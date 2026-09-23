import type { NextConfig } from "next";

const development = process.env.NODE_ENV === "development";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${development ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(development ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Preserve same-origin form authentication; send no referrer to other sites.
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
  ...(development
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const linuxCpuOnnxRuntime = [
  "./node_modules/onnxruntime-node/bin/napi-v6/linux/x64/onnxruntime_binding.node",
  "./node_modules/onnxruntime-node/bin/napi-v6/linux/x64/libonnxruntime.so.1",
];

const hostedSemanticRuntimeIncludes = [
  "./models/bge-small-en-v1.5/**/*",
  "./node_modules/@huggingface/transformers/package.json",
  "./node_modules/@huggingface/transformers/dist/transformers.node.mjs",
  "./node_modules/onnxruntime-node/package.json",
  "./node_modules/onnxruntime-node/dist/**/*",
  ...linuxCpuOnnxRuntime,
  "./node_modules/onnxruntime-common/package.json",
  "./node_modules/onnxruntime-common/dist/esm/index.js",
  "./node_modules/onnxruntime-common/dist/cjs/index.js",
];

/**
 * Downloads share one function. Force-include only data/runtime files NFT
 * cannot see. Do not glob whole office trees — #47's
 * pdfkit/docx/exceljs/pptxgenjs/** includes blew the 80 MiB
 * verify-download-trace budget.
 *
 * pdfkit: AFM via a computed runtime path.
 * pptx: pptxgenjs is a serverExternalPackage whose CJS/ESM entry does
 * `require('jszip')` / `import JSZip from 'jszip'` at load time. #48's
 * import-trace of pptxgenjs/package.json + dist does not keep jszip (or
 * pako/lie/immediate/setimmediate) on the Vercel function, so only pptx
 * throws and the route returns x-download-fallback: html. Include the
 * jszip graph, not pptxgenjs/**.
 */
const downloadRuntimeIncludes = [
  "./node_modules/pdfkit/js/data/**/*",
  "./node_modules/jszip/**/*",
  "./node_modules/pako/**/*",
  "./node_modules/lie/**/*",
  "./node_modules/immediate/**/*",
  "./node_modules/setimmediate/**/*",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  turbopack: { root: __dirname },
  poweredByHeader: false,
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "docx", "exceljs", "pptxgenjs", "jszip", "pdfkit"],
  // Staff Ask (POST /api/ask) is browse-and-download only after the September 2026 lock.
  // It must not become the Hugging Face packaging target: the route no longer imports the
  // typed pipeline, so Next's NFT for it correctly omits @huggingface/transformers.
  // Owner evals still call askConcierge (and therefore local-semantic). Pin that Node
  // runtime onto consultant/cron functions. Include only the CPU ONNX natives — the
  // previous linux/x64/** glob also pulled libonnxruntime_providers_cuda.so (~220 MiB)
  // and blew the 245 MiB packaging budget.
  // Downloads: AFM data + jszip graph under /api/downloads/**. Keep
  // ASK/ONNX/models excluded. Per-format dynamic imports stay in the
  // route so one missing office file cannot take every binary format down.
  outputFileTracingIncludes: {
    "/api/consultant/**": hostedSemanticRuntimeIncludes,
    "/api/cron/orchestrate": hostedSemanticRuntimeIncludes,
    "/api/downloads/**": downloadRuntimeIncludes,
  },
  outputFileTracingExcludes: {
    "/*": [
      "./node_modules/onnxruntime-node/bin/napi-v6/**/libonnxruntime_providers_cuda.so",
      "./node_modules/onnxruntime-node/bin/napi-v6/**/libonnxruntime_providers_tensorrt.so",
      "./node_modules/onnxruntime-node/bin/napi-v6/darwin/**/*",
      "./node_modules/onnxruntime-node/bin/napi-v6/win32/**/*",
      "./node_modules/@img/sharp-libvips-linuxmusl-x64/**/*",
      "./node_modules/@img/sharp-linuxmusl-x64/**/*",
      "./node_modules/@img/sharp-wasm32/**/*",
    ],
    "/api/downloads/**": [
      "./models/bge-small-en-v1.5/**/*",
      "./node_modules/onnxruntime-node/**/*",
      "./node_modules/onnxruntime-common/**/*",
      "./node_modules/@huggingface/transformers/**/*",
    ],
  },
  async redirects() {
    return [
      { source: "/blueprint", destination: "/about", permanent: true },
      { source: "/communities", destination: "/minnesota-communities", permanent: true },
      { source: "/communities/from-the-list", destination: "/minnesota-communities", permanent: true },
      { source: "/professional-support", destination: "/support", permanent: true },
      { source: "/library/course-:id", destination: "/courses/:id", permanent: true },
      { source: "/c/:id/:lesson", destination: "/courses/:id/:lesson", permanent: true },
      { source: "/c/:id", destination: "/courses/:id", permanent: true },
      { source: "/ci/:id", destination: "/courses/cultural-intelligence-:id", permanent: true },
      { source: "/guided-start", destination: "/start", permanent: true },
      { source: "/resources", destination: "/library", permanent: true },
      { source: "/resources/:path*", destination: "/library/:path*", permanent: true },
      { source: "/paths", destination: "/learn", permanent: true },
      { source: "/paths/:id", destination: "/practice/:id", permanent: true },
      { source: "/my-view", destination: "/my-work", permanent: true },

      // The original owner workspace occupied /practice. Keep precise compatibility
      // routes while reserving /practice for private, staff-facing application work.
      { source: "/practice/audit", destination: "/consultant/audit", permanent: false },
      { source: "/practice/evals", destination: "/consultant/evals", permanent: false },
      { source: "/practice/orchestrator", destination: "/consultant/orchestrator", permanent: false },
      { source: "/practice/queue/:path*", destination: "/consultant/queue/:path*", permanent: false },
      { source: "/practice/registry", destination: "/consultant/registry", permanent: false },
      { source: "/practice/research", destination: "/consultant/research", permanent: false },
      { source: "/practice/resources", destination: "/consultant/resources", permanent: false },
      { source: "/practice/resources/:path*", destination: "/consultant/resources/:path*", permanent: false },
      { source: "/practice/review", destination: "/consultant/review", permanent: false },
      { source: "/one-dsd-team", destination: "/consultant/one-dsd-team", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
