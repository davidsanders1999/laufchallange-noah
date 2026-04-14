"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const RUNNERS = ["David", "Noah"] as const;
type Runner = (typeof RUNNERS)[number];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="flex flex-col items-center gap-8 px-6 text-center">
        <div className="space-y-2">
          <div className="text-5xl">🏃</div>
          <h1 className="text-3xl font-bold text-gray-900">Lauf-Challenge</h1>
          <p className="text-gray-500">David vs. Noah · bis 31. Mai</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Wer bist du?</p>
          <div className="flex gap-4">
            {RUNNERS.map((name) => (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-md border-2 border-transparent hover:border-green-400 hover:shadow-lg transition-all duration-150 active:scale-95"
              >
                <span className="text-4xl">{name === "David" ? "🟢" : "🔵"}</span>
                <span className="text-lg font-bold text-gray-800">{name}</span>
              </button>
            ))}
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

  return (
    <div className="relative">
      <button
        onClick={() => setShowSwitch((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
      >
        <span>{user === "David" ? "🟢" : "🔵"}</span>
        <span>{user}</span>
        <span className="text-xs opacity-60">▾</span>
      </button>

      {showSwitch && (
        <div className="absolute right-0 top-full mt-1 z-10 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden min-w-[120px]">
          {RUNNERS.filter((r) => r !== user).map((name) => (
            <button
              key={name}
              onClick={() => {
                setRunner(name);
                setShowSwitch(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{name === "David" ? "🟢" : "🔵"}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
