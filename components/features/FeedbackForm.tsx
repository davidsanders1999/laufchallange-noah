"use client";

import { useState } from "react";
import { FeedbackCategory } from "@prisma/client";
import { createFeedback } from "@/actions/feedback";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "IMPROVEMENT", label: "Verbesserungsvorschlag" },
  { value: "BUG", label: "Fehler" },
  { value: "OTHER", label: "Sonstiges" },
];

export default function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>("IMPROVEMENT");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Bitte einen Titel angeben.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await createFeedback({
      title: title.trim(),
      body: body.trim() || undefined,
      category,
      authorName: authorName.trim() || undefined,
    });
    setLoading(false);
    if (result.success) {
      setTitle("");
      setBody("");
      setAuthorName("");
      setCategory("IMPROVEMENT");
      setOpen(false);
    } else {
      setError(result.error ?? "Unbekannter Fehler.");
    }
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span>Feedback einreichen</span>
        <svg
          className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4 border-t border-slate-100">
          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Kategorie
            </p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    category === c.value
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Titel"
            placeholder="Kurz und prägnant"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Beschreibung <span className="text-slate-400 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Was genau soll verbessert werden?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 hover:border-slate-300 resize-none transition-all duration-150"
            />
          </div>

          <Input
            label="Dein Name"
            placeholder="Optional"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button type="submit" loading={loading} className="flex-1">
              Absenden
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
