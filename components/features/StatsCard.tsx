import { Card } from "@/components/ui/Card";
import { LeaderboardEntry } from "@/types";
import { calcPace, formatDuration } from "@/lib/utils";

interface StatsCardProps {
  entry: LeaderboardEntry | null;
  userName: string;
}

export default function StatsCard({ entry, userName }: StatsCardProps) {
  const avgPace = entry
    ? calcPace(entry.totalKm, entry.totalMin)
    : "—";
  const totalTime = entry ? formatDuration(entry.totalMin) : "—";
  const totalKm = entry ? entry.totalKm.toFixed(1) : "0.0";
  const runCount = entry?.runCount ?? 0;

  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Meine Stats
        <span className="ml-2 text-xs font-normal text-gray-400">({userName})</span>
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Gesamt"
          value={`${totalKm} km`}
          icon="🏃"
          highlight
        />
        <StatItem
          label="Zeit"
          value={totalTime}
          icon="⏱️"
        />
        <StatItem
          label="Ø Pace"
          value={avgPace ? `${avgPace} /km` : "—"}
          icon="⚡"
        />
        <StatItem
          label="Läufe"
          value={String(runCount)}
          icon="📍"
        />
      </div>
    </Card>
  );
}

function StatItem({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${highlight ? "bg-green-50 border border-green-100" : "bg-gray-50"}`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-lg font-bold ${highlight ? "text-green-700" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}
