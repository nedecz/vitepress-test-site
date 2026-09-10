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

## Single-file HTML export

```bash
npm run docs:single-html-attempt
```

This builds one combined Markdown page, renders it through VitePress with `vite-plugin-singlefile`, writes a single-page export to `vitepress-single/index.html`, and copies the downloadable artifact to `dist/vitepress-single.html`.
The output is intended as an experimental offline export of the site content.

```
vitepress-single/
  index.html
```

You can open `index.html` directly in a browser without a local server.

That copied `dist/vitepress-single.html` file is also uploaded as the downloadable artifact (`vitepress-single-html`) on every CI run.

## Deploy to GitHub Pages

1. In GitHub, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger `.github/workflows/deploy.yml`.

Site URL:

`https://nedecz.github.io/vitepress-test-site/`
