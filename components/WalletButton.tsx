'use client';

import { useAppKitAccount, useAppKit } from '@reown/appkit/react';

export default function WalletButton() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
          Connected: {address.slice(0, 4)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => open({ view: 'Account' })}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors w-full"
    >
      Connect Wallet
    </button>
  );
}
