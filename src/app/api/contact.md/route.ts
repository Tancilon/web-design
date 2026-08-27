import { NextResponse } from "next/server"

import { SITE_URL } from "@/lib/constants"
import { PORTFOLIO_CONTACT } from "@/lib/portfolio-contact"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

export function GET() {
  const markdown = [
    `# 联系 ${PORTFOLIO_CONTACT.name}`,
    "",
    `${PORTFOLIO_CONTACT.name}（${PORTFOLIO_CONTACT.englishName}），${PORTFOLIO_CONTACT.role}。`,
    "",
    `- 所在地：${PORTFOLIO_CONTACT.location}`,
    `- 电话：[${PORTFOLIO_CONTACT.phone}](${PORTFOLIO_CONTACT.phoneHref})`,
    `- 邮箱：[${PORTFOLIO_CONTACT.email}](${PORTFOLIO_CONTACT.emailHref})`,
    "",
    `个人简历：[${SITE_URL}/ai](${SITE_URL}/ai)`,
    "",
    "---",
    "",
    `[查看全部内容](${SITE_URL}/sitemap.md)`
  ].join("\n")

  return new NextResponse(markdown, {
    headers: {
      ...MD_HEADERS,
      Link: `<${SITE_URL}/contact>; rel="canonical"`
    }
  })
}
