export const isInPath = (link: string, pathname: string) =>
  link === pathname || (pathname.includes("/blog/") && link === "/blog")
