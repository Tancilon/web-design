import { normalizeHref } from "@/utils/seo"

import { getImageUrl } from "./helpers"
import type { PortableTextBlock, SanityImage } from "./types"

interface MarkDef {
  _key: string
  _type: string
  href?: string
}

interface Span {
  _type: "span"
  text?: string
  marks?: string[]
}

interface TextBlock {
  _type: "block"
  style?: string
  listItem?: "bullet" | "number"
  level?: number
  children?: Span[]
  markDefs?: MarkDef[]
}

interface QuoteValue {
  quote?: PortableTextBlock[]
}

// Marks that are inline decorators rather than references into `markDefs`.
const DECORATORS = new Set([
  "strong",
  "em",
  "code",
  "underline",
  "strike-through"
])

interface Options {
  /** Used to absolutize root-relative link hrefs. */
  baseUrl?: string
}

/**
 * Converts the Portable Text blocks used by the remaining site content into
 * plain Markdown.
 */
export function portableTextToMarkdown(
  blocks: PortableTextBlock[] | null | undefined,
  opts?: Options
): string {
  if (!blocks?.length) return ""

  const pieces: Array<{ isListItem: boolean; md: string }> = []
  for (const block of blocks) {
    const md = renderBlock(block, opts?.baseUrl)
    if (md == null) continue
    const isListItem =
      block._type === "block" && Boolean((block as TextBlock).listItem)
    pieces.push({ isListItem, md })
  }

  return pieces.reduce((acc, piece, i) => {
    if (i === 0) return piece.md
    const prev = pieces[i - 1]
    // Keep consecutive list items tight; separate everything else by a blank line.
    const sep = prev?.isListItem && piece.isListItem ? "\n" : "\n\n"
    return acc + sep + piece.md
  }, "")
}

function renderBlock(
  block: PortableTextBlock,
  baseUrl: string | undefined
): string | null {
  switch (block._type) {
    case "block":
      return renderTextBlock(block as unknown as TextBlock, baseUrl)
    case "image":
      return renderImage(block as unknown as SanityImage & { caption?: string })
    case "quote":
      return renderQuote(block as unknown as QuoteValue, baseUrl)
    default:
      return null
  }
}

function renderTextBlock(
  block: TextBlock,
  baseUrl: string | undefined
): string | null {
  const markDefs = block.markDefs ?? []
  const text = (block.children ?? [])
    .map((child) => serializeSpan(child, markDefs, baseUrl))
    .join("")

  if (!text.trim()) return null

  if (block.listItem) {
    const indent = "  ".repeat(Math.max(0, (block.level ?? 1) - 1))
    const marker = block.listItem === "number" ? "1." : "-"
    return `${indent}${marker} ${text}`
  }

  switch (block.style) {
    case "h1":
      return `# ${text}`
    case "h2":
      return `## ${text}`
    case "h3":
      return `### ${text}`
    case "h4":
      return `#### ${text}`
    case "blockquote":
      return blockquote(text)
    default:
      return text
  }
}

function serializeSpan(
  span: Span,
  markDefs: MarkDef[],
  baseUrl: string | undefined
): string {
  if (span._type !== "span") return ""
  let text = span.text ?? ""
  const marks = span.marks ?? []

  // Inline code suppresses other formatting inside it, so apply it first.
  if (marks.includes("code")) text = `\`${text}\``
  if (marks.includes("strong")) text = `**${text}**`
  if (marks.includes("em")) text = `*${text}*`

  const linkKey = marks.find((mark) => !DECORATORS.has(mark))
  if (linkKey) {
    const def = markDefs.find((d) => d._key === linkKey)
    if (def?.href) text = `[${text}](${absolutize(def.href, baseUrl)})`
  }

  return text
}

function renderImage(block: SanityImage & { caption?: string }): string | null {
  const img = getImageUrl(block)
  if (!img) return null
  const alt = img.alt || block.caption || "Image"
  let md = `![${alt}](${img.src})`
  if (block.caption) md += `\n\n_${block.caption}_`
  return md
}

function renderQuote(
  block: QuoteValue,
  baseUrl: string | undefined
): string | null {
  const quoteMd = portableTextToMarkdown(block.quote, { baseUrl })
  return quoteMd ? blockquote(quoteMd) : null
}

function blockquote(text: string): string {
  return text
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n")
}

function absolutize(href: string, baseUrl: string | undefined): string {
  const normalized = normalizeHref(href)
  if (!baseUrl) return normalized
  if (normalized.startsWith("/")) return `${baseUrl}${normalized}`
  return normalized
}
