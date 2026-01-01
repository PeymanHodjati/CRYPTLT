'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useAppKitAccount, useAppKitProvider, useAppKit } from '@reown/appkit/react';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { findTokenApprovals, TokenApproval } from '@/utils/permissions';
import { buildRevokeTransaction } from '@/utils/revoke-tx';
import { createConnection } from '@/utils/solana';
import Link from 'next/link';

export default function Permissions() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('solana');
  const { connection } = useAppKitConnection();
  const [isScanning, setIsScanning] = useState(false);
  const [approvals, setApprovals] = useState<TokenApproval[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

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
      
      const foundApprovals = await findTokenApprovals(solanaConnection, userPubkey);
      setApprovals(foundApprovals);
      setSelectedApprovals(new Set());
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
      setApprovals([]);
      setSelectedApprovals(new Set());
    }
  }, [isConnected, address, handleScan]);

  const toggleSelection = (tokenAccount: string) => {
    const newSelected = new Set(selectedApprovals);
    if (newSelected.has(tokenAccount)) {
      newSelected.delete(tokenAccount);
    } else {
      newSelected.add(tokenAccount);
    }
    setSelectedApprovals(newSelected);
  };

  const selectAll = () => {
    setSelectedApprovals(new Set(approvals.map(approval => approval.tokenAccount.toBase58())));
  };

  const handleRevoke = async () => {
    if (!address || !walletProvider || selectedApprovals.size === 0) {
      throw new Error('No approvals selected');
    }

    setIsRevoking(true);
    setError(null);

    try {
      const solanaConnection = connection || createConnection();
      const userPubkey = new PublicKey(address);

      const approvalsToRevoke = approvals
        .filter(approval => selectedApprovals.has(approval.tokenAccount.toBase58()))
        .map(approval => approval.tokenAccount);

      const transaction = await buildRevokeTransaction(
        userPubkey,
        approvalsToRevoke,
        solanaConnection
      );

      const signature = await (walletProvider as any).sendTransaction(transaction, solanaConnection);
      await solanaConnection.confirmTransaction(signature, 'confirmed');

      // Remove revoked approvals
      const remaining = approvals.filter(
        approval => !selectedApprovals.has(approval.tokenAccount.toBase58())
      );
      setApprovals(remaining);
      setSelectedApprovals(new Set());

      alert(`Success! Revoked ${approvalsToRevoke.length} permissions. Transaction: ${signature}`);
    } catch (err: any) {
      setError(err.message || 'Failed to revoke permissions. Please try again.');
      console.error('Revoke error:', err);
    } finally {
      setIsRevoking(false);
    }
  };

  const selectedCount = selectedApprovals.size;
  const riskCount = approvals.filter(a => a.amount && Number(a.amount) > 1000000).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-1 block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">🔒 Permissions Revoke</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Revoke risky token approvals
              </p>
            </div>
            {isConnected && address && (
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-gray-500">Connected</div>
                <div className="text-xs font-mono text-blue-600">
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
            <h2 className="text-xl font-semibold text-gray-900">Connect Wallet to Scan</h2>
            <p className="text-sm text-gray-600">
              Find and revoke risky token approvals
            </p>
            <button
              onClick={() => open()}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-4"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {isScanning ? (
              <div className="glass rounded-xl p-8 text-center">
                <div className="text-5xl mb-4 animate-pulse">🔒</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Scanning for Risks...</h2>
                <p className="text-sm text-gray-600">Checking token approvals...</p>
                <div className="mt-6 w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            ) : (
              <>
                {approvals.length > 0 ? (
                  <>
                    <div className="glass rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Active Approvals</div>
                          <div className="text-2xl font-semibold text-gray-900">{approvals.length}</div>
                        </div>
                        {riskCount > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">High Risk</div>
                            <div className="text-2xl font-semibold text-red-600">{riskCount}</div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={selectAll}
                        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Select All
                      </button>
                    </div>

                    <div className="glass rounded-xl p-4 max-h-96 overflow-y-auto space-y-2">
                      {approvals.map((approval) => {
                        const isSelected = selectedApprovals.has(approval.tokenAccount.toBase58());
                        const isHighRisk = approval.amount && Number(approval.amount) > 1000000;
                        return (
                          <button
                            key={approval.tokenAccount.toBase58()}
                            onClick={() => toggleSelection(approval.tokenAccount.toBase58())}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50'
                                : isHighRisk
                                ? 'border-red-200 bg-red-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="text-xs font-mono text-gray-600 mb-1 truncate">
                                  {approval.mint.slice(0, 8)}...
                                </div>
                                {approval.delegate && (
                                  <div className="text-xs text-gray-500">
                                    Delegate: {approval.delegate.toBase58().slice(0, 8)}...
                                  </div>
                                )}
                              </div>
                              {isHighRisk && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  High Risk
                                </span>
                              )}
                            </div>
                            {approval.amount && (
                              <div className="text-xs text-gray-600">
                                Amount: {approval.amount}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedCount > 0 && (
                      <div className="glass-dark rounded-xl p-6 border border-purple-200/50">
                        <div className="text-sm text-gray-600 mb-4">
                          Revoking {selectedCount} permission{selectedCount > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
                          This action is free. No fees charged.
                        </div>
                        <button
                          onClick={handleRevoke}
                          disabled={isRevoking}
                          className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                        >
                          {isRevoking ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="animate-spin">⏳</span>
                              Revoking...
                            </span>
                          ) : (
                            `Revoke ${selectedCount} Permission${selectedCount > 1 ? 's' : ''}`
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="glass rounded-xl p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Approvals</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Your wallet is secure! No risky token approvals found.
                    </p>
                    <button
                      onClick={handleScan}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Scan Again
                    </button>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
