import { NextResponse } from "next/server"

import { SITE_URL } from "@/lib/constants"
import { PERSONAL_HONORS, PERSONAL_HONORS_INTRO } from "@/lib/personal-honors"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

export async function GET() {
  const honors = PERSONAL_HONORS.map((honor) => {
    const details = honor.details
      .map((detail) => `- ${detail.label}：${detail.value}`)
      .join("\n")

    return [
      `### ${honor.index} ${honor.title}`,
      "",
      `![${honor.title}证书](${SITE_URL}${honor.image.src})`,
      "",
      `- 奖项：${honor.award}`,
      `- 级别：${honor.level}`,
      `- 日期：${honor.date}`,
      `- 类别：${honor.category}`,
      details,
      "",
      honor.description
    ].join("\n")
  }).join("\n\n")

  const markdown = [
    "# 个人荣誉",
    "",
    PERSONAL_HONORS_INTRO,
    "",
    `## 荣誉档案（${PERSONAL_HONORS.length}）`,
    "",
    honors,
    "",
    "---",
    "",
    `[返回网站](${SITE_URL}/services)`,
    `[查看全部内容](${SITE_URL}/sitemap.md)`
  ].join("\n")

  return new NextResponse(markdown, {
    headers: {
      ...MD_HEADERS,
      Link: `<${SITE_URL}/services>; rel="canonical"`
    }
  })
}
