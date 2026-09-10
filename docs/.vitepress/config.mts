import { defineConfig } from 'vitepress'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { withMermaid } from 'vitepress-plugin-mermaid'

const singleFileBuild = process.env.VITEPRESS_SINGLE_FILE === 'true'

export default withMermaid(
  defineConfig({
  title: 'My VitePress Site',
  description: 'Markdown + SVG + Mermaid',
  base: singleFileBuild ? './' : '/vitepress-test-site/',
  cleanUrls: true,
  vite: {
    plugins: singleFileBuild
      ? [
          viteSingleFile({
            useRecommendedBuildConfig: false,
            removeViteModuleLoader: true,
            deleteInlinedFiles: false
          })
        ]
      : []
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/mermaid-and-svg' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Markdown Tips', link: '/guide/markdown' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Mermaid + SVG', link: '/examples/mermaid-and-svg' },
          { text: 'Markdown Showcase', link: '/examples/markdown-showcase' },
          { text: 'Progress Bars', link: '/examples/progress-bars' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/nedecz/vitepress-test-site' }]
  },

  markdown: {
    lineNumbers: true,
    config(md) {
      const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules)
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() !== 'progress') {
          return defaultFence(tokens, idx, options, env, self)
        }

        const lines = token.content
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0)

        const rows = lines.map(line => {
          const parts = line.split('|').map(p => p.trim())
          const label = parts[0] ?? ''
          const a = parseFloat(parts[1] ?? '0')
          const b = parseFloat(parts[2] ?? '100')
          const pct = Math.min(100, Math.max(0, (a / b) * 100))
          const diff = a - b
          const isDiff = parts.length === 3 && parts[2] !== undefined
          return { label, a, b, pct, diff, isDiff }
        })

        const bars = rows.map(({ label, a, b, pct, diff }) => {
          const diffSign = diff >= 0 ? '+' : ''
          const diffClass = diff > 0 ? 'progress-diff-pos' : diff < 0 ? 'progress-diff-neg' : 'progress-diff-zero'
          return `
<div class="progress-row">
  <div class="progress-label">${label}</div>
  <div class="progress-track">
    <div class="progress-fill" style="width:${pct.toFixed(2)}%"></div>
  </div>
  <div class="progress-meta">
    <span class="progress-value">${a} / ${b}</span>
    <span class="progress-pct">${pct.toFixed(1)}%</span>
    <span class="${diffClass}">${diffSign}${diff.toFixed(2)}</span>
  </div>
</div>`
        }).join('\n')

        return `<div class="progress-group">\n${bars}\n</div>\n`
      }
    }
  }
}),
  {
    mermaid: {}
  }
)
