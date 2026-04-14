"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2025-05-31T23:59:59");

function getDaysLeft(): number {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function CountdownBanner() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(getDaysLeft());
  }, []);

  if (days === null) return null;

  if (days === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-4 text-center shadow-sm">
        <p className="text-lg font-bold text-white">Challenge beendet!</p>
        <p className="text-sm text-yellow-100">31. Mai ist erreicht</p>
      </div>
    );
  }

  const urgency = days <= 7 ? "from-red-500 to-orange-500" : days <= 14 ? "from-orange-400 to-amber-400" : "from-green-500 to-emerald-500";

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${urgency} px-5 py-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-white/80 uppercase tracking-wide">Challenge läuft noch</p>
          <p className="text-2xl font-bold text-white">
            {days} {days === 1 ? "Tag" : "Tage"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/70">bis 31. Mai 2025</p>
          <div className="text-2xl">🏁</div>
        </div>
      </div>
    </div>
  );
}
