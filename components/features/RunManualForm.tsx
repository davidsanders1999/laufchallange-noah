"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createRun } from "@/actions/runs";
import { calcPace } from "@/lib/utils";

interface RunManualFormProps {
  userName: string;
}

export default function RunManualForm({ userName }: RunManualFormProps) {
  const router = useRouter();
  const [km, setKm] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
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

    const result = await createRun({
      userName,
      km: parseFloat(km),
      durationMin: parseFloat(duration),
      date: new Date(date),
      note: note.trim() || undefined,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setSaveError(result.error ?? "Fehler beim Speichern.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Distanz (km)"
          type="number"
          step="0.01"
          min="0.1"
          max="200"
          placeholder="5.4"
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
          placeholder="28.5"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          error={errors.duration}
        />
      </div>

      {errors.km && <p className="text-xs text-red-500 -mt-2">{errors.km}</p>}
      {errors.duration && (
        <p className="text-xs text-red-500 -mt-2">{errors.duration}</p>
      )}

      {/* Live pace preview */}
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
        placeholder="z.B. Morgenrunde im Park"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <p className="text-xs text-slate-400">
        Dauer in Dezimalminuten · 28.5 = 28 min 30 sek
      </p>

      {saveError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {saveError}
        </p>
      )}

      <Button type="submit" loading={saving} className="w-full" size="lg">
        Lauf speichern
      </Button>
    </form>
  );
}
