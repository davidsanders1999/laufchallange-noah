"use server";

import { prisma } from "@/lib/prisma";
import { LeaderboardEntry, RunEntry } from "@/types";
import { revalidatePath } from "next/cache";

export async function createRun(data: {
  userName: string;
  km: number;
  durationMin: number;
  date?: Date;
  note?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.upsert({
      where: { name: data.userName },
      update: {},
      create: { name: data.userName },
    });

    await prisma.run.create({
      data: {
        userId: user.id,
        km: data.km,
        durationMin: data.durationMin,
        date: data.date ?? new Date(),
        note: data.note,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("createRun error:", err);
    return { success: false, error: "Fehler beim Speichern des Laufs." };
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const results = await prisma.run.groupBy({
    by: ["userId"],
    _sum: { km: true, durationMin: true },
    _count: { id: true },
  });

  const userIds = results.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
  });

  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

  const leaderboard: LeaderboardEntry[] = results.map((r) => ({
    userName: userMap[r.userId] ?? r.userId,
    totalKm: r._sum.km ?? 0,
    totalMin: r._sum.durationMin ?? 0,
    runCount: r._count.id,
  }));

  leaderboard.sort((a, b) => b.totalKm - a.totalKm);
  return leaderboard;
}

export async function getRunsByUser(userName: string): Promise<RunEntry[]> {
  const user = await prisma.user.findUnique({ where: { name: userName } });
  if (!user) return [];

  const runs = await prisma.run.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 20,
  });

  return runs.map((r) => ({
    id: r.id,
    userName,
    km: r.km,
    durationMin: r.durationMin,
    date: r.date,
    note: r.note ?? undefined,
  }));
}

export async function updateRun(
  id: string,
  data: { km: number; durationMin: number; date: Date; note?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.run.update({
      where: { id },
      data: {
        km: data.km,
        durationMin: data.durationMin,
        date: data.date,
        note: data.note ?? null,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("updateRun error:", err);
    return { success: false, error: "Fehler beim Aktualisieren des Laufs." };
  }
}

export async function deleteRun(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.run.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("deleteRun error:", err);
    return { success: false, error: "Fehler beim Löschen des Laufs." };
  }
}

export async function getAllRuns(): Promise<RunEntry[]> {
  const runs = await prisma.run.findMany({
    include: { user: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  return runs.map((r) => ({
    id: r.id,
    userName: r.user.name,
    km: r.km,
    durationMin: r.durationMin,
    date: r.date,
    note: r.note ?? undefined,
  }));
}
