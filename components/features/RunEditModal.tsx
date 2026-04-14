"use client";

import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updateRun } from "@/actions/runs";
import { calcPace } from "@/lib/utils";
import { RunEntry } from "@/types";

interface RunEditModalProps {
  run: RunEntry;
  onClose: () => void;
  onSaved: () => void;
}

export default function RunEditModal({
  run,
  onClose,
  onSaved,
}: RunEditModalProps) {
  const [km, setKm] = useState(run.km.toString());
  const [duration, setDuration] = useState(run.durationMin.toString());
  const [date, setDate] = useState(
    new Date(run.date).toISOString().split("T")[0]
  );
  const [note, setNote] = useState(run.note ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const pace = useMemo(() => {
    const k = parseFloat(km);
    const d = parseFloat(duration);
    if (k > 0 && d > 0) return calcPace(k, d);
    return null;
  }, [km, duration]);

  const validate = () => {
    const e: Record<string, string> = {};
    const k = parseFloat(km);
    const d = parseFloat(duration);
    if (!km || isNaN(k) || k <= 0) e.km = "Bitte eine gültige Distanz eingeben";
    if (!duration || isNaN(d) || d <= 0)
      e.duration = "Bitte eine gültige Dauer eingeben";
    if (!date) e.date = "Bitte ein Datum wählen";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    setSaveError(null);
    setErrors({});

    const result = await updateRun(run.id, {
      km: parseFloat(km),
      durationMin: parseFloat(duration),
      date: new Date(date),
      note: note.trim() || undefined,
    });

    if (result.success) {
      onSaved();
    } else {
      setSaveError(result.error ?? "Fehler beim Speichern.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-modal">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="px-5 pt-4 pb-safe-bottom pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">
              Lauf bearbeiten
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Schließen"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Distanz (km)"
                type="number"
                step="0.01"
                min="0.1"
                max="200"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                error={errors.km}
              />
              <Input
                label="Dauer (min)"
                type="number"
                step="0.5"
                min="1"
                max="600"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={errors.duration}
              />
            </div>

            {pace && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                  Pace
                </span>
                <span className="text-base font-bold text-slate-800 tabular-nums">
                  {pace} /km
                </span>
              </div>
            )}

            <Input
              label="Datum"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
            />
            <Input
              label="Notiz (optional)"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {saveError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {saveError}
              </p>
            )}

            <div className="flex gap-2.5 pt-1">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button type="submit" loading={saving} className="flex-1">
                Speichern
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
