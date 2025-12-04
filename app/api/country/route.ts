// app/api/country/route.ts
import { NextRequest, NextResponse } from "next/server";

const ANIMAL_TO_COUNTRY: Record<string, string> = {
  // Keep animals aligned with FRUIT_TO_ANIMAL above
  "fox": "United Kingdom",
  "monkey": "Brazil",
  "kiwi bird": "New Zealand",
  "bear": "Canada",
};

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const animalRaw = searchParams.get("animal") || "";
  const animal = animalRaw.toLowerCase();

  // Normalise keys to match our mapping
  const key = animal as keyof typeof ANIMAL_TO_COUNTRY;

  if (!animal || !ANIMAL_TO_COUNTRY[key]) {
    return NextResponse.json(
      {
        error:
          "Unsupported animal. Use one of: fox, monkey, kiwi bird, bear.",
      },
      { status: 400 }
    );
  }

  const country = ANIMAL_TO_COUNTRY[key];

  return NextResponse.json({
    animal: animalRaw, // echo what the client sent
    country,
  });
}
