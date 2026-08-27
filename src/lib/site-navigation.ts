export const SITE_ROUTE_LABELS = {
  "/": "首页",
  "/services": "个人荣誉",
  "/showcase": "设计之外",
  "/blog": "所有项目",
  "/basketball": "篮球",
  "/ai": "个人简历",
  "/contact": "联系方式"
} as const

export type SiteRoute = keyof typeof SITE_ROUTE_LABELS

export function normalizeSiteRoute(route: string): string {
  const routeWithoutQuery = route.trim().split(/[?#]/, 1)[0]

  if (!routeWithoutQuery) return ""
  if (routeWithoutQuery === "/") return "/"

  const pathname = routeWithoutQuery.replace(/^\/+|\/+$/g, "").toLowerCase()

  if (!pathname) return "/"
  if (pathname === "home" || pathname === "index") return "/"

  return `/${pathname}`
}

export function getSiteRouteLabel(route: string): string | undefined {
  return SITE_ROUTE_LABELS[normalizeSiteRoute(route) as SiteRoute]
}
