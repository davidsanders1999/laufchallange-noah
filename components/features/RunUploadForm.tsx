"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { analyzeStravaImage } from "@/actions/ai";
import { createRun } from "@/actions/runs";
import { calcPace } from "@/lib/utils";

interface RunUploadFormProps {
  userName: string;
}

export default function RunUploadForm({ userName }: RunUploadFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<{
    km: number;
    durationMin: number;
    date?: string;
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setExtracted(null);
      setAiError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setAiError(null);

    const result = await analyzeStravaImage(preview);

    if ("error" in result) {
      setAiError(result.error);
    } else {
      setExtracted(result);
    }
    setAnalyzing(false);
  };

  const handleConfirm = async () => {
    if (!extracted) return;
    setSaving(true);
    setSaveError(null);

    const result = await createRun({
      userName,
      km: extracted.km,
      durationMin: extracted.durationMin,
      date: extracted.date ? new Date(extracted.date) : undefined,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setSaveError(result.error ?? "Fehler beim Speichern.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-150
          ${preview
            ? "border-slate-200 bg-slate-50"
            : "border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/30"
          }`}
      >
        {preview ? (
          <div className="p-3 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Strava Screenshot"
              className="max-h-60 w-full rounded-xl object-contain"
            />
            <p className="text-center text-xs text-slate-400 mt-2">
              Zum Ändern tippen
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 px-6">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                Screenshot auswählen
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Strava Screenshot · JPG, PNG bis 10 MB
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Analyze button */}
      {preview && !extracted && (
        <Button
          onClick={handleAnalyze}
          loading={analyzing}
          disabled={analyzing}
          className="w-full"
          size="lg"
        >
          {analyzing ? "Analysiere..." : "KI-Analyse starten"}
        </Button>
      )}

      {/* AI error */}
      {aiError && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{aiError}</p>
          <p className="text-xs text-red-400 mt-0.5">
            Bitte manuell eingeben.
          </p>
        </div>
      )}

      {/* Extracted stats */}
      {extracted && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Daten erkannt
            </p>
          </div>

          <div className={`grid divide-x divide-slate-100 ${extracted.date ? "grid-cols-4" : "grid-cols-3"}`}>
            <ExtractedStat
              label="Distanz"
              value={extracted.km.toFixed(2)}
              unit="km"
            />
            <ExtractedStat
              label="Zeit"
              value={
                extracted.durationMin < 60
                  ? `${Math.round(extracted.durationMin)}`
                  : `${Math.floor(extracted.durationMin / 60)}h ${Math.round(extracted.durationMin % 60)}`
              }
              unit={extracted.durationMin < 60 ? "min" : ""}
            />
            <ExtractedStat
              label="Pace"
              value={calcPace(extracted.km, extracted.durationMin)}
              unit="/km"
            />
            {extracted.date && (
              <ExtractedStat
                label="Datum"
                value={new Date(extracted.date).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              />
            )}
          </div>

          {saveError && (
            <div className="px-5 py-3 border-t border-slate-100">
              <p className="text-xs text-red-500">{saveError}</p>
            </div>
          )}

          <div className="flex gap-2.5 px-5 py-4 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => {
                setExtracted(null);
                setPreview(null);
                setSaveError(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="flex-1"
            >
              Nochmal
            </Button>
            <Button onClick={handleConfirm} loading={saving} className="flex-1">
              Speichern
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtractedStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="px-4 py-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-1">
        {label}
      </p>
      <div className="flex items-baseline justify-center gap-0.5">
        <span className="text-lg font-bold text-slate-800 tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 ml-0.5">{unit}</span>}
      </div>
    </div>
  );
}
