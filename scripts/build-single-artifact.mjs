import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { glob } from 'glob'
import { optimize } from 'svgo'

const repoRoot = process.cwd()
const outputFile = path.join(repoRoot, 'dist', 'master-combined.md')
const defaultPatterns = ['docs/**/*.md']

function stripFrontmatter(rawContent) {
  const parsed = matter(rawContent)
  return parsed.content.trim()
}

function slugifyFile(filePath) {
  return filePath
    .replace(/\\/g, '/')
    .replace(/^docs\//, '')
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function prefixValue(slug, value) {
  return value.startsWith(`${slug}-`) ? value : `${slug}-${value}`
}

function prefixSvgIds(svgContent, slug, filePath) {
  const optimized = optimize(svgContent, {
    path: filePath,
    plugins: [
      {
        name: 'prefixIds',
        params: {
          delim: '-',
          prefix: slug
        }
      }
    ]
  })

  if ('data' in optimized) {
    return optimized.data
  }

  throw new Error(`Unable to optimize SVG content in ${filePath}`)
}

function namespaceHtmlIdsAndAnchors(content, slug) {
  return content
    .replace(/<h([1-6])\b([^>]*?\sid=)(['"])([^'"]+)\3([^>]*)>/g, (match, level, before, quote, id, after) => {
      return `<h${level}${before}${quote}${prefixValue(slug, id)}${quote}${after}>`
    })
    .replace(/<a\b([^>]*?\shref=)(['"])#([^'"]+)\2([^>]*)>/g, (match, before, quote, target, after) => {
      return `<a${before}${quote}#${prefixValue(slug, target)}${quote}${after}>`
    })
}

function processMarkdownSegment(segment, slug, filePath) {
  const withPrefixedSvg = segment.replace(/<svg\b[\s\S]*?<\/svg>/g, (svgBlock) => {
    return prefixSvgIds(svgBlock, slug, filePath)
  })

  return namespaceHtmlIdsAndAnchors(withPrefixedSvg, slug)
}

function namespaceContent(content, slug, filePath) {
  const parts = content.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
  return parts
    .map((part, index) => (index % 2 === 0 ? processMarkdownSegment(part, slug, filePath) : part))
    .join('')
}

export async function buildSingleArtifact(patterns = defaultPatterns) {
  const matches = await glob(patterns, {
    cwd: repoRoot,
    nodir: true
  })

  const files = [...new Set(matches)].sort((a, b) => a.localeCompare(b))
  const sections = []

  for (const file of files) {
    const absolutePath = path.join(repoRoot, file)
    const rawContent = await fs.readFile(absolutePath, 'utf8')
    const slug = slugifyFile(file)
    const stripped = stripFrontmatter(rawContent)
    const namespaced = namespaceContent(stripped, slug, file)

    sections.push(`<!-- SECTION: ${slug} -->\n\n${namespaced}`)
  }

  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(outputFile, `${sections.join('\n\n')}\n`, 'utf8')

  return outputFile
}

const artifactPath = await buildSingleArtifact()
console.log(`Wrote ${path.relative(repoRoot, artifactPath)}`)
