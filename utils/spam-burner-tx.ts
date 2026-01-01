import { Transaction, SystemProgram, PublicKey, Connection } from "@solana/web3.js";
import { createCloseAccountInstruction } from "@solana/spl-token";
import { TREASURY_WALLET } from "./config";

/**
 * Builds a transaction to burn spam items and close accounts
 * Revenue: 15% of the refunded rent
 */
export async function buildBurnTransaction(
  userPubkey: PublicKey,
  spamItems: PublicKey[],
  connection: Connection
): Promise<Transaction> {
  const tx = new Transaction();

  // For each spam item:
  // 1. Transfer to burn address (if token) or just close (if NFT)
  // 2. Close the account to reclaim rent
  for (const itemPubkey of spamItems) {
    // Close account instruction - this refunds the rent
    tx.add(
      createCloseAccountInstruction(
        itemPubkey,
        userPubkey, // Destination for rent refund
        userPubkey  // Authority
      )
    );
  }

  // Calculate fee: 15% of estimated rent refund
  // Each account typically holds ~0.002 SOL in rent
  const RENT_PER_ACCOUNT = 2000000; // 0.002 SOL
  const totalRentRefund = spamItems.length * RENT_PER_ACCOUNT;
  const fee = Math.floor(totalRentRefund * 0.15); // 15% fee

  // Add fee transfer to treasury
  tx.add(
    SystemProgram.transfer({
      fromPubkey: userPubkey,
      toPubkey: TREASURY_WALLET,
      lamports: fee,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;
  tx.feePayer = userPubkey;

  return tx;
}
