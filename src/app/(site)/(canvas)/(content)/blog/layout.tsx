import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "所有项目"
}

interface BlogLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <>
      <div id="list" className="-translate-y-[3.25rem]" />
      <div className="pb-25 relative flex flex-col gap-12 bg-brand-k lg:gap-20">
        {children}
      </div>
    </>
  )
}
