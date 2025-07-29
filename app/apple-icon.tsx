import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontFamily: "system-ui",
        letterSpacing: "2px",
        borderRadius: "20px",
      }}
    >
      MG
    </div>,
    {
      ...size,
    },
  )
}
