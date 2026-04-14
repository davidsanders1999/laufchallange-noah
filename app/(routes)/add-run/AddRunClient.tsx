"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RunUploadForm from "@/components/features/RunUploadForm";
import RunManualForm from "@/components/features/RunManualForm";

type Tab = "upload" | "manual";

export default function AddRunClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("runner");
    if (stored === "David" || stored === "Noah") {
      setUserName(stored);
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (!userName) return null;

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors -ml-1"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">
            Lauf eintragen
          </h1>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                userName === "David" ? "bg-emerald-500" : "bg-violet-500"
              }`}
            />
            {userName}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 pb-12">
        {/* Tab Switch */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          <TabButton
            active={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
            label="Screenshot"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            }
          />
          <TabButton
            active={activeTab === "manual"}
            onClick={() => setActiveTab("manual")}
            label="Manuell"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            }
          />
        </div>

        {activeTab === "upload" ? (
          <RunUploadForm userName={userName} />
        ) : (
          <RunManualForm userName={userName} />
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all duration-150 ${
        active
          ? "bg-white text-slate-800 shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
