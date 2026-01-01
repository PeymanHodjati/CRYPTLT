import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cryptoolate - Reclaim Your Solana Rent | Web App',
  description: 'Find and reclaim rent from empty Solana token accounts. Web version of Cryptoolate.',
};

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
