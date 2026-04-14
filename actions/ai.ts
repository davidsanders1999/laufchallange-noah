"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AnalyzeResult =
  | { km: number; durationMin: number }
  | { error: string };

export async function analyzeStravaImage(
  base64: string
): Promise<AnalyzeResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analysiere diesen Strava-Screenshot und extrahiere die Laufdaten.
Gib NUR ein JSON-Objekt zurück, keine Erklärungen:
{
  "km": <Distanz in Kilometern als Dezimalzahl>,
  "durationMin": <Gesamtdauer in Minuten als Dezimalzahl>
}

Wenn du die Daten nicht erkennen kannst, gib zurück:
{ "error": "Daten nicht erkennbar" }`,
            },
            {
              type: "image_url",
              image_url: {
                url: base64,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return { error: "Keine Antwort von der KI." };

    const parsed = JSON.parse(content);

    if (parsed.error) return { error: parsed.error };

    const km = parseFloat(parsed.km);
    const durationMin = parseFloat(parsed.durationMin);

    if (isNaN(km) || isNaN(durationMin) || km <= 0 || durationMin <= 0) {
      return { error: "Ungültige Daten aus dem Screenshot extrahiert." };
    }

    return { km, durationMin };
  } catch (err) {
    console.error("analyzeStravaImage error:", err);
    return { error: "Fehler bei der Bildanalyse. Bitte manuell eingeben." };
  }
}
