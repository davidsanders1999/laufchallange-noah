import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcPace(km: number, durationMin: number): string {
  if (km <= 0 || durationMin <= 0) return "—";
  const paceDecimal = durationMin / km;
  const minutes = Math.floor(paceDecimal);
  const seconds = Math.round((paceDecimal - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDuration(durationMin: number): string {
  if (durationMin < 60) return `${Math.round(durationMin)} min`;
  const hours = Math.floor(durationMin / 60);
  const mins = Math.round(durationMin % 60);
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
