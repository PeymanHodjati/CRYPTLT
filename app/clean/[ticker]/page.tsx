import tokensData from '@/data/tokens.json';
import type { Token } from '@/data/token-types';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const tokens = tokensData as Token[];

interface TokenCleanPageProps {
  params: Promise<{ ticker: string }>;
}

// Generate static params for all tokens
export async function generateStaticParams() {
  return tokens.map((token) => ({
    ticker: token.ticker.toLowerCase(),
  }));
}

// Generate SEO metadata
export async function generateMetadata({ params }: TokenCleanPageProps): Promise<Metadata> {
  const { ticker } = await params;
  const token = tokens.find((t) => t.ticker.toLowerCase() === ticker.toLowerCase());

  if (!token) {
    return {
      title: 'Token Not Found - Manage Solana',
    };
  }

  const title = `How to Close Empty ${token.name} (${token.ticker}) Accounts | Manage Solana`;
  const description = `Recover the 0.002 SOL rent deposit hidden in your empty ${token.name} wallet. Instant cleanup tool for ${token.ticker}.`;
  const url = `https://www.managesolana.com/clean/${token.ticker.toLowerCase()}`;

  return {
    title,
    description,
    keywords: [`${token.ticker}`, `${token.name}`, 'close token account', 'reclaim rent', 'Solana', 'empty account'],
    openGraph: {
      title,
      description,
      url,
      siteName: 'Manage Solana',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TokenCleanPage({ params }: TokenCleanPageProps) {
  const { ticker } = await params;
  const token = tokens.find((t) => t.ticker.toLowerCase() === ticker.toLowerCase());

  if (!token) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-400 hover:text-[#8fae8a] mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        {/* Hero Section */}
        <div className="glass rounded-2xl p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
            How to Clean Empty{' '}
            <span className="text-[#8fae8a]">{token.name} ({token.ticker})</span> Accounts
          </h1>

          <div className="glass-dark border border-[#7a9b76]/30 rounded-xl p-6 mb-6">
            <p className="text-xl text-gray-200 mb-4">
              Do you have <strong>0 {token.ticker}</strong> in your wallet, but the account is still open? You are
              likely losing <strong className="text-[#8fae8a]">0.002 SOL</strong> in locked rent deposits.
            </p>
            <Link
              href="/tools/rent-finder"
              className="inline-block bg-[#7a9b76] hover:bg-[#8fae8a] text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Scan My Wallet for {token.ticker}
            </Link>
          </div>
        </div>

        {/* Educational Content */}
        <article className="prose prose-lg max-w-none glass rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">What is {token.name}?</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-4">{token.description}</p>
          <p className="italic text-sm text-gray-500 mb-8">Fun Fact: {token.funFact}</p>

          <h3 className="text-2xl font-bold text-gray-100 mb-4 mt-8">
            Why do I have an empty {token.ticker} account?
          </h3>
          <p className="text-gray-400 leading-relaxed mb-4">
            When you first traded <strong>{token.ticker}</strong> (Contract:{' '}
            <code className="bg-[#7a9b76]/10 px-2 py-1 border border-[#7a9b76]/20 rounded text-sm font-mono">{token.mintAddress}</code>), the Solana
            blockchain forced you to pay a "Rent Deposit" to open a storage space for the data.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            Even if you sold all your coins, that storage space stays open on the blockchain, holding your SOL hostage.
            Manage Solana helps you find and close these specific accounts.
          </p>

          <h3 className="text-2xl font-bold text-gray-100 mb-4 mt-8">How to recover the funds</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-400">
            <li>Open the <strong>Manage Solana</strong> dashboard.</li>
            <li>Connect your Phantom or Solflare wallet.</li>
            <li>Our scanner will identify your empty <strong>{token.ticker}</strong> account.</li>
            <li>
              Click <strong>"Reclaim"</strong> to close the account and get your 0.002 SOL back instantly.
            </li>
          </ol>

          <div className="mt-8 p-6 glass-dark border border-[#7a9b76]/30 rounded-xl">
            <h4 className="font-bold text-gray-100 mb-2">💡 Pro Tip</h4>
            <p className="text-gray-400">
              You can close multiple empty token accounts in a single transaction, saving on fees and time. Our tool
              automatically batches all your empty accounts together.
            </p>
          </div>
        </article>

        {/* FAQ Schema for Google Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `How do I close my ${token.ticker} token account?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `You can use Manage Solana to scan for empty ${token.ticker} accounts and close them in one click to recover your rent deposit. Simply connect your wallet and click "Reclaim" on any empty accounts found.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `How much SOL is locked in an empty ${token.ticker} account?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `An empty ${token.ticker} token account typically locks 0.002 SOL (approximately $0.30-0.50 depending on SOL price) as a rent deposit. This amount is refunded when you close the account.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `Is it safe to close my ${token.ticker} account?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Yes, it's completely safe to close empty token accounts. You can only close accounts with zero balance, so there's no risk of losing tokens. The transaction is atomic, meaning it either succeeds completely or fails entirely.`,
                  },
                },
              ],
            }),
          }}
        />

        {/* Additional Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: `How to Close Empty ${token.name} (${token.ticker}) Accounts`,
              description: `Recover the 0.002 SOL rent deposit hidden in your empty ${token.name} wallet.`,
              author: {
                '@type': 'Organization',
                name: 'Manage Solana',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Manage Solana',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.managesolana.com/logo.png',
                },
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
