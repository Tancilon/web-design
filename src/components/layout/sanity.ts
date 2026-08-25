import { sanityFetch, sanityFetchCached } from "@/service/sanity"

export interface CompanyInfo {
  github: string | null
  instagram: string | null
  twitter: string | null
  linkedIn: string | null
}

export async function fetchCurrentYear(): Promise<number> {
  "use cache"
  return new Date().getFullYear()
}

export async function fetchPostsCount(): Promise<number> {
  "use cache"
  return sanityFetch<number>({
    query: /* groq */ `count(*[_type == "post"])`
  })
}

const companyInfoQuery = /* groq */ `*[_type == "companyInfo"][0] {
  github,
  instagram,
  twitter,
  linkedIn
}`

export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  "use cache"
  return sanityFetch<CompanyInfo>({
    query: companyInfoQuery
  })
}

/** Published-perspective variant for the `.md` endpoints — keeps stega out of the markdown. */
export async function fetchCompanyInfoForMarkdown(): Promise<CompanyInfo | null> {
  return sanityFetchCached<CompanyInfo | null>({
    query: companyInfoQuery,
    perspective: "published"
  })
}
