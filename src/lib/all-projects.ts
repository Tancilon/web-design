import type { StaticImageData } from "next/image"

import {
  featuredPortfolioProjects,
  type PortfolioProject,
  portfolioProjects
} from "./portfolio"
import { projectCategories, type ProjectCategorySlug } from "./project-taxonomy"

export interface AllProject {
  id: string
  type: "main" | "beyond"
  title: string
  description: string
  category: ProjectCategorySlug
  tags: string[]
  date: string
  displayDate: string
  image: StaticImageData
  href: string
}

const toMainProject = (project: PortfolioProject): AllProject => ({
  id: `main-${project.index}`,
  type: "main",
  title: project.title,
  description: project.description,
  category: project.category,
  tags: project.tags,
  date: project.date,
  displayDate: project.displayDate ?? project.date.replaceAll("-", "."),
  image: project.coverImage ?? project.images[0],
  href: `/portfolio/${project.slug}`
})

const mainProjects = portfolioProjects
  .map(toMainProject)
  .sort((a, b) => b.date.localeCompare(a.date))

export const allProjects: AllProject[] = mainProjects

export const ALL_PROJECTS_COUNT = allProjects.length
export const allProjectCategories = projectCategories.filter((category) =>
  allProjects.some((project) => project.category === category.slug)
)
export const featuredProjects = featuredPortfolioProjects.map(toMainProject)

export const getProjectsByCategory = (category?: ProjectCategorySlug) =>
  category
    ? allProjects.filter((project) => project.category === category)
    : allProjects
