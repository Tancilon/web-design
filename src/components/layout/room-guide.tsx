"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useAppLoadingStore } from "@/components/loading/app-loading-handler"
import { useNavigationStore } from "@/components/navigation-handler/navigation-store"
import { useHandleNavigation } from "@/hooks/use-handle-navigation"

import styles from "./room-guide.module.css"
import { useRoomGuide } from "./room-guide-store"

const rooms = [
  {
    name: "作品室",
    label: "所有项目",
    route: "/blog",
    icon: "▧",
    clue: "想知道一个想法怎样变成作品？",
    story:
      "先去作品室吧。那里收集了我的项目，点开喜欢的封面，就能继续了解它的设计与呈现。",
    action: "带我看作品"
  },
  {
    name: "荣誉室",
    label: "个人荣誉",
    route: "/services",
    icon: "✧",
    clue: "这些闪光的时刻，值得停留一下。",
    story:
      "荣誉室记录了我的奖项和成长足迹。来看看一路走来，哪些尝试收获了认可。",
    action: "去看看荣誉"
  },
  {
    name: "灵感室",
    label: "设计之外",
    route: "/showcase",
    icon: "◒",
    clue: "设计之外，我还在收集生活的灵感。",
    story:
      "这个房间放着我的兴趣、创作和生活片段。随便逛逛，也许会发现和你一样的爱好。",
    action: "寻找一点灵感"
  },
  {
    name: "篮球互动区",
    label: "篮球",
    route: "/basketball",
    icon: "◎",
    clue: "逛累了？换个节奏，投个篮！",
    story:
      "这里藏着一个篮球互动体验。暂时放下作品介绍，去试试手感，轻松玩一会儿。",
    action: "去投个篮"
  },
  {
    name: "资料区",
    label: "个人简历",
    route: "/ai",
    icon: "≡",
    clue: "赶时间的话，我也准备了一份文字介绍。",
    story:
      "个人简历把信息整理成便于阅读的文字。想快速了解我的经历和能力，就从这里开始。",
    action: "打开个人简历"
  }
]

// A schematic of the five destinations, not a floor plan of the 3D model.
const floorTiles = [
  { x: 150, y: 30 },
  { x: 226, y: 68 },
  { x: 74, y: 68 },
  { x: 150, y: 106 },
  { x: 302, y: 106 }
]

function RoomAtlas({ selected }: { selected: number }) {
  return (
    <svg className={styles.atlas} viewBox="0 0 440 200" aria-hidden="true">
      <defs>
        <pattern
          id="guide-grid"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 22 0 L 0 0 0 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="440" height="200" fill="url(#guide-grid)" opacity="0.18" />
      <path
        d="M40 160H400 M40 154V166 M400 154V166"
        className={styles.dimension}
      />
      {floorTiles.map(({ x, y }, index) => (
        <g
          key={index}
          transform={`translate(${x} ${y})`}
          className={selected === index ? styles.activeTile : styles.tile}
        >
          <path
            d="M-68 0 L0 34 L68 0 L68 14 L0 48 L-68 14Z"
            className={styles.tileSide}
          />
          <path d="M0-34L68 0L0 34L-68 0Z" className={styles.tileTop} />
          <path
            d="M-48 0L0-24L48 0L0 24Z"
            fill="none"
            stroke="currentColor"
            opacity="0.3"
          />
          <text x="0" y="4" textAnchor="middle">
            0{index + 1}
          </text>
          {selected === index && (
            <>
              <path d="M0-38V-52" stroke="currentColor" />
              <circle cx="0" cy="-56" r="3" fill="currentColor" />
            </>
          )}
        </g>
      ))}
      <text x="24" y="185" className={styles.mapLabel}>
        FIVE SPACES / ONE STORY
      </text>
      <text x="416" y="185" textAnchor="end" className={styles.mapLabel}>
        分区示意
      </text>
    </svg>
  )
}

