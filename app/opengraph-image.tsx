import { ImageResponse } from "next/og";

export const alt =
  "learn.smmeyer.dev — free system design and LLM engineering courses by Steven Meyer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#11100e",
          color: "#eee9df",
          padding: "56px 64px",
          borderTop: "10px solid #e4ad44",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#e4ad44" }}>
          learn.smmeyer.dev
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 52,
            fontSize: 82,
            lineHeight: 1.08,
            letterSpacing: -3,
          }}
        >
          <span>System design.</span>
          <span>LLM engineering.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#aaa294",
          }}
        >
          Learn a mechanism. Work an example. Defend a design.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 25,
            borderTop: "1px solid #4b453b",
            fontSize: 22,
          }}
        >
          <span>Free · self-paced · no account</span>
          <span>Steven Meyer</span>
        </div>
      </div>
    ),
    size,
  );
}
