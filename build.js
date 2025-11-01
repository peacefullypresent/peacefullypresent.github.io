const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configuration
const POSTS_DIR = './posts';
const DIST_DIR = './dist';
const SITE_URL = 'https://peacefullypresent.github.io'; // Update this
const SITE_TITLE = 'Personal Blog';
const SITE_DESCRIPTION = 'Musings on my Journey of Porn Addiction Recovery';

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Read all markdown files from posts directory
function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory found. Creating one...');
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content: markdown } = matter(content);
    const html = marked(markdown);
    const slug = file.replace('.md', '');

    return {
      slug,
      title: data.title || slug.replace(/-/g, ' '),
      date: data.date || new Date().toISOString().split('T')[0],
      description: data.description || '',
      html,
      markdown
    };
  });

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

// Generate HTML template
function getTemplate(title, content, isHomePage = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${SITE_TITLE}</title>
  <link href="/styles.css" rel="stylesheet">
  <link rel="alternate" type="application/rss+xml" title="${SITE_TITLE}" href="/feed.xml">
</head>
<body class="min-h-screen">
  <div class="max-w-3xl mx-auto px-4 py-8">
    <header class="mb-12">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-bold mb-2">
            <a href="/" class="no-underline text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300">${SITE_TITLE}</a>
          </h1>
          <p class="text-gray-600 dark:text-gray-400">${SITE_DESCRIPTION}</p>
          <nav class="mt-4">
            <a href="/" class="mr-4">Home</a>
            <a href="/feed.xml" class="mr-4">RSS</a>
          </nav>
        </div>
        <button id="theme-toggle" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
          <svg id="theme-toggle-light-icon" class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
          <svg id="theme-toggle-dark-icon" class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        </button>
      </div>
    </header>
    <main>
      ${content}
    </main>
    <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
      <p>&copy; ${new Date().getFullYear()} ${SITE_TITLE}. All rights reserved.</p>
    </footer>
  </div>
  <script>
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      html.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
      html.classList.toggle('dark');
      const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
    });
  </script>
</body>
</html>`;
}

// Generate individual post page
function generatePostPage(post) {
  const content = `
    <article>
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-2">${post.title}</h1>
        <time class="text-gray-600" datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      </header>
      <div class="post-content">
        ${post.html}
      </div>
    </article>

    <!-- Contact Section -->
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <p class="text-gray-600 dark:text-gray-400">
        Have thoughts on this post? <a href="mailto:presentpeacefully@gmail.com" class="text-blue-600 dark:text-blue-400 hover:underline">Email me</a>
      </p>
    </div>
  `;

  const html = getTemplate(post.title, content);
  const postDir = path.join(DIST_DIR, post.slug);

  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  fs.writeFileSync(path.join(postDir, 'index.html'), html);
  console.log(`Generated: ${post.slug}/index.html`);
}

// Generate homepage with post list
function generateHomePage(posts) {
  const postsList = posts.map(post => `
    <article class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <h2 class="text-2xl font-bold mb-2">
        <a href="/${post.slug}/" class="no-underline text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">${post.title}</a>
      </h2>
      <time class="text-gray-600 dark:text-gray-400 text-sm" datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      ${post.description ? `<p class="mt-2 text-gray-700 dark:text-gray-300">${post.description}</p>` : ''}
    </article>
  `).join('');

  const content = `
    <div class="space-y-4">
      ${posts.length > 0 ? postsList : '<p class="text-gray-600 dark:text-gray-400">No posts yet. Add markdown files to the posts/ directory.</p>'}
    </div>
  `;

  const html = getTemplate('Home', content, true);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
  console.log('Generated: index.html');
}

// Generate RSS feed
function generateRSSFeed(posts) {
  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/${post.slug}/</link>
      <guid>${SITE_URL}/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description || post.title)}</description>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), rss);
  console.log('Generated: feed.xml');
}

// Helper function to escape XML
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Main build process
console.log('Building site...\n');

const posts = getAllPosts();
console.log(`Found ${posts.length} posts\n`);

// Generate all pages
generateHomePage(posts);
posts.forEach(generatePostPage);
generateRSSFeed(posts);

console.log('\nBuild complete! Run "npm run dev" to preview locally.');
