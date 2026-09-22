import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { FeatureExtractionPipeline } from "@huggingface/transformers";
import modelManifest from "../../../models/bge-small-en-v1.5/manifest.json";
import type { AskIntent } from "@/lib/content/types";
import { AUTHORITY } from "@/lib/content/types";
import type { Doc, SearchHit } from "./search";
import { getModel, isCallableInProduction } from "../registry/models";
import { flagEnabled } from "../registry/flags";
import type { AgentDefinition } from "../types";
import { reportSemanticFailure, type SemanticFailureStage } from "./semantic-diagnostics";

export const LOCAL_SEARCH_MODEL = "mdl_local_bge_v1";
export const SEMANTIC_MIN_SIMILARITY = 0.50;
export class SemanticSearchUnavailable extends Error {
  constructor(public readonly reason: "model_binding" | "model_unavailable" | "model_integrity" | "busy" | "index_warming" | "capacity" | "inference_failed", options?: ErrorOptions) {
    super(`Local semantic search unavailable: ${reason}`, options);
    this.name = "SemanticSearchUnavailable";
  }
}

let extractorPromise: Promise<FeatureExtractionPipeline> | undefined;
let activeQueries = 0;
const vectorCache = new Map<string, Float32Array>();
const MAX_CACHED_DOCS = 4096;
const BATCH_SIZE = 12;
const INDEX_BUDGET_MS = 6000;

async function extractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    let stage: SemanticFailureStage = "model_files";
    extractorPromise = (async () => {
      const directory = path.join(process.cwd(), "models", "bge-small-en-v1.5");
      try {
        for (const file of modelManifest.files) {
          const bytes = await readFile(path.join(directory, file.name));
          if (bytes.length !== file.bytes || createHash("sha256").update(bytes).digest("hex") !== file.sha256) {
            throw new SemanticSearchUnavailable("model_integrity");
          }
        }
      } catch (error) {
        if (error instanceof SemanticSearchUnavailable) throw error;
        throw new SemanticSearchUnavailable("model_unavailable", { cause: error });
      }
      stage = "projection";
      const projection = (modelManifest as typeof modelManifest & { vectorProjection?: { name: string; sha256: string } }).vectorProjection;
      if (projection) {
        try {
          const bytes = await readFile(path.join(directory, projection.name));
          if (createHash("sha256").update(bytes).digest("hex") !== projection.sha256) throw new Error("projection_integrity");
          const saved: unknown = JSON.parse(bytes.toString("utf8"));
          if (!saved || typeof saved !== "object") throw new Error("projection_shape");
          const value = saved as { modelRevision?: unknown; vectors?: unknown };
          if (value.modelRevision !== modelManifest.revision || !Array.isArray(value.vectors) || value.vectors.length > MAX_CACHED_DOCS) throw new Error("projection_shape");
          for (const row of value.vectors) {
            if (!Array.isArray(row) || !/^[a-f0-9]{64}$/.test(row[0]) || !Array.isArray(row[1]) || row[1].length !== 384
              || !row[1].every((n:unknown) => typeof n === "number" && Number.isFinite(n) && Math.abs(n) <= 1)) throw new Error("projection_shape");
          }
          for (const [key, vector] of value.vectors) remember(key, Float32Array.from(vector));
        } catch (error) { throw new SemanticSearchUnavailable("model_integrity", { cause: error }); }
      }
      stage = "dependency_import";
      const { env, pipeline } = await import("@huggingface/transformers");
      // Inference is entirely local. Requests cannot download weights or send text.
      env.allowRemoteModels = false;
      env.allowLocalModels = true;
      env.useFSCache = false;
      stage = "model_session";
      return pipeline("feature-extraction", directory, {
        local_files_only: true, dtype: "q8", device: "cpu",
        session_options: { intraOpNumThreads: 2, interOpNumThreads: 1 },
      });
    })().catch(error => {
      extractorPromise = undefined;
      const failure = error instanceof SemanticSearchUnavailable ? error : new SemanticSearchUnavailable("inference_failed", { cause: error });
      reportSemanticFailure(stage, failure);
      throw failure;
    });
  }
  return extractorPromise;
}

