'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useAppKitAccount, useAppKitProvider, useAppKit } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { findSpamItems, SpamItem } from '@/utils/spam-burner';
import { buildBurnTransaction } from '@/utils/spam-burner-tx';
import { createConnection } from '@/utils/solana';
import Link from 'next/link';

export default function SpamBurner() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('solana');
  const { connection } = useAppKitConnection();
  const [isScanning, setIsScanning] = useState(false);
  const [spamItems, setSpamItems] = useState<SpamItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isBurning, setIsBurning] = useState(false);

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
      
      const items = await findSpamItems(solanaConnection, userPubkey);
      setSpamItems(items);
      setSelectedItems(new Set());
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
      setSpamItems([]);
      setSelectedItems(new Set());
    }
  }, [isConnected, address, handleScan]);

  const toggleSelection = (pubkey: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(pubkey)) {
      newSelected.delete(pubkey);
    } else {
      newSelected.add(pubkey);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    setSelectedItems(new Set(spamItems.map(item => item.pubkey.toBase58())));
  };

  const selectDust = () => {
    const dustItems = spamItems.filter(item => 
      item.type === 'token' && item.balance && item.balance < 1
    );
    setSelectedItems(new Set(dustItems.map(item => item.pubkey.toBase58())));
  };

  const handleBurn = async () => {
    if (!address || !walletProvider || selectedItems.size === 0) {
      throw new Error('No items selected');
    }

    setIsBurning(true);
    setError(null);

    try {
      const solanaConnection = connection || createConnection();
      const userPubkey = new PublicKey(address);

      const itemsToBurn = spamItems
        .filter(item => selectedItems.has(item.pubkey.toBase58()))
        .map(item => item.pubkey);

      const transaction = await buildBurnTransaction(
        userPubkey,
        itemsToBurn,
        solanaConnection
      );

      const signature = await (walletProvider as any).sendTransaction(transaction, solanaConnection);
      await solanaConnection.confirmTransaction(signature, 'confirmed');

      // Remove burned items
      const remaining = spamItems.filter(item => !selectedItems.has(item.pubkey.toBase58()));
      setSpamItems(remaining);
      setSelectedItems(new Set());

      alert(`Success! Burned ${itemsToBurn.length} items. Transaction: ${signature}`);
    } catch (err: any) {
      setError(err.message || 'Failed to burn items. Please try again.');
      console.error('Burn error:', err);
    } finally {
      setIsBurning(false);
    }
  };

  const selectedCount = selectedItems.size;
  const estimatedRent = selectedCount * 0.002; // ~0.002 SOL per account
  const fee = estimatedRent * 0.15; // 15% fee
  const userReceives = estimatedRent - fee;

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
              <h1 className="text-2xl font-semibold text-gray-100">🔥 The Spam Burner</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Burn spam NFTs and tokens, reclaim rent
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
              Find and burn spam NFTs and tokens cluttering your wallet
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
                <div className="text-5xl mb-4 animate-pulse">🔥</div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">Scanning wallet...</h2>
                <p className="text-sm text-gray-400">Looking for spam items...</p>
                <div className="mt-6 w-full bg-gray-900/50 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            ) : (
              <>
                {spamItems.length > 0 ? (
                  <>
                    {/* Summary Card */}
                    <div className="glass rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Found Items</div>
                          <div className="text-2xl font-semibold text-gray-100">{spamItems.length}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Selected</div>
                          <div className="text-2xl font-semibold text-orange-400">{selectedCount}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAll}
                          className="flex-1 px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          onClick={selectDust}
                          className="flex-1 px-4 py-2 glass-dark hover:bg-[#7a9b76]/20 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          Select Dust
                        </button>
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="glass rounded-xl p-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {spamItems.map((item) => {
                          const isSelected = selectedItems.has(item.pubkey.toBase58());
                          return (
                            <button
                              key={item.pubkey.toBase58()}
                              onClick={() => toggleSelection(item.pubkey.toBase58())}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500/10'
                                  : 'border-[#7a9b76]/20 glass-dark hover:border-[#7a9b76]/40'
                              }`}
                            >
                              <div className="text-xs font-mono text-gray-400 mb-1 truncate">
                                {item.pubkey.toBase58().slice(0, 6)}...
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.type === 'nft' ? 'NFT' : `Token: ${item.balance?.toFixed(4) || '0'}`}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Revenue Card */}
                    {selectedCount > 0 && (
                      <div className="glass-dark rounded-xl p-6 border border-orange-500/30">
                        <div className="text-sm text-gray-400 mb-1">You Will Receive</div>
                        <div className="text-3xl font-bold text-orange-400 mb-1">
                          {userReceives.toFixed(4)} SOL
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          Fee (15%): {fee.toFixed(4)} SOL
                        </div>
                        <button
                          onClick={handleBurn}
                          disabled={isBurning}
                          className="w-full px-6 py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                        >
                          {isBurning ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="animate-spin">⏳</span>
                              Burning...
                            </span>
                          ) : (
                            `Incinerate ${selectedCount} Items`
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="glass rounded-xl p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-semibold text-gray-100 mb-2">No Spam Items Found</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      Your wallet is clean! No spam NFTs or tokens detected.
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
          </>
        )}
      </div>
    </div>
  );
}
