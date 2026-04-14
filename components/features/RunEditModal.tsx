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

export default function RunEditModal({ run, onClose, onSaved }: RunEditModalProps) {
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
    if (!duration || isNaN(d) || d <= 0) e.duration = "Bitte eine gültige Dauer eingeben";
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900">Lauf bearbeiten</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Dauer (Minuten)"
            type="number"
            step="0.5"
            min="1"
            max="600"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={errors.duration}
            hint="Dezimalminuten, z.B. 28.5 = 28 min 30 sek"
          />

          {pace && (
            <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-green-700 font-medium">Pace</span>
              <span className="text-lg font-bold text-green-800">{pace} /km</span>
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
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
              {saveError}
            </p>
          )}

          <Button type="submit" loading={saving} className="w-full" size="lg">
            Speichern
          </Button>
        </form>
      </div>
    </div>
  );
}
