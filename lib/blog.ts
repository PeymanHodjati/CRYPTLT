import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { format } from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  content: string;
  readingTime: number;
  published: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime: number;
  published: boolean;
}

// Get all blog posts (metadata only)
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        author: data.author || 'Manage Solana Team',
        category: data.category || 'General',
        tags: data.tags || [],
        image: data.image,
        readingTime: calculateReadingTime(fileContents),
        published: data.published !== false, // Default to true unless explicitly false
      } as BlogPostMeta;
    })
    .filter((post) => post.published) // Only return published posts
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allPostsData;
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'Manage Solana Team',
      category: data.category || 'General',
      tags: data.tags || [],
      image: data.image,
      content: contentHtml,
      readingTime: calculateReadingTime(fileContents),
      published: data.published !== false,
    } as BlogPost;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Get all slugs for static generation
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/[#*`]/g, ''); // Remove markdown syntax
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Format date for display
export function formatPostDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
}
