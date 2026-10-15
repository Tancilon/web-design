import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"

import { Arrow } from "@/components/primitives/icons/arrow"
import { ProjectGallery } from "@/components/primitives/zoomable-project-image"
import { getPortfolioProject, portfolioProjects } from "@/lib/portfolio"

interface PortfolioPageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = () =>
  portfolioProjects.map(({ slug }) => ({ slug }))

export const generateMetadata = async ({
  params
}: PortfolioPageProps): Promise<Metadata> => {
  const { slug } = await params
  const project = getPortfolioProject(slug)

  if (!project) return {}

  return {
    title: {
      absolute: `${project.title} | 江含个人作品集`
    },
    description: `${project.title}个人作品展示，共 ${project.images.length} 张完整设计稿。`,
    alternates: {
      canonical: `/portfolio/${project.slug}`
    }
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params
  const project = getPortfolioProject(slug)

  if (!project) notFound()

  const total = String(project.images.length).padStart(2, "0")
  const backHref = project.showOnHome ? "/#featured-work" : "/blog"
  const backLabel = project.showOnHome ? "返回主要作品" : "返回所有项目"

  return (
    <article className="grid-layout pb-8 pt-10 lg:pb-20 lg:pt-16">
      <header className="col-span-full grid grid-cols-4 gap-x-3 border-b border-brand-w1/30 pb-6 lg:grid-cols-12 lg:pb-10">
        <NextLink
          href={backHref}
          className="actionable col-span-2 w-max self-start text-f-h4-mobile text-brand-w1 lg:col-span-3 lg:text-f-h4"
        >
          <Arrow className="mr-2 size-4 rotate-180 lg:size-5" />
          {backLabel}
        </NextLink>
        <div className="col-span-2 text-right text-f-h4-mobile text-brand-w2 lg:col-span-2 lg:col-start-11 lg:text-f-h4">
          作品 {project.index} / {total} 张图片
        </div>
        <h1 className="col-span-full mt-12 max-w-[14ch] text-f-h1-mobile text-brand-w1 lg:col-span-10 lg:mt-20 lg:text-f-h1">
          {project.title}
        </h1>
      </header>

      <div className="col-span-full mt-4 flex flex-col gap-4 lg:mt-6 lg:gap-6">
        <ProjectGallery
          key={project.slug}
          images={project.images}
          title={project.title}
        />
      </div>
    </article>
  )
}
