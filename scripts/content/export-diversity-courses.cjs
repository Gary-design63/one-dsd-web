/* eslint-disable @typescript-eslint/no-require-imports -- Read-only content export using the existing TypeScript exporter pattern. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
require.extensions['.ts'] = function(module, filename) {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText, filename);
};
const { CoursePackSchema } = require(path.join(root, 'lib/content/courses/contract.ts'));
const families = ['foundation', 'intermediate', 'advanced'];
const packs = families.flatMap(family => {
  const folder = path.join(root, 'lib/content/courses/authored', `diversity-${family}`);
  return fs.existsSync(folder) ? fs.readdirSync(folder).filter(file => /^div-[fia]\d{2}.*\.ts$/.test(file)).sort()
    .map(file => CoursePackSchema.parse(require(path.join(folder, file)).default)) : [];
});
if (process.argv.includes('--write-plan')) {
  if (packs.length !== 30) throw new Error(`Expected thirty courses, found ${packs.length}`);
  const plan = packs.map(pack => ({
    level: pack.course.seriesLabel.split('·').at(-1).trim(),
    module: pack.course.indexNumber % 10 || 10,
    id: pack.course.id, title: pack.course.title, indexNumber: pack.course.indexNumber,
    seriesLabel: pack.course.seriesLabel, coverImage: pack.course.coverImage,
    coverAlt: pack.course.coverAlt, contentType: pack.course.contentType,
  }));
  fs.writeFileSync(path.join(root, 'lib/content/courses/authored/diversity-plan.json'), JSON.stringify(plan, null, 2) + '\n');
  process.stdout.write(`Recorded ${plan.length} diversity courses.\n`);
} else {
  process.stdout.write(JSON.stringify(packs));
}
