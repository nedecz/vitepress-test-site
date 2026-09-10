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

## About single HTML output

VitePress builds a multi-file static site (HTML + CSS + JS + assets) by design.
So for the full docs site, a single standalone HTML file is not supported.

## Deploy to GitHub Pages

1. In GitHub, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger `.github/workflows/deploy.yml`.

Site URL:

`https://nedecz.github.io/vitepress-test-site/`
