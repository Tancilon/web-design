import { BEYOND_DESIGN_COUNT } from "@/lib/beyond-design"

import { FooterContent } from "./footer-content"
import { fetchCompanyInfo } from "./sanity"

export const Footer = async () => {
  const companyInfo = await fetchCompanyInfo()

  return (
    <FooterContent
      projectsCount={BEYOND_DESIGN_COUNT}
      socialLinks={{
        twitter: companyInfo.twitter || "",
        instagram: companyInfo.instagram || "",
        github: companyInfo.github || "",
        linkedIn: companyInfo.linkedIn || ""
      }}
    />
  )
}
