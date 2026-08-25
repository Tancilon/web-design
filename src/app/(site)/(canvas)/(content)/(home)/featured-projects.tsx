import Image from "next/image"

import { Arrow } from "@/components/primitives/icons/arrow"
import { Link } from "@/components/primitives/link"
import type { PortfolioProject } from "@/lib/portfolio"
import { portfolioProjects } from "@/lib/portfolio"
import { cn } from "@/utils/cn"

export const FeaturedProjects = () => {
  return (
    <section className="grid-layout !gap-y-0" id="featured-work">
      {portfolioProjects.map((project, index) => (
        <div
          key={project.slug}
          className={cn(
            "col-span-full",
            "top-[6.7rem] lg:sticky lg:top-[9.2rem]",
            index === 0 && "!top-0 lg:!top-0",
            index === portfolioProjects.length - 1 &&
              "top-[6.8rem] lg:top-[9.3rem]"
          )}
          style={{ zIndex: index + 1 }}
        >
          {index === 0 && (
            <h2
              className={cn(
                "col-span-full bg-brand-k pb-6 pt-12 !text-f-h1-mobile text-brand-w2 lg:pt-14 lg:!text-f-h1"
              )}
            >
              主要作品
            </h2>
          )}
          <ProjectItem project={project} />
        </div>
      ))}
    </section>
  )
}

interface ProjectItemProps {
  project: PortfolioProject
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const href = `/portfolio/${project.slug}`
  const imageCount = project.images.length
  return (
    <div
      className={cn(
        "grid-layout bg-transparent !px-0 py-4",
        "transition-transform duration-300",
        "bg-brand-k",
        "border-t border-brand-w1/30",
        "col-span-full"
      )}
    >
      <div className="relative col-span-full overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-10 after:border after:border-brand-w1/20 lg:col-span-7">
        <Link
          href={href}
          aria-label={`查看作品：${project.title}`}
          className="group block aspect-video overflow-hidden focus-visible:!ring-offset-0"
        >
          <Image
            src={project.images[0]}
            alt={`${project.title}封面`}
            fill
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            placeholder="blur"
          />
        </Link>
      </div>
      <div className="col-span-full flex min-h-24 flex-col justify-between gap-y-8 md:col-span-3 md:pr-12 lg:min-h-0 lg:pr-2">
        <Link
          href={href}
          className="text-f-h2-mobile text-brand-w1 md:hidden lg:text-f-h2"
        >
          <span className="actionable">{project.title}</span>
        </Link>
        <div className="flex items-end justify-between text-f-h4-mobile text-brand-w2 lg:block lg:text-f-h4">
          <span>作品 {project.index}</span>
          <span className="lg:block">
            {String(imageCount).padStart(2, "0")} 张图片
          </span>
        </div>
      </div>

      <Link
        href={href}
        className="hidden h-max w-max justify-self-end pr-0.5 text-right text-f-h2-mobile text-brand-w1 md:block lg:col-span-2 lg:col-start-11 lg:text-f-h2"
      >
        <span className="actionable group gap-x-2 [&:before]:delay-0 [&:before]:hover:delay-150">
          <span className="translate-x-6 transition-transform duration-200 ease-in-out group-hover:translate-x-0 motion-reduce:transform-none">
            {project.title}
          </span>
          <Arrow className="size-6 opacity-0 transition-opacity delay-0 duration-100 ease-in-out hover:delay-200 group-hover:opacity-100" />
        </span>
      </Link>
    </div>
  )
}
