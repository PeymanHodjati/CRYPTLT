#!/usr/bin/env node

/**
 * Blog Post Generator Script
 * 
 * Usage: node scripts/new-post.js "Post Title" [category] [tags]
 * 
 * Example: node scripts/new-post.js "New Feature Release" "Announcements" "solana,features"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

async function createBlogPost() {
  console.log('\n📝 Create New Blog Post\n');
  console.log('Press Ctrl+C to cancel at any time\n');

  try {
    // Get title
    const title = await question('Post title: ');
    if (!title.trim()) {
      console.log('❌ Title is required');
      process.exit(1);
    }

    // Get description
    const description = await question('Description (brief summary): ');

    // Get category
    const category = await question('Category (default: General): ') || 'General';

    // Get tags
    const tagsInput = await question('Tags (comma-separated, e.g., solana,wallet,guide): ');
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Get author
    const author = await question('Author (default: Manage Solana Team): ') || 'Manage Solana Team';

    // Get image URL (optional)
    const image = await question('Featured image URL (optional, press Enter to skip): ');

    // Get published status
    const publishedInput = await question('Publish immediately? (y/n, default: y): ').then((ans) =>
      ans.toLowerCase().trim()
    );
    const published = publishedInput !== 'n' && publishedInput !== 'no';

    // Generate slug
    const slug = slugify(title);
    const date = getCurrentDate();

    // Create frontmatter
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
date: "${date}"
author: "${author}"
category: "${category}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
${image ? `image: "${image}"` : ''}
published: ${published}
---

# ${title}

${description}

<!-- Your content goes here -->

`;

    // Create file path
    const postsDir = path.join(process.cwd(), 'content', 'blog');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const filePath = path.join(postsDir, `${slug}.md`);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      const overwrite = await question(`\n⚠️  File ${slug}.md already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Cancelled');
        process.exit(0);
      }
    }

    // Write file
    fs.writeFileSync(filePath, frontmatter, 'utf8');

    console.log(`\n✅ Blog post created: ${filePath}`);
    console.log(`\n📝 Edit the file to add your content:`);
    console.log(`   ${filePath}\n`);

    // Open in editor (optional)
    const openEditor = await question('Open in VS Code? (y/n, default: n): ');
    if (openEditor.toLowerCase() === 'y' || openEditor.toLowerCase() === 'yes') {
      const { exec } = require('child_process');
      exec(`code "${filePath}"`, (error) => {
        if (error) {
          console.log('⚠️  Could not open in VS Code. Open manually.');
        }
      });
    }
  } catch (error) {
    if (error.message.includes('SIGINT')) {
      console.log('\n\n❌ Cancelled');
      process.exit(0);
    }
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  createBlogPost();
}

module.exports = { createBlogPost, slugify };
