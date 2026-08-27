import { sanityFetchCached } from "@/service/sanity"
import { imageFragment } from "@/service/sanity/queries"
import type { SanityImage } from "@/service/sanity/types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HomepageData {
  homepage: {
    clients: SanityClient[] | null
  }
}

export interface SanityClient {
  _id: string
  title: string
  logo: SanityImage | null
  website: string | null
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

const homepageQuery = /* groq */ `{
  "homepage": *[_type == "homepage"][0]{
    "clients": clients[]->{
      _id,
      title,
      logo ${imageFragment},
      website
    }
  }
}`

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

export async function fetchHomepage(
  /** Pass `published: true` for non-draft contexts (e.g. the `.md` endpoint) — disables stega so output isn't polluted with invisible chars. */
  options?: { published?: boolean }
): Promise<HomepageData> {
  if (options?.published) {
    return sanityFetchCached<HomepageData>({
      query: homepageQuery,
      perspective: "published"
    })
  }
  return sanityFetchCached<HomepageData>({
    query: homepageQuery
  })
}

// Organization data (schema.org) lives in `@/service/sanity/organization` —
// it feeds the Organization JSON-LD rendered on every page via the site layout.
