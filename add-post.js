const fs = require('fs');
const path = require('path');

// Helper script to add frontmatter to posts from drafts folder

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node add-post.js <path-to-draft.md> <slug>');
  console.log('Example: node add-post.js drafts/personal_prod/a_fresh_start.md a-fresh-start');
  console.log('\nOptional flags:');
  console.log('  --title "Post Title"       - Override title');
  console.log('  --date 2024-10-31         - Set publish date');
  console.log('  --description "..."        - Add description');
  process.exit(1);
}

const sourcePath = args[0];
const slug = args[1];

// Parse optional flags
let title = null;
let date = new Date().toISOString().split('T')[0];
let description = '';

for (let i = 2; i < args.length; i++) {
  if (args[i] === '--title' && args[i + 1]) {
    title = args[i + 1];
    i++;
  } else if (args[i] === '--date' && args[i + 1]) {
    date = args[i + 1];
    i++;
  } else if (args[i] === '--description' && args[i + 1]) {
    description = args[i + 1];
    i++;
  }
}

// Read the source file
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: File not found: ${sourcePath}`);
  process.exit(1);
}

const content = fs.readFileSync(sourcePath, 'utf8');

// Extract title from first heading if not provided
if (!title) {
  const match = content.match(/^#\s+(.+)$/m);
  title = match ? match[1].replace(/~~/g, '') : slug.replace(/-/g, ' ');
}

// Create frontmatter
const frontmatter = `---
title: ${title}
date: ${date}
description: ${description}
---

`;

// Check if frontmatter already exists
const newContent = content.startsWith('---') ? content : frontmatter + content;

// Write to posts directory
const outputPath = path.join('posts', `${slug}.md`);
fs.writeFileSync(outputPath, newContent);

console.log(`✓ Created: ${outputPath}`);
console.log(`  Title: ${title}`);
console.log(`  Date: ${date}`);
if (description) console.log(`  Description: ${description}`);
console.log('\nRun "npm run build && npm run tailwind" to regenerate your site.');
