# vitepress-test-site

VitePress static site starter with Markdown, SVG, and Mermaid support.

## Development

```bash
npm install
npm run docs:dev
```

## Build static site

```bash
npm run docs:build
```

Output directory: `docs/.vitepress/dist/`

## Create one downloadable artifact

```bash
npm run docs:artifact
```

This creates `vitepress-site-artifact.tar.gz`, which you can download and extract to check locally.

## Build a combined Markdown artifact

```bash
npm run docs:master-artifact
```

This scans all `docs/**/*.md` files, strips frontmatter, prefixes inline SVG IDs and matching HTML anchors per source file, and writes the merged result to `dist/master-combined.md`.

## Single-file per-page HTML export

```bash
npm run docs:single-html-attempt
```

This enables `vite-plugin-singlefile` during build and exports all pages to `vitepress-single/`.
Each `.html` file has its CSS and JS fully inlined — no separate asset files are needed.

```
vitepress-single/
  index.html
  guide/
    getting-started/index.html
    markdown/index.html
  examples/
    mermaid-and-svg/index.html
    markdown-showcase/index.html
```

You can open any page directly in a browser without a local server.
Inter-page navigation works when pages are opened from the same folder.

This folder is also uploaded as a downloadable artifact (`vitepress-single-html`) on every CI run.

## Deploy to GitHub Pages

1. In GitHub, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger `.github/workflows/deploy.yml`.

Site URL:

`https://nedecz.github.io/vitepress-test-site/`
