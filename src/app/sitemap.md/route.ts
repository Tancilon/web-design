import { NextResponse } from "next/server"

import { allProjects } from "@/lib/all-projects"
import { SITE_URL } from "@/lib/constants"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

export function GET() {
  const projectList = allProjects.map(
    (project) => `- [${project.title}](${SITE_URL}${project.href})`
  )

  const parts = [
    "# FeiFei的个人作品集 — 内容索引",
    "",
    "## 页面",
    "",
    `- [首页](${SITE_URL}/index.md)`,
    `- [个人荣誉](${SITE_URL}/services.md)`,
    `- [设计之外](${SITE_URL}/showcase.md)`,
    `- [所有项目](${SITE_URL}/blog.md)`,
    `- [联系方式](${SITE_URL}/contact.md)`,
    "",
    "## 所有项目",
    "",
    ...projectList,
    "",
    "## 其他资源",
    "",
    `- [个人简历](${SITE_URL}/ai)`,
    `- [llms.txt](${SITE_URL}/llms.txt)`,
    `- [agents.md](${SITE_URL}/agents.md)`,
    `- [XML sitemap](${SITE_URL}/sitemap.xml)`,
    `- [篮球互动](${SITE_URL}/basketball)`,
    `- [Doom 互动](${SITE_URL}/doom)`,
    ""
  ]

  return new NextResponse(parts.join("\n"), { headers: MD_HEADERS })
}
