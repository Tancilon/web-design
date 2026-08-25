import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Contact } from "@/components/layout/contact"
import { PageJsonLd } from "@/lib/structured-data/page-json-ld"
import { generateServicesWebPageSchema } from "@/lib/structured-data/schemas/professional-service"
import { getImageUrl } from "@/service/sanity/helpers"

import { Awards } from "./awards"
import { Hero } from "./hero"
import { fetchAwards, fetchServicesPage } from "./sanity"
import { Services } from "./services"
import { VenturesBanner } from "./ventures"

export const metadata: Metadata = {
  title: "Services",
  description:
    "basement.studio's services — branding, web design, 3D experiences, and product engineering. Award-winning work, built to perform for clients worldwide.",
  alternates: {
    canonical: "https://basement.studio/services"
  }
}

export interface AwardDisplay {
  _id: string
  title: string
  date: string
  awardUrl: string | null
  projectName: string | null
  certificate: { url: string; alt: string | null } | null
  numericId: number
}

const ServicesPage = async () => {
  const [data, awards] = await Promise.all([fetchServicesPage(), fetchAwards()])

  if (!data) notFound()

  const displayAwards: AwardDisplay[] = awards.map((award, index) => {
    const cert = getImageUrl(award.certificate)
    return {
      _id: award._id,
      title: award.title,
      date: award.date,
      awardUrl: award.awardUrl,
      projectName: award.projectName,
      certificate: cert ? { url: cert.src, alt: cert.alt ?? null } : null,
      numericId: index + 1
    }
  })

  const servicesSchema = generateServicesWebPageSchema(data.serviceCategories)

  return (
    <div className="flex flex-col gap-18 lg:gap-44">
      <PageJsonLd nodes={[servicesSchema]} />
      <Hero data={data} className="lg:-mb-11" />
      <Services data={data} />
      <Awards data={displayAwards} />
      <VenturesBanner data={data} />
      <Contact />
    </div>
  )
}

export default ServicesPage
