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
