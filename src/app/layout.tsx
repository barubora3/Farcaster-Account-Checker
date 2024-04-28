import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  Center,
  Title,
  Stack,
  Text,
} from "@mantine/core";
import "./globals.css";

export const metadata = {
  title: "Farcaster Account Checker",
  description:
    "You can check how many holders of a given NFT collection have registered an account with Farcaster.",
};

const Header = () => (
  <>
    <Center>
      <Stack pt={20}>
        <a href="/">
          <Title>{metadata.title}</Title>
        </a>
      </Stack>
    </Center>
  </>
);

const Footer = () => (
  <>
    <Center pt={12} pb={4}>
      <Text ta="right">
        create by{" "}
        <a href="https://warpcast.com/tenden" target="_blank">
          tenden
        </a>
      </Text>
    </Center>
  </>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Header />
          {children}
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
