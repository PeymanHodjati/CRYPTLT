'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useAppKitAccount, useAppKitProvider, useAppKit } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { createConnection } from '@/utils/solana';
import Link from 'next/link';

interface DustToken {
  mint: string;
  balance: number;
  usdValue: number;
  tokenAccount: PublicKey;
}

export default function LooseChange() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('solana');
  const { connection } = useAppKitConnection();
  const [isScanning, setIsScanning] = useState(false);
  const [dustTokens, setDustTokens] = useState<DustToken[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

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
      // TODO: Implement Jupiter API integration to find dust tokens
      // For now, showing placeholder
      setDustTokens([]);
      setError('Jupiter integration coming soon. This will batch swap small token balances into SOL.');
    } catch (err: any) {
      setError(err.message || 'Failed to scan wallet. Please try again.');
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      handleScan();
    } else {
      setDustTokens([]);
    }
  }, [isConnected, address, handleScan]);

  const totalUsdValue = dustTokens.reduce((sum, token) => sum + token.usdValue, 0);
  const fee = 0.01; // 0.01 SOL flat fee or 1% spread
  const solPrice = 160;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-300 mb-1 block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-gray-100">🪙 Loose Change Collector</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Batch swap small token balances into SOL
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
              Find small token balances and convert them to SOL
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
                <div className="text-5xl mb-4 animate-pulse">🪙</div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">Scanning wallet...</h2>
                <p className="text-sm text-gray-400">Looking for dust tokens...</p>
                <div className="mt-6 w-full bg-gray-900/50 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            ) : (
              <>
                {dustTokens.length > 0 ? (
                  <>
                    <div className="glass rounded-xl p-6">
                      <div className="text-sm text-gray-400 mb-1">Total Dust Value</div>
                      <div className="text-3xl font-semibold text-gray-100 mb-4">
                        ${totalUsdValue.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {dustTokens.length} tokens with &lt;$1.00 balance
                      </div>
                    </div>

                    <div className="glass rounded-xl p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {dustTokens.map((token, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-gray-100">{token.mint.slice(0, 8)}...</div>
                              <div className="text-xs text-gray-400">${token.usdValue.toFixed(2)}</div>
                            </div>
                            <div className="text-sm text-gray-400">{token.balance.toFixed(4)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-dark rounded-xl p-6 border border-green-200/50">
                      <div className="text-sm text-gray-400 mb-1">You Will Receive</div>
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {((totalUsdValue / solPrice) - fee).toFixed(4)} SOL
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        Fee: {fee} SOL (~${(fee * solPrice).toFixed(2)})
                      </div>
                      <button
                        onClick={() => setError('Jupiter integration coming soon')}
                        disabled={isSwapping}
                        className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                      >
                        {isSwapping ? 'Swapping...' : `Swap All to SOL`}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="glass rounded-xl p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-semibold text-gray-100 mb-2">No Dust Tokens Found</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      {error || 'Your wallet is clean! No small token balances detected.'}
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