export function RoomGuide() {
  const pathname = usePathname()
  const router = useRouter()
  const { handleNavigation } = useHandleNavigation()
  const open = useRoomGuide((state) => state.open)
  const inView = useRoomGuide((state) => state.inView)
  const [step, setStep] = useState(0)
  const closeButton = useRef<HTMLButtonElement>(null)
  const ready = useAppLoadingStore((state) => state.canRunMainApp)
  const unavailable = useAppLoadingStore((state) => state.canvasUnavailable)
  const room = rooms[step]
  const isHome = pathname === "/"

  useEffect(() => {
    const update = () =>
      useRoomGuide.setState({
        inView: window.scrollY < window.innerHeight * 0.55
      })
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  useEffect(() => {
    useRoomGuide.setState({ open: false })
  }, [pathname])

  useEffect(() => {
    if (!open || !isHome || !inView) return
    closeButton.current?.focus({ preventScroll: true })
  }, [open, isHome, inView])

  if (!isHome || !inView) return null

  const enter = () => {
    useRoomGuide.setState({ open: false })
    if (room.route === "/ai") {
      window.location.assign(room.route)
      return
    }
    const scene = useNavigationStore
      .getState()
      .scenes?.find((entry) => `/${entry.name}` === room.route)
    if (scene && ready && !unavailable) handleNavigation(room.route)
    else router.push(room.route)
  }

  return (
    <aside className={styles.guide} aria-label="RYN 的房间导览">
      {!open && (
        <button
          className={`${styles.invitation} ${ready && !unavailable ? styles.fallback : ""}`}
          aria-expanded={false}
          onClick={() => useRoomGuide.setState({ open: true })}
        >
          <span className={styles.avatar} aria-hidden="true">
            ↗
          </span>
          <span>
            <strong>空间探索指南</strong>
            <small>跟随 RYN · 发现五个分区</small>
          </span>
        </button>
      )}
      {open && (
        <section
          className={styles.note}
          role="dialog"
          aria-modal={false}
          aria-labelledby="room-note-title"
          onKeyDown={(event) => {
            event.stopPropagation()
            if (event.key === "Escape") useRoomGuide.setState({ open: false })
          }}
        >
          <header className={styles.header}>
            <div>
              <strong>FEIFEI — EXPLORER’S GUIDE</strong>
              <small>由 RYN 带路 / 随心探索</small>
            </div>
            <button
              ref={closeButton}
              className={styles.close}
              onClick={() => useRoomGuide.setState({ open: false })}
              aria-label="收起房间导览"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          </header>
          <div className={styles.intro}>
            <h2>
              选一扇门，
              <br />
              发现我的另一面<span>↗</span>
            </h2>
            <p>
              五个分区，五种打开方式。
              <br />
              从你感兴趣的地方开始。
            </p>
          </div>
          <RoomAtlas selected={step} />
          <nav className={styles.stops} aria-label="选择要了解的分区">
            {rooms.map((item, index) => (
              <button
                key={item.route}
                aria-label={item.label}
                aria-pressed={step === index}
                onClick={() => setStep(index)}
              >
                <span aria-hidden="true">0{index + 1}</span>
                <small>{item.label}</small>
              </button>
            ))}
          </nav>
          <div className={styles.story} aria-live="polite" aria-atomic="true">
            <span className={styles.eyebrow}>DESTINATION 0{step + 1} / 05</span>
            <h2 id="room-note-title">{room.name}</h2>
            <p className={styles.clue}>{room.clue}</p>
            <p>{room.story}</p>
          </div>
          <footer className={styles.actions}>
            <button
              className={styles.next}
              onClick={() => setStep((step + 1) % rooms.length)}
            >
              下一个分区 ↗
            </button>
            <button className={styles.enter} onClick={enter}>
              {room.action} →
            </button>
          </footer>
        </section>
      )}
    </aside>
  )
}
