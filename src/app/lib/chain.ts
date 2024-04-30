import { ZDKChain, ZDKNetwork } from "@zoralabs/zdk";

export type ChainName =
  | "ethereum"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "base";

export const chainOptions = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "base", label: "Base" },
];

export const AlchemyChainNames: { [key in ChainName]: string } = {
  ethereum: "eth-mainnet",
  polygon: "polygon-mainnet",
  arbitrum: "arb-mainnet",
  optimism: "opt-mainnet",
  base: "base-mainnet",
};

export const ZoraNetworks = {
  zora: {
    network: ZDKNetwork.Zora,
    chain: ZDKChain.ZoraMainnet,
    rpc: "https://rpc.zora.energy",
  },
  base: {
    network: ZDKNetwork.Base,
    chain: ZDKChain.BaseMainnet,
    rpc: "https://base-mainnet.public.blastapi.io	",
  },
  ethereum: {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Mainnet,
    rpc: "https://cloudflare-eth.com",
  },
  optimism: {
    network: ZDKNetwork.Optimism,
    chain: ZDKChain.OptimismMainnet,
    rpc: "https://mainnet.optimism.io",
  },
};
