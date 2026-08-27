import { COMPANY_FACTS } from "@/lib/company-facts"
import { sanityFetch } from "@/service/sanity"

/**
 * Data feeding the schema.org Organization node rendered on every page (see
 * `src/lib/structured-data/page-json-ld.tsx`). Stable identity facts come from
 * `COMPANY_FACTS`; awards come from Sanity so they stay in sync with what the
 * site publishes. Legacy company social/contact data is intentionally omitted
 * from the personalized portfolio output.
 */
export interface OrganizationStructuredData {
  description: string | null
  foundingDate: string | number | null
  email: string | null
  contactPoints: Array<{ email: string; contactType: string }>
  addressCity: string | null
  addressRegion: string | null
  addressCountry: string | null
  logoUrl: string | null
  awards: Array<{
    title: string
    date: string | number | null
    projectName: string | null
  }>
  social: {
    github: string | null
    instagram: string | null
    twitter: string | null
    linkedIn: string | null
  }
}

const organizationQuery = /* groq */ `{
  "awards": *[_type == "award" && defined(title)] | order(date desc){
    title,
    date,
    "projectName": project->title
  }
}`

const getOrganizationFallback = (): OrganizationStructuredData => ({
  description: COMPANY_FACTS.description,
  foundingDate: COMPANY_FACTS.foundingDate,
  email: null,
  contactPoints: [],
  addressCity: COMPANY_FACTS.addressCity,
  addressRegion: null,
  addressCountry: COMPANY_FACTS.addressCountry,
  logoUrl: COMPANY_FACTS.logoUrl,
  awards: [],
  social: {
    github: null,
    instagram: null,
    twitter: null,
    linkedIn: null
  }
})

export async function fetchOrganizationData(): Promise<OrganizationStructuredData> {
  "use cache"

  try {
    const data = await sanityFetch<{
      awards: Array<{
        title: string
        date: string | null
        projectName: string | null
      }> | null
    }>({
      query: organizationQuery
    })

    return {
      ...getOrganizationFallback(),
      awards: data.awards ?? []
    }
  } catch (error) {
    console.error(
      "Failed to fetch optional organization data; using stable fallback",
      error
    )
    return getOrganizationFallback()
  }
}
