import { Connection, PublicKey, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export interface SpamItem {
  pubkey: PublicKey;
  mint: string;
  type: 'nft' | 'token';
  name?: string;
  balance?: number;
}

/**
 * Finds all NFTs and tokens owned by the user
 */
export async function findSpamItems(
  connection: Connection,
  walletAddress: PublicKey
): Promise<SpamItem[]> {
  const items: SpamItem[] = [];

  try {
    // Find token accounts
    const tokenFilters: GetProgramAccountsFilter[] = [
      {
        memcmp: {
          offset: 32,
          bytes: walletAddress.toBase58(),
        },
      },
    ];

    const tokenAccounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: tokenFilters,
    });

    for (const account of tokenAccounts) {
      // @ts-ignore
      const parsedInfo = account.account.data.parsed?.info;
      if (!parsedInfo) continue;

      const amount = parsedInfo.tokenAmount?.amount;
      const mint = parsedInfo.mint;
      const decimals = parsedInfo.tokenAmount?.decimals || 0;

      // Skip if balance is 0
      if (amount === '0' || amount === 0) continue;

      items.push({
        pubkey: account.pubkey,
        mint,
        type: 'token',
        balance: Number(amount) / Math.pow(10, decimals),
      });
    }

    // Find NFTs (token accounts with 0 decimals and balance = 1)
    // Note: This is a simplified approach. For production, you'd want to use Metaplex metadata
    for (const account of tokenAccounts) {
      // @ts-ignore
      const parsedInfo = account.account.data.parsed?.info;
      if (!parsedInfo) continue;
      
      const decimals = parsedInfo.tokenAmount?.decimals;
      const amount = parsedInfo.tokenAmount?.amount;
      
      // If it's an NFT (0 decimals, balance = 1), add it
      if (decimals === 0 && (amount === '1' || amount === 1)) {
        const mint = parsedInfo.mint;
        // Check if we already added this as a token
        const alreadyAdded = items.some(item => item.pubkey.equals(account.pubkey));
        if (!alreadyAdded) {
          items.push({
            pubkey: account.pubkey,
            mint,
            type: 'nft',
          });
        }
      }
    }
  } catch (error) {
    console.error("Error scanning for spam items:", error);
    throw new Error("Failed to scan wallet. Please try again.");
  }

  return items;
}
