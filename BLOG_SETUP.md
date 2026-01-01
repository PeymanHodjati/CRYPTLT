# Blog System Setup & Usage

The Manage Solana blog is a fully SEO-optimized blog system built with Next.js, featuring automated workflows for creating and managing blog posts.

## Features

- ✅ **SEO Optimized**: Full metadata, Open Graph, Twitter Cards, and structured data
- ✅ **Markdown-Based**: Write posts in Markdown for easy editing
- ✅ **Automated Workflows**: Scripts for creating new posts
- ✅ **Static Generation**: Fast, pre-rendered pages
- ✅ **Responsive Design**: Beautiful UI matching the Wirely aesthetic

## Directory Structure

```
content/
  blog/
    welcome-to-manage-solana.md
    how-to-reclaim-rent.md
    ... (your posts)

app/
  blog/
    page.tsx          # Blog listing page
    [slug]/
      page.tsx        # Individual post pages

lib/
  blog.ts             # Blog utilities (reading, parsing posts)

scripts/
  new-post.js         # Automation script for creating posts
```

## Creating a New Blog Post

### Method 1: Using the Automation Script (Recommended)

Run the interactive script:

```bash
npm run new-post
```

The script will prompt you for:
- Post title
- Description
- Category
- Tags (comma-separated)
- Author
- Featured image URL (optional)
- Publish status

The script will:
- Generate a URL-friendly slug from the title
- Create the markdown file with proper frontmatter
- Optionally open it in VS Code

### Method 2: Manual Creation

1. Create a new `.md` file in `content/blog/`
2. Use a URL-friendly filename (e.g., `my-new-post.md`)
3. Add frontmatter at the top:

```markdown
---
title: "Your Post Title"
description: "A brief description for SEO and previews"
date: "2025-01-15"
author: "Manage Solana Team"
category: "Guides"
tags: ["solana", "wallet", "tutorial"]
image: "https://www.managesolana.com/og-image.png"
published: true
---

# Your Post Title

Your content goes here...
```

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `description` | Yes | SEO description (150-160 chars recommended) |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `author` | No | Author name (defaults to "Manage Solana Team") |
| `category` | No | Post category (defaults to "General") |
| `tags` | No | Array of tags for categorization |
| `image` | No | Featured image URL for Open Graph |
| `published` | No | Set to `false` to hide from listing (defaults to `true`) |

## Blog Post Categories

Common categories:
- **Announcements**: Product updates, new features
- **Guides**: Tutorials, how-to articles
- **News**: Industry news, Solana updates
- **Tips**: Tips and tricks
- **General**: General topics

## SEO Optimization

Each blog post automatically includes:

- **Meta Tags**: Title, description, keywords
- **Open Graph**: For social media sharing
- **Twitter Cards**: Optimized Twitter previews
- **Structured Data**: JSON-LD schema for search engines
- **Canonical URLs**: Prevents duplicate content issues

### Best Practices

1. **Descriptions**: Keep between 150-160 characters
2. **Titles**: Include keywords, keep under 60 characters
3. **Images**: Use high-quality images (1200x630px recommended for OG)
4. **Tags**: Use relevant, specific tags
5. **Content**: Write valuable, original content

## Viewing Your Blog

- **Blog Listing**: `https://www.managesolana.com/blog`
- **Individual Post**: `https://www.managesolana.com/blog/[slug]`

## Automation Workflows

### Creating Posts from Command Line

```bash
# Interactive mode
npm run new-post

# Or directly with Node
node scripts/new-post.js
```

### Batch Operations

You can extend the script to:
- Import posts from external sources
- Generate posts from templates
- Sync with CMS systems
- Auto-publish scheduled posts

## Styling

Blog posts use custom prose styles defined in `app/globals.css`. The styles match the Wirely aesthetic with:
- Clean typography
- Proper spacing
- Code block styling
- Responsive images
- Glassmorphism effects

## Development

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see your posts.

### Building for Production

```bash
npm run build
```

All blog posts are statically generated at build time for optimal performance.

## Troubleshooting

### Post Not Appearing

1. Check `published: true` in frontmatter
2. Verify file is in `content/blog/` directory
3. Ensure file has `.md` extension
4. Check for syntax errors in frontmatter

### Build Errors

1. Verify all frontmatter fields are valid
2. Check markdown syntax
3. Ensure image URLs are accessible
4. Review console for specific errors

### SEO Issues

1. Verify metadata in page source
2. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Check Open Graph with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
4. Validate structured data with [Schema.org Validator](https://validator.schema.org/)

## Next Steps

- Add RSS feed generation
- Implement search functionality
- Add related posts
- Create author pages
- Add comment system (optional)

---

**Questions?** Check the code in `lib/blog.ts` for implementation details.
