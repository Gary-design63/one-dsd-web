import Link from "next/link";
import { dispositionLabel, KIND_LABEL, workTypeLabel } from "@/lib/equity-analysis/model";
import { buildDashboard, quarterLabel, type Delta } from "@/lib/equity-analysis/rollups";
import type { EquityWorkspace } from "@/lib/equity-analysis/records";
import { fmt } from "@/lib/equity-analysis/format";
import { Figure, SERIES_COLORS, StackedBars, StackedColumns, StatTile, TableView, TrendLines } from "./charts";

const TOOL_SERIES = [
  { key: "full", label: "Full analysis", color: SERIES_COLORS.full },
  { key: "scan", label: "Equity scan", color: SERIES_COLORS.scan },
  { key: "pause", label: "Equity Pause", color: SERIES_COLORS.pause },
];

const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function countDelta(d: Delta | null, vs: string) {
  if (!d) return null;
  const pct = d.pct === null ? "" : ` (${Math.round(Math.abs(d.pct) * 100)}%)`;
  return { text: `${fmt(Math.abs(d.value))}${pct}`, direction: d.value > 0 ? ("up" as const) : d.value < 0 ? ("down" as const) : ("flat" as const), vs };
}

function pointDelta(d: Delta | null, vs: string) {
  if (!d) return null;
  return { text: `${Math.abs(d.value)} point${Math.abs(d.value) === 1 ? "" : "s"}`, direction: d.value > 0 ? ("up" as const) : d.value < 0 ? ("down" as const) : ("flat" as const), vs };
}

