import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const directory = path.join(root,'models/bge-small-en-v1.5');
const manifest = JSON.parse(await readFile(path.join(directory,'manifest.json'),'utf8'));
for (const file of manifest.files) {
  const response = await fetch(`https://huggingface.co/${manifest.modelId}/resolve/${manifest.revision}/${file.name}`, {signal:AbortSignal.timeout(120000)});
  if (!response.ok) throw new Error(`Public model download failed (${response.status}): ${file.name}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length!==file.bytes || createHash('sha256').update(bytes).digest('hex')!==file.sha256) throw new Error(`Pinned model integrity mismatch: ${file.name}`);
  const destination=path.join(directory,file.name);
  await mkdir(path.dirname(destination),{recursive:true});
  await writeFile(destination,bytes);
  console.log(`Verified ${file.name}: ${bytes.length} bytes`);
}
console.log('Pinned model verified and saved locally. No application data was transmitted.');
