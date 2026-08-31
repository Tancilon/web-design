"use client"

import Image from "next/image"
import { useCallback, useState } from "react"

import type { PersonalHonor } from "@/lib/personal-honors"

import { HonorLightbox } from "./honor-lightbox"

export function HonorArchive({ honors }: { honors: PersonalHonor[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setActiveIndex(null), [])

  return (
    <>
      <section className="grid-layout" aria-labelledby="honor-archive-title">
        <div className="col-span-full flex items-baseline gap-2 text-brand-g1">
          <h2
            id="honor-archive-title"
            className="font-display text-f-h3-mobile lg:text-f-h3"
          >
            荣誉档案
          </h2>
          <span className="font-display text-f-h4-mobile tabular-nums lg:text-f-h4">
            / {String(honors.length).padStart(2, "0")}
          </span>
        </div>

        <ol className="col-span-full border-t border-brand-w1/20">
          {honors.map((honor, honorIndex) => (
            <li
              id={honor.id}
              key={honor.id}
              className="group relative scroll-m-14 border-b border-brand-w1/20"
            >
              <article className="relative grid grid-cols-4 gap-x-3 gap-y-4 py-5 lg:grid-cols-12 lg:gap-x-2 lg:py-6">
                <button
                  type="button"
                  onClick={() => setActiveIndex(honorIndex)}
                  aria-label={`放大查看${honor.title}证书`}
                  className="absolute inset-0 z-10 cursor-zoom-in focus-visible:!ring-inset focus-visible:!ring-offset-0"
                />

                <span className="col-span-full font-display text-f-h4-mobile tabular-nums text-brand-g1 lg:col-span-1 lg:text-f-h4">
                  {honor.index}
                </span>

                <span className="relative col-span-full block aspect-[0.7075] w-full max-w-72 overflow-hidden bg-white lg:col-span-3 lg:max-w-none">
                  <Image
                    src={honor.image.src}
                    alt={`${honor.award}：${honor.title}${honor.level}证书`}
                    fill
                    sizes="(max-width: 1023px) 18rem, 25vw"
                    quality={88}
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
                  />
                </span>

                <span className="col-span-full flex flex-col gap-3 lg:col-span-5 lg:px-4">
                  <span className="text-f-h5 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-brand-g1">
                    <span>{honor.category}</span>
                    <span aria-hidden="true">/</span>
                    <span>{honor.date}</span>
                  </span>
                  <span className="font-display text-f-h2-mobile text-brand-w1 lg:text-f-h2">
                    {honor.title}
                  </span>
                  <span className="font-sans text-f-h4-mobile text-brand-w2 lg:text-f-h4">
                    {honor.award} · {honor.level}
                  </span>
                  <span className="max-w-[44rem] font-sans text-f-p-mobile text-brand-w2 lg:text-f-p">
                    {honor.description}
                  </span>
                  <span className="text-f-h5 font-display text-brand-w1">
                    放大查看 →
                  </span>
                </span>

                <dl className="col-span-full grid content-start gap-2 border-t border-brand-w1/20 pt-3 font-sans text-f-p-mobile text-brand-w2 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 lg:text-f-p">
                  {honor.details.map((detail) => (
                    <div
                      key={`${honor.id}-${detail.label}`}
                      className="grid grid-cols-[5rem_1fr] gap-2 lg:grid-cols-1 lg:gap-0"
                    >
                      <dt className="text-brand-g1">{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>

                <span className="with-diagonal-lines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none" />
              </article>
            </li>
          ))}
        </ol>
      </section>

      <HonorLightbox
        honors={honors}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        onClose={closeLightbox}
      />
    </>
  )
}
