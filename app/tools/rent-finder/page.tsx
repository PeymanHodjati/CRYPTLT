'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useAppKitAccount, useAppKitProvider, useAppKit } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { findZombieAccounts, estimateRentRefund } from '@/utils/scanner';
import { buildClaimTransaction, batchZombieAccounts } from '@/utils/transaction';
import { createConnection } from '@/utils/solana';
import { FEE_LAMPORTS, MAX_ACCOUNTS_PER_TX } from '@/utils/config';
import Link from 'next/link';

export default function RentFinder() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('solana');
  const { connection } = useAppKitConnection();
  const [isScanning, setIsScanning] = useState(false);
  const [zombieAccounts, setZombieAccounts] = useState<{ pubkey: PublicKey; mint: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [batches, setBatches] = useState<PublicKey[][]>([]);
  const [isClaiming, setIsClaiming] = useState(false);

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
      const solanaConnection = connection || createConnection();
      const userPubkey = new PublicKey(address);
      
      const accounts = await findZombieAccounts(solanaConnection, userPubkey);
      setZombieAccounts(accounts);

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
  }, [address, connection]);

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

    setIsClaiming(true);
    setError(null);

    try {
      const solanaConnection = connection || createConnection();
      const userPubkey = new PublicKey(address);

      const transaction = await buildClaimTransaction(
        userPubkey,
        accountsToClaim,
        solanaConnection
      );

      const signature = await (walletProvider as any).sendTransaction(transaction, solanaConnection);
      await solanaConnection.confirmTransaction(signature, 'confirmed');

      const remainingAccounts = zombieAccounts.filter(
        acc => !accountsToClaim.some(claimed => claimed.equals(acc.pubkey))
      );
      setZombieAccounts(remainingAccounts);

      if (remainingAccounts.length > 0) {
        const accountPubkeys = remainingAccounts.map(acc => acc.pubkey);
        const accountBatches = batchZombieAccounts(accountPubkeys, MAX_ACCOUNTS_PER_TX);
        setBatches(accountBatches);
        setCurrentBatch(0);
      } else {
        setBatches([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to claim. Please try again.');
      console.error('Claim error:', err);
    } finally {
      setIsClaiming(false);
    }
  };

  const totalRefund = estimateRentRefund(zombieAccounts.length);
  const currentBatchAccounts = batches[currentBatch] || [];
  const solRefund = totalRefund / 1_000_000_000;
  const solFee = FEE_LAMPORTS / 1_000_000_000;
  const solNet = (totalRefund - FEE_LAMPORTS) / 1_000_000_000;
  const solPrice = 160;
  const usdNet = solNet * solPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-[#8fae8a] mb-1 block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-gray-100">💰 The Rent Finder</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Reclaim rent from empty token accounts
              </p>
            </div>
            {isConnected && address && (
              <div className="px-3 py-1.5 glass border-[#7a9b76]/30 rounded-lg">
                <div className="text-xs text-gray-400">Connected</div>
                <div className="text-xs font-mono text-[#8fae8a]">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {!isConnected ? (
          <div className="glass rounded-xl p-6 text-center space-y-4">
            <div className="text-5xl mb-2">🔍</div>
            <h2 className="text-xl font-semibold text-gray-100">Connect Wallet to Scan</h2>
            <p className="text-sm text-gray-400">
              Connect your Phantom, Solflare, or Backpack wallet to find unclaimed rent
            </p>
            <button
              onClick={() => open()}
              className="w-full px-6 py-3 bg-[#7a9b76] hover:bg-[#8fae8a] text-white font-medium rounded-lg transition-colors mt-4"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {isScanning ? (
              <div className="glass rounded-xl p-8 text-center">
                <div className="text-5xl mb-4 animate-pulse">💰</div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">Scanning blockchain...</h2>
                <p className="text-sm text-gray-400">Looking for zombie accounts...</p>
                <div className="mt-6 w-full bg-gray-900/50 rounded-full h-2">
                  <div className="bg-[#7a9b76] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            ) : (
              <>
                {zombieAccounts.length > 0 ? (
                  <>
                    <div className="glass rounded-xl p-6">
                      <div className="text-sm text-gray-400 mb-1">Total Portfolio Value</div>
                      <div className="text-3xl font-semibold text-gray-100 mb-4">
                        {solRefund.toFixed(4)} SOL
                      </div>
                      <div className="text-sm text-gray-400">~${(solRefund * solPrice).toFixed(2)} USD</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass rounded-xl p-4">
                        <div className="text-xs text-gray-400 mb-1">Zombie Accounts</div>
                        <div className="text-2xl font-semibold text-gray-100">{zombieAccounts.length}</div>
                      </div>
                      <div className="glass rounded-xl p-4">
                        <div className="text-xs text-gray-400 mb-1">Service Fee</div>
                        <div className="text-2xl font-semibold text-amber-400">{solFee.toFixed(4)} SOL</div>
                      </div>
                    </div>

                    <div className="glass-dark rounded-xl p-6 border border-[#7a9b76]/30">
                      <div className="text-sm text-gray-400 mb-1">You Will Receive</div>
                      <div className="text-3xl font-bold text-[#8fae8a] mb-1">
                        {solNet.toFixed(4)} SOL
                      </div>
                      <div className="text-sm text-gray-400">~${usdNet.toFixed(2)} USD</div>
                    </div>

                    {batches.length > 1 && (
                      <div className="glass rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-400">Transaction Batch</span>
                          <span className="text-sm font-semibold text-gray-100">
                            {currentBatch + 1} of {batches.length}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentBatch(Math.max(0, currentBatch - 1))}
                            disabled={currentBatch === 0}
                            className="flex-1 px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors text-sm font-medium"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentBatch(Math.min(batches.length - 1, currentBatch + 1))}
                            disabled={currentBatch === batches.length - 1}
                            className="flex-1 px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors text-sm font-medium"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleClaim(currentBatchAccounts)}
                      disabled={isClaiming || currentBatchAccounts.length === 0}
                      className="w-full px-6 py-4 bg-[#7a9b76] hover:bg-[#8fae8a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors card-shadow"
                    >
                      {isClaiming ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Processing...
                        </span>
                      ) : (
                        `Claim Batch ${currentBatch + 1} (${currentBatchAccounts.length} accounts)`
                      )}
                    </button>

                    <div className="glass rounded-xl p-4 text-sm border border-[#7a9b76]/30">
                      <p className="font-medium text-[#8fae8a] mb-2">ℹ️ How it works</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                        <li>Closing empty accounts refunds the rent you paid</li>
                        <li>Transaction is atomic - you only pay if the claim succeeds</li>
                        <li>Large account sets are split into batches</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="glass rounded-xl p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-semibold text-gray-100 mb-2">No Zombie Accounts Found</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      Your wallet is clean! All your token accounts are in use.
                    </p>
                    <button
                      onClick={handleScan}
                      className="px-6 py-2 bg-[#7a9b76] hover:bg-[#8fae8a] text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Scan Again
                    </button>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="glass-dark border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="glass rounded-xl p-4">
              {isConnected && address ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Connected Wallet</div>
                    <div className="text-sm font-mono text-gray-100">{address.slice(0, 8)}...{address.slice(-6)}</div>
                  </div>
                  <button
                    onClick={() => open({ view: 'Account' })}
                    className="px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => open()}
                  className="w-full px-6 py-3 bg-[#7a9b76] hover:bg-[#8fae8a] text-white font-medium rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
