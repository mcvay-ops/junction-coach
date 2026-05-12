import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "junction-coach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0c17",
          padding: "72px",
          color: "#f7f7f8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#8e90a1" }}>
          Solutions Engineering artifact
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            junction<span style={{ color: "#5b8def" }}>-coach</span>
          </div>
          <div style={{ fontSize: 36, color: "#d9dae0", lineHeight: 1.3, maxWidth: 980 }}>
            A better API is one with no humans in the loop.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 26, color: "#b8b9c5" }}>
          <span>Question Bank</span>
          <span>·</span>
          <span>Integration Coach</span>
          <span>·</span>
          <span>SE Playbook</span>
        </div>
      </div>
    ),
    size
  );
}
