export default function AddRunLoading() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-100 h-14" />
      <div className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        <div className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
