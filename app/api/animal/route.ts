// app/api/animal/route.ts
import { NextRequest, NextResponse } from "next/server";

const FRUIT_TO_ANIMAL: Record<string, string> = {
  strawberry: "fox",
  banana: "monkey",
  kiwi: "kiwi bird",
  blueberry: "bear",
};

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fruit = (searchParams.get("fruit") || "").toLowerCase();

  if (!fruit || !FRUIT_TO_ANIMAL[fruit]) {
    return NextResponse.json(
      {
        error:
          "Unsupported fruit. Use one of: strawberry, banana, kiwi, blueberry.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    fruit,
    animal: FRUIT_TO_ANIMAL[fruit],
  });
}
