'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { findZombieAccounts, estimateRentRefund } from '@/utils/scanner';
import { buildClaimTransaction, batchZombieAccounts } from '@/utils/transaction';
import { createConnection, formatSol, formatUSD } from '@/utils/solana';
import { FEE_LAMPORTS, MAX_ACCOUNTS_PER_TX } from '@/utils/config';
import WalletButton from '@/components/WalletButton';
import ZombieAccountList from '@/components/ZombieAccountList';
import ClaimButton from '@/components/ClaimButton';

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('solana');
  const { connection } = useAppKitConnection();
  const [isScanning, setIsScanning] = useState(false);
  const [zombieAccounts, setZombieAccounts] = useState<{ pubkey: PublicKey; mint: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [batches, setBatches] = useState<PublicKey[][]>([]);

  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@twa-dev/sdk').then((Telegram) => {
        const WebApp = Telegram.default || Telegram;
        if (WebApp && typeof WebApp.ready === 'function') {
          WebApp.ready();
          WebApp.expand();
        }
      });
    }
  }, []);

  const handleScan = useCallback(async () => {
    if (!address) return;

    setIsScanning(true);
    setError(null);

    try {
      const connection = createConnection();
      const userPubkey = new PublicKey(address);
      
      const accounts = await findZombieAccounts(connection, userPubkey);
      setZombieAccounts(accounts);

      // Create batches for transactions
      const accountPubkeys = accounts.map(acc => acc.pubkey);
      const accountBatches = batchZombieAccounts(accountPubkeys, MAX_ACCOUNTS_PER_TX);
      setBatches(accountBatches);
      setCurrentBatch(0);

      if (accounts.length === 0) {
        setError('No zombie accounts found. Your wallet is clean! 🎉');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to scan wallet. Please try again.');
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [address]);

  // Scan for zombie accounts when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      handleScan();
    } else {
      setZombieAccounts([]);
      setBatches([]);
      setCurrentBatch(0);
    }
  }, [isConnected, address, handleScan]);

  const handleClaim = async (accountsToClaim: PublicKey[]) => {
    if (!address || !walletProvider) {
      throw new Error('Wallet not connected');
    }

    const solanaConnection = connection || createConnection();
    const userPubkey = new PublicKey(address);

    // Build the atomic transaction
    const transaction = await buildClaimTransaction(
      userPubkey,
      accountsToClaim,
      solanaConnection
    );

    // Send transaction via wallet provider
    // The wallet provider should have a sendTransaction method
    const signature = await (walletProvider as any).sendTransaction(transaction, solanaConnection);

    // Wait for confirmation
    await solanaConnection.confirmTransaction(signature, 'confirmed');

    // Update state - remove claimed accounts
    const remainingAccounts = zombieAccounts.filter(
      acc => !accountsToClaim.some(claimed => claimed.equals(acc.pubkey))
    );
    setZombieAccounts(remainingAccounts);

    // Update batches
    if (remainingAccounts.length > 0) {
      const accountPubkeys = remainingAccounts.map(acc => acc.pubkey);
      const accountBatches = batchZombieAccounts(accountPubkeys, MAX_ACCOUNTS_PER_TX);
      setBatches(accountBatches);
      setCurrentBatch(0);
    } else {
      setBatches([]);
    }
  };

  const totalRefund = estimateRentRefund(zombieAccounts.length);
  const currentBatchAccounts = batches[currentBatch] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-center">💰 Cryptoolate</h1>
        <p className="text-sm text-gray-400 text-center mt-1">
          Reclaim rent from empty token accounts
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center space-y-4">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold">Connect Wallet to Scan</h2>
            <p className="text-gray-400 text-sm">
              Connect your Phantom, Solflare, or Backpack wallet to find unclaimed rent
            </p>
            <div className="pt-4">
              <WalletButton />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Note: Only non-custodial wallets are supported. Please use Phantom, Solflare, or Backpack.
            </p>
          </div>
        ) : (
          <>
            {/* Scanning State */}
            {isScanning ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                <div className="text-4xl mb-4 animate-pulse">💰</div>
                <h2 className="text-xl font-semibold mb-2">Scanning blockchain...</h2>
                <p className="text-gray-400 text-sm">Looking for zombie accounts...</p>
              </div>
            ) : (
              <>
                {/* Results */}
                {zombieAccounts.length > 0 ? (
                  <>
                    <ZombieAccountList
                      accounts={zombieAccounts}
                      totalRefund={totalRefund}
                      fee={FEE_LAMPORTS}
                    />

                    {/* Batch Navigation */}
                    {batches.length > 1 && (
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Batch</span>
                          <span className="text-white font-semibold">
                            {currentBatch + 1} of {batches.length}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setCurrentBatch(Math.max(0, currentBatch - 1))}
                            disabled={currentBatch === 0}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentBatch(Math.min(batches.length - 1, currentBatch + 1))}
                            disabled={currentBatch === batches.length - 1}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Claim Button */}
                    <ClaimButton
                      accounts={currentBatchAccounts}
                      onClaim={handleClaim}
                    />

                    {/* Info */}
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-sm text-blue-300">
                      <p className="font-semibold mb-1">ℹ️ How it works:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Closing empty accounts refunds the rent you paid</li>
                        <li>The transaction is atomic - you only pay the fee if the claim succeeds</li>
                        <li>If you have many accounts, they'll be split into batches</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h2 className="text-xl font-semibold mb-2">No Zombie Accounts Found</h2>
                    <p className="text-gray-400 text-sm mb-4">
                      Your wallet is clean! All your token accounts are in use.
                    </p>
                    <button
                      onClick={handleScan}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      Scan Again
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Wallet Info */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <WalletButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
