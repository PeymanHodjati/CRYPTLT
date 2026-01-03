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
  const solPrice = 160;
  const usdNet = solNet * solPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-100">Manage Solana</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Dashboard {'>'} My Portfolio
              </p>
            </div>
            {isConnected && address && (
              <div className="px-4 py-2 bg-[#7a9b76]/10 border border-[#7a9b76]/30 rounded-lg">
                <div className="text-xs text-gray-500">Connected</div>
                <div className="text-sm font-mono text-[#8fae8a]">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-100 mb-2">My Portfolio</h2>
          {isConnected && address && (
            <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!isConnected ? (
              <div className="glass rounded-xl p-8 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-2xl font-semibold text-gray-100 mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Connect your Phantom, Solflare, or Backpack wallet to scan for unclaimed rent from empty token accounts.
                </p>
                <button
                  onClick={() => open()}
                  className="px-8 py-4 bg-[#7a9b76] hover:bg-[#8fae8a] text-white font-semibold rounded-xl transition-colors card-shadow"
                >
                  Connect Wallet
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Only non-custodial wallets are supported (Phantom, Solflare, Backpack)
                </p>
              </div>
            ) : (
              <>
                {isScanning ? (
                  <div className="glass rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4 animate-pulse">💰</div>
                    <h2 className="text-2xl font-semibold text-gray-100 mb-2">Scanning blockchain...</h2>
                    <p className="text-gray-400">Looking for zombie accounts...</p>
                    <div className="mt-6 w-full bg-gray-900/50 rounded-full h-2">
                      <div className="bg-[#7a9b76] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {zombieAccounts.length > 0 ? (
                      <>
                        {/* Total Portfolio Value */}
                        <div className="glass-dark rounded-xl p-6">
                          <div className="text-sm text-gray-500 mb-1">Total Portfolio Value</div>
                          <div className="text-4xl font-semibold text-gray-100">
                            {solRefund.toFixed(4)} SOL
                          </div>
                          <div className="text-sm text-gray-500 mt-1">~${(solRefund * solPrice).toFixed(2)} USD</div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="glass rounded-xl p-4">
                            <div className="text-xs text-gray-500 mb-1">Zombie Accounts</div>
                            <div className="text-2xl font-semibold text-gray-100">{zombieAccounts.length}</div>
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div className="text-xs text-gray-500 mb-1">Pending Claims</div>
                            <div className="text-2xl font-semibold text-gray-100">{batches.length}</div>
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div className="text-xs text-gray-500 mb-1">Monthly Change</div>
                            <div className="text-2xl font-semibold text-[#8fae8a]">+ {((solNet / (solRefund || 1)) * 100).toFixed(1)}%</div>
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div className="text-xs text-gray-500 mb-1">Avg Claim Size</div>
                            <div className="text-2xl font-semibold text-gray-100">{solNet > 0 ? (solNet / batches.length).toFixed(4) : '0.0000'} SOL</div>
                          </div>
                        </div>

                        {/* Net Amount Card */}
                        <div className="glass-dark rounded-xl p-6 border border-[#7a9b76]/30/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm text-gray-400 mb-1">You Will Receive</div>
                              <div className="text-3xl font-bold text-[#8fae8a]">
                                {solNet.toFixed(4)} SOL
                              </div>
                              <div className="text-sm text-gray-500 mt-1">~${usdNet.toFixed(2)} USD</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 mb-1">Service Fee</div>
                              <div className="text-lg font-semibold text-yellow-600">
                                {solFee.toFixed(4)} SOL
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Batch Navigation */}
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
                                className="flex-1 px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 disabled:bg-gray-900/30 disabled:text-gray-600 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setCurrentBatch(Math.min(batches.length - 1, currentBatch + 1))}
                                disabled={currentBatch === batches.length - 1}
                                className="flex-1 px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 disabled:bg-gray-900/30 disabled:text-gray-600 text-gray-300 rounded-lg transition-colors text-sm font-medium"
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
                          className="w-full px-6 py-4 bg-[#7a9b76] hover:bg-[#8fae8a] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors card-shadow text-lg"
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
                      </>
                    ) : (
                      <div className="glass rounded-xl p-8 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-semibold text-gray-100 mb-2">No Zombie Accounts Found</h2>
                        <p className="text-gray-400 mb-6">
                          Your wallet is clean! All your token accounts are in use.
                        </p>
                        <button
                          onClick={handleScan}
                          className="px-6 py-3 bg-[#7a9b76] hover:bg-[#8fae8a] text-white rounded-xl transition-colors font-medium"
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
              </>
            )}
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">How It Works</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#8fae8a] mt-1 font-semibold">1.</span>
                  <span>Connect your Solana wallet (Phantom, Solflare, or Backpack)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8fae8a] mt-1 font-semibold">2.</span>
                  <span>We scan for empty token accounts (zombie accounts)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8fae8a] mt-1 font-semibold">3.</span>
                  <span>Close these accounts to reclaim the locked SOL rent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8fae8a] mt-1 font-semibold">4.</span>
                  <span>Pay a small fee (0.005 SOL) and keep the rest</span>
                </li>
              </ul>
            </div>

            {/* Safety Info */}
            <div className="glass rounded-xl p-6 border border-[#7a9b76]/30">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">🔒 Safety & Security</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Atomic transactions - all or nothing</li>
                <li>✓ You only pay if the claim succeeds</li>
                <li>✓ Non-custodial - we never touch your keys</li>
                <li>✓ Transparent - see all transaction details</li>
              </ul>
            </div>

            {/* Transaction Details */}
            {zombieAccounts.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accounts to close:</span>
                    <span className="text-gray-100 font-mono font-semibold">{currentBatchAccounts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rent refund:</span>
                    <span className="text-[#8fae8a] font-mono font-semibold">{solRefund.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service fee:</span>
                    <span className="text-yellow-600 font-mono font-semibold">{solFee.toFixed(4)} SOL</span>
                  </div>
                  <div className="border-t border-[#7a9b76]/20 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-100 font-medium">Net amount:</span>
                      <span className="text-[#8fae8a] font-bold">{solNet.toFixed(4)} SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-[#7a9b76]/20">
        <div className="text-center text-sm text-gray-500">
          <p>Manage Solana - Reclaim your Solana rent</p>
          <p className="mt-2">Built with Next.js, Reown AppKit, and Solana</p>
        </div>
      </div>
    </div>
  );
}
