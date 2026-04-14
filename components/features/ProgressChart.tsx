"use client";

import { useEffect, useState } from "react";
import { RunEntry } from "@/types";

interface ProgressChartProps {
  runs: RunEntry[];
}

const CHALLENGE_START = new Date("2026-04-01T00:00:00").getTime();
const CHALLENGE_END   = new Date("2026-05-24T23:59:59").getTime();

const COLORS = {
  David: { line: "#10B981", grad: "#10B981" },
  Noah:  { line: "#8B5CF6", grad: "#8B5CF6" },
} as const;

// SVG layout:
//  PAD_L = left margin — km labels start at x=0, grid lines start at x=PAD_L
//  PT    = top padding
//  IH    = inner chart height
//  PB    = bottom area: two label rows (dates)
const VW    = 400;
const PAD_L = 18;
const PT    = 8;
const IH    = 88;
const PB    = 36;
const VH    = PT + IH + PB; // = 132

function buildSeries(runs: RunEntry[], name: string, xMin: number, xMax: number) {
  const sorted = runs
    .filter((r) => r.userName === name)
    .map((r) => ({ t: new Date(r.date).getTime(), km: r.km }))
    .filter((r) => r.t >= xMin && r.t <= xMax)
    .sort((a, b) => a.t - b.t);

  let cum = 0;
  const pts: { t: number; km: number; isRun: boolean }[] = [
    { t: xMin, km: 0, isRun: false },
  ];
  for (const r of sorted) {
    cum += r.km;
    pts.push({ t: r.t, km: cum, isRun: true });
  }
  if (pts.at(-1)!.t < xMax) pts.push({ t: xMax, km: cum, isRun: false });
  return pts;
}

function makeLine(pts: { t: number; km: number }[], xs: (t: number) => number, ys: (km: number) => number) {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${xs(p.t).toFixed(1)},${ys(p.km).toFixed(1)}`)
    .join(" ");
}

function makeArea(pts: { t: number; km: number }[], xs: (t: number) => number, ys: (km: number) => number) {
  const line = makeLine(pts, xs, ys);
  const base = ys(0).toFixed(1);
  return `${line} L${xs(pts.at(-1)!.t).toFixed(1)},${base} L${xs(pts[0].t).toFixed(1)},${base} Z`;
}

export default function ProgressChart({ runs }: ProgressChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  const now  = Date.now();
  const xMin = CHALLENGE_START;
  const xMax = Math.min(now, CHALLENGE_END);

  const runners = ["David", "Noah"] as const;
  const series  = Object.fromEntries(
    runners.map((n) => [n, buildSeries(runs, n, xMin, xMax)])
  );

  const maxKm    = Math.max(...Object.values(series).flatMap((ps) => ps.map((p) => p.km)), 10);
  const yMax     = Math.ceil(maxKm / 5) * 5;
  const gridStep = yMax <= 20 ? 5 : yMax <= 50 ? 10 : 25;

  const xs = (t: number)  => PAD_L + ((t - xMin) / (xMax - xMin)) * (VW - PAD_L);
  const ys = (km: number) => PT + IH - (km / yMax) * IH;

  const baseline = PT + IH;       // y of the x-axis line (= 96)
  const labelY1  = baseline + 12; // first label row
  const labelY2  = baseline + 23; // second label row (today's date)

  const gridLines: number[] = [];
  for (let km = gridStep; km <= yMax; km += gridStep) gridLines.push(km);

  const showToday = now < CHALLENGE_END;
  const rawTodayX = xs(now);

  const todayFormatted = new Date(now).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
          Verlauf
        </p>
        <div className="flex items-center gap-4">
          {runners.map((name) => (
            <div key={name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[name].line }} />
              <span className="text-xs font-semibold text-slate-700">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG — same px-5 padding as other cards */}
      <div className="px-5 pb-4">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full block">
          <defs>
            {runners.map((name) => (
              <linearGradient key={name} id={`pg-grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={COLORS[name].grad} stopOpacity="0.18" />
                <stop offset="100%" stopColor={COLORS[name].grad} stopOpacity="0" />
              </linearGradient>
            ))}

            {/* Clip rect — animates from left, same principle as bar animation */}
            <clipPath id="pg-reveal">
              <rect
                x={0} y={0} width={VW} height={baseline}
                style={{
                  transformBox: "fill-box" as React.CSSProperties["transformBox"],
                  transformOrigin: "left",
                  transform: `scaleX(${mounted ? 1 : 0})`,
                  transition: "transform 0.8s ease-out",
                }}
              />
            </clipPath>
          </defs>

          {/* ── Grid lines — start at PAD_L; km labels left-aligned at x=0 ── */}
          {gridLines.map((km) => (
            <g key={km}>
              <line
                x1={PAD_L} y1={ys(km)} x2={VW} y2={ys(km)}
                stroke="#F1F5F9" strokeWidth="1"
              />
              <text
                x={0} y={ys(km)}
                textAnchor="start" dominantBaseline="middle"
                fill="#CBD5E1" fontSize={8}
              >
                {km}
              </text>
            </g>
          ))}

          {/* ── Baseline ── */}
          <line x1={PAD_L} y1={baseline} x2={VW} y2={baseline} stroke="#E2E8F0" strokeWidth="1" />

          {/* ── Today marker (dashed vertical) ── */}
          {showToday && (
            <line
              x1={rawTodayX} y1={PT}
              x2={rawTodayX} y2={baseline}
              stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3"
            />
          )}

          {/* ── Animated chart content (clipped) ── */}
          <g clipPath="url(#pg-reveal)">
            {runners.map((name) => (
              <path
                key={`area-${name}`}
                d={makeArea(series[name], xs, ys)}
                fill={`url(#pg-grad-${name})`}
              />
            ))}
            {[...runners].reverse().map((name) => (
              <path
                key={`line-${name}`}
                d={makeLine(series[name], xs, ys)}
                fill="none"
                stroke={COLORS[name].line}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {runners.map((name) =>
              series[name]
                .filter((p) => p.isRun)
                .map((p, i) => (
                  <circle
                    key={`dot-${name}-${i}`}
                    cx={xs(p.t)} cy={ys(p.km)}
                    r={3} fill="white"
                    stroke={COLORS[name].line} strokeWidth="1.5"
                  />
                ))
            )}
          </g>

          {/* ── X-axis label rows ── */}
          {/* Left: "Start" + start date, aligned with left end of x-axis */}
          <text x={PAD_L} y={labelY1} fill="#94A3B8" fontSize={8} fontWeight="600" textAnchor="start">
            Start
          </text>
          <text x={PAD_L} y={labelY2} fill="#CBD5E1" fontSize={7} textAnchor="start">
            1. Apr 2026
          </text>

          {/* Right: "Heute" + today's date during challenge; end date after */}
          {showToday ? (
            <>
              <text x={VW} y={labelY1} fill="#94A3B8" fontSize={8} fontWeight="600" textAnchor="end">
                Heute
              </text>
              <text x={VW} y={labelY2} fill="#CBD5E1" fontSize={7} textAnchor="end">
                {todayFormatted}
              </text>
            </>
          ) : (
            <text x={VW} y={labelY1} fill="#94A3B8" fontSize={8} textAnchor="end">
              24. Mai 2026
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
