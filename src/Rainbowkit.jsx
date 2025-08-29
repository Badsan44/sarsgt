// src/components/Rainbowkit.jsx

import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { bscTestnet, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
import {
  argentWallet,
  coinbaseWallet,
  imTokenWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = "0a125e3a4251eb58c540988c282cdb2d";

// 1️⃣  Keep your existing wallet groups (no calls to the wallet-factory here):
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: "Others",
      wallets: [
        trustWallet,
        ledgerWallet,
        argentWallet,
        omniWallet,
        imTokenWallet,
      ],
    },
  ],
  { appName: "My RainbowKit App", projectId }
);

// 2️⃣  Tell Wagmi & RainbowKit about BOTH chains with custom RPC endpoints:
const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId,
  chains: [bscTestnet, sepolia],
  connectors,
  transports: {
    [bscTestnet.id]: http('https://bsc-testnet-rpc.publicnode.com'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
});

const queryClient = new QueryClient();

export default function Rainbowkit({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          // initialChain can be whichever you prefer:
          initialChain={bscTestnet}
          modalSize="compact"
          theme={darkTheme({
            accentColor: "rgba(255, 255, 255, 0.2)",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
