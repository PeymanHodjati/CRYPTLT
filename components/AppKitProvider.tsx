'use client';

import { AppKitProvider } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana } from '@reown/appkit/networks';

// Configure AppKit with Solana
// Get your Project ID from https://cloud.reown.com
// IMPORTANT: You MUST set NEXT_PUBLIC_PROJECT_ID in your .env.local file
// The placeholder below will cause build errors - replace it with your actual Project ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';

export const metadata = {
  name: 'Manage Solana',
  description: 'Reclaim rent from empty Solana token accounts',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://managesolana.com',
  icons: ['https://managesolana.com/icon.png'],
};

// AppKitProvider component with Solana configuration
export default function ManageSolanaAppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppKitProvider
      adapters={[new SolanaAdapter()]}
      projectId={projectId}
      metadata={metadata}
      networks={[solana]}
      features={{
        analytics: false,
        email: false,
      }}
      themeMode="light"
      themeVariables={{
        '--w3m-accent': '#6366f1',
      }}
    >
      {children}
    </AppKitProvider>
  );
}
