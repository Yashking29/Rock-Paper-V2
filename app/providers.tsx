"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, localhost, sepolia } from "wagmi/chains";
import { createConfig, WagmiProvider, http, createStorage } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask, injected } from "wagmi/connectors";

// For wagmi v2, you need to use createConfig differently
const projectId = "YOUR_PROJECT_ID"; // Replace with your WalletConnect Cloud project ID

const { wallets } = getDefaultWallets({
  appName: "My DApp",
  projectId,
});

// Create wagmi config for v2
const wagmiConfig = createConfig({
  chains: [localhost, sepolia, mainnet, polygon],
  transports: {
    [localhost.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [injected()],
  storage: createStorage({ storage: localStorage }),
});

// Create query client for react-query
const queryClient = new QueryClient();

// Wrap everything in providers
export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
