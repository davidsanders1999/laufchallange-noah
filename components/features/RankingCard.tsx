"use client";

import { useEffect, useState } from "react";
import { LeaderboardEntry } from "@/types";
import { calcPace } from "@/lib/utils";

interface RankingCardProps {
  leaderboard: LeaderboardEntry[];
}

const RUNNER_CONFIG: Record<string, { bar: string; text: string }> = {
  David: { bar: "bg-emerald-500", text: "text-emerald-600" },
  Noah:  { bar: "bg-violet-500",  text: "text-violet-600"  },
};
const DEFAULT_CONFIG = { bar: "bg-slate-400", text: "text-slate-600" };

export default function RankingCard({ leaderboard }: RankingCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const maxKm = leaderboard[0]?.totalKm ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-4">
        Rangliste
      </p>

      {leaderboard.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">
          Noch keine Läufe eingetragen
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {leaderboard.slice(0, 2).map((entry, i) => {
              const widthPct = maxKm > 0 ? (entry.totalKm / maxKm) * 100 : 0;
              const c = RUNNER_CONFIG[entry.userName] ?? DEFAULT_CONFIG;
              const pace = calcPace(entry.totalKm, entry.totalMin);
              return (
                <div key={entry.userName}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 w-4">{i + 1}</span>
                      <span className="text-sm font-bold text-slate-900">{entry.userName}</span>
                      <span className="text-[10px] text-slate-400">
                        {entry.runCount} {entry.runCount === 1 ? "Lauf" : "Läufe"}
                      </span>
                    </div>
                    <div>
                      <span className={`text-base font-bold tabular-nums ${c.text}`}>
                        {entry.totalKm.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400 ml-0.5">km</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${c.bar} h-2 rounded-full transition-all duration-700 ease-out`}
                      style={{ width: mounted ? `${widthPct}%` : "0%" }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Ø {pace} /km</p>
                </div>
              );
            })}
          </div>

          {leaderboard.length >= 2 && leaderboard[0].totalKm > leaderboard[1].totalKm && (
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{leaderboard[0].userName}</span> führt
              </span>
              <span className="text-xs font-bold text-slate-700 tabular-nums">
                +{(leaderboard[0].totalKm - leaderboard[1].totalKm).toFixed(1)} km
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
