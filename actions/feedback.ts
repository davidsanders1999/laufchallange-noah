"use server";

import { prisma } from "@/lib/prisma";
import { FeedbackCategory, FeedbackStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type FeedbackEntry = {
  id: string;
  title: string;
  body: string | null;
  category: FeedbackCategory;
  status: FeedbackStatus;
  authorName: string | null;
  createdAt: Date;
};

export async function createFeedback(data: {
  title: string;
  body?: string;
  category: FeedbackCategory;
  authorName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.feedback.create({
      data: {
        title: data.title,
        body: data.body || null,
        category: data.category,
        authorName: data.authorName || null,
      },
    });
    revalidatePath("/feedback");
    return { success: true };
  } catch (err) {
    console.error("createFeedback error:", err);
    return { success: false, error: "Fehler beim Speichern des Feedbacks." };
  }
}

export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  return prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.feedback.update({ where: { id }, data: { status } });
    revalidatePath("/feedback");
    return { success: true };
  } catch (err) {
    console.error("updateFeedbackStatus error:", err);
    return { success: false, error: "Fehler beim Aktualisieren des Status." };
  }
}

export async function updateFeedback(
  id: string,
  data: { title: string; body?: string; category: FeedbackCategory; authorName?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.feedback.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body || null,
        category: data.category,
        authorName: data.authorName || null,
      },
    });
    revalidatePath("/feedback");
    return { success: true };
  } catch (err) {
    console.error("updateFeedback error:", err);
    return { success: false, error: "Fehler beim Bearbeiten des Feedbacks." };
  }
}

export async function deleteFeedback(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.feedback.delete({ where: { id } });
    revalidatePath("/feedback");
    return { success: true };
  } catch (err) {
    console.error("deleteFeedback error:", err);
    return { success: false, error: "Fehler beim Löschen des Feedbacks." };
  }
}
