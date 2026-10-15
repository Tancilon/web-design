"use client"

import { useEffect, useRef, useState } from "react"

import { AmbientMusic } from "@/lib/audio/ambient-music"

import styles from "./background-music.module.css"

export function BackgroundMusic() {
  const engine = useRef<AmbientMusic | null>(null)
  const wanted = useRef(true)
  const busy = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState(22)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      wanted.current = localStorage.getItem("feifei-bgm-off") !== "true"
      setEnabled(wanted.current)
    } catch {
      /* Storage is optional. */
    }
    let mounted = true
    const sync = () => {
      if (mounted) setPlaying(engine.current?.isPlaying ?? false)
    }
    const attempt = (event?: Event) => {
      if (!wanted.current || document.hidden) return
      if (
        event?.target instanceof Element &&
        event.target.closest("[data-bgm-player]")
      )
        return
      try {
        if (!engine.current) engine.current = new AmbientMusic(0.22)
        const music = engine.current
        music.onstatechange = sync
        // Browsers may require a user gesture before audible playback.
        void music
          .play()
          .then(() => {
            if (!mounted || !wanted.current || document.hidden)
              void music.pause().catch(() => {})
            sync()
          })
          .catch((cause: unknown) => {
            if (!mounted) return
            setPlaying(false)
            if (
              cause instanceof DOMException &&
              cause.name === "NotAllowedError"
            )
              return
            if (cause instanceof DOMException && cause.name === "AbortError")
              return
            setError("音乐加载失败，请重试")
          })
      } catch {
        if (mounted) setError("音乐暂不可用，请重试")
      }
    }
    attempt()
    document.addEventListener("pointerdown", attempt)
    document.addEventListener("keydown", attempt)
    const visibility = () => {
      const music = engine.current
      if (!music) return
      if (document.hidden) void music.pause().catch(() => {})
      else attempt()
    }
    document.addEventListener("visibilitychange", visibility)
    return () => {
      mounted = false
      document.removeEventListener("pointerdown", attempt)
      document.removeEventListener("keydown", attempt)
      document.removeEventListener("visibilitychange", visibility)
      engine.current?.dispose()
      engine.current = null
    }
  }, [])

  const toggle = async () => {
    if (busy.current) return
    busy.current = true
    setError("")
    try {
      if (!engine.current) engine.current = new AmbientMusic(volume / 100)
      const music = engine.current
      if (wanted.current) {
        wanted.current = false
        setEnabled(false)
        await music.pause()
      } else {
        wanted.current = true
        setEnabled(true)
        await music.play()
      }
      try {
        localStorage.setItem("feifei-bgm-off", String(!wanted.current))
      } catch {
        /* Optional preference. */
      }
      setPlaying(music.isPlaying)
    } catch {
      wanted.current = false
      setEnabled(false)
      setPlaying(false)
      setError("音乐暂不可用，请重试")
      engine.current?.dispose()
      engine.current = null
    } finally {
      busy.current = false
    }
  }

  return (
    <div className={styles.player} data-bgm-player>
      <button
        type="button"
        onClick={toggle}
        className={styles.toggle}
        aria-label={enabled ? "关闭背景音乐" : "开启背景音乐"}
        aria-pressed={enabled}
        title={enabled ? "关闭背景音乐" : "开启背景音乐"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          {enabled ? (
            <path d="M5 4h3v12H5zm7 0h3v12h-3z" />
          ) : (
            <path d="M6 3.5v13l10-6.5z" />
          )}
        </svg>
        <span className={styles.label}>
          {enabled
            ? playing
              ? "Lounge · 播放中"
              : "BGM · 等待播放"
            : "BGM · 已关闭"}
        </span>
      </button>
      <details className={styles.settings}>
        <summary aria-label="背景音乐音量设置" title="背景音乐音量设置">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 9v6h4l5 4V5L8 9H4zM17 8a6 6 0 010 8M20 5a10 10 0 010 14" />
          </svg>
        </summary>
        <div className={styles.controls}>
          <strong>AIRPORT LOUNGE</strong>
          <p>电钢琴与颤音琴 · 轻松器乐</p>
          <p>
            <a
              href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100806"
              target="_blank"
              rel="noreferrer"
            >
              Kevin MacLeod · incompetech.com
            </a>
            <br />
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              CC BY 4.0
            </a>{" "}
            · 原始录音，未修改
          </p>
          <label htmlFor="bgm-volume">
            音量 <span>{volume}%</span>
          </label>
          <input
            id="bgm-volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => {
              const next = Number(event.target.value)
              setVolume(next)
              engine.current?.setVolume(next / 100)
            }}
          />
        </div>
      </details>
      {error && (
        <p role="status" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
