"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { RunEntry } from "@/types";
import { calcPace, formatDate } from "@/lib/utils";
import { deleteRun } from "@/actions/runs";
import RunEditModal from "@/components/features/RunEditModal";
import { useRouter } from "next/navigation";

interface RunListProps {
  runs: RunEntry[];
  showUser?: boolean;
  editable?: boolean;
}

const RUNNER_DOT: Record<string, string> = {
  David: "bg-emerald-500",
  Noah: "bg-violet-500",
};

export default function RunList({
  runs,
  showUser = false,
  editable = false,
}: RunListProps) {
  const router = useRouter();
  const [editingRun, setEditingRun] = useState<RunEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (run: RunEntry) => {
    if (
      !confirm(
        `Lauf vom ${formatDate(run.date)} (${run.km.toFixed(2)} km) wirklich löschen?`
      )
    )
      return;
    setDeletingId(run.id);
    startTransition(async () => {
      await deleteRun(run.id);
      setDeletingId(null);
      router.refresh();
    });
  };

  if (runs.length === 0) {
    return (
      <Card>
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-4">
          Letzte Läufe
        </p>
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-400">Noch keine Läufe eingetragen</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card padding="none">
        <div className="px-5 pt-5 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Letzte Läufe
          </p>
        </div>

        <div className="divide-y divide-slate-50">
          {runs.map((run) => {
            const pace = calcPace(run.km, run.durationMin);
            const hours = Math.floor(run.durationMin / 60);
            const mins = Math.round(run.durationMin % 60);
            const durationStr =
              hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
            const isDeleting = deletingId === run.id;
            const dot = RUNNER_DOT[run.userName] ?? "bg-slate-400";

            return (
              <div
                key={run.id}
                className={`flex items-center gap-3 px-5 py-3.5 transition-opacity ${
                  isDeleting ? "opacity-30" : ""
                }`}
              >
                {/* Color dot */}
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-slate-900 tabular-nums">
                      {run.km.toFixed(2)} km
                    </span>
                    {showUser && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {run.userName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {durationStr} · {pace} /km
                    {run.note && (
                      <span className="text-slate-300"> · {run.note}</span>
                    )}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-1 shrink-0">
                  <p className="text-xs text-slate-400 tabular-nums">
                    {formatDate(run.date)}
                  </p>

                  {editable && (
                    <>
                      <button
                        onClick={() => setEditingRun(run)}
                        disabled={isDeleting || isPending}
                        className="ml-1 p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Bearbeiten"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(run)}
                        disabled={isDeleting || isPending}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Löschen"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-6 0h6"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {editingRun && (
        <RunEditModal
          run={editingRun}
          onClose={() => setEditingRun(null)}
          onSaved={() => {
            setEditingRun(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
