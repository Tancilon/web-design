"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef } from "react"

import { Arrow } from "@/components/primitives/icons/arrow"
import { Portal } from "@/components/primitives/portal"
import type { BeyondDesignWork } from "@/lib/beyond-design"

interface DesignLightboxProps {
  works: BeyondDesignWork[]
  activeIndex: number | null
  onChange: React.Dispatch<React.SetStateAction<number | null>>
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

export function DesignLightbox({
  works,
  activeIndex,
  onChange
}: DesignLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const isOpen = activeIndex !== null

  const close = useCallback(() => onChange(null), [onChange])
  const focusCloseButton = useCallback(() => {
    closeButtonRef.current?.focus()
  }, [])
  const showPrevious = useCallback(
    () =>
      onChange((currentIndex) => {
        if (currentIndex === null) return null
        return currentIndex === 0 ? works.length - 1 : currentIndex - 1
      }),
    [onChange, works.length]
  )
  const showNext = useCallback(
    () =>
      onChange((currentIndex) => {
        if (currentIndex === null) return null
        return (currentIndex + 1) % works.length
      }),
    [onChange, works.length]
  )

  useEffect(() => {
    if (!isOpen) return

    triggerRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
        return
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        showPrevious()
        return
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        showNext()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [close, isOpen, showNext, showPrevious])

  if (activeIndex === null) return null

  const work = works[activeIndex]
  const current = String(activeIndex + 1).padStart(2, "0")
  const total = String(works.length).padStart(2, "0")
  const imageRatio = work.image.width / work.image.height

  return (
    <Portal id="design-lightbox" onMount={focusCloseButton}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${work.label}大图`}
        className="fixed inset-0 z-[10000] grid grid-rows-[3.25rem_minmax(0,1fr)_3.25rem] bg-brand-k/[0.96] backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) close()
        }}
      >
        <header className="flex items-center justify-between border-b border-brand-w1/20 px-4 text-f-h4-mobile text-brand-w1 lg:text-f-h4">
          <span>{work.label}</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="actionable"
          >
            关闭
          </button>
        </header>

        <div className="relative m-3 flex min-h-0 items-center justify-center lg:m-5">
          <button
            type="button"
            onClick={close}
            aria-label="关闭灯箱背景"
            className="absolute inset-0 cursor-zoom-out focus-visible:!ring-offset-0"
          />
          <div
            className="relative z-10 max-h-full max-w-full"
            style={{
              aspectRatio: `${work.image.width} / ${work.image.height}`,
              width: `min(100%, calc((100dvh - 9rem) * ${imageRatio}))`
            }}
          >
            <Image
              key={work.image.src}
              src={work.image}
              alt={work.label}
              fill
              sizes="100vw"
              quality={90}
              priority
              placeholder="blur"
              className="object-contain"
            />
          </div>
        </div>

        <footer className="grid grid-cols-3 items-center border-t border-brand-w1/20 px-4 text-f-h4-mobile text-brand-w1 lg:text-f-h4">
          <button
            type="button"
            onClick={showPrevious}
            className="actionable w-max"
            aria-label="查看上一张作品"
          >
            <Arrow className="mr-2 size-4 rotate-180" />
            上一张
          </button>
          <span className="text-center tabular-nums text-brand-g1">
            {current} / {total}
          </span>
          <button
            type="button"
            onClick={showNext}
            className="actionable w-max justify-self-end"
            aria-label="查看下一张作品"
          >
            下一张
            <Arrow className="ml-2 size-4" />
          </button>
        </footer>
      </div>
    </Portal>
  )
}
