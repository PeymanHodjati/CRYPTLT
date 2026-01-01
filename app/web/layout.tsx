import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Solana - Reclaim Your Solana Rent | Web App',
  description: 'Find and reclaim rent from empty Solana token accounts. Web version of Manage Solana.',
};

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
