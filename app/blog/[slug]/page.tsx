import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs, formatPostDate } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - Manage Solana',
    };
  }

  const imageUrl = post.image || 'https://www.managesolana.com/og-image.png';
  const url = `https://www.managesolana.com/blog/${slug}`;

  return {
    title: `${post.title} - Manage Solana Blog`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'Manage Solana',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'article:published_time': post.date,
      'article:author': post.author,
      'article:section': post.category,
    },
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/blog"
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
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-[#8fae8a] bg-[#7a9b76]/20 rounded-full border border-[#7a9b76]/30">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {post.author}
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatPostDate(post.date)}
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {post.readingTime} min read
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-xl overflow-hidden bg-gray-900/50">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-[#7a9b76]/10 text-gray-400 rounded-full border border-[#7a9b76]/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none glass rounded-2xl p-8 md:p-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.description,
              image: post.image || 'https://www.managesolana.com/og-image.png',
              datePublished: post.date,
              author: {
                '@type': 'Person',
                name: post.author,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Manage Solana',
                url: 'https://www.managesolana.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.managesolana.com/logo.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://www.managesolana.com/blog/${slug}`,
              },
            }),
          }}
        />
      </article>
    </div>
  );
}
