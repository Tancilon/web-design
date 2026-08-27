import type { StaticImageData } from "next/image"

import { beyondDesignWorks } from "./beyond-design"
import { portfolioProjects } from "./portfolio"
import type { ProjectCategorySlug } from "./project-taxonomy"

export interface AllProject {
  id: string
  type: "main" | "beyond"
  title: string
  description: string
  category: ProjectCategorySlug
  tags: string[]
  date: string
  image: StaticImageData
  href: string
}

export const allProjects: AllProject[] = [
  ...portfolioProjects.map(
    (project): AllProject => ({
      id: `main-${project.index}`,
      type: "main",
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      date: project.date,
      image: project.coverImage ?? project.images[0],
      href: `/portfolio/${project.slug}`
    })
  ),
  ...beyondDesignWorks.map(
    (work): AllProject => ({
      id: work.id,
      type: "beyond",
      title: work.label,
      description: work.description,
      category: work.category,
      tags: work.tags,
      date: work.date,
      image: work.image,
      href: `/showcase#${work.id}`
    })
  )
].sort((a, b) => b.date.localeCompare(a.date))

export const ALL_PROJECTS_COUNT = allProjects.length
export const featuredProject = allProjects[0]

export const getProjectsByCategory = (category?: ProjectCategorySlug) =>
  category
    ? allProjects.filter((project) => project.category === category)
    : allProjects
