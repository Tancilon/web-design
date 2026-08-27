import { ALL_PROJECTS_COUNT } from "@/lib/all-projects"
import { BEYOND_DESIGN_COUNT } from "@/lib/beyond-design"
import { SITE_ROUTE_LABELS } from "@/lib/site-navigation"

import { NavbarContent } from "./navbar-content"

interface NavbarLink {
  title: string
  href: string
  count?: number
  reloadDocument?: boolean
}

export const Navbar = async () => {
  const LINKS: NavbarLink[] = [
    {
      title: SITE_ROUTE_LABELS["/"],
      href: "/"
    },
    {
      title: SITE_ROUTE_LABELS["/services"],
      href: "/services"
    },
    {
      title: SITE_ROUTE_LABELS["/showcase"],
      href: "/showcase",
      count: BEYOND_DESIGN_COUNT
    },
    {
      title: SITE_ROUTE_LABELS["/blog"],
      href: "/blog",
      count: ALL_PROJECTS_COUNT
    },
    {
      title: SITE_ROUTE_LABELS["/ai"],
      href: "/ai",
      reloadDocument: true
    }
  ]

  return <NavbarContent key="navbar-content" links={LINKS} />
}
