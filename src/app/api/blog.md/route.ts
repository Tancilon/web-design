import { NextResponse } from "next/server"

import { allProjects } from "@/lib/all-projects"
import { SITE_URL } from "@/lib/constants"
import { projectCategories } from "@/lib/project-taxonomy"

const MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff"
} as const

const escapeLinkLabel = (text: string) => text.replace(/[\\[\]]/g, "\\$&")

export function GET() {
  const filters = projectCategories
    .map((category) => `[${category.title}](${SITE_URL}/blog/${category.slug})`)
    .join("、")
  const list = allProjects
    .map((project) => {
      const link = `[${escapeLinkLabel(project.title)}](${SITE_URL}${project.href})`
      return `- ${link} — ${project.displayDate} — ${project.tags.join("、")} — ${project.description}`
    })
    .join("\n")

  const markdown = [
    "# 所有项目",
    "",
    `江含的个人作品总览，共 ${allProjects.length} 件作品。`,
    "",
    `**标签：** ${filters}`,
    "",
    "## 作品列表",
    "",
    list,
    "",
    "---",
    "",
    `[查看全部内容](${SITE_URL}/sitemap.md)`
  ].join("\n")

  return new NextResponse(markdown, {
    headers: {
      ...MD_HEADERS,
      Link: `<${SITE_URL}/blog>; rel="canonical"`
    }
  })
}
