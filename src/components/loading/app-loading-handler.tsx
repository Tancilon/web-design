"use client"

import { useEffect } from "react"
import { create } from "zustand"

import {
  armCanvasBootDeadline,
  captureCanvasBootRecovery,
  captureCanvasBootTimeout,
  startCanvasBootTrace,
  stopCanvasBootTrace
} from "@/lib/canvas-boot"

// Readiness is reported from inside the R3F tree (<Bakes/>). Keep a bounded
// monitor even though the former visual loading overlay has been removed.
const CANVAS_BOOT_TIMEOUT_MS = 20_000

interface AppLoadingState {
  isCanvasInPage: boolean
  canvasVisible: boolean
  canRunMainApp: boolean
  canvasUnavailable: boolean
  canvasBootTimedOut: boolean
  setCanRunMainApp: (canRunMainApp: boolean) => void
  reportCanvasUnavailable: () => void
}

export const useAppLoadingStore = create<AppLoadingState>((set, get) => {
  const store: AppLoadingState = {
    // Sticky: once true the <Scene/> stays mounted so the WebGL context
    // persists across navigations.
    isCanvasInPage: false,
    // Current route's canvas visibility (toggled per route by <SetCanvasMode>).
    canvasVisible: false,
    // The renderer stays black until critical map materials are ready.
    canRunMainApp: false,
    /**
     * Set by the error boundary, the WebGL2 probe, or a failed context creation
     */
    canvasUnavailable: false,
    /**
     * The scene never reported readiness, so 3D interactions will never work
     */
    canvasBootTimedOut: false,
    // Reveals the main renderer once its critical resources are ready.
    setCanRunMainApp: (canRunMainApp) => {
      if (canRunMainApp && get().canvasBootTimedOut) captureCanvasBootRecovery()

      set({ canRunMainApp, canvasBootTimedOut: false })
    },
    /**
     * Vetoes the canvas; <CanvasLayer/> unmounts the whole subtree from here
     */
    reportCanvasUnavailable: () => {
      if (get().canvasUnavailable) return

      set({ canvasUnavailable: true })
    }
  }
  return store
})

export const AppLoadingHandler = () => {
  const isCanvasInPage = useAppLoadingStore((state) => state.isCanvasInPage)
  const canRunMainApp = useAppLoadingStore((state) => state.canRunMainApp)
  const canvasUnavailable = useAppLoadingStore(
    (state) => state.canvasUnavailable
  )
  useEffect(() => {
    // <SetCanvasMode> re-arms isCanvasInPage on navigation, so skip when WebGL
    // is already known dead.
    if (!isCanvasInPage || canRunMainApp || canvasUnavailable) return

    // Starts the clock on the same tick the budget is armed, so both are
    // measured against the same t0.
    startCanvasBootTrace()

    // Counts down only while the tab is visible, so a backgrounded tab is never
    // charged for a boot it was never given the frames to finish.
    armCanvasBootDeadline(CANVAS_BOOT_TIMEOUT_MS, () => {
      // A slow scene may still arrive, so don't mark the canvas unavailable.
      useAppLoadingStore.setState({ canvasBootTimedOut: true })

      captureCanvasBootTimeout(CANVAS_BOOT_TIMEOUT_MS)
    })

    return () => stopCanvasBootTrace()
  }, [isCanvasInPage, canRunMainApp, canvasUnavailable])

  return null
}
