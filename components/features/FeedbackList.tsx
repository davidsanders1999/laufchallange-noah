"use client";

import { useState, useTransition } from "react";
import { FeedbackCategory, FeedbackStatus } from "@prisma/client";
import { updateFeedbackStatus, updateFeedback, deleteFeedback, FeedbackEntry } from "@/actions/feedback";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Trash2, Pencil, ChevronDown, CheckCheck, Ban } from "lucide-react";

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  BUG: "Fehler",
  IMPROVEMENT: "Verbesserung",
  OTHER: "Sonstiges",
};

const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  BUG: "bg-red-100 text-red-700",
  IMPROVEMENT: "bg-blue-100 text-blue-700",
  OTHER: "bg-slate-100 text-slate-600",
};

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: "OPEN", label: "Offen" },
  { value: "IN_PROGRESS", label: "In Bearbeitung" },
  { value: "DONE", label: "Umgesetzt" },
  { value: "REJECTED", label: "Abgelehnt" },
];

const STATUS_BORDER: Record<FeedbackStatus, string> = {
  OPEN: "border-l-orange-400",
  IN_PROGRESS: "border-l-yellow-400",
  DONE: "border-l-emerald-400",
  REJECTED: "border-l-slate-300",
};

const STATUS_DOT: Record<FeedbackStatus, string> = {
  OPEN: "bg-orange-400",
  IN_PROGRESS: "bg-yellow-400",
  DONE: "bg-emerald-400",
  REJECTED: "bg-slate-300",
};

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "IMPROVEMENT", label: "Verbesserungsvorschlag" },
  { value: "BUG", label: "Fehler" },
  { value: "OTHER", label: "Sonstiges" },
];

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Std.`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `vor ${diffD} Tag${diffD > 1 ? "en" : ""}`;
  return new Date(date).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

function FeedbackCard({ entry, muted = false }: { entry: FeedbackEntry; muted?: boolean }) {
  const [status, setStatus] = useState<FeedbackStatus>(entry.status);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body ?? "");
  const [category, setCategory] = useState<FeedbackCategory>(entry.category);
  const [authorName, setAuthorName] = useState(entry.authorName ?? "");
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState("");

  function handleStatusChange(newStatus: FeedbackStatus) {
    setStatus(newStatus);
    startTransition(() => {
      updateFeedbackStatus(entry.id, newStatus);
    });
  }

  async function handleSave() {
    if (!title.trim()) {
      setEditError("Bitte einen Titel angeben.");
      return;
    }
    setSaving(true);
    setEditError("");
    const result = await updateFeedback(entry.id, {
      title: title.trim(),
      body: body.trim() || undefined,
      category,
      authorName: authorName.trim() || undefined,
    });
    setSaving(false);
    if (result.success) {
      setEditing(false);
    } else {
      setEditError(result.error ?? "Unbekannter Fehler.");
    }
  }

  function handleCancelEdit() {
    setTitle(entry.title);
    setBody(entry.body ?? "");
    setCategory(entry.category);
    setAuthorName(entry.authorName ?? "");
    setEditError("");
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Feedback wirklich löschen?")) return;
    setDeleting(true);
    await deleteFeedback(entry.id);
  }

  return (
    <Card
      padding="sm"
      className={cn(
        "border-l-[3px] transition-all duration-200",
        STATUS_BORDER[status],
        deleting && "opacity-40 pointer-events-none",
        muted && "opacity-60 hover:opacity-100"
      )}
    >
      {editing ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Kategorie</p>
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
          <Input label="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Beschreibung{" "}
              <span className="text-slate-400 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 hover:border-slate-300 resize-none transition-all duration-150"
            />
          </div>
          <Input
            label="Name"
            placeholder="Optional"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          {editError && <p className="text-xs text-red-500 font-medium">{editError}</p>}
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSave} loading={saving} className="flex-1">
              Speichern
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
              Abbrechen
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md", CATEGORY_COLORS[category])}>
                {CATEGORY_LABELS[category]}
              </span>
              {/* Inline status selector — dot + label, no visible box */}
              <label className={cn("flex items-center gap-1.5 cursor-pointer", isPending && "opacity-50")}>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[status])} />
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as FeedbackStatus)}
                  disabled={isPending}
                  className="text-xs text-slate-400 bg-transparent appearance-none cursor-pointer focus:outline-none hover:text-slate-600 transition-colors"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {authorName && <span className="text-xs text-slate-400">{authorName}</span>}
              <span className="text-xs text-slate-400">{timeAgo(entry.createdAt)}</span>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Bearbeiten"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Löschen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800 leading-snug">{title}</p>
          {body && <p className="mt-1 text-sm text-slate-500 leading-relaxed">{body}</p>}
        </>
      )}
    </Card>
  );
}

export default function FeedbackList({ entries }: { entries: FeedbackEntry[] }) {
  const [archivedOpen, setArchivedOpen] = useState(false);

  const active = entries.filter((e) => e.status === "OPEN" || e.status === "IN_PROGRESS");
  const archived = entries.filter((e) => e.status === "DONE" || e.status === "REJECTED");

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">Noch kein Feedback vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Active count */}
      <p className="text-xs text-slate-400 font-medium px-1">
        {active.length} {active.length === 1 ? "offener Eintrag" : "offene Einträge"}
      </p>

      {/* Active entries */}
      {active.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">Kein offenes Feedback.</p>
        </div>
      ) : (
        active.map((entry) => <FeedbackCard key={entry.id} entry={entry} />)
      )}

      {/* Archived section */}
      {archived.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setArchivedOpen((v) => !v)}
            className="w-full flex items-center gap-3 py-2 px-1 group"
          >
            {/* Line */}
            <div className="flex-1 h-px bg-slate-200" />

            {/* Label */}
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors shrink-0">
              {archivedOpen ? (
                <Ban className="w-3 h-3" />
              ) : (
                <CheckCheck className="w-3 h-3" />
              )}
              {archived.length} abgeschlossen
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  archivedOpen && "rotate-180"
                )}
              />
            </span>

            {/* Line */}
            <div className="flex-1 h-px bg-slate-200" />
          </button>

          {archivedOpen && (
            <div className="space-y-3 mt-2">
              {archived.map((entry) => (
                <FeedbackCard key={entry.id} entry={entry} muted />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
