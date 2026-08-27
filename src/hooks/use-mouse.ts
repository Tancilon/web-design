"use client"

import { useCallback, useEffect } from "react"
import { create } from "zustand"

interface useCursorProps {
  style: CursorType
  container?: HTMLElement
}

export type CursorTextStyle = "body" | "display"

type CursorType =
  | "default"
  | "grab"
  | "grabbing"
  | "inspect"
  | "zoom-in"
  | "not-allowed"
  | "alias"
  | "pointer"

interface MouseStore {
  hoverText: string | null
  setHoverText: (text: string | null) => void
  hoverTextStyle: CursorTextStyle
  setHoverTextStyle: (style: CursorTextStyle) => void
  cursorType: CursorType
  setCursorType: (type: CursorType) => void
  marquee: boolean | null
  setMarquee: (marquee: boolean | null) => void
}

export const useMouseStore = create<MouseStore>((set) => ({
  hoverText: null,
  setHoverText: (text: string | null) => set({ hoverText: text }),
  hoverTextStyle: "body",
  setHoverTextStyle: (style: CursorTextStyle) => set({ hoverTextStyle: style }),
  cursorType: "default",
  setCursorType: (type: CursorType) => set({ cursorType: type }),
  marquee: false,
  setMarquee: (marquee: boolean | null) => set({ marquee })
}))

export function useCursor(defaultStyle: useCursorProps["style"] = "default") {
  const setHoverText = useMouseStore((state) => state.setHoverText)
  const setHoverTextStyle = useMouseStore((state) => state.setHoverTextStyle)
  const setMarquee = useMouseStore((state) => state.setMarquee)
  const setCursorType = useMouseStore((state) => state.setCursorType)

  useEffect(() => {
    setCursorType(defaultStyle)
    return () => {
      setCursorType("default")
      setHoverText(null)
      setHoverTextStyle("body")
      setMarquee(false)
    }
  }, [defaultStyle, setCursorType, setHoverText, setHoverTextStyle, setMarquee])

  const setCursor = useCallback(
    (
      newStyle: useCursorProps["style"],
      text?: string | null,
      marquee?: boolean | null,
      textStyle: CursorTextStyle = "body"
    ) => {
      if (text !== undefined) {
        setHoverText(text)
        setHoverTextStyle(text ? textStyle : "body")
      }
      setMarquee(marquee !== undefined ? marquee : false)
      setCursorType(newStyle)
    },
    [setHoverText, setHoverTextStyle, setMarquee, setCursorType]
  )

  return setCursor
}
