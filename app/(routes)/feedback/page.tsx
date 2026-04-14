import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAllFeedback } from "@/actions/feedback";
import FeedbackForm from "@/components/features/FeedbackForm";
import FeedbackList from "@/components/features/FeedbackList";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const entries = await getAllFeedback();

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-slate-900 tracking-tight">Feedback</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-16 space-y-4">
        <FeedbackForm />
        <FeedbackList entries={entries} />
      </main>
    </div>
  );
}
