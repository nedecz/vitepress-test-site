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
