import type { Metadata } from "next"

import { beyondDesignWorks } from "@/lib/beyond-design"
import { PageJsonLd } from "@/lib/structured-data/page-json-ld"
import { generateCollectionPageSchema } from "@/lib/structured-data/schemas/collection"

import { DesignGallery } from "./gallery"
import { Hero } from "./hero"

export const metadata: Metadata = {
  title: "设计之外",
  description: "江含的个人设计作品图库，收录插画、视觉设计与创意练习。",
  alternates: {
    canonical: "/showcase"
  }
}

const ShowcaseIndexPage = () => {
  const collectionSchema = generateCollectionPageSchema({
    path: "/showcase",
    name: "设计之外",
    description: "江含的个人设计作品图库。",
    items: beyondDesignWorks.map((work) => ({
      name: work.label,
      path: `/showcase#${work.id}`
    }))
  })

  return (
    <>
      <PageJsonLd nodes={[collectionSchema]} />
      <div id="list" className="-translate-y-[3.25rem]" />
      <div className="flex scroll-m-4 flex-col gap-9 lg:gap-16">
        <Hero />
        <DesignGallery works={beyondDesignWorks} />
      </div>
    </>
  )
}

export default ShowcaseIndexPage
