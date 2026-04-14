export type RunEntry = {
  id: string;
  userName: string;
  km: number;
  durationMin: number;
  date: Date;
  note?: string;
};

export type LeaderboardEntry = {
  userName: string;
  totalKm: number;
  totalMin: number;
  runCount: number;
};
