import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatPostDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Manage Solana | Solana Wallet Management Tools',
  description: 'Stay updated with the latest news, guides, and updates about Manage Solana - your toolkit for reclaiming rent, burning spam, and managing your Solana wallet.',
  openGraph: {
    title: 'Blog - Manage Solana',
    description: 'Latest news, guides, and updates about Solana wallet management',
    url: 'https://www.managesolana.com/blog',
    siteName: 'Manage Solana',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Manage Solana',
    description: 'Latest news, guides, and updates about Solana wallet management',
  },
  alternates: {
    canonical: 'https://www.managesolana.com/blog',
  },
};

export default function BlogPage() {
  // getAllPosts is synchronous, so this is fine
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Link
            href="/dashboard"
            className="inline-block mb-6 text-sm text-gray-400 hover:text-[#8fae8a] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-gray-100 mb-4">
            Manage Solana Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest news, guides, and updates about Solana wallet management
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="glass rounded-xl p-20 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-2">No posts yet</h2>
            <p className="text-gray-400 mb-6">
              Check back soon for updates and guides!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-[#7a9b76] hover:bg-[#8fae8a] text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="glass rounded-2xl p-6 h-full flex flex-col hover:scale-105 transition-all duration-300">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-[#8fae8a] bg-[#7a9b76]/20 rounded-full border border-[#7a9b76]/30">
                      {post.category}
                    </span>
                  </div>

                  {/* Featured Image */}
                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-900/50 aspect-video">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-[#8fae8a] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {post.description}
                  </p>

                  {/* Meta Info */}
                  <div className="mt-auto pt-4 border-t border-[#7a9b76]/20">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatPostDate(post.date)}</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-[#7a9b76]/10 text-gray-400 rounded border border-[#7a9b76]/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'Manage Solana Blog',
              description: 'Latest news, guides, and updates about Solana wallet management',
              url: 'https://www.managesolana.com/blog',
              publisher: {
                '@type': 'Organization',
                name: 'Manage Solana',
                url: 'https://www.managesolana.com',
              },
              blogPost: posts.map((post) => ({
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.description,
                datePublished: post.date,
                author: {
                  '@type': 'Person',
                  name: post.author,
                },
                url: `https://www.managesolana.com/blog/${post.slug}`,
                image: post.image || 'https://www.managesolana.com/og-image.png',
              })),
            }),
          }}
        />
      </div>
    </div>
  );
}
