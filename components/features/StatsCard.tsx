import { LeaderboardEntry } from "@/types";
import { calcPace, formatDuration } from "@/lib/utils";

interface StatsCardProps {
  entry: LeaderboardEntry | null;
  userName: string;
}

const RUNNER_COLORS: Record<string, { accent: string; border: string; bg: string }> = {
  David: { accent: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" },
  Noah: { accent: "text-violet-600", border: "border-violet-200", bg: "bg-violet-50" },
};

const DEFAULT_COLOR = {
  accent: "text-slate-700",
  border: "border-slate-200",
  bg: "bg-slate-50",
};

export default function StatsCard({ entry, userName }: StatsCardProps) {
  const c = RUNNER_COLORS[userName] ?? DEFAULT_COLOR;
  const avgPace = entry ? calcPace(entry.totalKm, entry.totalMin) : "—";
  const totalTime = entry ? formatDuration(entry.totalMin) : "—";
  const totalKm = entry ? entry.totalKm.toFixed(1) : "0.0";
  const runCount = entry?.runCount ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
          Meine Stats
        </p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${c.bg} ${c.accent}`}>
          {userName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricTile
          label="Gesamt"
          value={totalKm}
          unit="km"
          accent={c.accent}
          highlighted
          bg={c.bg}
          border={c.border}
        />
        <MetricTile label="Zeit" value={totalTime} />
        <MetricTile label="Ø Pace" value={avgPace} unit="/km" />
        <MetricTile label="Läufe" value={String(runCount)} />
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  unit,
  highlighted = false,
  accent = "text-slate-800",
  bg = "bg-slate-50",
  border = "border-slate-100",
}: {
  label: string;
  value: string;
  unit?: string;
  highlighted?: boolean;
  accent?: string;
  bg?: string;
  border?: string;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 border ${highlighted ? `${bg} ${border}` : "bg-slate-50 border-slate-100"}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-1.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-xl font-bold tabular-nums leading-none ${
            highlighted ? accent : "text-slate-800"
          }`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs text-slate-400 font-medium">{unit}</span>
        )}
      </div>
    </div>
  );
}