export function EquityDashboard({ workspace }: { workspace: EquityWorkspace }) {
  const d = buildDashboard(workspace.analyses, workspace.followUpEvents, workspace.waves, workspace.now);
  const latestLabel = quarterLabel(d.latest.period);
  const priorLabel = quarterLabel(d.quarterly[d.quarterly.length - 2].period);
  const windowLabel = `${quarterLabel(d.windowPeriods[0])} to ${latestLabel}`;
  const belonging = d.survey.find((s) => s.key === "belonging")!;
  const priorWave = d.waves.length > 1 ? d.waves[d.waves.length - 2].wave : "the prior wave";

  return (
    <section aria-labelledby="dashboard-title" className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="kicker m-0">How the policy is being used</p>
          <h2 id="dashboard-title" className="m-0 mt-1 scroll-mt-24 text-3xl font-bold">Equity Policy dashboard</h2>
          <p className="mt-2">Two measures the policy asks for: whether the Equity Analysis Tool is run before decisions are final, and whether staff report belonging, inclusion, and engagement. Analysis figures are computed from what staff have added through the walkthrough each time this page loads.</p>
        </div>
        <div className="text-right text-sm text-muted">
          <p className="m-0">As of <strong>{longDate.format(new Date(d.asOf))}</strong></p>
          <Link href="/equity-policy/register">Register, follow-ups, and download</Link>
          <p className="m-0 mt-1 text-xs">Owner record. Staff pages do not list stored analyses.</p>
        </div>
      </div>

      {d.followUps.pending ? (
        <div className="notice flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="font-semibold">Follow-ups promised in these analyses</span>
          <span className={d.followUps.overdue ? "font-semibold text-[color:var(--red-strong)]" : ""}>{fmt(d.followUps.overdue)} overdue</span>
          <span>{fmt(d.followUps.soon)} due within 30 days</span>
          <span className="text-muted">{fmt(d.followUps.pending)} open in total</span>
          <Link href="/equity-policy/register#followups-title" className="ml-auto">See the list</Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={`Full analyses added, ${latestLabel}`} value={fmt(d.latest.full)} delta={countDelta(d.latestDelta.full, priorLabel)} />
        <StatTile label={`Equity scans added, ${latestLabel}`} value={fmt(d.latest.scan)} delta={countDelta(d.latestDelta.scan, priorLabel)} />
        <StatTile label="Analyses on the record" value={fmt(d.allTime.total)} note={d.empty ? "No analyses added yet." : `${Math.round(d.fullShare * 100)}% full analyses. ${d.byAdministration.length} administration${d.byAdministration.length === 1 ? "" : "s"} in the last ${d.windowPeriods.length} quarters.`} />
        {d.latestWave ? (
          <StatTile label={`Belonging, ${d.latestWave.wave} survey`} value={`${belonging.latest}%`} delta={pointDelta(belonging.delta, priorWave)} note={`Percent favorable. ${fmt(d.latestWave.respondents)} respondents, ${Math.round(d.latestWave.responseRate * 100)}% response.`} />
        ) : (
          <StatTile label="Belonging, culture survey" value="Not yet entered" note="Survey waves are entered on the register." />
        )}
      </div>

      {d.empty ? (
        <div className="card">
          <h3 className="m-0 text-xl font-bold">Nothing on the record yet</h3>
          <p className="mt-2 max-w-2xl">The figures below fill in as staff add analyses through the guided walkthrough. The first one takes about fifteen minutes for a scan or forty-five for a full analysis, with your data at hand.</p>
          <Link href="/equity-policy/analysis" className="btn btn--primary mt-4">Add the first analysis</Link>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <Figure title="Equity Analysis Tool use by quarter" lede="Full analyses, equity scans, and equity pauses added across DHS. The label on each column is the quarter total." footnote="Use current official guidance to determine the required review. A short timeline alone does not establish that an equity scan is sufficient.">
            <StackedColumns ariaLabel="Stacked columns of full analyses, equity scans, and equity pauses added per quarter" series={TOOL_SERIES} rows={d.quarterly.map((q) => ({ label: quarterLabel(q.period), values: { full: q.full, scan: q.scan, pause: q.pause } }))} />
            <TableView caption="Tool use by quarter" columns={["Quarter", "Full analysis", "Equity scan", "Equity Pause", "Total"]} rows={d.quarterly.map((q) => [quarterLabel(q.period), q.full, q.scan, q.pause, q.total])} />
          </Figure>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <Figure title="By administration" lede={`Analyses added, ${windowLabel}. Sorted by total.`} footnote="A low count is a prompt to ask, not a finding.">
            {d.byAdministration.length ? (
              <>
                <StackedBars ariaLabel="Horizontal stacked bars of analyses by administration" series={TOOL_SERIES} rows={d.byAdministration.map((a) => ({ label: a.administration, values: { full: a.full, scan: a.scan, pause: a.pause } }))} />
                <TableView caption="Analyses by administration" columns={["Administration", "Full analysis", "Equity scan", "Equity Pause", "Total"]} rows={d.byAdministration.map((a) => [a.administration, a.full, a.scan, a.pause, a.total])} />
              </>
            ) : <p className="m-0 text-sm text-muted">No analyses in this window.</p>}
          </Figure>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <Figure title="Recent analyses" lede="The latest additions. Open one to read the full record.">
            {d.recent.length ? (
              <div className="overflow-x-auto">
                <table className="data w-full min-w-[36rem] text-sm">
                  <thead><tr><th scope="col">Work</th><th scope="col">Administration</th><th scope="col">Form</th><th scope="col">Disposition</th><th scope="col">Added</th></tr></thead>
                  <tbody>
                    {d.recent.map((r) => (
                      <tr key={r.id}>
                        <td><Link href={`/equity-policy/analysis/${r.id}`}>{r.workTitle}</Link><span className="block text-xs text-muted">{workTypeLabel(r.workType)}</span></td>
                        <td>{r.administration}</td>
                        <td className="whitespace-nowrap">{KIND_LABEL[r.kind]}</td>
                        <td>{dispositionLabel(r.disposition)}</td>
                        <td className="whitespace-nowrap tabular-nums">{shortDate.format(new Date(r.createdAt))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="m-0 text-sm text-muted">Added analyses will be listed here.</p>}
          </Figure>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <Figure title="What was decided" lede="Dispositions across all analyses on the record." footnote="A referral means the toolkit did its job: a formal path such as civil rights, Tribal consultation, or labor relations was the right one.">
            {d.empty ? <p className="m-0 text-sm text-muted">No dispositions yet.</p> : (
              <>
                <StackedBars ariaLabel="Horizontal bars of dispositions" series={[{ key: "count", label: "Analyses", color: SERIES_COLORS.full }]} showLegend={false} rows={d.dispositions.map((x) => ({ label: x.label, values: { count: x.count } }))} />
                <TableView caption="Dispositions" columns={["Disposition", "Analyses"]} rows={d.dispositions.map((x) => [x.label, x.count])} />
              </>
            )}
          </Figure>
        </div>
      </div>

      <Figure title="Culture and engagement survey, percent favorable" lede="Share of DHS respondents who agreed or strongly agreed, by survey wave." footnote={<>Items: {d.survey.map((s) => `${s.label}, “${s.item}”`).join("; ")}. {d.latestWave ? `Response rate ${Math.round(d.latestWave.responseRate * 100)}% in ${d.latestWave.wave}. ` : ""}Results are department-wide. They are never a finding about any unit or person.</>}>
        {d.waves.length ? (
          <>
            <TrendLines ariaLabel="Line chart of belonging, inclusion, and engagement percent favorable by survey wave" xLabels={d.waves.map((w) => w.wave)} series={d.survey.map((s) => ({ key: s.key, label: s.label, color: SERIES_COLORS[s.key], values: s.values }))} />
            <TableView caption="Survey percent favorable by wave" columns={["Wave", ...d.survey.map((s) => `${s.label} (%)`), "Respondents", "Response rate"]} rows={d.waves.map((w) => [w.wave, ...d.survey.map((s) => w[s.key]), w.respondents, `${Math.round(w.responseRate * 100)}%`])} />
          </>
        ) : (
          <p className="m-0 text-sm text-muted">No survey waves entered yet. Program staff can add them on the <Link href="/equity-policy/register#survey-title">register</Link>.</p>
        )}
      </Figure>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="m-0 text-xl font-bold">How to read the numbers</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Tool counts show whether the method was run before the decision was final. They do not grade the analysis.</li>
            <li>Rising scans with flat full analyses can mean long-lasting work is getting the short form. Ask.</li>
            <li>Survey movement of one or two points is within normal variation. Look at direction over several waves.</li>
          </ul>
        </div>
        <div>
          <h3 className="m-0 text-xl font-bold">Where the numbers come from</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Tool use: every analysis or scan staff added through the guided walkthrough, counted by the quarter it was added and the administration named in it. Nothing is counted per person.</li>
            <li>Survey: one row per wave (percent favorable per item, respondents, response rate), entered by program staff after each wave.</li>
            <li>Open by design: every analysis, follow-up, and survey figure is readable by all DHS staff, and every change is kept in the register’s change history where it can be seen and reversed.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
