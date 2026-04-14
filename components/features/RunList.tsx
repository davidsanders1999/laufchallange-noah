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

export default function RunList({ runs, showUser = false, editable = false }: RunListProps) {
  const router = useRouter();
  const [editingRun, setEditingRun] = useState<RunEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (run: RunEntry) => {
    if (!confirm(`Lauf vom ${formatDate(run.date)} (${run.km.toFixed(2)} km) wirklich löschen?`)) return;
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
        <h2 className="text-base font-semibold text-gray-900 mb-4">Letzte Läufe</h2>
        <div className="py-8 text-center">
          <div className="text-4xl mb-2">👟</div>
          <p className="text-sm text-gray-400">Noch keine Läufe eingetragen</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card padding="none">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-base font-semibold text-gray-900">Letzte Läufe</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {runs.map((run) => {
            const pace = calcPace(run.km, run.durationMin);
            const hours = Math.floor(run.durationMin / 60);
            const mins = Math.round(run.durationMin % 60);
            const durationStr = hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
            const isDeleting = deletingId === run.id;

            return (
              <div
                key={run.id}
                className={`flex items-center gap-3 px-5 py-3.5 ${isDeleting ? "opacity-40" : ""}`}
              >
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🏃</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {run.km.toFixed(2)} km
                    </span>
                    {showUser && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {run.userName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {durationStr} · {pace} /km
                    {run.note && ` · ${run.note}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-xs text-gray-400">{formatDate(run.date)}</p>
                  {editable && (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => setEditingRun(run)}
                        disabled={isDeleting || isPending}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        aria-label="Bearbeiten"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(run)}
                        disabled={isDeleting || isPending}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Löschen"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-6 0h6" />
                        </svg>
                      </button>
                    </div>
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
