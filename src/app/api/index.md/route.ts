import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

import { fetchHomepage } from "@/app/(site)/(canvas)/(content)/(home)/sanity"
import { ALL_PROJECTS_COUNT } from "@/lib/all-projects"
import { COMPANY_FACTS, formatFactList } from "@/lib/company-facts"
import { SITE_URL } from "@/lib/constants"
import { HOME_INTRO_SUBTITLE, HOME_INTRO_TITLE } from "@/lib/home-intro"
import { featuredPortfolioProjects } from "@/lib/portfolio"
import {
  PORTFOLIO_CAPABILITIES,
  PORTFOLIO_CAPABILITIES_INTRO_LINES,
  PORTFOLIO_CAPABILITIES_SECTION_TITLE
} from "@/lib/portfolio-capabilities"
import { PORTFOLIO_CONTACT } from "@/lib/portfolio-contact"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

export async function GET() {
  try {
    const { homepage } = await fetchHomepage({ published: true })
    if (!homepage) {
      return new NextResponse("# 404 Not Found\n", {
        status: 404,
        headers: MD_HEADERS
      })
    }

    const featuredWork = featuredPortfolioProjects
      .map(
        (project) =>
          `- [${project.title}](${SITE_URL}/portfolio/${project.slug}) — ${project.images.length} 张图片`
      )
      .join("\n")

    const capabilities = PORTFOLIO_CAPABILITIES.map((capability) =>
      [
        `### ${capability.title}`,
        "",
        capability.description,
        "",
        `标签：${capability.tags.map((tag) => `\`${tag}\``).join(" / ")}`
      ].join("\n")
    ).join("\n\n")

    const clients = homepage.clients?.length
      ? homepage.clients
          .map((c) => (c.website ? `[${c.title}](${c.website})` : c.title))
          .join(", ")
      : null

    const capabilitiesIntro = PORTFOLIO_CAPABILITIES_INTRO_LINES.join("\n")
    const hasBody = Boolean(featuredWork || capabilities || clients)

    const parts: Array<string | null> = [
      "# basement.studio",
      "",
      HOME_INTRO_TITLE,
      "",
      HOME_INTRO_SUBTITLE,
      "",
      hasBody ? "---" : null,
      hasBody ? "" : null,
      featuredWork ? "## 主要作品" : null,
      featuredWork ? "" : null,
      featuredWork,
      featuredWork ? "" : null,
      capabilities ? `## ${PORTFOLIO_CAPABILITIES_SECTION_TITLE}` : null,
      capabilities ? "" : null,
      capabilitiesIntro,
      capabilities ? "" : null,
      capabilities,
      capabilities ? "" : null,
      clients ? "## Clients" : null,
      clients ? "" : null,
      clients,
      "",
      // Entity block mirroring the homepage's crawlable about section.
      "## About basement.studio",
      "",
      COMPANY_FACTS.description,
      "",
      `Founded in ${COMPANY_FACTS.foundingDate} and based in ${COMPANY_FACTS.locationName}, the studio works primarily with technology companies in the San Francisco Bay Area and has partnered with startups and enterprise brands including ${formatFactList(COMPANY_FACTS.notableClients)}.`,
      "",
      COMPANY_FACTS.awardsSummary,
      "",
      COMPANY_FACTS.geistAttribution,
      "",
      "## Contact",
      "",
      `- Name: ${PORTFOLIO_CONTACT.name} (${PORTFOLIO_CONTACT.englishName})`,
      `- Role: ${PORTFOLIO_CONTACT.role}`,
      `- Location: ${PORTFOLIO_CONTACT.location}`,
      `- Phone: ${PORTFOLIO_CONTACT.phone}`,
      `- Email: ${PORTFOLIO_CONTACT.email}`,
      `- [Contact page](${SITE_URL}/contact.md)`,
      "",
      "## More",
      "",
      `- [个人荣誉](${SITE_URL}/services.md)`,
      `- [Showcase](${SITE_URL}/showcase.md)`,
      `- [所有项目（${ALL_PROJECTS_COUNT}）](${SITE_URL}/blog.md)`,
      `- [FAQ](${SITE_URL}/faq.md)`,
      "",
      "---",
      "",
      `[View all content](${SITE_URL}/sitemap.md)`
    ]

    const markdown = parts.filter((part) => part !== null).join("\n")

    return new NextResponse(markdown, {
      headers: { ...MD_HEADERS, Link: `<${SITE_URL}>; rel="canonical"` }
    })
  } catch (error) {
    console.error("Error building homepage markdown:", error)
    Sentry.captureException(error)
    return new NextResponse("# 500 Error\n\nFailed to build markdown.", {
      status: 500,
      headers: MD_HEADERS
    })
  }
}
