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

## Deploy to GitHub Pages

1. In GitHub, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger `.github/workflows/deploy.yml`.

Site URL:

`https://nedecz.github.io/vitepress-test-site/`
