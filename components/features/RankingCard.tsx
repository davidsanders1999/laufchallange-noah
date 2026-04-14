import { Card } from "@/components/ui/Card";
import { LeaderboardEntry } from "@/types";
import { calcPace } from "@/lib/utils";

interface RankingCardProps {
  leaderboard: LeaderboardEntry[];
}

const MEDALS = ["🥇", "🥈"] as const;
const COLORS = ["text-yellow-500", "text-gray-400"] as const;

export default function RankingCard({ leaderboard }: RankingCardProps) {
  const entries = [
    leaderboard[0] ?? null,
    leaderboard[1] ?? null,
  ];

  const leader = entries[0];
  const kmDiff =
    leader && entries[1]
      ? leader.totalKm - entries[1].totalKm
      : null;

  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-900 mb-4">Rangliste</h2>

      <div className="space-y-3">
        {entries.map((entry, i) => {
          if (!entry) {
            return (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="text-xl">{MEDALS[i]}</span>
                <span className="text-sm text-gray-400 italic">Noch kein Läufer</span>
              </div>
            );
          }

          const pace = calcPace(entry.totalKm, entry.totalMin);

          return (
            <div
              key={entry.userName}
              className={`flex items-center gap-3 rounded-xl p-3 ${i === 0 ? "bg-yellow-50 border border-yellow-100" : "bg-gray-50"}`}
            >
              <span className="text-2xl">{MEDALS[i]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {entry.userName}
                  </span>
                  {i === 0 && kmDiff !== null && kmDiff > 0 && (
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-1.5 py-0.5 rounded-full">
                      +{kmDiff.toFixed(1)} km
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {entry.runCount} {entry.runCount === 1 ? "Lauf" : "Läufe"} · Ø {pace} /km
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${COLORS[i]}`}>
                  {entry.totalKm.toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">km</p>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          Noch keine Läufe eingetragen
        </p>
      )}
    </Card>
  );
}
