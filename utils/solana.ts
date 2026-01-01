import { Connection, clusterApiUrl } from '@solana/web3.js';
import { RPC_ENDPOINTS } from './config';

/**
 * Creates a Solana connection with fallback RPC endpoints
 */
export function createConnection(): Connection {
  const rpcUrl = RPC_ENDPOINTS.primary;
  
  return new Connection(rpcUrl, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
  });
}

/**
 * Converts lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

/**
 * Formats SOL amount for display
 */
export function formatSol(lamports: number): string {
  return lamportsToSol(lamports).toFixed(4);
}

/**
 * Formats USD amount (rough estimate)
 */
export function formatUSD(lamports: number, solPrice: number = 160): string {
  const sol = lamportsToSol(lamports);
  return `$${(sol * solPrice).toFixed(2)}`;
}
