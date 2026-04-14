import { getLeaderboard, getAllRuns } from "@/actions/runs";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [leaderboard, runs] = await Promise.all([
    getLeaderboard(),
    getAllRuns(),
  ]);

  return (
    <div className="min-h-dvh bg-gray-50">
      <DashboardClient leaderboard={leaderboard} runs={runs} />
    </div>
  );
}
