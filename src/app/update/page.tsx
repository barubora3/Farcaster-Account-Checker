"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Container,
  Title,
  Button,
  LoadingOverlay,
  Center,
  Paper,
  Alert,
  Box,
  Text,
  Avatar,
} from "@mantine/core";
import { ChainName } from "@/app/lib/chain";

import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const [chain, setChain] = useState<ChainName>("ethereum");
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setChain(params.get("chain") as ChainName);
    setName(params.get("name") as string);
    setIcon(params.get("icon") as string);
    setContractAddress(params.get("contractAddress") as string);
  }, []);

  const handleNavigation = async (isUpdate: boolean) => {
    setIsLoading(true);

    const query = {
      chain: chain!,
      contractAddress: contractAddress.toLowerCase(),
      ...(isUpdate ? { forceUpdate: "true" } : {}),
    };

    const searchParams = new URLSearchParams(query);
    const url = `/result?${searchParams.toString()}`;

    router.push(url);
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Container size="sm" mt={40}>
        <Paper shadow="md" p="xl" radius="md">
          <Center>
            <Title order={2} mb={20}>
              NFT Owner Find on Farcaster
            </Title>
          </Center>

          <Center pt={20}>
            <Avatar
              src={icon}
              alt="icon"
              className="mr-2 inline-block align-middle"
            />
            <Text fz={20} fw={"bold"}>
              Update {name} data
            </Text>
          </Center>

          {errorMessage && (
            <Box pb={20}>
              <Alert variant="light" color="red" title={errorMessage}></Alert>
            </Box>
          )}
          <Box mb={20} mt={20}>
            <Alert variant="light" color="cyan" title={errorMessage}>
              <Text size="sm" color="dimmed" mb={4}>
                Are you sure you want to update the information for this
                collection?
              </Text>
              <Text size="sm" color="dimmed" mb={4}>
                Please be aware that if many users frequently update the data,
                it may cause the service to reach its API limit and become
                temporarily unavailable.
              </Text>
              <Text size="sm" color="dimmed" mb={4}>
                Due to the nature of the data, having the most recent
                information may not always be necessary for your purposes.
              </Text>
              <Text size="sm" color="blue">
                If you find this tool helpful, consider tipping $DEGEN to
                support the developer{" "}
                <span>
                  {" "}
                  <a href="https://warpcast.com/tenden" target="_blank">
                    (@tenden)
                  </a>
                </span>
                .
              </Text>
            </Alert>
          </Box>
          <Center>
            <Button
              size="md"
              variant="outline"
              onClick={() => handleNavigation(false)}
              mr={20}
            >
              Back
            </Button>
            <Button size="md" onClick={() => handleNavigation(true)}>
              Update
            </Button>
          </Center>
        </Paper>
      </Container>
    </>
  );
}
