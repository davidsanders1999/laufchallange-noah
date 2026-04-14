"use client";

import { useEffect, useState } from "react";

const START_DATE = new Date("2026-04-01T00:00:00");
const END_DATE = new Date("2026-05-24T23:59:59");
const TOTAL_DAYS = Math.ceil(
  (END_DATE.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
);

function getStats() {
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((END_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
  const elapsed = Math.min(
    TOTAL_DAYS,
    Math.max(
      0,
      Math.floor(
        (now.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
      )
    )
  );
  const progress = Math.min(100, Math.round((elapsed / TOTAL_DAYS) * 100));
  return { daysLeft, elapsed, progress };
}

export default function CountdownBanner() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStats(getStats());
    setTimeout(() => setMounted(true), 50);
  }, []);

  if (!stats) return null;

  const { daysLeft, elapsed, progress } = stats;

  if (daysLeft === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-1">
          Challenge
        </p>
        <p className="text-xl font-bold text-slate-900">Abgeschlossen</p>
        <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-slate-400">1. Apr 2026</span>
          <span className="text-[10px] font-semibold text-emerald-600">100%</span>
          <span className="text-[10px] text-slate-400">24. Mai 2026</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card px-5 py-5">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-0.5">
            Verbleibend
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 tabular-nums leading-none">
              {daysLeft}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {daysLeft === 1 ? "Tag" : "Tage"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-0.5">
            Fortschritt
          </p>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-xl font-bold text-slate-900 tabular-nums leading-none">
              {progress}
            </span>
            <span className="text-sm font-semibold text-slate-500">%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Tag {elapsed} / {TOTAL_DAYS}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: mounted ? `${progress}%` : "0%" }}
        />
      </div>

      {/* Date labels */}
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-slate-400">1. Apr 2026</span>
        <span className="text-[10px] text-slate-400">24. Mai 2026</span>
      </div>
    </div>
  );
}
