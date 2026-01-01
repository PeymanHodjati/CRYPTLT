import { Transaction, SystemProgram, PublicKey, Connection } from "@solana/web3.js";
import { createCloseAccountInstruction } from "@solana/spl-token";
import { TREASURY_WALLET, FEE_LAMPORTS, MAX_ACCOUNTS_PER_TX } from "./config";

/**
 * Builds an atomic transaction that:
 * 1. Closes zombie accounts (refunding rent to user)
 * 2. Transfers fee to treasury wallet
 * 
 * If any close instruction fails, the entire transaction fails (including the fee transfer)
 * This ensures the user only pays if they successfully reclaim their rent
 */
export async function buildClaimTransaction(
  userPubkey: PublicKey,
  zombieAccountPubkeys: PublicKey[],
  connection: Connection
): Promise<Transaction> {
  const tx = new Transaction();

  // 1. Add instructions to close every zombie account
  // Each closed account releases ~0.002 SOL back to the user
  zombieAccountPubkeys.forEach((zombiePubkey) => {
    tx.add(
      createCloseAccountInstruction(
        zombiePubkey, // Account to close
        userPubkey,   // Destination for the rent money (The User)
        userPubkey    // Authority (The User)
      )
    );
  });

  // 2. Add the fee transfer to treasury wallet
  // Important: If the close instructions fail, this transfer also fails. Safe for user.
  tx.add(
    SystemProgram.transfer({
      fromPubkey: userPubkey,
      toPubkey: TREASURY_WALLET,
      lamports: FEE_LAMPORTS,
    })
  );

  // 3. Get latest blockhash and set fee payer
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;
  tx.feePayer = userPubkey;

  return tx;
}

/**
 * Splits zombie accounts into batches for multiple transactions
 * Solana transactions have size limits (~1232 bytes), so we batch them
 */
export function batchZombieAccounts(
  zombieAccounts: PublicKey[],
  maxPerBatch: number = MAX_ACCOUNTS_PER_TX
): PublicKey[][] {
  const batches: PublicKey[][] = [];
  
  for (let i = 0; i < zombieAccounts.length; i += maxPerBatch) {
    batches.push(zombieAccounts.slice(i, i + maxPerBatch));
  }
  
  return batches;
}
