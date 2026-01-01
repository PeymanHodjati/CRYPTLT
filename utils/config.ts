import { PublicKey } from '@solana/web3.js';

// Treasury wallet where fees are sent
// This is where the 0.005 SOL fee from each claim transaction will be sent
const TREASURY_WALLET_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_WALLET || "3LdJReJo1VxMjkNukZpZ9yanxzSXcW596eFWu9bB6Tq9";

export const TREASURY_WALLET = (() => {
  try {
    return new PublicKey(TREASURY_WALLET_ADDRESS);
  } catch {
    // Return a valid placeholder for build time
    return new PublicKey("11111111111111111111111111111111");
  }
})();

// Fee in lamports (0.005 SOL = 5,000,000 lamports)
export const FEE_LAMPORTS = 5000000;

// Maximum accounts per transaction (Solana transaction size limit)
export const MAX_ACCOUNTS_PER_TX = 20;

// RPC endpoints with fallback
export const RPC_ENDPOINTS = {
  primary: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  fallback: 'https://solana-api.projectserum.com',
};

// Wrapped SOL mint address (to exclude from closing)
export const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112';
