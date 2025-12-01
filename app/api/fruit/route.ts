// app/api/fruit/route.ts
import { NextRequest, NextResponse } from "next/server";

const COLOR_TO_FRUIT: Record<string, string> = {
  red: "strawberry",
  yellow: "banana",
  green: "kiwi",
  blue: "blueberry",
};

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const color = (searchParams.get("color") || "").toLowerCase();

  if (!color || !COLOR_TO_FRUIT[color]) {
    return NextResponse.json(
      {
        error: "Unsupported color. Use one of: red, yellow, green, blue.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    color,
    fruit: COLOR_TO_FRUIT[color],
  });
}
