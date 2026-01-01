# Blog Automation Workflows

This document describes the automated workflows for managing blog posts in the Manage Solana blog system.

## Quick Start

### Create a New Post

```bash
npm run new-post
```

This interactive script will guide you through creating a new blog post with all required metadata.

## Automation Scripts

### `scripts/new-post.js`

Interactive script for creating new blog posts.

**Features:**
- Generates URL-friendly slugs from titles
- Creates proper frontmatter structure
- Validates required fields
- Optionally opens in VS Code
- Prevents overwriting existing posts (with confirmation)

**Usage:**
```bash
node scripts/new-post.js
# or
npm run new-post
```

## Workflow Examples

### Daily Blog Post Workflow

1. **Create Post**
   ```bash
   npm run new-post
   ```

2. **Edit Content**
   - Open the generated `.md` file
   - Write your content in Markdown
   - Add images to `public/blog-images/` (optional)

3. **Preview Locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000/blog`

4. **Publish**
   - Commit and push to trigger deployment
   - Or set `published: false` to draft

### Batch Post Creation

You can extend `scripts/new-post.js` to:
- Import from external sources (CMS, Google Docs, etc.)
- Generate from templates
- Auto-schedule posts
- Sync with external systems

### Example: Import from CSV

```javascript
// scripts/import-posts.js
const fs = require('fs');
const csv = require('csv-parser');

// Read CSV and create posts
// ... implementation
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/blog.yml
name: Blog Post Automation

on:
  push:
    paths:
      - 'content/blog/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build site
        run: npm run build
      - name: Deploy
        run: # your deployment command
```

## Scheduled Posts

To implement scheduled posts:

1. Add a `scheduledDate` field to frontmatter
2. Filter posts by date in `getAllPosts()`
3. Use a cron job or scheduled function to publish

Example:
```typescript
// lib/blog.ts
export function getAllPosts(): BlogPostMeta[] {
  const now = new Date();
  return posts.filter(post => {
    if (post.scheduledDate) {
      return new Date(post.scheduledDate) <= now;
    }
    return post.published;
  });
}
```

## Content Management

### Markdown Features

The blog supports standard Markdown plus:
- Frontmatter metadata
- Code blocks with syntax highlighting
- Images (local or remote)
- Links
- Lists (ordered/unordered)
- Blockquotes
- Tables

### Image Management

**Option 1: Local Images**
1. Add images to `public/blog-images/`
2. Reference: `/blog-images/image.png`

**Option 2: Remote Images**
- Use full URLs in markdown
- Recommended: CDN or image hosting service

### SEO Best Practices

1. **Titles**: 50-60 characters, include keywords
2. **Descriptions**: 150-160 characters, compelling
3. **Images**: 1200x630px for Open Graph
4. **Tags**: 3-5 relevant tags per post
5. **Categories**: Use consistent categories

## Advanced Automation

### RSS Feed Generation

```typescript
// app/blog/rss.xml/route.ts
export async function GET() {
  const posts = getAllPosts();
  // Generate RSS XML
  return new Response(rssXml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

### Sitemap Integration

Add blog posts to sitemap:
```typescript
// app/sitemap.ts
import { getAllPostSlugs } from '@/lib/blog';

export default function sitemap() {
  const posts = getAllPostSlugs().map(slug => ({
    url: `https://www.managesolana.com/blog/${slug}`,
    lastModified: new Date(),
  }));
  // ... rest of sitemap
}
```

### Analytics Integration

Track blog views:
```typescript
// app/blog/[slug]/page.tsx
useEffect(() => {
  // Track page view
  analytics.track('blog_post_view', { slug });
}, [slug]);
```

## Troubleshooting

### Post Not Appearing

1. Check `published: true` in frontmatter
2. Verify file is in `content/blog/`
3. Ensure valid frontmatter syntax
4. Check for build errors

### Build Errors

1. Validate YAML frontmatter
2. Check markdown syntax
3. Verify image URLs
4. Review console logs

### Automation Script Issues

1. Ensure Node.js is installed
2. Check file permissions
3. Verify directory structure
4. Review script logs

## Next Steps

- [ ] Add RSS feed
- [ ] Implement search
- [ ] Add related posts
- [ ] Create author pages
- [ ] Add comment system
- [ ] Implement scheduled posts
- [ ] Add analytics tracking

---

For more details, see `BLOG_SETUP.md`.