/** Key includes complete current content and metadata, even beyond the model input window. */
export function semanticDocumentKey(doc: Doc): string {
  return createHash("sha256").update(JSON.stringify([modelManifest.revision, doc.kind, doc.id, doc.scope, doc.status,
    doc.title, doc.href, doc.authority, doc.reviewDate, doc.summary, doc.text, doc.tags, doc.intents])).digest("hex");
}

function documentText(doc: Doc): string {
  // A focused description avoids burying meaning in large course/page payloads.
  return [doc.title, doc.summary, doc.tags.join(" "), doc.text].join("\n").slice(0, 1600);
}

function remember(key: string, vector: Float32Array) {
  vectorCache.delete(key);
  vectorCache.set(key, vector);
  while (vectorCache.size > MAX_CACHED_DOCS) vectorCache.delete(vectorCache.keys().next().value!);
}

/**
 * Actual normalized sentence embeddings over the request's current eligible snapshot.
 * Only derived document vectors are cached; questions and query vectors are not stored.
 * Cache contents can never supply a document absent from the current request.
 */
export async function localSemanticRetrieve(query: string, intents: AskIntent[], docs: Doc[], limit = 5): Promise<SearchHit[]> {
  const question = query.trim();
  if (!question || !docs.length || limit <= 0) return [];
  if (docs.length > MAX_CACHED_DOCS || activeQueries >= 2) {
    const failure = new SemanticSearchUnavailable(docs.length > MAX_CACHED_DOCS ? "capacity" : "busy");
    reportSemanticFailure("admission", failure);
    throw failure;
  }
  activeQueries++;
  let stage: SemanticFailureStage = "model_session";
  try {
    const started = Date.now();
    const model = await extractor();
    stage = "index_preparation";
    const candidates = docs.map(doc => ({ doc, key: semanticDocumentKey(doc) }));
    const missing = [...new Map(candidates.filter(row => !vectorCache.has(row.key)).map(row => [row.key, row])).values()];
    for (let offset = 0; offset < missing.length; offset += BATCH_SIZE) {
      if (Date.now() - started > INDEX_BUDGET_MS) throw new SemanticSearchUnavailable("index_warming");
      const batch = missing.slice(offset, offset + BATCH_SIZE);
      stage = "embedding";
      const result = await model(batch.map(row => documentText(row.doc)), { pooling: "cls", normalize: true });
      if (result.dims[1] !== 384) throw new SemanticSearchUnavailable("inference_failed");
      batch.forEach((row, index) => remember(row.key, Float32Array.from(result.data.slice(index * 384, (index + 1) * 384) as Float32Array)));
      stage = "index_preparation";
    }
    stage = "embedding";
    const encoded = await model("Represent this sentence for searching relevant passages: " + question.slice(0, 3000), { pooling: "cls", normalize: true });
    const queryVector = encoded.data as Float32Array;
    return candidates.map(({doc, key}) => {
      const vector = vectorCache.get(key);
      if (!vector) throw new SemanticSearchUnavailable("index_warming");
      let similarity = 0;
      for (let index = 0; index < 384; index++) similarity += queryVector[index] * vector[index];
      return { doc, similarity };
    }).filter(row => Number.isFinite(row.similarity) && row.similarity >= SEMANTIC_MIN_SIMILARITY)
      .sort((a,b) => semanticRank(b.doc, b.similarity, question, intents) - semanticRank(a.doc, a.similarity, question, intents))
      .slice(0, Math.min(limit, 50)).map(({doc, similarity}) => ({
        kind: doc.kind, id: doc.id, title: doc.title, href: doc.href, authority: doc.authority,
        authorityLabel: AUTHORITY[doc.authority].label, type: doc.type, layer: doc.layer,
        status: doc.status, reviewDate: doc.reviewDate, scope: doc.scope,
        excerpt: (doc.summary || doc.text).replace(/\s+/g," ").trim().slice(0,360), score: Math.round(similarity * 1000) / 100,
      }));
  } catch (error) {
    const failure = error instanceof SemanticSearchUnavailable ? error : new SemanticSearchUnavailable("inference_failed", { cause: error });
    reportSemanticFailure(stage, failure);
    throw failure;
  } finally {
    activeQueries--;
  }
}

