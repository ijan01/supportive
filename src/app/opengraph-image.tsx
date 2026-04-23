import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Supportive — Mental health careers in Australia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            background: "#7c3aed",
            borderRadius: "16px",
            padding: "12px 28px",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: "white", fontSize: "22px", fontWeight: "700", letterSpacing: "0.05em" }}>
            SUPPORTIVE
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: "#0f172a",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Mental health careers in Australia
        </div>
        <div
          style={{
            fontSize: "26px",
            color: "#64748b",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Clinical, community, AOD, peer work & NDIS roles
        </div>
      </div>
    ),
    { ...size }
  );
}
