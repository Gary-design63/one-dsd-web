import { mkdirSync, writeFileSync } from "node:fs";

const base = new URL("https://one-dhs-pac.vercel.app");
const key = process.env.PAC_OWNER_KEY;
if (!key || key.length < 32) throw new Error("Load the private production release settings before checking access.");
const checks = [];
async function request(path, options = {}) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(60000), ...options });
}
const protectedPath = "/api/consultant/content/community-reading.african-american";
const denied = await request(protectedPath);
if (denied.status !== 401) throw new Error("The editing boundary did not deny a signed-out request.");
checks.push({ check: "Signed-out editing remains protected", passed: true });

const login = await request("/api/consultant/login", {
  method: "POST", redirect: "manual",
  headers: { origin: base.origin, "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ key, returnTo: "/consultant" }),
});
const cookie = login.headers.get("set-cookie")?.split(";")[0];
if (login.status !== 303 || !cookie?.startsWith("pac_owner=") || login.headers.get("location")?.includes("denied")) {
  throw new Error(`Production sign-in failed with status ${login.status}.`);
}
checks.push({ check: "Owner sign-in", passed: true });

for (const path of ["/consultant", "/consultant/workforce", "/minnesota-communities/african-american"]) {
  const response = await request(path, { headers: { cookie } });
  const text = await response.text();
  if (response.status !== 200 || text.includes("Workspace access key")) throw new Error(`Owner access failed for ${path}.`);
  checks.push({ check: `Owner view ${path}`, passed: true });
}
for (const surface of ["community-reading.african-american", "community-reading.somali", "community-connections.home"]) {
  const response = await request(`/api/consultant/content/${surface}`, { headers: { cookie } });
  const body = await response.json();
  if (response.status !== 200 || body.ok !== true || !body.state) throw new Error(`Published editing state could not be read for ${surface}.`);
  checks.push({ check: `Read-only editing check ${surface}`, passed: true });
}

const ask = await request("/api/ask", {
  method: "POST",
  headers: { origin: base.origin, "content-type": "application/json" },
  body: JSON.stringify({ question: "How can I make a meeting accessible?", researchMode: "program_only", contextPreference: "one_dhs" }),
});
const closed = await ask.json();
if (ask.status !== 403 || closed.code !== "staff_browse_download_only") throw new Error(`Staff Ask must fail closed with status 403, received ${ask.status}.`);
checks.push({ check: "Ask staff write closed", passed: true, status: ask.status });

mkdirSync("evidence", { recursive: true });
writeFileSync("evidence/production-access-release.json", JSON.stringify({ checkedAt: new Date().toISOString(), base: base.origin, checks, contentMutations: 0 }, null, 2) + "\n");
console.log(JSON.stringify({ status: "passed", checks: checks.length, contentMutations: 0 }));