/** Offline maintenance only: build a derivative of supplied public document snapshots. */
export async function prepareSemanticProjection(docs: Doc[], onProgress: (ready: number, total: number) => void) {
  const unique = [...new Map(docs.map(doc => [semanticDocumentKey(doc), doc])).values()];
  if (unique.length > MAX_CACHED_DOCS) throw new SemanticSearchUnavailable("capacity");
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await localSemanticRetrieve("equity", [], unique, 1);
      break;
    } catch (error) {
      if (!(error instanceof SemanticSearchUnavailable) || error.reason !== "index_warming") throw error;
    }
    onProgress(unique.filter(doc => vectorCache.has(semanticDocumentKey(doc))).length, unique.length);
  }
  const vectors = unique.map(doc => {
    const key = semanticDocumentKey(doc);
    const vector = vectorCache.get(key);
    if (!vector) throw new SemanticSearchUnavailable("index_warming");
    return [key, Array.from(vector, value => Number(value.toFixed(7)))] as const;
  });
  return { modelRevision: modelManifest.revision, vectors };
}
/** Resolve the registry binding before any model load or inference. */
export async function semanticRetrieveForAgent(query: string, intents: AskIntent[], docs: Doc[], agent: AgentDefinition, limit = 5): Promise<SearchHit[]> {
  const model = agent.model_setting.embed_model_id ? getModel(agent.model_setting.embed_model_id) : undefined;
  const environment = process.env.VERCEL_ENV === "preview" ? "preview"
    : process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production" ? "production" : "local";
  if (!model || model.model_id !== LOCAL_SEARCH_MODEL || model.provider_id !== "local" || model.purpose !== "embed"
    || model.provider_model_ref !== `${modelManifest.modelId}/${modelManifest.revision}`
    || !model.allowed_agent_ids.includes(agent.agent_id) || !model.scope.environments.includes(environment)
    || !model.scope.data_classes.includes("staff_public_corpus") || !isCallableInProduction(model, flagEnabled)
    || (model.feature_flag && !flagEnabled(model.feature_flag))) {
    const failure = new SemanticSearchUnavailable("model_binding");
    reportSemanticFailure("binding", failure);
    throw failure;
  }
  return localSemanticRetrieve(query, intents, docs, limit);
}
function semanticRank(doc: Doc, similarity: number, question: string, intents: AskIntent[]): number {
  const learning = /\b(learn\w*|course\w*|lesson\w*|training|study|explore|culture\w*|cultural|community|communities)\b/i.test(question);
  // A broad work question should surface a usable resource before many near-identical
  // lesson introductions. Lessons remain available and lead when learning is requested.
  const lessonAdjustment = !learning && doc.type === "course_lesson" ? -0.12 : 0;
  const populationTitle = doc.kind === "brief" ? doc.title
    : /^Cultural intelligence: /i.test(doc.title) ? doc.title.split(":")[1] : "";
  const generalWords = new Set(["minnesota", "minnesotans", "speaking", "culture", "cultural", "communities", "community", "intelligence", "people", "american", "americans"]);
  const queryWords = new Set(question.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/));
  const explicitlyNamed = populationTitle.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/)
    .some(word => word.length > 2 && !generalWords.has(word) && queryWords.has(word));
  // Do not imply a family's cultural or disability identity from a general access need.
  // Specific-community material remains searchable and rises when that community is named.
  const populationAdjustment = populationTitle && !explicitlyNamed && !learning ? -0.12 : 0;
  return similarity + lessonAdjustment + populationAdjustment + (doc.intents.some(intent => intents.includes(intent)) ? 0.01 : 0);
}