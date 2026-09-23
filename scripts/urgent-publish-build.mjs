import { ensureHostedSemanticModel } from './ensure-hosted-semantic-model.mjs';
import { spawnSync } from 'node:child_process';
console.log(await ensureHostedSemanticModel());
const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env: process.env });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
