"use client";
import { useDisclosure } from "@mantine/hooks";
import { useRouter, usePathname } from "next/navigation";
import { notifications } from "@mantine/notifications";
import toast, { Toaster } from "react-hot-toast";

import {
  Container,
  Title,
  Text,
  Button,
  Radio,
  Textarea,
  Input,
  Select,
  Card,
  Avatar,
  Group,
  Loader,
  Tabs,
  rem,
  LoadingOverlay,
  Center,
  Paper,
  TextInput,
  Alert,
  Box,
} from "@mantine/core";
import { chainOptions, AlchemyChainNames, ChainName } from "./lib/chain";

import { useState } from "react";
const iconStyle = { width: rem(12), height: rem(12) };

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

const fetchOptions = { method: "GET", headers: { accept: "application/json" } };

export default function Home() {
  const router = useRouter();

  const [chain, setChain] = useState<ChainName>("ethereum");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [walletAddressList, setWalletAddressList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [farcasterUsers, setFarcasterUsers] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchWalletAddress = async () => {
    setIsLoading(true);

    const url = `https://${
      AlchemyChainNames[chain as ChainName]
    }.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getOwnersForContract?contractAddress=${contractAddress}&withTokenBalances=false`;
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    console.log(data.owners);
    setWalletAddressList(data.owners);
    setIsLoading(false);
  };

  const handleNavigation = async () => {
    setErrorMessage("");

    // バリデーションチェック
    // 存在チェック
    if (!contractAddress || !chain) {
      setErrorMessage("Please enter contract address and select chain.");
      return;
    }

    // アドレスのフォーマットチェック
    const isAddressValid = (address: string) =>
      /^(0x)?[0-9a-fA-F]{40}$/i.test(address);

    if (!isAddressValid(contractAddress)) {
      setErrorMessage("Invalid contract address format");
      return;
    }

    // コレクションのチェック
    const contractMetadataUrl = `https://${
      AlchemyChainNames[chain as ChainName]
    }.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getContractMetadata?contractAddress=${contractAddress}`;
    const response = await fetch(contractMetadataUrl, fetchOptions);
    const data = await response.json();
    if (data.tokenType === "NOT_A_CONTRACT") {
      setErrorMessage("Invalid contract address");
      return;
    }
    setIsLoading(true);

    const query = {
      chain: chain!,
      contractAddress: contractAddress.toLowerCase(),
    };

    const searchParams = new URLSearchParams(query);
    const url = `/result?${searchParams.toString()}`;

    router.push(url);
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const addresses = event.target.value
      .split("\n")
      .map((address) => address.trim());
    setWalletAddressList(addresses);
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Toaster />

      <Container size="sm" mt={40}>
        <Paper shadow="md" p="xl" radius="md">
          <Center>
            <Title order={2} mb={20}>
              NFT Owner Find on Farcaster
            </Title>
          </Center>

          <Select
            label="Select Chain"
            placeholder="Chain"
            data={chainOptions}
            defaultValue={"ethereum"}
            onChange={(value: string | null) =>
              value !== null && setChain(value as ChainName)
            }
            mb={20}
          />

          <TextInput
            label="NFT Contract Address"
            placeholder="Enter contract address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            mb={20}
          />

          {errorMessage && (
            <Box pb={20}>
              <Alert variant="light" color="red" title={errorMessage}></Alert>
            </Box>
          )}

          <Center>
            <Button size="md" onClick={handleNavigation}>
              Check !
            </Button>
          </Center>
        </Paper>
      </Container>
    </>
  );
}
