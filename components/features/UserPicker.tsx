"use client";

import { useEffect, useState } from "react";

const RUNNERS = ["David", "Noah"] as const;
type Runner = (typeof RUNNERS)[number];

const RUNNER_COLORS: Record<Runner, { bg: string; border: string; text: string; dot: string }> = {
  David: {
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Noah: {
    bg: "bg-violet-50",
    border: "border-violet-400",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
};

interface UserPickerProps {
  onUserChange?: (user: Runner) => void;
}

export function useCurrentUser() {
  const [user, setUser] = useState<Runner | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("runner");
    if (stored === "David" || stored === "Noah") {
      setUser(stored);
    }
  }, []);

  const setRunner = (name: Runner) => {
    localStorage.setItem("runner", name);
    setUser(name);
  };

  return { user, setRunner };
}

export default function UserPicker({ onUserChange }: UserPickerProps) {
  const { user, setRunner } = useCurrentUser();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("runner")) {
      setShowOverlay(true);
    }
  }, []);

  const handleSelect = (name: Runner) => {
    setRunner(name);
    setShowOverlay(false);
    onUserChange?.(name);
  };

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col items-center gap-10 px-6 text-center max-w-sm w-full">
        {/* Logo mark */}
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lauf-Challenge</h1>
            <p className="text-sm text-slate-500 mt-1">David vs. Noah · bis 24. Mai 2026</p>
          </div>
        </div>

        {/* Picker */}
        <div className="w-full space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
            Wer bist du?
          </p>
          <div className="flex gap-3">
            {RUNNERS.map((name) => {
              const c = RUNNER_COLORS[name];
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className={`flex-1 flex flex-col items-center gap-3 rounded-2xl border-2 bg-white px-6 py-6
                    border-slate-200 hover:${c.border} hover:${c.bg}
                    transition-all duration-150 active:scale-95 group`}
                >
                  <div className={`w-10 h-10 rounded-full ${c.dot} flex items-center justify-center`}>
                    <span className="text-base font-bold text-white">{name[0]}</span>
                  </div>
                  <span className="text-base font-bold text-slate-800">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserHeader() {
  const { user, setRunner } = useCurrentUser();
  const [showSwitch, setShowSwitch] = useState(false);

  if (!user) return null;

  const c = RUNNER_COLORS[user];

  return (
    <div className="relative">
      <button
        onClick={() => setShowSwitch((v) => !v)}
        className={`flex items-center gap-2 rounded-xl ${c.bg} px-3 py-1.5 text-sm font-semibold ${c.text} hover:opacity-80 transition-opacity`}
      >
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        <span>{user}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showSwitch && (
        <div className="absolute right-0 top-full mt-1.5 z-10 rounded-xl bg-white shadow-modal border border-slate-200/80 overflow-hidden min-w-[130px]">
          {RUNNERS.filter((r) => r !== user).map((name) => {
            const nc = RUNNER_COLORS[name];
            return (
              <button
                key={name}
                onClick={() => {
                  setRunner(name);
                  setShowSwitch(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${nc.dot}`} />
                <span className="font-medium">{name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
