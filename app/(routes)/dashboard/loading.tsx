export default function DashboardLoading() {
  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header skeleton */}
      <div className="sticky top-0 bg-white border-b border-gray-100 h-14" />

      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">
        {/* Countdown skeleton */}
        <div className="h-20 rounded-2xl bg-gray-200 animate-pulse" />
        {/* Ranking skeleton */}
        <div className="h-44 rounded-2xl bg-white shadow-sm border border-gray-100 animate-pulse" />
        {/* Stats skeleton */}
        <div className="h-40 rounded-2xl bg-white shadow-sm border border-gray-100 animate-pulse" />
        {/* Run list skeleton */}
        <div className="h-64 rounded-2xl bg-white shadow-sm border border-gray-100 animate-pulse" />
      </div>
    </div>
  );
}
