import { BEYOND_DESIGN_COUNT } from "@/lib/beyond-design"

import { NavbarContent } from "./navbar-content"
import { fetchCompanyInfo } from "./sanity"

interface NavbarLink {
  title: string
  href: string
  count?: number
  reloadDocument?: boolean
}

export const Navbar = async () => {
  const companyInfo = await fetchCompanyInfo()

  const LINKS: NavbarLink[] = [
    {
      title: "首页",
      href: "/"
    },
    {
      title: "荣誉",
      href: "/services"
    },
    {
      title: "设计之外",
      href: "/showcase",
      count: BEYOND_DESIGN_COUNT
    },
    {
      title: "个人简历",
      href: "/ai",
      reloadDocument: true
    }
  ]

  return (
    <NavbarContent
      key="navbar-content"
      links={LINKS}
      socialLinks={{
        twitter: companyInfo.twitter || "",
        instagram: companyInfo.instagram || "",
        github: companyInfo.github || "",
        linkedIn: companyInfo.linkedIn || ""
      }}
    />
  )
}
