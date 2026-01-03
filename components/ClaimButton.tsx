'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';

interface ClaimButtonProps {
  accounts: PublicKey[];
  onClaim: (accounts: PublicKey[]) => Promise<void>;
  disabled?: boolean;
}

export default function ClaimButton({ accounts, onClaim, disabled }: ClaimButtonProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (disabled || isClaiming || accounts.length === 0) return;

    setIsClaiming(true);
    setError(null);

    try {
      await onClaim(accounts);
    } catch (err: any) {
      setError(err.message || 'Failed to claim. Please try again.');
      console.error('Claim error:', err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClaim}
        disabled={disabled || isClaiming || accounts.length === 0}
        className="w-full px-6 py-4 bg-[#7a9b76] hover:bg-[#8fae8a] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-lg"
      >
        {isClaiming ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Processing...
          </span>
        ) : (
          `Claim All (${accounts.length} accounts)`
        )}
      </button>
      {error && (
        <div className="text-red-400 text-sm text-center">{error}</div>
      )}
    </div>
  );
}
