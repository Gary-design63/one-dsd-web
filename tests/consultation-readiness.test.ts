import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { consultationReadiness } from '../scripts/operations/consultation-readiness.mjs';
function fixture() {
 const requirements = Object.fromEntries(['approved_policy','deletion_process','correction_process','backup_process','restore_process','recovery_process','incident_process','delivery_process'].map(name => [name,{state:'verified',evidence_id:'test:'+name}]));
 const register = {schema_version:'1.0.0',features:{dsd_consultation:{evidence_id:'test:activation',approval_state:'approved',policy_version:'test-policy',retention_days:90,requirements}}};
 const env: Record<string,string> = {PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID:'test:activation',PAC_CONSULTATION_POLICY_VERSION:'test-policy',PAC_CONSULTATION_RETENTION_DAYS:'90',PAC_STORE:'postgres',PAC_RUNTIME_DATABASE_URL:'postgres://private:secret@localhost/test',PAC_CONSULTATION_TRACKING_SECRET:randomBytes(32).toString('hex'),PAC_RATE_LIMIT_SECRET:randomBytes(32).toString('hex')};
 for(const name of ['CORRECTION','DELETION','BACKUP','RESTORE','RECOVERY','INCIDENT','DELIVERY']) env['PAC_CONSULTATION_'+name+'_READY']='on';
 return {register,env};
}
describe('consultation activation diagnostics',()=>{
 it('distinguishes ready configuration from the explicit intake switch and untested runtime',()=>{const {register,env}=fixture();const r=consultationReadiness(register,env);expect(r.configurationReady).toBe(true);expect(r.acceptingConfigured).toBe(false);expect(r.runtime.checked).toBe(false);env.PAC_CONSULTATION_INTAKE_ENABLED='on';expect(consultationReadiness(register,env).acceptingConfigured).toBe(true);});
 it('does not turn pending recovery evidence into approval through ready settings',()=>{const {register,env}=fixture();register.features.dsd_consultation.requirements.restore_process.state='pending';expect(consultationReadiness(register,env).missing).toContain('restore_process');});
 it('requires the selected policy, duration and evidence to agree',()=>{const {register,env}=fixture();env.PAC_CONSULTATION_RETENTION_DAYS='180';env.PAC_CONSULTATION_POLICY_VERSION='other-policy';env.PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID='different';expect(consultationReadiness(register,env).missing).toEqual(expect.arrayContaining(['retention_duration','policy_version','selected_evidence']));});
 it('keeps credentials and database connection text out of reports',()=>{const {register,env}=fixture();env.PAC_RATE_LIMIT_SECRET=env.PAC_CONSULTATION_TRACKING_SECRET;const r=consultationReadiness(register,env);expect(r.missing).toContain('distinct_secrets');const text=JSON.stringify(r);expect(text).not.toContain(env.PAC_RATE_LIMIT_SECRET);expect(text).not.toContain(env.PAC_RUNTIME_DATABASE_URL);});
 it('reports every missing dependency without inventing a retention duration',()=>{const r=consultationReadiness({},{});expect(r.configurationReady).toBe(false);expect(r.retentionDays).toBe(null);expect(r.missing).toEqual(expect.arrayContaining(['approved_policy','retention_duration','tracking_secret','runtime_database','backup_process']));});
});
