"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UserHeader } from "@/components/features/UserPicker";
import CountdownBanner from "@/components/features/CountdownBanner";
import RankingCard from "@/components/features/RankingCard";
import ProgressChart from "@/components/features/ProgressChart";
import StatsCard from "@/components/features/StatsCard";
import RunList from "@/components/features/RunList";
import UserPicker from "@/components/features/UserPicker";
import { LeaderboardEntry, RunEntry } from "@/types";

interface DashboardClientProps {
  leaderboard: LeaderboardEntry[];
  runs: RunEntry[];
}

export default function DashboardClient({
  leaderboard,
  runs,
}: DashboardClientProps) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("runner");
    if (stored === "David" || stored === "Noah") {
      setCurrentUser(stored);
    }
  }, []);

  const myEntry = leaderboard.find((e) => e.userName === currentUser) ?? null;
  const myRuns  = currentUser ? runs.filter((r) => r.userName === currentUser) : runs;

  return (
    <>
      <UserPicker onUserChange={setCurrentUser} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Lauf-Challenge
            </span>
          </div>
          <UserHeader />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-3">
        <CountdownBanner />
        <RankingCard leaderboard={leaderboard} />
        <ProgressChart runs={runs} />
        {currentUser && <StatsCard entry={myEntry} userName={currentUser} />}
        <RunList runs={myRuns} showUser={!currentUser} editable={!!currentUser} />
      </main>

      {/* FABs */}
      <div
        className="fixed right-4 z-40 flex flex-col items-end gap-2"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <Link
          href="/feedback"
          className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-sm text-slate-600 font-semibold shadow-md hover:bg-slate-50 active:scale-95 transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span>Feedback</span>
        </Link>
        <Link
          href="/add-run"
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm text-white font-semibold shadow-lg hover:bg-emerald-600 active:scale-95 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Lauf eintragen</span>
        </Link>
      </div>
    </>
  );
}
