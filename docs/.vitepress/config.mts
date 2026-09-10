import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
  title: 'My VitePress Site',
  description: 'Markdown + SVG + Mermaid',
  base: '/vitepress-test-site/',
  cleanUrls: true,

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
          { text: 'Markdown Showcase', link: '/examples/markdown-showcase' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/nedecz/vitepress-test-site' }]
  },

  markdown: {
    lineNumbers: true
  }
}),
  {
    mermaid: {}
  }
)
