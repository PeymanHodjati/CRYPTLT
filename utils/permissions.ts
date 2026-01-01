import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export interface TokenApproval {
  tokenAccount: PublicKey;
  mint: string;
  delegate?: PublicKey;
  amount?: string;
  isRevocable: boolean;
}

/**
 * Finds token accounts with active approvals/delegates
 */
export async function findTokenApprovals(
  connection: Connection,
  walletAddress: PublicKey
): Promise<TokenApproval[]> {
  const approvals: TokenApproval[] = [];

  try {
    const filters = [
      {
        memcmp: {
          offset: 32,
          bytes: walletAddress.toBase58(),
        },
      },
    ];

    const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters });

    for (const account of accounts) {
      // @ts-ignore
      const parsedInfo = account.account.data.parsed?.info;
      if (!parsedInfo) continue;

      const delegate = parsedInfo.delegate;
      const delegateAmount = parsedInfo.delegatedAmount?.amount;

      // If there's a delegate and it's not the owner, it's an approval
      if (delegate && delegate !== walletAddress.toBase58()) {
        approvals.push({
          tokenAccount: account.pubkey,
          mint: parsedInfo.mint,
          delegate: new PublicKey(delegate),
          amount: delegateAmount,
          isRevocable: true,
        });
      }
    }
  } catch (error) {
    console.error("Error scanning for approvals:", error);
    throw new Error("Failed to scan wallet. Please try again.");
  }

  return approvals;
}
