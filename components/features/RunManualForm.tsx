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
      <Input
        label="Distanz (km)"
        type="number"
        step="0.01"
        min="0.1"
        max="200"
        placeholder="z.B. 5.4"
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
        placeholder="z.B. 28.5"
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
        placeholder="z.B. Morgenrunde im Park"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {saveError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
          {saveError}
        </p>
      )}

      <Button type="submit" loading={saving} className="w-full" size="lg">
        Lauf speichern
      </Button>
    </form>
  );
}
