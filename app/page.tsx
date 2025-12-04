"use client";

import { useState } from "react";
import { Orb } from "@/components/ui/orb";

type Bot = {
  id: string;
  title: string;
  description: string;
  url: string;
  colors: [string, string];
  seed: number;
};

// Allowed options for each API
type ColorOption = "red" | "yellow" | "green" | "blue";
type FruitOption = "strawberry" | "banana" | "kiwi" | "blueberry";
type AnimalOption = "fox" | "monkey" | "kiwi bird" | "bear";
type CountryOption = "United Kingdom" | "Brazil" | "New Zealand" | "Canada";

const BOTS: Bot[] = [
  {
    id: "test-fruits-api",
    title: "Test External API call",
    description:
      "Tap to run the Fruits API test bot. This tests 1) choosing a multiple choice answer, 2) using an external API call in ElevenLabs, 3) using the API result to generate a response.",
    url: "https://elevenlabs.io/app/talk-to?agent_id=agent_6701kbbs2db0exrt4daf1dr2h65r",
    colors: ["#8b5cf6", "#60a5fa"],
    seed: 101,
  },
];

export default function Page() {
  // Select values
  const [color, setColor] = useState<ColorOption>("green");
  const [fruit, setFruit] = useState<FruitOption>("kiwi");
  const [animal, setAnimal] = useState<AnimalOption>("kiwi bird");
  const [country, setCountry] = useState<CountryOption>("New Zealand");

  // Individual results
  const [fruitResult, setFruitResult] = useState<string>("");
  const [animalResult, setAnimalResult] = useState<string>("");
  const [countryResult, setCountryResult] = useState<string>("");
  const [exportResult, setExportResult] = useState<string>("");

  // Full chain result
  const [chainResult, setChainResult] = useState<string>("");

  // ----- Helper calls that return data -----

  async function callFruitApi(selectedColor: ColorOption) {
    const res = await fetch(`/api/fruit?color=${encodeURIComponent(selectedColor)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unknown /api/fruit error");
    }
    return data as { color: string; fruit: FruitOption };
  }

  async function callAnimalApi(selectedFruit: FruitOption) {
    const res = await fetch(`/api/animal?fruit=${encodeURIComponent(selectedFruit)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unknown /api/animal error");
    }
    return data as { fruit: string; animal: AnimalOption };
  }

  async function callCountryApi(selectedAnimal: AnimalOption) {
    const res = await fetch(`/api/country?animal=${encodeURIComponent(selectedAnimal)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unknown /api/country error");
    }
    return data as { animal: string; country: CountryOption };
  }

  async function callExportApi(selectedCountry: CountryOption) {
    const res = await fetch(`/api/export?country=${encodeURIComponent(selectedCountry)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unknown /api/export error");
    }
    return data as { country: string; mainExport: string };
  }

  // ----- Button handlers: test each endpoint -----

  async function testFruitApi() {
    try {
      setFruitResult(`Calling /api/fruit?color=${color} ...`);
      const data = await callFruitApi(color);
      setFruitResult(JSON.stringify(data, null, 2));
      // Keep selects in sync with API result
      setFruit(data.fruit);
    } catch (err) {
      setFruitResult((err as Error).message);
    }
  }

  async function testAnimalApi() {
    try {
      setAnimalResult(`Calling /api/animal?fruit=${fruit} ...`);
      const data = await callAnimalApi(fruit);
      setAnimalResult(JSON.stringify(data, null, 2));
      setAnimal(data.animal);
    } catch (err) {
      setAnimalResult((err as Error).message);
    }
  }

  async function testCountryApi() {
    try {
      setCountryResult(`Calling /api/country?animal=${animal} ...`);
      const data = await callCountryApi(animal);
      setCountryResult(JSON.stringify(data, null, 2));
      setCountry(data.country);
    } catch (err) {
      setCountryResult((err as Error).message);
    }
  }

  async function testExportApi() {
    try {
      setExportResult(`Calling /api/export?country=${country} ...`);
      const data = await callExportApi(country);
      setExportResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setExportResult((err as Error).message);
    }
  }

  // ----- Full chain: presses all the "buttons" logically -----

  async function testFullApiChain() {
    try {
      setChainResult("Running full chain from selected color ...");

      // Reset panel messages
      setFruitResult("");
      setAnimalResult("");
      setCountryResult("");
      setExportResult("");

      // 1) color -> fruit
      setFruitResult(`Calling /api/fruit?color=${color} ...`);
      const fruitData = await callFruitApi(color);
      setFruitResult(JSON.stringify(fruitData, null, 2));
      setFruit(fruitData.fruit);

      // 2) fruit -> animal
      setAnimalResult(`Calling /api/animal?fruit=${fruitData.fruit} ...`);
      const animalData = await callAnimalApi(fruitData.fruit);
      setAnimalResult(JSON.stringify(animalData, null, 2));
      setAnimal(animalData.animal);

      // 3) animal -> country
      setCountryResult(`Calling /api/country?animal=${animalData.animal} ...`);
      const countryData = await callCountryApi(animalData.animal);
      setCountryResult(JSON.stringify(countryData, null, 2));
      setCountry(countryData.country);

      // 4) country -> export
      setExportResult(`Calling /api/export?country=${countryData.country} ...`);
      const exportData = await callExportApi(countryData.country);
      setExportResult(JSON.stringify(exportData, null, 2));

      const summary = {
        color: fruitData.color,
        fruit: fruitData.fruit,
        animal: animalData.animal,
        country: countryData.country,
        mainExport: exportData.mainExport,
      };

      setChainResult(
        JSON.stringify(
          {
            steps: {
              fruit: fruitData,
              animal: animalData,
              country: countryData,
              export: exportData,
            },
            summary,
          },
          null,
          2
        )
      );
    } catch (err) {
      setChainResult((err as Error).message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f3f6",
        fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        padding: "60px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 700,
              marginBottom: "10px",
              letterSpacing: "-0.5px",
            }}
          >
            My Test Bots
          </h1>
          <p style={{ fontSize: "18px", color: "#555" }}>
            Choose a bot to test or run a live API call.
          </p>
        </div>

        {/* Bot grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "32px",
            marginBottom: "70px",
          }}
        >
          {BOTS.map((bot) => (
            <a
              key={bot.id}
              href={bot.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "32px 28px 30px",
                background: "white",
                borderRadius: "24px",
                textDecoration: "none",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 14px 40px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.08)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                minHeight: "340px",
                textAlign: "center",
                maxWidth: "420px",
                width: "100%",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 55px rgba(15,23,42,0.18), 0 6px 18px rgba(15,23,42,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 14px 40px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.08)";
              }}
            >
              {/* Orb */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: "999px",
                    padding: 6,
                    background: "#020617",
                    boxShadow: "0 26px 60px rgba(15,23,42,0.55)",
                  }}
                >
                  <Orb
                    colors={bot.colors}
                    seed={bot.seed}
                    agentState={null}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Text */}
              <div>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 650,
                    marginBottom: "6px",
                    color:
                      bot.id === "test-fruits-api" ? "#6d28d9" : "#0f172a",
                  }}
                >
                  {bot.title}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    lineHeight: 1.5,
                  }}
                >
                  {bot.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* API test section */}
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "32px 36px",
            boxShadow:
              "0 12px 32px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)",
            border: "1px solid #e8e8e8",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            Test External API Call
          </h2>
          <p style={{ fontSize: "16px", color: "#555", marginBottom: 20 }}>
            Use the controls below to test each endpoint individually or run the
            full chain: <code>color → fruit → animal → country → export</code>.
          </p>

          {/* Run full chain */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <button
              onClick={testFullApiChain}
              style={{
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
                color: "white",
                padding: "12px 22px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                boxShadow: "0 8px 20px rgba(34,197,94,0.25)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 28px rgba(34,197,94,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(34,197,94,0.25)";
              }}
            >
              Run full chain from selected color
            </button>
          </div>

          {/* 1. /api/fruit */}
          <section style={{ marginBottom: "18px" }}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              1. /api/fruit – color → fruit
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label style={{ fontSize: "14px" }}>Color:</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as ColorOption)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  fontSize: "14px",
                  minWidth: "140px",
                  background: "#fff",
                }}
              >
                <option value="red">red</option>
                <option value="yellow">yellow</option>
                <option value="green">green</option>
                <option value="blue">blue</option>
              </select>

              <button
                onClick={testFruitApi}
                style={{
                  background: "linear-gradient(90deg, #0070f3, #0059d6)",
                  color: "white",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 6px 16px rgba(0,118,255,0.25)",
                }}
              >
                Test /api/fruit
              </button>
            </div>
            {fruitResult && (
              <pre
                style={{
                  background: "#f6f6f6",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  border: "1px solid #e0e0e0",
                  overflowX: "auto",
                }}
              >
                {fruitResult}
              </pre>
            )}
          </section>

          {/* 2. /api/animal */}
          <section style={{ marginBottom: "18px" }}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              2. /api/animal – fruit → animal
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label style={{ fontSize: "14px" }}>Fruit:</label>
              <select
                value={fruit}
                onChange={(e) => setFruit(e.target.value as FruitOption)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  fontSize: "14px",
                  minWidth: "160px",
                  background: "#fff",
                }}
              >
                <option value="strawberry">strawberry</option>
                <option value="banana">banana</option>
                <option value="kiwi">kiwi</option>
                <option value="blueberry">blueberry</option>
              </select>

              <button
                onClick={testAnimalApi}
                style={{
                  background: "linear-gradient(90deg, #0ea5e9, #0284c7)",
                  color: "white",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 6px 16px rgba(14,165,233,0.25)",
                }}
              >
                Test /api/animal
              </button>
            </div>
            {animalResult && (
              <pre
                style={{
                  background: "#f6f6f6",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  border: "1px solid #e0e0e0",
                  overflowX: "auto",
                }}
              >
                {animalResult}
              </pre>
            )}
          </section>

          {/* 3. /api/country */}
          <section style={{ marginBottom: "18px" }}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              3. /api/country – animal → country
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label style={{ fontSize: "14px" }}>Animal:</label>
              <select
                value={animal}
                onChange={(e) => setAnimal(e.target.value as AnimalOption)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  fontSize: "14px",
                  minWidth: "160px",
                  background: "#fff",
                }}
              >
                <option value="fox">fox</option>
                <option value="monkey">monkey</option>
                <option value="kiwi bird">kiwi bird</option>
                <option value="bear">bear</option>
              </select>

              <button
                onClick={testCountryApi}
                style={{
                  background: "linear-gradient(90deg, #f97316, #ea580c)",
                  color: "white",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 6px 16px rgba(249,115,22,0.25)",
                }}
              >
                Test /api/country
              </button>
            </div>
            {countryResult && (
              <pre
                style={{
                  background: "#f6f6f6",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  border: "1px solid #e0e0e0",
                  overflowX: "auto",
                }}
              >
                {countryResult}
              </pre>
            )}
          </section>

          {/* 4. /api/export */}
          <section style={{ marginBottom: "18px" }}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              4. /api/export – country → main export
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label style={{ fontSize: "14px" }}>Country:</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryOption)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  fontSize: "14px",
                  minWidth: "180px",
                  background: "#fff",
                }}
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="Brazil">Brazil</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Canada">Canada</option>
              </select>

              <button
                onClick={testExportApi}
                style={{
                  background: "linear-gradient(90deg, #22c55e, #16a34a)",
                  color: "white",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 6px 16px rgba(34,197,94,0.25)",
                }}
              >
                Test /api/export
              </button>
            </div>
            {exportResult && (
              <pre
                style={{
                  background: "#f6f6f6",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  border: "1px solid #e0e0e0",
                  overflowX: "auto",
                }}
              >
                {exportResult}
              </pre>
            )}
          </section>

          {/* Full chain result */}
          {chainResult && (
            <div style={{ marginTop: "18px" }}>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                Full chain result
              </h3>
              <pre
                style={{
                  background: "#f6f6f6",
                  padding: "14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  border: "1px solid #e0e0e0",
                  overflowX: "auto",
                }}
              >
                {chainResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
