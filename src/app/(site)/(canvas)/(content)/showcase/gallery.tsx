"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import type { BeyondDesignWork } from "@/lib/beyond-design"

import { DesignLightbox } from "./lightbox"

export function DesignGallery({ works }: { works: BeyondDesignWork[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const openFromHash = useCallback(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const index = works.findIndex((work) => work.id === id)
    if (index >= 0) setActiveIndex(index)
  }, [works])

  useEffect(() => {
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [openFromHash])

  const closeLightbox = useCallback(() => {
    setActiveIndex(null)
    if (window.location.hash.startsWith("#work-")) {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  return (
    <>
      <section
        aria-label="设计作品图库"
        className="grid-layout"
        id="design-gallery"
      >
        <div className="col-span-full columns-1 gap-3 md:columns-2 lg:columns-4">
          {works.map((work, index) => (
            <figure
              id={work.id}
              key={work.id}
              className="mb-3 scroll-m-12 break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full overflow-hidden border border-brand-w1/20 bg-brand-k text-left transition-colors duration-300 hover:border-brand-w1/60 focus-visible:!ring-offset-0 motion-reduce:transition-none"
                aria-label={`查看${work.label}大图`}
              >
                <Image
                  src={work.image}
                  alt={work.label}
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  placeholder="blur"
                  className="h-auto w-full transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.01] group-hover:brightness-90 motion-reduce:transition-none"
                />
                <span className="text-f-h5 pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-brand-k/85 px-2 py-1 text-brand-w1 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none">
                  <span>{work.label}</span>
                  <span>放大查看</span>
                </span>
              </button>
            </figure>
          ))}
        </div>
      </section>

      <DesignLightbox
        works={works}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        onClose={closeLightbox}
      />
    </>
  )
}
