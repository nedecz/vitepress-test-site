import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import type { Theme } from 'vitepress'
import mermaid from 'mermaid'
import './custom.css'

function initMermaidZoom() {
  const diagrams = document.querySelectorAll<SVGSVGElement>('.mermaid svg')
  for (const svg of diagrams) {
    if (svg.dataset.zoomInit) continue
    svg.dataset.zoomInit = '1'

    // Ensure viewBox is set from current dimensions
    if (!svg.getAttribute('viewBox')) {
      const { width, height } = svg.getBoundingClientRect()
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    }

    const getVB = () => {
      const vb = svg.getAttribute('viewBox')!.split(' ').map(Number)
      return { x: vb[0], y: vb[1], w: vb[2], h: vb[3] }
    }
    const setVB = (x: number, y: number, w: number, h: number) =>
      svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)

    const originalVB = svg.getAttribute('viewBox')!

    // Zoom on wheel
    svg.addEventListener('wheel', (e) => {
      e.preventDefault()
      const { x, y, w, h } = getVB()
      const factor = e.deltaY > 0 ? 1.1 : 0.9
      const rect = svg.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width) * w + x
      const my = ((e.clientY - rect.top) / rect.height) * h + y
      const nw = w * factor
      const nh = h * factor
      setVB(mx - (mx - x) * factor, my - (my - y) * factor, nw, nh)
    }, { passive: false })

    // Pan on drag
    let dragging = false
    let dragStart = { x: 0, y: 0 }
    let vbStart = { x: 0, y: 0, w: 0, h: 0 }

    svg.addEventListener('mousedown', (e) => {
      dragging = true
      dragStart = { x: e.clientX, y: e.clientY }
      vbStart = getVB()
      svg.style.cursor = 'grabbing'
    })

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return
      const rect = svg.getBoundingClientRect()
      const dx = ((e.clientX - dragStart.x) / rect.width) * vbStart.w
      const dy = ((e.clientY - dragStart.y) / rect.height) * vbStart.h
      setVB(vbStart.x - dx, vbStart.y - dy, vbStart.w, vbStart.h)
    })

    window.addEventListener('mouseup', () => {
      if (!dragging) return
      dragging = false
      svg.style.cursor = 'grab'
    })

    // Double-click to reset
    svg.addEventListener('dblclick', () => {
      svg.setAttribute('viewBox', originalVB)
    })

    svg.style.cursor = 'grab'
  }
}

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

  initMermaidZoom()
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
