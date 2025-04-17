import "./globals.css";
import type { Metadata } from "next";
import { Web3Providers } from "./providers";

export const metadata: Metadata = {
  title: "Web3 DApp",
  description: "Connect to MetaMask using RainbowKit + Wagmi + Viem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
