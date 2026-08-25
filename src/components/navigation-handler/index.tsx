"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"

import { useAssets } from "@/components/assets-provider"
import { useContactStore } from "@/components/contact/contact-store"
import { useInspectable } from "@/components/inspectables/context"
import { useCurrentScene } from "@/hooks/use-current-scene"
import { useHandleNavigation } from "@/hooks/use-handle-navigation"
import { useKeyPress } from "@/hooks/use-key-press"

import { IScene } from "./navigation.interface"
import { useNavigationStore } from "./navigation-store"

export const NavigationHandler = () => {
  const pathname = usePathname()
  const { setSelected } = useInspectable()
  const previousPathRef = useRef(pathname)
  const previousIsNotFoundRef = useRef(false)

  const setScenes = useNavigationStore((state) => state.setScenes)
  const isNotFound = useNavigationStore((state) => state.isNotFound)
  const isCanvasTabMode = useNavigationStore((state) => state.isCanvasTabMode)
  const setIsCanvasTabMode = useNavigationStore(
    (state) => state.setIsCanvasTabMode
  )
  const currentScene = useNavigationStore((state) => state.currentScene)
  const setCurrentScene = useNavigationStore((state) => state.setCurrentScene)
  const currentTabIndex = useNavigationStore((state) => state.currentTabIndex)
  const setEnteredByKeyboard = useNavigationStore(
    (state) => state.setEnteredByKeyboard
  )
  const scenes: IScene[] = useAssets().scenes
  const { handleNavigation } = useHandleNavigation()
  const scene = useCurrentScene()
  const { selected } = useInspectable()

  useEffect(() => setScenes(scenes), [scenes, setScenes])

  useEffect(() => {
    const handleContactFormNavigate = (event: CustomEvent) => {
      const path = event.detail?.path
      if (path) {
        handleNavigation(path)
      }
    }

    window.addEventListener(
      "contactFormNavigate",
      handleContactFormNavigate as EventListener
    )

    return () => {
      window.removeEventListener(
        "contactFormNavigate",
        handleContactFormNavigate as EventListener
      )
    }
  }, [handleNavigation])

  const setCurrentTabIndex = useNavigationStore(
    (state) => state.setCurrentTabIndex
  )

  useEffect(() => {
    if (!scenes.length || !pathname) return

    // notFound() doesn't change pathname, so also re-run when the flag flips —
    // including 404 -> page, where pathname may update a render before the flag
    // clears, leaving the scene stuck on 404 if we early-return on the next run.
    const isNotFoundChanged = previousIsNotFoundRef.current !== isNotFound
    previousIsNotFoundRef.current = isNotFound

    if (
      previousPathRef.current === pathname &&
      !isNotFound &&
      !isNotFoundChanged
    ) {
      previousPathRef.current = pathname
      return
    }

    const isFromPostToBlog =
      previousPathRef.current.startsWith("/post/") && pathname === "/blog"

    const expectedScene = isNotFound
      ? scenes.find((scene) => scene.name === "404")
      : pathname === "/" || pathname === "/index"
        ? scenes.find((scene) => scene.name.toLowerCase() === "home")
        : pathname.startsWith("/post/")
          ? scenes.find((scene) => scene.name === "blog")
          : scenes.find((scene) => scene.name === pathname.split("/")[1])

    if (
      expectedScene &&
      currentScene &&
      (expectedScene.name !== currentScene.name || isFromPostToBlog)
    ) {
      setCurrentScene(expectedScene)
    }

    previousPathRef.current = pathname
  }, [pathname, scenes, currentScene, setCurrentScene, isNotFound])

  useEffect(() => {
    if (!scenes.length) return

    setSelected(null)

    if (isNotFound) {
      const notFoundScene = scenes.find((scene) => scene.name === "404")
      if (notFoundScene) setCurrentScene(notFoundScene)
      return
    }

    if (pathname === "/contact") {
      const expectedScene = scenes.find(
        (scene) => scene.name.toLowerCase() === "home"
      )
      if (expectedScene) {
        setCurrentScene(expectedScene)
      }
      return
    }

    const currentScene =
      pathname === "/" || pathname === "/index"
        ? scenes.find((scene) => scene.name.toLowerCase() === "home")
        : pathname.startsWith("/post/")
          ? scenes.find((scene) => scene.name === "blog")
          : scenes.find((scene) => scene.name === pathname.split("/")[1])

    if (!currentScene) {
      const notFoundScene = scenes.find((scene) => scene.name === "404")
      if (notFoundScene) {
        setCurrentScene(notFoundScene)
      }
      return
    }

    if (currentScene.name !== scene) {
      setCurrentScene(currentScene)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes, setSelected, setCurrentTabIndex])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !isCanvasTabMode) return

      if (!currentScene?.tabs?.length) {
        setIsCanvasTabMode(false)
        return
      }

      e.preventDefault()
      const newIndex = e.shiftKey ? currentTabIndex - 1 : currentTabIndex + 1

      if (newIndex < 0 || newIndex >= currentScene.tabs.length) {
        setIsCanvasTabMode(false)

        setTimeout(() => {
          const tabEvent = new KeyboardEvent("keydown", {
            key: "Tab",
            bubbles: true,
            cancelable: true,
            shiftKey: e.shiftKey
          })
          document.dispatchEvent(tabEvent)
        }, 0)

        return
      }

      setCurrentTabIndex(newIndex)
    },
    [
      isCanvasTabMode,
      setCurrentTabIndex,
      currentTabIndex,
      currentScene,
      setIsCanvasTabMode
    ]
  )

  useEffect(() => {
    if (pathname !== "/" && currentTabIndex !== -1) {
      setCurrentTabIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentTabIndex, pathname])

  useEffect(() => setSelected(null), [setSelected])

  useKeyPress("Tab", handleKeyDown)
  useKeyPress(
    "Escape",
    useCallback(() => {
      if (useContactStore.getState().isContactOpen) return
      if (selected) {
        setSelected(null)
        return
      }

      if (
        pathname === "/" ||
        pathname === "/index" ||
        !scenes ||
        window.scrollY > window.innerHeight
      )
        return

      const trimmedPathname = pathname.replace("/", "")
      const tabIndex = scenes[0].tabs.findIndex(
        (tab) => tab.tabName.toLowerCase() === trimmedPathname
      )

      if (
        scene === "services" ||
        scene === "blog" ||
        scene === "basketball" ||
        scene === "showcase"
      ) {
        const enteredByKeyboard =
          useNavigationStore.getState().enteredByKeyboard
        handleNavigation("/")
        if (enteredByKeyboard) {
          setCurrentTabIndex(tabIndex)
        }
        setEnteredByKeyboard(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      scene,
      handleNavigation,
      pathname,
      scenes,
      setCurrentTabIndex,
      selected
    ])
  )

  return null
}
