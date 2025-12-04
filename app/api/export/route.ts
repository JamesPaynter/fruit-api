// app/api/export/route.ts
import { NextRequest, NextResponse } from "next/server";

type CountryData = {
  name: string;
  mainExport: string;
};

const COUNTRY_TO_EXPORT: Record<string, CountryData> = {
  "united kingdom": {
    name: "United Kingdom",
    mainExport: "baked beans",
  },
  brazil: {
    name: "Brazil",
    mainExport: "Havaianas",
  },
  "new zealand": {
    name: "New Zealand",
    mainExport: "hobbits",
  },
  canada: {
    name: "Canada",
    mainExport: "maple syrup",
  },
};

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryRaw = searchParams.get("country") || "";
  const key = countryRaw.toLowerCase();

  const data = COUNTRY_TO_EXPORT[key];

  if (!countryRaw || !data) {
    return NextResponse.json(
      {
        error:
          "Unsupported country. Use one of: United Kingdom, Brazil, New Zealand, Canada.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    country: data.name,
    mainExport: data.mainExport,
  });
}
