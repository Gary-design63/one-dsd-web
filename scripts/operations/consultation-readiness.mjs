import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postgres from 'postgres';
const root = fileURLToPath(new URL('../../', import.meta.url));
const names = ['approved_policy', 'deletion_process', 'correction_process', 'backup_process', 'restore_process', 'recovery_process', 'incident_process', 'delivery_process'];
const readyNames = ['CORRECTION', 'DELETION', 'BACKUP', 'RESTORE', 'RECOVERY', 'INCIDENT', 'DELIVERY'];
const on = value => String(value ?? '').trim().toLowerCase() === 'on';
const strong = value => typeof value === 'string' && Buffer.byteLength(value.trim()) >= 32 && new Set(value).size >= 10 && !/^(test|example|placeholder|change.?me)/i.test(value);

/** Diagnose without changing settings or granting evidence approval.
 * @param {unknown} register
 * @param {Record<string, string | undefined>} env
 */
export function consultationReadiness(register, env = process.env) {
  const typed = /** @type {any} */ (register);
  const feature = typed?.features?.dsd_consultation;
  const missing = [];
  for (const name of names) {
    const entry = feature?.requirements?.[name];
    if (entry?.state !== 'verified' || !/^[A-Za-z0-9][A-Za-z0-9:._-]{2,159}$/.test(entry?.evidence_id ?? '')) missing.push(name);
  }
  if (typed?.schema_version !== '1.0.0' || feature?.approval_state !== 'approved') missing.push('committed_activation_evidence');
  if (!feature?.evidence_id || feature.evidence_id !== env.PAC_CONSULTATION_ACTIVATION_EVIDENCE_ID?.trim()) missing.push('selected_evidence');
  if (!feature?.policy_version || feature.policy_version !== env.PAC_CONSULTATION_POLICY_VERSION?.trim()) missing.push('policy_version');
  const days = Number(env.PAC_CONSULTATION_RETENTION_DAYS);
  if (!Number.isSafeInteger(days) || days < 1 || days > 3650 || days !== feature?.retention_days) missing.push('retention_duration');
  if (env.PAC_STORE?.trim() !== 'postgres') missing.push('durable_store');
  if (!env.PAC_RUNTIME_DATABASE_URL?.trim()) missing.push('runtime_database');
  if (!strong(env.PAC_CONSULTATION_TRACKING_SECRET)) missing.push('tracking_secret');
  if (!strong(env.PAC_RATE_LIMIT_SECRET)) missing.push('rate_limit_secret');
  if (env.PAC_CONSULTATION_TRACKING_SECRET && env.PAC_CONSULTATION_TRACKING_SECRET === env.PAC_RATE_LIMIT_SECRET) missing.push('distinct_secrets');
  for (const name of readyNames) if (!on(env['PAC_CONSULTATION_' + name + '_READY'])) missing.push(name.toLowerCase() + '_readiness_setting');
  const enabled = on(env.PAC_CONSULTATION_INTAKE_ENABLED);
  return { kind: 'consultation-readiness', checkedAt: new Date().toISOString(), acceptingRequested: enabled, configurationReady: missing.length === 0, acceptingConfigured: enabled && missing.length === 0, missing: [...new Set(missing)], retentionDays: Number.isSafeInteger(days) && days > 0 && days <= 3650 ? days : null, runtime: { checked: false }, limitation: 'Configuration does not prove a completed submission or recovery drill. No secrets or request text are included.' };
}

/** Read-only probe: never selects staff records or performs writes. */
export async function probeConsultationRuntime(env = process.env) {
  if (!env.PAC_RUNTIME_DATABASE_URL?.trim()) return { checked: false, ready: false, reason: 'runtime_database_missing' };
  const sql = postgres(env.PAC_RUNTIME_DATABASE_URL, { max: 1, connect_timeout: 10, idle_timeout: 2, ssl: env.PAC_RUNTIME_DATABASE_SSL === 'require' ? 'require' : undefined, onnotice: () => {} });
  try {
    return await sql.begin('read only', async tx => {
      const [role] = await tx`select rolsuper, rolbypassrls, rolcreatedb, rolcreaterole from pg_roles where rolname = current_user`;
      const [tables] = await tx`select to_regclass('pac.runtime_work_objects') is not null as work_objects, to_regclass('pac.runtime_idempotency') is not null as idempotency, to_regclass('pac.runtime_audit_events') is not null as audit_events`;
      const restrictedRole = Boolean(role) && !role.rolsuper && !role.rolbypassrls && !role.rolcreatedb && !role.rolcreaterole;
      return { checked: true, ready: restrictedRole && Object.values(tables).every(Boolean), restrictedRole, tables };
    });
  } catch { return { checked: true, ready: false, reason: 'runtime_verification_failed' }; }
  finally { await sql.end({ timeout: 2 }); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = consultationReadiness(JSON.parse(readFileSync(path.join(root, 'config/protected-feature-activation.json'), 'utf8')));
  if (process.argv.includes('--runtime')) report.runtime = await probeConsultationRuntime();
  const outIndex = process.argv.indexOf('--out');
  if (outIndex >= 0 && process.argv[outIndex + 1]) { const target = path.resolve(root, process.argv[outIndex + 1]); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, JSON.stringify(report, null, 2) + '\n'); }
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.configurationReady && (!report.runtime.checked || report.runtime.ready) ? 0 : 2;
}
