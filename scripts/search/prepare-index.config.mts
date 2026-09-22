import path from 'node:path';
import { defineConfig } from 'vitest/config';
const root=path.resolve(import.meta.dirname,'../..');
export default defineConfig({
 resolve:{alias:{'@':root,'server-only':path.join(root,'tests/helpers/server-only.ts')}},
 test:{environment:'node',include:['scripts/search/prepare-public-index.ts'],fileParallelism:false,
 env:{NODE_ENV:'test',PAC_CONTENT_SOURCE:'static',PAC_STORE:'memory',PAC_STAFF_SCOPE:'one-dhs'},testTimeout:600000}
});
