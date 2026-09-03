import Link from "next/link"

import { allProjectCategories } from "@/lib/all-projects"
import { cn } from "@/utils/cn"

export const Categories = ({ activeCategory }: { activeCategory?: string }) => (
  <div className="col-span-full row-start-1 flex flex-col gap-1 pb-8 lg:col-span-3 lg:col-start-9 lg:row-start-auto lg:gap-2">
    <p className="text-f-p-mobile text-brand-g1 lg:text-f-h3">标签</p>

    <ul className="flex flex-col gap-y-1 lg:flex-row lg:flex-wrap lg:gap-x-4">
      {allProjectCategories.map((category) => {
        const isActive = activeCategory === category.slug
        const href = isActive ? "/blog" : `/blog/${category.slug}`

        return (
          <li key={category.slug}>
            <Link
              href={href}
              scroll={false}
              className={cn(
                "flex w-max gap-x-1.25 text-left !text-f-h2-mobile transition-colors duration-300 lg:!text-f-h2",
                !activeCategory || isActive ? "text-brand-w1" : "text-brand-g1"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="actionable">{category.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  </div>
)
