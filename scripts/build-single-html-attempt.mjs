import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { buildSingleArtifact } from './build-single-artifact.mjs'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const tempRoot = '/tmp/vitepress-single-html'
const tempDocsRoot = path.join(tempRoot, 'docs')
const tempConfigRoot = path.join(tempDocsRoot, '.vitepress')
const tempPublicRoot = path.join(tempDocsRoot, 'public')
const outputRoot = path.join(repoRoot, 'vitepress-single')

function normalizeAssetPath(assetPath) {
  return assetPath.replace(/^\/+/, '')
}

async function readIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }
}

function rewriteSectionAnchors(content) {
  return content.replace(/<!-- SECTION: ([^\s]+) -->/g, '<!-- SECTION: $1 -->\n<div id="$1"></div>')
}

function rewriteDocLinks(content) {
  return content.replace(/\]\((\/[^)#?]+)(#[^)]+)?\)/g, (match, targetPath, hash = '') => {
    if (/\.[a-z0-9]+$/i.test(targetPath)) {
      return match
    }

    const slug = targetPath
      .replace(/^\/+/, '')
      .replace(/\/$/, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

    if (!slug) {
      return match
    }

    return `](#${slug}${hash})`
  })
}

async function inlinePublicSvgMarkdownImages(content) {
  const matches = [...content.matchAll(/!\[([^\]]*)\]\((\/[^)\s?#]+\.svg)(?:[?#][^)]+)?\)/g)]
  let result = content

  for (const match of matches) {
    const [fullMatch, , assetPath] = match
    const absolutePath = path.join(repoRoot, 'docs', 'public', normalizeAssetPath(assetPath))
    const svg = await readIfExists(absolutePath)
    if (svg) {
      result = result.replace(fullMatch, svg.trim())
    }
  }

  return result
}

async function prepareSinglePageMarkdown() {
  const artifactPath = await buildSingleArtifact()
  let content = await fs.readFile(artifactPath, 'utf8')
  content = rewriteSectionAnchors(content)
  content = rewriteDocLinks(content)
  content = await inlinePublicSvgMarkdownImages(content)
  return content
}

async function writeTempSite(markdownContent) {
  await fs.rm(tempRoot, { recursive: true, force: true })
  await fs.mkdir(tempConfigRoot, { recursive: true })

  await fs.cp(path.join(repoRoot, 'docs', '.vitepress'), tempConfigRoot, { recursive: true })
  await fs.cp(path.join(repoRoot, 'docs', 'public'), tempPublicRoot, { recursive: true, force: true })
  await fs.writeFile(path.join(tempDocsRoot, 'index.md'), markdownContent, 'utf8')
  await fs.symlink(path.join(repoRoot, 'node_modules'), path.join(tempRoot, 'node_modules'))
}

async function buildSingleHtmlSite() {
  const markdownContent = await prepareSinglePageMarkdown()
  await writeTempSite(markdownContent)

  await execFileAsync(
    path.join(repoRoot, 'node_modules', '.bin', 'vitepress'),
    ['build', tempDocsRoot],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        VITEPRESS_SINGLE_FILE: 'true'
      }
    }
  )

  await fs.rm(outputRoot, { recursive: true, force: true })
  await fs.cp(path.join(tempConfigRoot, 'dist'), outputRoot, { recursive: true })
}

await buildSingleHtmlSite()
console.log(`Wrote ${path.relative(repoRoot, outputRoot)}`)
