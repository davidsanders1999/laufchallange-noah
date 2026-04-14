"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, PenLine } from "lucide-react";
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
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors -ml-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">Lauf eintragen</h1>
          <span className="ml-auto text-xs text-gray-400">{userName}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 pb-12">
        {/* Tab Switch */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6">
          <TabButton
            active={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
            icon={<Camera className="w-4 h-4" />}
            label="Screenshot"
          />
          <TabButton
            active={activeTab === "manual"}
            onClick={() => setActiveTab("manual")}
            icon={<PenLine className="w-4 h-4" />}
            label="Manuell"
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
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
