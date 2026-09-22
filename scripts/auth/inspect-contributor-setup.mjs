#!/usr/bin/env node
// Read-only operator reference: no connection, account, invitation or activation mutation.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
const root=resolve(import.meta.dirname,"../..");
const contract=JSON.parse(readFileSync(resolve(root,"config/contributor-access.json"),"utf8"));
function canonical(value){
 if(Array.isArray(value))return "["+value.map(canonical).join(",")+"]";
 if(value!==null && typeof value==="object")return "{"+Object.keys(value).sort().map(key=>JSON.stringify(key)+":"+canonical(value[key])).join(",")+"}";
 return JSON.stringify(value);
}
const features=Object.fromEntries(Object.entries(contract.features).map(([feature,value])=>[feature,{
 evidenceId:value.evidence_id,
 bundleSha256:createHash("sha256").update(canonical({schema_version:contract.schema_version,feature,contract:value})).digest("hex"),
 bindings:value.bindings,
}]));
console.log(JSON.stringify({
 mode:"read-only",databaseChanged:false,realAccountsCreated:0,activationChanged:false,
 migrations:readdirSync(resolve(root,"db/migrations")).filter(name=>/^004[2-5]_.*\.sql$/.test(name)).sort(),
 roles:{contributor:"pac_contributor_runtime",broker:"pac_authentication_broker",existingOwner:"pac_app_runtime (unchanged)"},
 features,
 setupOnlyFunctions:[
  "pac.record_protected_feature_activation(environment,feature,state,evidence_id,bundle_sha256,reason)",
  "pac.bootstrap_program_owner_invitation(environment,sign_in_id,display_name,invitation_digest,expires_at,evidence_id,bundle_sha256)",
  "pac.create_program_owner_recovery_invitation(environment,account_id,invitation_digest,expires_at,reason,evidence_id,bundle_sha256)"
 ],
 guidance:"Use a migration-owner connection only for explicitly authorized setup. The application roles cannot call these setup functions. Existing owner credentials do not become named-account credentials."
},null,2));
