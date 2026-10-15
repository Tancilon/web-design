"use client"

import Image, { type StaticImageData } from "next/image"
import { useRef, useState } from "react"

import styles from "./zoomable-project-image.module.css"

export function ProjectGallery({
  images,
  title
}: {
  images: StaticImageData[]
  title: string
}) {
  const [width, setWidth] = useState(100)
  const menu = useRef<HTMLDetailsElement>(null)
  return (
    <section className={styles.viewer} aria-label={`${title}作品图片`}>
      <div className={styles.toolbar}>
        <details
          ref={menu}
          className={styles.menu}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current) {
              menu.current.open = false
              menu.current.querySelector("summary")?.focus()
            }
          }}
        >
          <summary
            aria-label={`调整整组作品显示大小，当前 ${width}%`}
            title="调整整组作品大小"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4M8 8h8v8H8z" />
            </svg>
            <span>画面</span>
            <span className={styles.currentSize}>{width}%</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
              className={styles.chevron}
            >
              <path d="m2 4 3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </summary>
          <div
            className={styles.options}
            role="group"
            aria-label="整体显示大小"
          >
            <span>整体显示</span>
            {[
              { value: 65, label: "紧凑浏览" },
              { value: 85, label: "舒适阅读" },
              { value: 100, label: "铺满宽度" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={width === option.value}
                onClick={() => {
                  setWidth(option.value)
                  if (menu.current) {
                    menu.current.open = false
                    menu.current.querySelector("summary")?.focus()
                  }
                }}
              >
                {option.label}
                <span>{option.value}%</span>
              </button>
            ))}
          </div>
        </details>
      </div>
      <div className={styles.gallery} style={{ width: `${width}%` }}>
        {images.map((image, index) => (
          <figure key={image.src} className={styles.figure}>
            <figcaption className={styles.caption}>
              <span>{title}</span>
              <span>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
            </figcaption>
            <Image
              src={image}
              alt={`${title}作品图 ${index + 1}/${images.length}`}
              sizes={`${width}vw`}
              quality={90}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              placeholder="blur"
              className={styles.image}
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
