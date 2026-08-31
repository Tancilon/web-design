import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Categories } from "@/components/blog/categories"
import { ProjectList } from "@/components/blog/list"
import {
  ALL_PROJECTS_COUNT,
  featuredProject,
  getProjectsByCategory
} from "@/lib/all-projects"
import { getProjectCategory, projectCategories } from "@/lib/project-taxonomy"
import { PageJsonLd } from "@/lib/structured-data/page-json-ld"
import { generateCollectionPageSchema } from "@/lib/structured-data/schemas/collection"

import { Featured } from "../featured"
import { Hero } from "../hero"

type Params = Promise<{ slug?: string[] }>

export const generateMetadata = async ({
  params
}: {
  params: Params
}): Promise<Metadata> => {
  const { slug } = await params
  const category = slug?.[0] ? getProjectCategory(slug[0]) : undefined

  if (slug?.length && (!category || slug.length > 1)) {
    return { robots: { index: false } }
  }

  return {
    title: category ? `${category.title}项目` : "所有项目",
    description: category
      ? `浏览江含的${category.title}作品。`
      : `浏览江含的 ${ALL_PROJECTS_COUNT} 件个人设计作品，涵盖 UI/UX、活动视觉、产品设计与插画。`,
    alternates: {
      canonical: category ? `/blog/${category.slug}` : "/blog"
    }
  }
}

export default async function AllProjectsPage({ params }: { params: Params }) {
  const { slug } = await params
  const categorySlug = slug?.[0]
  const category = categorySlug ? getProjectCategory(categorySlug) : undefined

  if ((categorySlug && !category) || (slug?.length ?? 0) > 1) notFound()

  const projects = getProjectsByCategory(category?.slug)
  const isIndex = !category
  const listedProjects = isIndex ? projects.slice(1) : projects
  const collectionSchema = generateCollectionPageSchema({
    path: category ? `/blog/${category.slug}` : "/blog",
    name: category ? `${category.title}项目` : "所有项目",
    description: category
      ? `江含的${category.title}作品。`
      : "江含的个人作品总览。",
    items: projects.map((project) => ({
      name: project.title,
      path: project.href
    }))
  })

  return (
    <>
      <PageJsonLd nodes={[collectionSchema]} />
      <Hero count={projects.length} />
      {isIndex && featuredProject ? (
        <Featured project={featuredProject} />
      ) : null}
      <section className="grid-layout pb-[35px] lg:pt-12" id="projects-list">
        <div className="col-span-full -mb-3 grid grid-cols-12 border-brand-w1/20 lg:border-b lg:pb-2">
          <h2 className="col-span-full mt-auto text-f-h3-mobile text-brand-g1 lg:col-span-3 lg:col-start-5 lg:text-f-h3">
            描述
          </h2>
          <Categories activeCategory={category?.slug} />
        </div>
        <ProjectList projects={listedProjects} />
      </section>
    </>
  )
}

export const generateStaticParams = () => [
  { slug: [] },
  ...projectCategories.map((category) => ({ slug: [category.slug] }))
]
