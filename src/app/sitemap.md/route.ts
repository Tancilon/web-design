import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

import { fetchAllPostsForIndex } from "@/app/(site)/(plain)/(content)/post/[slug]/sanity"
import { SITE_URL } from "@/lib/constants"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

export async function GET() {
  try {
    const posts = await fetchAllPostsForIndex()

    const parts: string[] = ["# basement.studio — Content Index", ""]

    parts.push(
      "## Pages",
      "",
      `- [Home](${SITE_URL}/index.md)`,
      `- [Services](${SITE_URL}/services.md)`,
      `- [Showcase](${SITE_URL}/showcase.md)`,
      `- [Blog](${SITE_URL}/blog.md)`,
      `- [FAQ](${SITE_URL}/faq.md)`,
      `- [Contact](${SITE_URL}/contact.md)`,
      ""
    )

    if (posts.length > 0) {
      parts.push("## Blog Posts", "")
      for (const post of posts) {
        parts.push(`- [${post.title}](${SITE_URL}/post/${post.slug}.md)`)
      }
      parts.push("")
    }

    parts.push(
      "## Other Resources",
      "",
      `- [Machine view](${SITE_URL}/ai) — single-page plain-HTML index of the entire site`,
      `- [llms.txt](${SITE_URL}/llms.txt) — curated link map for LLMs`,
      `- [agents.md](${SITE_URL}/agents.md) — notes for AI agents and crawlers`,
      `- [XML sitemap](${SITE_URL}/sitemap.xml)`,
      `- [Basketball](${SITE_URL}/basketball) — interactive experience, HTML only`,
      `- [Doom](${SITE_URL}/doom) — interactive experience, HTML only`,
      ""
    )

    return new NextResponse(parts.join("\n"), {
      headers: MD_HEADERS
    })
  } catch (error) {
    console.error("Error building markdown sitemap:", error)
    Sentry.captureException(error)
    return new NextResponse("# 500 Error\n\nFailed to build content index.", {
      status: 500,
      headers: MD_HEADERS
    })
  }
}
