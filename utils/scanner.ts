import { Connection, PublicKey, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { WRAPPED_SOL_MINT } from "./config";

export interface ZombieAccount {
  pubkey: PublicKey;
  mint: string;
}

/**
 * Finds all empty token accounts (zombie accounts) owned by a wallet
 * These accounts have 0 balance and can be closed to reclaim rent
 */
export async function findZombieAccounts(
  connection: Connection,
  walletAddress: PublicKey
): Promise<ZombieAccount[]> {
  const filters: GetProgramAccountsFilter[] = [
    { dataSize: 165 }, // Filter for Token Accounts only (standard size)
    {
      memcmp: {
        offset: 32, // Location of the "Owner" public key in the account layout
        bytes: walletAddress.toBase58(),
      },
    },
  ];

  try {
    // Fetch all token accounts owned by the user
    const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters });

    // Filter client-side for accounts with 0 balance
    const zombies = accounts.filter((account) => {
      // @ts-ignore - Parsed account data structure
      const parsedInfo = account.account.data.parsed?.info;
      if (!parsedInfo) return false;

      const amount = parsedInfo.tokenAmount?.amount;
      const mint = parsedInfo.mint;
      
      // Exclude wrapped SOL accounts (users might want to keep these)
      if (mint === WRAPPED_SOL_MINT) return false;

      // Only include accounts with 0 balance
      return amount === '0' || amount === 0;
    });

    return zombies.map((z) => ({
      pubkey: z.pubkey,
      // @ts-ignore
      mint: z.account.data.parsed.info.mint,
    }));
  } catch (error) {
    console.error("Error scanning for zombie accounts:", error);
    throw new Error("Failed to scan wallet. Please try again.");
  }
}

/**
 * Estimates the rent refund from closing zombie accounts
 * Each empty token account typically holds ~0.002 SOL in rent
 */
export function estimateRentRefund(accountCount: number): number {
  // Rough estimate: 0.002 SOL per account (2,000,000 lamports)
  const RENT_PER_ACCOUNT = 2000000;
  return accountCount * RENT_PER_ACCOUNT;
}
