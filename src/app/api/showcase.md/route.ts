import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

import { beyondDesignWorks } from "@/lib/beyond-design"
import { SITE_URL } from "@/lib/constants"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

export async function GET() {
  try {
    const list = beyondDesignWorks.map((work) => `- ${work.label}`).join("\n")

    const parts: Array<string | null> = [
      "# 设计之外",
      "",
      `江含的个人设计作品图库，共 ${beyondDesignWorks.length} 件作品。`,
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
