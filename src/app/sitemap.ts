import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/constants"
import { portfolioProjects } from "@/lib/portfolio"
import { projectCategories } from "@/lib/project-taxonomy"

const staticRoutes: Array<{ href: string; priority: number }> = [
  { href: "/", priority: 1 },
  ...portfolioProjects.map(({ slug }) => ({
    href: `/portfolio/${slug}`,
    priority: 0.9
  })),
  { href: "/showcase", priority: 0.9 },
  { href: "/services", priority: 0.9 },
  { href: "/blog", priority: 0.8 },
  ...projectCategories.map(({ slug }) => ({
    href: `/blog/${slug}`,
    priority: 0.7
  })),
  { href: "/contact", priority: 0.7 },
  { href: "/faq", priority: 0.7 },
  { href: "/ai", priority: 0.5 },
  { href: "/basketball", priority: 0.3 },
  { href: "/doom", priority: 0.3 }
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: new URL(route.href, SITE_URL).toString(),
    changeFrequency: "weekly",
    priority: route.priority
  }))
}
