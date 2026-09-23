"use client";

import { useId, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { fmt } from "@/lib/equity-analysis/format";

// Series colors follow the entity. Checked for color-vision deficiency against a
// white surface (adjacent-pair and all-pairs); do not reorder or substitute.
export const SERIES_COLORS = {
  full: "#1c6fc0",
  scan: "#5c9c14",
  pause: "#a0459c",
  belonging: "#1c6fc0",
  inclusion: "#5c9c14",
  engagement: "#a0459c",
} as const;

const INK = "#181817";
const MUTED = "#353532";
const AXIS = "#7a7a76";
const GRID = "#e6e6e2";
const SURFACE = "#ffffff";

export type Series = { key: string; label: string; color: string };
type Active = { i: number; left: number; flip: boolean };
type StackRow = { label: string; values: Record<string, number> };

const W = 640;
const H = 280;

function niceMax(max: number, steps = 4): number {
  if (max <= 0) return steps;
  const raw = max / steps;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const unit = [1, 2, 2.5, 5, 10].find((u) => u * mag >= raw) ?? 10;
  return unit * mag * steps;
}

function topRounded(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

function useActiveMark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active | null>(null);
  const show = (i: number) => (e: SyntheticEvent<Element>) => {
    const mark = e.currentTarget.getBoundingClientRect();
    const wrap = wrapRef.current?.getBoundingClientRect();
    const left = wrap ? mark.left + mark.width / 2 - wrap.left : 0;
    setActive({ i, left, flip: wrap ? left > wrap.width * 0.7 : false });
  };
  return { wrapRef, active, show, hide: () => setActive(null) };
}

export function Legend({ series, mark = "rect" }: { series: Series[]; mark?: "rect" | "line" }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm text-muted" aria-label="Legend">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-2">
          <span aria-hidden="true" className={mark === "line" ? "inline-block h-[3px] w-4 rounded-full" : "inline-block h-3 w-3 rounded-[3px]"} style={{ background: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function Tooltip({ anchor, title, rows }: { anchor: Active; title: string; rows: { label: string; value: string; color?: string }[] }) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute top-10 z-10 min-w-[10rem] rounded border border-line bg-white px-3 py-2 text-sm shadow"
      style={{ left: anchor.left, transform: anchor.flip ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
    >
      <p className="m-0 font-semibold">{title}</p>
      <ul className="m-0 mt-1 list-none space-y-0.5 p-0">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-muted">
              {r.color ? <span aria-hidden="true" className="inline-block h-[3px] w-3 rounded-full" style={{ background: r.color }} /> : null}
              {r.label}
            </span>
            <strong className="tabular-nums">{r.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatTile({ label, value, delta, note }: { label: string; value: string; delta?: { text: string; direction: "up" | "down" | "flat"; vs: string } | null; note?: string }) {
  const tone = delta?.direction === "up" ? "text-green-strong" : delta?.direction === "down" ? "text-[color:var(--red-strong)]" : "text-muted";
  const word = delta?.direction === "up" ? "up" : delta?.direction === "down" ? "down" : "no change";
  return (
    <div className="card">
      <p className="m-0 text-sm text-muted">{label}</p>
      <p className="m-0 mt-1 text-4xl font-semibold leading-none">{value}</p>
      {delta ? (
        <p className={`m-0 mt-3 text-sm ${tone}`}>
          <span className="font-semibold">{delta.text}</span> <span className="text-muted">{word} from {delta.vs}</span>
        </p>
      ) : null}
      {note ? <p className="m-0 mt-2 text-xs text-muted">{note}</p> : null}
    </div>
  );
}

export function TableView({ caption, columns, rows }: { caption: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-4 text-sm">
      <summary className="cursor-pointer font-semibold">View as table</summary>
      <div className="mt-2 overflow-x-auto">
        <table className="data w-full">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>{columns.map((c, i) => <th key={c} scope="col" className={i > 0 ? "text-right" : ""}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>{r.map((cell, ci) => <td key={ci} className={ci > 0 ? "text-right tabular-nums" : ""}>{typeof cell === "number" ? fmt(cell) : cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function Figure({ title, lede, children, footnote }: { title: string; lede?: string; children: ReactNode; footnote?: ReactNode }) {
  return (
    <figure className="card m-0">
      <figcaption>
        <h3 className="m-0 text-xl font-bold">{title}</h3>
        {lede ? <p className="m-0 mt-1 text-sm text-muted">{lede}</p> : null}
      </figcaption>
      <div className="mt-4">{children}</div>
      {footnote ? <p className="m-0 mt-3 text-xs text-muted">{footnote}</p> : null}
    </figure>
  );
}

export function StackedColumns({ rows, series, ariaLabel }: { rows: StackRow[]; series: Series[]; ariaLabel: string }) {
  const { wrapRef, active, show, hide } = useActiveMark();
  const pad = { top: 16, right: 12, bottom: 32, left: 36 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const totals = rows.map((r) => series.reduce((s, k) => s + (r.values[k.key] ?? 0), 0));
  const yMax = niceMax(Math.max(...totals));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
  const band = plotW / rows.length;
  const barW = Math.min(24, band * 0.6);
  const y = (v: number) => pad.top + plotH - (v / yMax) * plotH;
  const dim = (i: number) => (active === null || active.i === i ? 1 : 0.55);
  return (
    <div ref={wrapRef} className="relative">
      <Legend series={series} />
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block w-full min-w-[34rem]" role="img" aria-label={ariaLabel} onMouseLeave={hide}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? AXIS : GRID} strokeWidth={1} />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={AXIS}>{fmt(t)}</text>
            </g>
          ))}
          {rows.map((r, i) => {
            const cx = pad.left + band * i + band / 2;
            const x0 = cx - barW / 2;
            let cursor = 0;
            const segs = series.map((s, si) => {
              const v = r.values[s.key] ?? 0;
              const y1 = y(cursor + v);
              const y0 = y(cursor);
              cursor += v;
              const gap = si > 0 && v > 0 ? 2 : 0;
              return { s, v, y: y1, h: Math.max(0, y0 - y1 - gap), isTop: si === series.length - 1 };
            });
            return (
              <g key={r.label}>
                {segs.map(({ s, v, y: sy, h, isTop }) =>
                  v <= 0 ? null : isTop ? <path key={s.key} d={topRounded(x0, sy, barW, h, 4)} fill={s.color} opacity={dim(i)} /> : <rect key={s.key} x={x0} y={sy} width={barW} height={h} fill={s.color} opacity={dim(i)} />,
                )}
                <text x={cx} y={y(totals[i]) - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill={INK}>{fmt(totals[i])}</text>
                <text x={cx} y={H - 10} textAnchor="middle" fontSize={11} fill={MUTED}>{r.label}</text>
                <rect
                  x={pad.left + band * i}
                  y={pad.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${r.label}: ${series.map((s) => `${s.label} ${fmt(r.values[s.key] ?? 0)}`).join(", ")}, total ${fmt(totals[i])}`}
                  onMouseEnter={show(i)}
                  onFocus={show(i)}
                  onBlur={hide}
                  style={{ outline: "none" }}
                />
              </g>
            );
          })}
        </svg>
      </div>
      {active ? <Tooltip anchor={active} title={rows[active.i].label} rows={[...series.map((s) => ({ label: s.label, value: fmt(rows[active.i].values[s.key] ?? 0), color: s.color })), { label: "Total", value: fmt(totals[active.i]) }]} /> : null}
    </div>
  );
}

export function StackedBars({ rows, series, ariaLabel, showLegend = true }: { rows: StackRow[]; series: Series[]; ariaLabel: string; showLegend?: boolean }) {
  const { wrapRef, active, show, hide } = useActiveMark();
  const totals = rows.map((r) => series.reduce((s, k) => s + (r.values[k.key] ?? 0), 0));
  const max = Math.max(...totals, 1);
  return (
    <div ref={wrapRef} className="relative">
      {showLegend ? <Legend series={series} /> : null}
      <ol className={`m-0 list-none p-0 ${showLegend ? "mt-3" : ""} space-y-3`} aria-label={ariaLabel} onMouseLeave={hide}>
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="grid grid-cols-[minmax(7rem,12rem)_1fr_3rem] items-center gap-3 rounded"
            tabIndex={0}
            aria-label={`${r.label}: ${series.map((s) => `${s.label} ${fmt(r.values[s.key] ?? 0)}`).join(", ")}, total ${fmt(totals[i])}`}
            onMouseEnter={show(i)}
            onFocus={show(i)}
            onBlur={hide}
          >
            <span className="text-sm leading-tight">{r.label}</span>
            <div className="flex h-4 items-stretch gap-[2px]" aria-hidden="true">
              {series.map((s, si) => {
                const v = r.values[s.key] ?? 0;
                if (v <= 0) return null;
                return <span key={s.key} className={si === series.length - 1 ? "rounded-r-[4px]" : ""} style={{ width: `${(v / max) * 100}%`, background: s.color, opacity: active === null || active.i === i ? 1 : 0.55 }} />;
              })}
            </div>
            <span className="text-right text-sm font-semibold tabular-nums">{fmt(totals[i])}</span>
          </li>
        ))}
      </ol>
      {active ? <Tooltip anchor={active} title={rows[active.i].label} rows={[...series.map((s) => ({ label: s.label, value: fmt(rows[active.i].values[s.key] ?? 0), color: s.color })), { label: "Total", value: fmt(totals[active.i]) }]} /> : null}
    </div>
  );
}

export function TrendLines({ xLabels, series, ariaLabel, unit = "%" }: { xLabels: string[]; series: (Series & { values: number[] })[]; ariaLabel: string; unit?: string }) {
  const { wrapRef, active, show, hide } = useActiveMark();
  const clipId = useId();
  const pad = { top: 16, right: 124, bottom: 32, left: 36 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const all = series.flatMap((s) => s.values);
  const lo = Math.floor((Math.min(...all) - 4) / 10) * 10;
  const hi = Math.ceil((Math.max(...all) + 4) / 10) * 10;
  const n = xLabels.length;
  const x = (i: number) => pad.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => pad.top + plotH - ((v - lo) / (hi - lo)) * plotH;
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += 10) ticks.push(t);
  const bandW = n === 1 ? plotW : plotW / (n - 1);
  const ends = series.map((s, i) => ({ i, y: y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k += 1) if (ends[k].y - ends[k - 1].y < 13) ends[k].y = ends[k - 1].y + 13;
  const endY = new Map(ends.map((e) => [e.i, e.y]));
  return (
    <div ref={wrapRef} className="relative">
      <Legend series={series} mark="line" />
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block w-full min-w-[34rem]" role="img" aria-label={ariaLabel} onMouseLeave={hide}>
          <defs>
            <clipPath id={clipId}><rect x={pad.left - 6} y={0} width={plotW + 12} height={H} /></clipPath>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + plotW} y1={y(t)} y2={y(t)} stroke={t === lo ? AXIS : GRID} strokeWidth={1} />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={AXIS}>{t}{unit}</text>
            </g>
          ))}
          {xLabels.map((l, i) => <text key={l} x={x(i)} y={H - 10} textAnchor="middle" fontSize={11} fill={MUTED}>{l}</text>)}
          {active ? <line x1={x(active.i)} x2={x(active.i)} y1={pad.top} y2={pad.top + plotH} stroke={AXIS} strokeWidth={1} /> : null}
          <g clipPath={`url(#${clipId})`}>
            {series.map((s) => <polyline key={s.key} points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />)}
          </g>
          {series.map((s, si) => {
            const last = s.values.length - 1;
            return (
              <g key={s.key}>
                {active ? <circle cx={x(active.i)} cy={y(s.values[active.i])} r={5} fill={s.color} stroke={SURFACE} strokeWidth={2} /> : null}
                <circle cx={x(last)} cy={y(s.values[last])} r={4} fill={s.color} stroke={SURFACE} strokeWidth={2} />
                <text x={x(last) + 10} y={endY.get(si) ?? y(s.values[last])} dy="0.32em" fontSize={11} fill={INK}>
                  <tspan fontWeight={600}>{s.values[last]}{unit}</tspan>
                  <tspan fill={MUTED}> {s.label}</tspan>
                </text>
              </g>
            );
          })}
          {xLabels.map((l, i) => (
            <rect key={l} x={x(i) - bandW / 2} y={pad.top} width={bandW} height={plotH} fill="transparent" tabIndex={0} aria-label={`${l}: ${series.map((s) => `${s.label} ${s.values[i]}${unit}`).join(", ")}`} onMouseEnter={show(i)} onFocus={show(i)} onBlur={hide} style={{ outline: "none" }} />
          ))}
        </svg>
      </div>
      {active ? <Tooltip anchor={active} title={xLabels[active.i]} rows={series.map((s) => ({ label: s.label, value: `${s.values[active.i]}${unit}`, color: s.color }))} /> : null}
    </div>
  );
}
