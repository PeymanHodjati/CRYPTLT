import { Transaction, PublicKey, Connection } from "@solana/web3.js";
import { createRevokeInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

/**
 * Builds a transaction to revoke token approvals
 * This is free - no fee charged
 */
export async function buildRevokeTransaction(
  userPubkey: PublicKey,
  approvals: PublicKey[],
  connection: Connection
): Promise<Transaction> {
  const tx = new Transaction();

  // Add revoke instruction for each approval
  approvals.forEach((tokenAccount) => {
    tx.add(
      createRevokeInstruction(
        tokenAccount,
        userPubkey // Authority
      )
    );
  });

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;
  tx.feePayer = userPubkey;

  return tx;
}
