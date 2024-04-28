import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const label = searchParams.get("label")!;
  const icon = searchParams.get("icon")!;
  const collectionSlug = searchParams.get("collectionSlug")!;
  const x = Number(searchParams.get("x")!);
  const y = Number(searchParams.get("y")!);
  const radius = 100;
  const circumference = Number(searchParams.get("circumference")!);
  const strokeDasharray = searchParams.get("strokeDasharray")!;

  const fontData = await fetch(
    new URL("@/app/assets/Oswald-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* @ts-ignore */}
        <img
          width="100%"
          height="100%"
          alt="icon"
          src={icon}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
            zIndex: -1,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#ffffff",
              lineHeight: 1,
              marginTop: 20,
              marginBottom: 0,
              fontSize: 70,
              fontFamily: '"Oswald Bold"',
              textAlign: "center",
              textShadow:
                "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0px 1px 0 #000, 0px -1px 0 #000, -1px 0px 0 #000, 1px 0px 0 #000",
            }}
          >
            Farcaster Penetration in the
          </p>
          <p
            style={{
              color: "#ffffff",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: 0,
              fontSize: 70,
              fontFamily: '"Oswald Bold"',
              textAlign: "center",
              textShadow:
                "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0px 1px 0 #000, 0px -1px 0 #000, -1px 0px 0 #000, 1px 0px 0 #000",
            }}
          >
            {label + " "} holders
          </p>
        </div>
        <svg
          width="400"
          height="400"
          style={{
            marginTop: 0,
            position: "absolute",
            top: "50%",
            left: "45%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <circle
            cx="200"
            cy="200"
            r={radius}
            fill="transparent"
            stroke="#e0e0e0"
            strokeWidth="30"
          />
          <circle
            cx="200"
            cy="200"
            r={radius}
            fill="transparent"
            stroke="#0088FE"
            strokeWidth="30"
            strokeDasharray={strokeDasharray}
            transform="rotate(-90 200 200)"
          />
        </svg>
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 10 }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 50,
              fontFamily: "Arial",
              marginBottom: 0,
              color: "#ffffff",
              lineHeight: 1,
              textShadow:
                "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0px 1px 0 #000, 0px -1px 0 #000, -1px 0px 0 #000, 1px 0px 0 #000",
            }}
          >
            {((x / y) * 100).toFixed(2) + " "}%
          </p>
          {/* 
          <p
            style={{
              textAlign: "center",
              fontSize: 40,
              fontFamily: "Arial",
              marginTop: 10,
              marginBottom: 10,
              color: "#ffffff",
              lineHeight: 1,
              textShadow:
                "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0px 1px 0 #000, 0px -1px 0 #000, -1px 0px 0 #000, 1px 0px 0 #000",
            }}
          >
            {x} / {y}
          </p>
          */}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              color: "#ffffff",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: 0,
              fontSize: 40,
              fontFamily: '"Oswald Bold"',
              textAlign: "center",
              textShadow:
                "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0px 1px 0 #000, 0px -1px 0 #000, -1px 0px 0 #000, 1px 0px 0 #000",
            }}
          >
            Out of the {y} {label} holders,
          </p>
          <p
            style={{
              color: "#ffffff",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: 0,
              fontSize: 40,
              fontFamily: '"Oswald Bold"',
              textAlign: "center",
              textShadow:
                "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0px 1px 0 #000, 0px -1px 0 #000, -1px 0px 0 #000, 1px 0px 0 #000",
            }}
          >
            {x} have registered a Farcaster account.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Oswald Bold",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
