import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import type { Theme } from 'vitepress'
import mermaid from 'mermaid'
import './custom.css'

async function renderMermaidDiagrams() {
  if (!inBrowser) return

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'default'
  })

  const nodes = document.querySelectorAll<HTMLElement>('.language-mermaid code')
  if (!nodes.length) return

  for (const codeEl of nodes) {
    const pre = codeEl.closest('pre')
    if (!pre) continue

    const source = codeEl.textContent ?? ''
    const div = document.createElement('div')
    div.className = 'mermaid'
    div.textContent = source
    pre.replaceWith(div)
  }

  await mermaid.run({
    querySelector: '.mermaid'
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp() {
    // no-op
  },
  setup() {
    if (!inBrowser) return

    queueMicrotask(() => {
      renderMermaidDiagrams().catch((err) => {
        console.error('Mermaid render error:', err)
      })
    })

    document.addEventListener('vp:contentLoaded', () => {
      renderMermaidDiagrams().catch((err) => {
        console.error('Mermaid render error:', err)
      })
    })
  }
} satisfies Theme
