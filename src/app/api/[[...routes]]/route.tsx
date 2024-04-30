/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { db } from "@/app/lib/firebase";
import { handle } from "frog/next";
import { generateSvgString } from "@/app/components/PieChartComponent";
import { createSystem } from "frog/ui";

const app = new Frog({
  basePath: "/api",
  imageAspectRatio: "1:1",
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": "AIRSTACK_API_KEY",
      },
    },
  },
});

const OpenSeaURL = "https://opensea.io/collection/";
const { Box, Image, VStack, Heading, Text } = createSystem({
  fontSizes: { title: 0.04 },
});

app.frame("/:id", async (c) => {
  const { buttonValue, status, req, url } = c;
  const id = req.param("id");

  const dbRef = db.ref("collection/" + id);
  const snapshot = await dbRef.get();

  if (!snapshot.exists()) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background:
              status === "response"
                ? "linear-gradient(to right, #432889, #17101F)"
                : "black",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Invalid URL
          </div>
        </div>
      ),
      intents: [
        <Button.Link key="to" href={url.replace(/\/api\/.*/, "")}>
          Check on Website
        </Button.Link>,
      ],
    });
  }
  const data = await snapshot.val();
  const icon = data.icon;
  const label = data.label;
  const collectionSlug = data.collectionSlug;
  //const body = data.body;
  //const walletAddressList = data.walletAddressList;
  const bodyLength = data.body.length;
  const walletAddressListLength = data.walletAddressList.length;

  const chain = id.split(":")[0];
  const contractAddress = id.split(":")[1];

  const percentage = (bodyLength / walletAddressListLength) * 100;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  const newSearchParams = new URLSearchParams({
    label: encodeURIComponent(label),
    icon: icon,
    collectionSlug: encodeURIComponent(collectionSlug),
    x: bodyLength.toString(),
    y: walletAddressListLength.toString(),
    circumference: circumference.toString(),
    strokeDasharray: [(percentage / 100) * circumference, circumference].join(
      ","
    ),
  });

  return c.res({
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/api/image?${newSearchParams}`,
    intents: [
      <Button.Link
        key="detail"
        href={url.replace(
          /\/api\/.*/,
          "/result?chain=" + chain + "&contractAddress=" + contractAddress
        )}
      >
        Check Details
      </Button.Link>,
      <Button.Link key="opensea" href={OpenSeaURL + collectionSlug}>
        OpenSea
      </Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
