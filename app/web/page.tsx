'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { useAppKitProvider } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { findZombieAccounts, estimateRentRefund } from '@/utils/scanner';
import { buildClaimTransaction, batchZombieAccounts } from '@/utils/transaction';
import { createConnection } from '@/utils/solana';
import { FEE_LAMPORTS, MAX_ACCOUNTS_PER_TX } from '@/utils/config';

export default function WebPage() {
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

  const handleScan = useCallback(async () => {
    if (!address) return;

    setIsScanning(true);
    setError(null);

    try {
      const solanaConnection = connection || createConnection();
      const userPubkey = new PublicKey(address);
      
      const accounts = await findZombieAccounts(solanaConnection, userPubkey);
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
  }, [address, connection]);

  // Auto-scan when wallet connects
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

      // Build the atomic transaction
      const transaction = await buildClaimTransaction(
        userPubkey,
        accountsToClaim,
        solanaConnection
      );

      // Send transaction via wallet provider
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

      setError(null);
      alert(`Success! Claimed ${accountsToClaim.length} accounts. Transaction: ${signature}`);
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
  const solPrice = 160; // Rough estimate
  const usdNet = solNet * solPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                💰 Cryptoolate
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Reclaim rent from empty Solana token accounts
              </p>
            </div>
            {isConnected && address && (
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="text-xs text-gray-400">Connected</div>
                <div className="text-sm font-mono text-green-400">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Connection Card */}
            {!isConnected ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Connect your Phantom, Solflare, or Backpack wallet to scan for unclaimed rent from empty token accounts.
                </p>
                <button
                  onClick={() => open()}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Connect Wallet
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Only non-custodial wallets are supported (Phantom, Solflare, Backpack)
                </p>
              </div>
            ) : (
              <>
                {/* Scanning State */}
                {isScanning ? (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
                    <div className="text-6xl mb-4 animate-pulse">💰</div>
                    <h2 className="text-2xl font-semibold mb-2">Scanning blockchain...</h2>
                    <p className="text-gray-400">Looking for zombie accounts...</p>
                    <div className="mt-6 w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Results */}
                    {zombieAccounts.length > 0 ? (
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <h2 className="text-xl font-semibold mb-4">Found Zombie Accounts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Accounts</div>
                            <div className="text-2xl font-bold text-white">{zombieAccounts.length}</div>
                          </div>
                          <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                            <div className="text-sm text-gray-400 mb-1">Recoverable</div>
                            <div className="text-2xl font-bold text-green-400">
                              {solRefund.toFixed(4)} SOL
                            </div>
                            <div className="text-xs text-gray-400">~${(solRefund * solPrice).toFixed(2)}</div>
                          </div>
                          <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
                            <div className="text-sm text-gray-400 mb-1">Fee</div>
                            <div className="text-2xl font-bold text-yellow-400">
                              {solFee.toFixed(4)} SOL
                            </div>
                            <div className="text-xs text-gray-400">~${(solFee * solPrice).toFixed(2)}</div>
                          </div>
                        </div>

                        {/* Net Amount */}
                        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg p-6 border border-indigo-500/30 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">You Receive</span>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-white">
                                {solNet.toFixed(4)} SOL
                              </div>
                              <div className="text-sm text-gray-400">~${usdNet.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Batch Navigation */}
                        {batches.length > 1 && (
                          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-400">Transaction Batch</span>
                              <span className="text-white font-semibold">
                                {currentBatch + 1} of {batches.length}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setCurrentBatch(Math.max(0, currentBatch - 1))}
                                disabled={currentBatch === 0}
                                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setCurrentBatch(Math.min(batches.length - 1, currentBatch + 1))}
                                disabled={currentBatch === batches.length - 1}
                                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Claim Button */}
                        <button
                          onClick={() => handleClaim(currentBatchAccounts)}
                          disabled={isClaiming || currentBatchAccounts.length === 0}
                          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg"
                        >
                          {isClaiming ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="animate-spin">⏳</span>
                              Processing Transaction...
                            </span>
                          ) : (
                            `Claim Batch ${currentBatch + 1} (${currentBatchAccounts.length} accounts) - Receive ${solNet.toFixed(4)} SOL`
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-semibold mb-2">No Zombie Accounts Found</h2>
                        <p className="text-gray-400 mb-6">
                          Your wallet is clean! All your token accounts are in use.
                        </p>
                        <button
                          onClick={handleScan}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Scan Again
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-red-300">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">1.</span>
                  <span>Connect your Solana wallet (Phantom, Solflare, or Backpack)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">2.</span>
                  <span>We scan for empty token accounts (zombie accounts)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">3.</span>
                  <span>Close these accounts to reclaim the locked SOL rent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">4.</span>
                  <span>Pay a small fee (0.005 SOL) and keep the rest</span>
                </li>
              </ul>
            </div>

            {/* Safety Info */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">🔒 Safety & Security</h3>
              <ul className="space-y-2 text-sm text-blue-200/80">
                <li>✓ Atomic transactions - all or nothing</li>
                <li>✓ You only pay if the claim succeeds</li>
                <li>✓ Non-custodial - we never touch your keys</li>
                <li>✓ Transparent - see all transaction details</li>
              </ul>
            </div>

            {/* Stats */}
            {zombieAccounts.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accounts to close:</span>
                    <span className="text-white font-mono">{currentBatchAccounts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rent refund:</span>
                    <span className="text-green-400 font-mono">{solRefund.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service fee:</span>
                    <span className="text-yellow-400 font-mono">{solFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-medium">Net amount:</span>
                      <span className="text-green-400 font-bold">{solNet.toFixed(4)} SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-gray-700/50">
        <div className="text-center text-sm text-gray-400">
          <p>Cryptoolate - Reclaim your Solana rent</p>
          <p className="mt-2">Built with Next.js, Reown AppKit, and Solana</p>
        </div>
      </div>
    </div>
  );
}
