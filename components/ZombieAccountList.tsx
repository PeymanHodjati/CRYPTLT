'use client';

import { PublicKey } from '@solana/web3.js';

interface ZombieAccountListProps {
  accounts: { pubkey: PublicKey; mint: string }[];
  totalRefund: number;
  fee: number;
}

export default function ZombieAccountList({ accounts, totalRefund, fee }: ZombieAccountListProps) {
  const netAmount = totalRefund - fee;
  const solRefund = totalRefund / 1_000_000_000;
  const solFee = fee / 1_000_000_000;
  const solNet = netAmount / 1_000_000_000;

  // Rough USD estimate (update with real price API if needed)
  const solPrice = 160;
  const usdRefund = solRefund * solPrice;
  const usdFee = solFee * solPrice;
  const usdNet = solNet * solPrice;

  return (
    <div className="space-y-4">
      <div className="glass rounded-lg p-4 border border-[#7a9b76]/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Zombie Accounts Found</span>
          <span className="text-gray-100 font-semibold">{accounts.length}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Total Recoverable</span>
          <span className="text-[#8fae8a] font-semibold">
            {solRefund.toFixed(4)} SOL (~${usdRefund.toFixed(2)})
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Service Fee</span>
          <span className="text-yellow-400 font-semibold">
            {solFee.toFixed(4)} SOL (~${usdFee.toFixed(2)})
          </span>
        </div>
        <div className="border-t border-[#7a9b76]/20 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">You Receive</span>
            <span className="text-[#8fae8a] font-bold text-lg">
              {solNet.toFixed(4)} SOL (~${usdNet.toFixed(2)})
            </span>
          </div>
        </div>
      </div>

      {accounts.length > 0 && (
        <div className="glass rounded-lg p-4 border border-[#7a9b76]/30 max-h-64 overflow-y-auto">
          <h3 className="text-gray-100 font-semibold mb-2">Accounts to Close:</h3>
          <div className="space-y-1">
            {accounts.slice(0, 10).map((account, idx) => (
              <div key={idx} className="text-xs text-gray-400 font-mono">
                {account.pubkey.toString().slice(0, 8)}...{account.pubkey.toString().slice(-8)}
              </div>
            ))}
            {accounts.length > 10 && (
              <div className="text-xs text-gray-500">...and {accounts.length - 10} more</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
