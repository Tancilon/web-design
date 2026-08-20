import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

import { fetchShowcaseListForMarkdown } from "@/app/(site)/(canvas)/(content)/showcase/sanity"
import { SITE_URL } from "@/lib/constants"
import { truncateDescription } from "@/utils/seo"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

// CMS strings land inside `[label](url)` syntax — escape the delimiters so a
// bracketed label can't break the link.
const escapeLinkLabel = (text: string) => text.replace(/[\\[\]]/g, "\\$&")

export async function GET() {
  try {
    const projects = await fetchShowcaseListForMarkdown()

    const list = projects
      .map((project) => {
        const clientYear = [project.client, project.year]
          .filter(Boolean)
          .join(", ")
        const categories = project.categories?.length
          ? `(${project.categories.join(", ")})`
          : null
        const meta = [clientYear || null, categories].filter(Boolean).join(" ")
        const detail = [
          meta || null,
          truncateDescription(project.description) || null
        ]
          .filter(Boolean)
          .join(" — ")
        const link = `[${escapeLinkLabel(project.title)}](${SITE_URL}/showcase/${project.slug}.md)`
        return detail ? `- ${link} — ${detail}` : `- ${link}`
      })
      .join("\n")

    const parts: Array<string | null> = [
      "# Showcase",
      "",
      "Selected projects by basement.studio.",
      list ? "" : null,
      list || null,
      "",
      "---",
      "",
      `[View all content](${SITE_URL}/sitemap.md)`
    ]

    const markdown = parts.filter((part) => part !== null).join("\n")

    return new NextResponse(markdown, {
      headers: {
        ...MD_HEADERS,
        Link: `<${SITE_URL}/showcase>; rel="canonical"`
      }
    })
  } catch (error) {
    console.error("Error building showcase markdown:", error)
    Sentry.captureException(error)
    return new NextResponse("# 500 Error\n\nFailed to build markdown.", {
      status: 500,
      headers: MD_HEADERS
    })
  }
}
