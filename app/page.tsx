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

const BOTS: Bot[] = [
  {
    id: "test-fruits-api",
    title: "Test External API call",
    description:
      "Tap to run the Fruits API test bot. This tests 1) choosing a multiple choice answer, 2) using an external API call in ElevenLabs, 3) using the API result to generate a response.",
    url: "https://elevenlabs.io/app/talk-to?agent_id=agent_6701kbbs2db0exrt4daf1dr2h65r",
    colors: ["#8b5cf6", "#60a5fa"], // purple → blue
    seed: 101,
  },
  // {
  //   id: "bot-1",
  //   title: "Customer Support",
  //   description: "Tap to start voice chat.",
  //   url: "https://example.com/bot-1",
  //   colors: ["#3b82f6", "#0ea5e9"], // blues
  //   seed: 202,
  // },
  // {
  //   id: "bot-2",
  //   title: "Sales Demo",
  //   description: "Tap to start sales chat.",
  //   url: "https://example.com/bot-2",
  //   colors: ["#f59e0b", "#f97316"], // orange / amber
  //   seed: 303,
  // },
  // {
  //   id: "bot-3",
  //   title: "Research Assistant",
  //   description: "Tap to start research chat.",
  //   url: "https://example.com/bot-3",
  //   colors: ["#14b8a6", "#22c55e"], // teal / green
  //   seed: 404,
  // },
];

export default function Page() {
  const [result, setResult] = useState<string>("");

  async function testFruitApi() {
    setResult("Calling /api/fruit?color=green ...");
    const res = await fetch("/api/fruit?color=green");
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
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
           
                 // NEW: limit card width + center it
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
              {/* BIG centered orb */}
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
            Press the button to call <code>/api/fruit</code>.
          </p>

          <button
            onClick={testFruitApi}
            style={{
              background: "linear-gradient(90deg, #0070f3, #0059d6)",
              color: "white",
              padding: "12px 22px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
              boxShadow: "0 8px 20px rgba(0,118,255,0.25)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(0,118,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,118,255,0.25)";
            }}
          >
            Test /api/fruit (green)
          </button>

          {result && (
            <pre
              style={{
                marginTop: "22px",
                background: "#f6f6f6",
                padding: "18px",
                borderRadius: "12px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
              }}
            >
              {result}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
