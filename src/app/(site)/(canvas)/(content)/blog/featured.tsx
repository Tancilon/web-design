import Image from "next/image"
import Link from "next/link"

import type { AllProject } from "@/lib/all-projects"

export function Featured({ project }: { project: AllProject }) {
  return (
    <section className="grid-layout">
      <div className="col-span-full grid grid-cols-12">
        <div className="col-span-full grid grid-cols-12 items-end gap-2 border-b border-brand-w1/20 pb-2">
          <h2 className="col-span-full text-f-h3-mobile text-brand-g1 lg:col-span-3 lg:col-start-5 lg:text-f-h3">
            重点项目
          </h2>
        </div>
        <article className="group relative col-span-full border-b border-brand-w1/20">
          <Link
            className="col-span-full grid grid-cols-12 gap-2 py-2 focus-visible:!ring-offset-0 lg:pb-2"
            href={project.href}
            aria-label={`查看重点项目：${project.title}`}
          >
            <div className="with-diagonal-lines pointer-events-none !absolute -bottom-px -top-px left-0 right-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative col-span-full my-auto aspect-[418/228] overflow-clip bg-brand-g2/20 after:absolute after:inset-0 after:border after:border-brand-w1/20 lg:col-span-3">
              <div className="with-dots h-full w-full">
                <Image
                  src={project.image}
                  alt={`${project.title}重点项目封面`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
                  placeholder="blur"
                  priority
                />
              </div>
            </div>
            <h2 className="relative col-span-full py-1 text-f-h2-mobile text-brand-w2 lg:col-start-5 lg:col-end-8 lg:text-f-h2">
              {project.title}
            </h2>
            <div className="relative col-span-full grid grid-cols-4 content-start gap-y-4 py-1 lg:col-span-4 lg:col-start-9">
              <p className="col-span-full text-f-h4-mobile leading-snug text-brand-w2 lg:text-f-h4">
                {project.description}
              </p>
              <hr className="relative col-start-1 col-end-5 hidden w-full border-dashed border-brand-w1/20 lg:block" />
              <div className="relative col-span-2 col-start-1 flex flex-wrap gap-1 text-f-p-mobile lg:text-f-p">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="h-max w-max bg-brand-g2 px-1 text-brand-w2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <time
                dateTime={project.date}
                className="relative col-span-2 col-start-3 text-right text-f-p-mobile tabular-nums text-brand-w2 lg:text-left lg:text-f-p"
              >
                {project.displayDate}
              </time>
            </div>
          </Link>
        </article>
      </div>
    </section>
  )
}
