"use client";

import { useEffect, useState } from "react";
import { LeaderboardEntry } from "@/types";
import { calcPace } from "@/lib/utils";

interface RankingCardProps {
  leaderboard: LeaderboardEntry[];
}

const RUNNER_COLORS: Record<string, { bar: string; text: string; bg: string; border: string }> = {
  David: {
    bar: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Noah: {
    bar: "bg-violet-500",
    text: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
};

const DEFAULT_COLOR = {
  bar: "bg-slate-400",
  text: "text-slate-600",
  bg: "bg-slate-50",
  border: "border-slate-200",
};

export default function RankingCard({ leaderboard }: RankingCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const maxKm = leaderboard[0]?.totalKm ?? 0;

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-4">
          Rangliste
        </p>
        <p className="text-sm text-slate-400 text-center py-4">
          Noch keine Läufe eingetragen
        </p>
      </div>
    );
  }

  const leader = leaderboard[0];
  const second = leaderboard[1] ?? null;
  const kmDiff = second ? leader.totalKm - second.totalKm : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-4">
        Rangliste
      </p>

      <div className="space-y-4">
        {leaderboard.slice(0, 2).map((entry, i) => {
          const widthPct = maxKm > 0 ? (entry.totalKm / maxKm) * 100 : 0;
          const c = RUNNER_COLORS[entry.userName] ?? DEFAULT_COLOR;
          const pace = calcPace(entry.totalKm, entry.totalMin);

          return (
            <div key={entry.userName}>
              {/* Name row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 w-4">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {entry.userName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {entry.runCount} {entry.runCount === 1 ? "Lauf" : "Läufe"}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-bold tabular-nums ${c.text}`}>
                    {entry.totalKm.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 ml-0.5">km</span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`${c.bar} h-2 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: mounted ? `${widthPct}%` : "0%" }}
                />
              </div>

              {/* Pace */}
              <p className="text-[10px] text-slate-400 mt-1">
                Ø {pace} /km
              </p>
            </div>
          );
        })}
      </div>

      {/* Lead indicator */}
      {kmDiff !== null && kmDiff > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{leader.userName}</span> führt
          </span>
          <span className="text-xs font-bold text-slate-700 tabular-nums">
            +{kmDiff.toFixed(1)} km
          </span>
        </div>
      )}
    </div>
  );
}
