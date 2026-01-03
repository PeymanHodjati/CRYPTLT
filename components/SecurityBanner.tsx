'use client';

import { useState } from 'react';

export default function SecurityBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="glass-dark border-b border-[#7a9b76]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-2xl">🔒</div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-[#8fae8a]">Security Notice:</span>{' '}
                We NEVER ask for your private keys or seed phrases. All transactions are non-custodial - you maintain full control of your wallet.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-300 text-xl leading-none"
            aria-label="Close banner"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
