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

type ExtractedData = {
  km: number;
  durationMin: number;
};

export default function RunUploadForm({ userName }: RunUploadFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracted(null);
    setAiError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setAiError(null);
    setExtracted(null);

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
      {/* File Input */}
      <div
        onClick={() => fileRef.current?.click()}
        className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Strava Screenshot"
            className="max-h-64 rounded-xl object-contain shadow"
          />
        ) : (
          <>
            <div className="text-4xl mb-3">📸</div>
            <p className="text-sm font-medium text-gray-600">
              Strava Screenshot auswählen
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG bis 10 MB</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

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

      {aiError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm text-red-600">{aiError}</p>
          <p className="text-xs text-red-400 mt-1">
            Bitte manuell eingeben.
          </p>
        </div>
      )}

      {extracted && (
        <div className="rounded-2xl bg-green-50 border border-green-100 p-5 space-y-4">
          <p className="text-sm font-semibold text-green-800">
            Daten erkannt
          </p>

          <div className="grid grid-cols-3 gap-3">
            <ExtractedStat
              label="Distanz"
              value={`${extracted.km.toFixed(2)} km`}
            />
            <ExtractedStat
              label="Zeit"
              value={
                extracted.durationMin < 60
                  ? `${Math.round(extracted.durationMin)} min`
                  : `${Math.floor(extracted.durationMin / 60)}h ${Math.round(extracted.durationMin % 60)}min`
              }
            />
            <ExtractedStat
              label="Pace"
              value={`${calcPace(extracted.km, extracted.durationMin)} /km`}
            />
          </div>

          {saveError && (
            <p className="text-xs text-red-500">{saveError}</p>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setExtracted(null);
                setPreview(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="flex-1"
            >
              Nochmal
            </Button>
            <Button
              onClick={handleConfirm}
              loading={saving}
              className="flex-1"
            >
              Speichern
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtractedStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}
