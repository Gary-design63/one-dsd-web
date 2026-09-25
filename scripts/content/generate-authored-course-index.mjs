// Regenerates lib/content/courses/authored/index.ts from the course plan order,
// importing only the course files that exist in one of the authored family
// directories (disability-inclusion, intercultural-practice, dsd-practice, ...).
// Usage: node scripts/content/generate-authored-course-index.mjs
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
const root = new URL("../../lib/content/courses/authored/", import.meta.url);
const plan = [
  ...JSON.parse(readFileSync(new URL("disability-inclusion/plan.json", root), "utf8")),
  ...JSON.parse(readFileSync(new URL("diversity-plan.json", root), "utf8")),
  ...JSON.parse(readFileSync(new URL("gap-plan.json", root), "utf8")),
];
const families = readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const present = plan
  .map(row => ({ row, family: families.find(family => existsSync(new URL(`${family}/${row.id}.ts`, root))) }))
  .filter(entry => entry.family);
const lines = [
  'import type { CoursePack } from "../source-types";',
  ...present.map(({ row, family }, i) => `import course${i + 1} from "./${family}/${row.id}";`),
  "",
  "/**",
  " * Program-authored course packs. They use the same contract as the recovered",
  " * collection but are kept apart from it so the recovered source bytes, counts",
  " * and hashes stay exactly as preserved. Order follows the original, diversity and gap-completion plans.",
  " */",
  `export const AUTHORED_COURSE_PACKS: readonly CoursePack[] = [${present.map((_, i) => `course${i + 1}`).join(", ")}];`,
  "",
];
writeFileSync(new URL("index.ts", root), lines.join("\n"));
console.log(`authored index: ${present.length} of ${plan.length} planned courses present`);
