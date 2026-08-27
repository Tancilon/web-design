import Image from "next/image"
import Link from "next/link"

import type { AllProject } from "@/lib/all-projects"

export const ProjectList = ({ projects }: { projects: AllProject[] }) => (
  <div className="col-span-full flex flex-col gap-12 lg:gap-3">
    {projects.map((project) => (
      <article
        key={project.id}
        className="group relative col-span-full -mb-3 border-b border-brand-w1/20"
      >
        <Link
          className="col-span-full grid grid-cols-12 gap-2 py-2 pb-2 focus-visible:!ring-offset-0 lg:pb-2"
          href={project.href}
          aria-label={`查看作品：${project.title}`}
        >
          <div className="with-diagonal-lines pointer-events-none !absolute -bottom-px -top-px left-0 right-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative col-span-full my-auto aspect-[418/228] w-full overflow-clip bg-brand-g2/20 after:absolute after:inset-0 after:border after:border-brand-w1/20 lg:col-span-3 lg:aspect-auto lg:h-[124px] lg:max-w-[418px]">
            <div className="with-dots h-full w-full">
              <Image
                src={project.image}
                alt={`${project.title}作品预览`}
                fill
                sizes="(max-width: 1024px) 100vw, 418px"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
                placeholder="blur"
              />
            </div>
          </div>
          <div className="relative col-span-full flex flex-col gap-2 text-brand-w2 lg:col-start-5 lg:col-end-9">
            <h2 className="text-f-h3-mobile lg:text-f-h3">{project.title}</h2>
            <p className="max-w-[42rem] text-f-p-mobile leading-snug text-brand-g1 lg:text-f-p">
              {project.description}
            </p>
          </div>
          <div className="relative col-span-6 flex flex-wrap gap-1 self-start lg:col-start-9 lg:col-end-11">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="h-max w-max bg-brand-g2 px-1 text-f-p-mobile text-brand-w2 lg:text-f-p"
              >
                {tag}
              </span>
            ))}
          </div>
          <time
            dateTime={project.date}
            className="relative col-span-6 text-right text-f-p-mobile tabular-nums text-brand-w2 lg:col-start-11 lg:col-end-13 lg:text-left lg:text-f-p"
          >
            {project.date.replaceAll("-", ".")}
          </time>
        </Link>
      </article>
    ))}
  </div>
)
