import type { Metadata } from "next"

import { Contact } from "@/components/layout/contact"
import { SITE_URL } from "@/lib/constants"
import { PERSONAL_HONORS, PERSONAL_HONORS_INTRO } from "@/lib/personal-honors"
import { PageJsonLd } from "@/lib/structured-data/page-json-ld"
import { generatePersonalHonorsSchema } from "@/lib/structured-data/schemas/personal-honors"

import { Hero } from "./hero"
import { HonorArchive } from "./honor-archive"

export const metadata: Metadata = {
  title: "个人荣誉",
  description: PERSONAL_HONORS_INTRO,
  alternates: {
    canonical: `${SITE_URL}/services`
  }
}

const ServicesPage = () => {
  const honorsSchema = generatePersonalHonorsSchema(
    PERSONAL_HONORS,
    PERSONAL_HONORS_INTRO
  )

  return (
    <div className="flex flex-col gap-18 lg:gap-44">
      <PageJsonLd nodes={[honorsSchema]} />
      <Hero />
      <HonorArchive honors={PERSONAL_HONORS} />
      <Contact />
    </div>
  )
}

export default ServicesPage
