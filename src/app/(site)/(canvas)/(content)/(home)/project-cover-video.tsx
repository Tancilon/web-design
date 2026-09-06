"use client"

import Image, { type StaticImageData } from "next/image"
import { useEffect, useRef, useState } from "react"

import type { PortfolioProject } from "@/lib/portfolio"

export function ProjectCoverVideo({
  video,
  image,
  title
}: {
  video: NonNullable<PortfolioProject["homeCoverVideo"]>
  image: StaticImageData
  title: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false
    let disposed = false
    let failed = false
    let revision = 0
    const shouldPlay = () =>
      !disposed &&
      !failed &&
      visible &&
      !document.hidden &&
      !reducedMotion.matches
    const syncPlayback = () => {
      const attempt = ++revision
      if (!shouldPlay()) {
        element.pause()
        if (reducedMotion.matches) setShowVideo(false)
        return
      }
      if (!element.getAttribute("src")) element.src = video.src
      element.muted = true
      void element.play().catch(() => {
        if (!disposed && attempt === revision) setShowVideo(false)
      })
    }
    const onPlaying = () => {
      if (shouldPlay()) setShowVideo(true)
      else element.pause()
    }
    const onError = () => {
      failed = true
      element.pause()
      setShowVideo(false)
    }
    // A tall portrait cover may never fit entirely inside the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    })
    observer.observe(element)
    document.addEventListener("visibilitychange", syncPlayback)
    reducedMotion.addEventListener("change", syncPlayback)
    element.addEventListener("playing", onPlaying)
    element.addEventListener("error", onError)
    return () => {
      disposed = true
      revision++
      observer.disconnect()
      document.removeEventListener("visibilitychange", syncPlayback)
      reducedMotion.removeEventListener("change", syncPlayback)
      element.removeEventListener("playing", onPlaying)
      element.removeEventListener("error", onError)
      element.pause()
      element.removeAttribute("src")
      element.load()
    }
  }, [video.src])

  return (
    <div
      className="relative"
      style={{ aspectRatio: `${video.width}/${video.height}` }}
    >
      <Image
        src={image}
        alt={`${title}封面`}
        fill
        sizes="(max-width: 1023px) 100vw, 58vw"
        className="object-contain object-top"
        placeholder="blur"
      />
      <video
        ref={videoRef}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ opacity: showVideo ? 1 : 0 }}
      />
    </div>
  )
}
