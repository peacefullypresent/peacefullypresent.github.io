# Personal Blog

A minimal, customizable static blog built with Tailwind CSS, with support for comments and RSS feeds.

## Features

- 📝 Write posts in Markdown
- 💬 Comments via Utterances (GitHub Issues)
- 📡 RSS feed generation
- 🎨 Tailwind CSS for styling
- ⚡ Fast static site generation
- 🔧 Fully customizable

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your blog:**
   - Edit `build.js` and update:
     - `SITE_URL`: Your GitHub Pages URL (e.g., `https://username.github.io/repo-name`)
     - `SITE_TITLE`: Your blog title
     - `SITE_DESCRIPTION`: Your blog description

3. **Enable comments:**
   - Go to https://utteranc.es/
   - Follow instructions to install the Utterances app on your repository
   - In `build.js`, find the comments section and update:
     - `repo="YOUR_USERNAME/YOUR_REPO"` with your actual repository

## Usage

### Writing Posts

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter at the top:
   ```markdown
   ---
   title: Your Post Title
   date: 2024-10-31
   description: A brief description
   ---

   Your content here...
   ```

3. Build the site:
   ```bash
   npm run build
   npm run tailwind
   ```

### Local Development

Preview your site locally:
```bash
npm run build
npm run tailwind
npm run dev
```

Then visit `http://localhost:8000`

## Deployment to GitHub Pages

1. **Create a new repository on GitHub**
   - Name it whatever you want (e.g., `blog`)
   - Initialize it as public

2. **Update your configuration:**
   - In `build.js`, set `SITE_URL` to your GitHub Pages URL
   - In `build.js`, update the utterances `repo` field

3. **Build your site:**
   ```bash
   npm run build
   npm run tailwind
   ```

4. **Set up GitHub Pages:**
   - Commit all your code (including the `dist/` folder)
   - Push to GitHub
   - Go to Settings → Pages
   - Set source to "Deploy from a branch"
   - Select branch: `main`, folder: `/dist`
   - Save

5. **Push updates:**
   ```bash
   git add .
   git commit -m "Update blog"
   git push
   ```

   Your site will be live at `https://username.github.io/repo-name/`

## Project Structure

```
.
├── posts/          # Your markdown blog posts
├── src/            # Source files
│   └── styles.css  # Tailwind CSS source
├── dist/           # Generated site (committed to git)
├── build.js        # Build script
└── package.json    # Dependencies
```

## Customization

### Styling

Edit `src/styles.css` to customize the design. The site uses Tailwind CSS, so you can use any Tailwind utility classes.

After making changes, rebuild:
```bash
npm run tailwind
```

### Layout

Edit `build.js` to modify:
- HTML templates
- Page structure
- Navigation
- Footer

### Comments

The blog uses Utterances by default, which stores comments as GitHub Issues. To switch to a different commenting system:

1. Remove the Utterances script in `build.js` (search for "utteranc.es")
2. Add your preferred system (e.g., Giscus, Disqus)

## License

MIT
