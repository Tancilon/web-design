import type { Metadata } from "next"

import { Contact } from "@/components/layout/contact"
import { PORTFOLIO_CAPABILITIES } from "@/lib/portfolio-capabilities"
import { PageJsonLd } from "@/lib/structured-data/page-json-ld"
import { generateWebSiteSchema } from "@/lib/structured-data/schemas/organization"
import { generateProfessionalServiceSchema } from "@/lib/structured-data/schemas/professional-service-entity"
import { fetchOrganizationData } from "@/service/sanity/organization"

import { Brands } from "./brands"
import { SkillsSection } from "./capabilities"
import { FeaturedProjects } from "./featured-projects"
import { Intro } from "./intro"
import { fetchHomepage } from "./sanity"

export const metadata: Metadata = {
  title: {
    absolute: "basement.studio | We make cool shit that performs."
  },
  alternates: {
    canonical: "https://basement.studio"
  }
}

const Homepage = async () => {
  const [data, orgData] = await Promise.all([
    fetchHomepage(),
    fetchOrganizationData()
  ])

  const serviceTitles = PORTFOLIO_CAPABILITIES.map(
    (capability) => capability.title
  )

  return (
    <div className="flex flex-col gap-18 lg:gap-32">
      <PageJsonLd
        nodes={[
          generateWebSiteSchema(),
          generateProfessionalServiceSchema({
            services: serviceTitles,
            email: orgData.email
          })
        ]}
      />
      <Intro />
      <Brands data={data} />
      <FeaturedProjects />
      <SkillsSection />
      <Contact />
    </div>
  )
}

export default Homepage
