import { motion, useAnimation } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { PORTFOLIO_CONTACT } from "@/lib/portfolio-contact"

import { Link } from "../primitives/link"
import { useContactStore } from "./contact-store"

export const ContactScreen = () => {
  const contentRef = useRef(null)
  const animation = useAnimation()
  const worker = useContactStore((state) => state.worker)
  const closeContact = useContactStore.getState().setIsContactOpen

  const [screenDimensions, setScreenDimensions] = useState({
    width: 580,
    height: 350
  })

  useEffect(() => {
    if (!worker) return

    const handleMessage = (event: MessageEvent) => {
      const { type, screenPos, dimensions } = event.data

      if (type === "update-screen-skinned-matrix") {
        if (contentRef.current) {
          const element = contentRef.current as HTMLDivElement
          element.style.left = `${screenPos.x * 100 + 0.2}%`
          element.style.top = `${screenPos.y * 100}%`
        }
      } else if (type === "intro-complete") {
        animation
          .start({
            scaleX: [0, 0, 1, 1],
            scaleY: [0, 0.01, 0.01, 1],
            transition: {
              duration: 0.4,
              times: [0, 0.2, 0.6, 1],
              ease: "easeOut"
            }
          })
          .then(() => {
            useContactStore.getState().setIntroCompleted(true)
            useContactStore.getState().setIsAnimating(false)
            worker.postMessage({ type: "scale-animation-complete" })
          })
      } else if (type === "start-outro") {
        animation
          .start({
            scaleX: [1, 1, 0, 0],
            scaleY: [1, 0.01, 0.01, 0],
            transition: {
              duration: 0.4,
              times: [0, 0.4, 0.8, 1],
              ease: "easeIn"
            }
          })
          .then(() => {
            worker.postMessage({ type: "run-outro-animation" })
          })
      } else if (type === "outro-complete") {
        setTimeout(() => {
          useContactStore.getState().setIsAnimating(false)
          worker.postMessage({ type: "scale-down-animation-complete" })
        }, 500)
      } else if (type === "screen-dimensions") {
        setScreenDimensions(dimensions)
      }
    }

    worker.addEventListener("message", handleMessage)
    return () => worker.removeEventListener("message", handleMessage)
  }, [worker, animation])

  const handleClose = () => {
    const state = useContactStore.getState()
    if (!state.isAnimating) closeContact(false)
  }

  return (
    <div
      ref={contentRef}
      className="contact-screen absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="relative flex bg-transparent"
        style={{
          width: "580px",
          height: "350px",
          transform: `perspective(400px) rotateY(0.5deg) scale(${screenDimensions.width / 580}, ${screenDimensions.height / 350})`,
          transformOrigin: "center center"
        }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ scaleX: 0, scaleY: 0 }}
          animate={animation}
        >
          <div className="relative z-20 flex h-full w-full flex-col justify-between gap-7 font-flauta text-[14px] text-brand-o">
            <section className="relative flex h-full w-full flex-col justify-between gap-4 border border-brand-o pb-4 pt-6 uppercase [box-shadow:0_0_5px_rgba(255,140,0,0.15)]">
              <fieldset className="absolute -top-[10px] left-[10px] z-10 -ml-px p-0">
                <legend className="bg-black px-1">PERSONAL CONTACT</legend>
              </fieldset>

              <fieldset className="absolute -top-[10px] right-[10px] z-10 -mr-px p-0">
                <legend className="px-1">
                  <button
                    type="button"
                    className="bg-black px-1 uppercase transition-opacity duration-300 hover:opacity-70"
                    onClick={handleClose}
                  >
                    CLOSE
                  </button>
                </legend>
              </fieldset>

              <div className="flex h-full flex-col justify-between gap-5 px-5 font-sans normal-case">
                <div className="flex items-end justify-between gap-6 border-b border-dashed border-brand-o pb-4">
                  <div>
                    <p className="mb-1 text-xs uppercase opacity-60">
                      UX / VISUAL DESIGN
                    </p>
                    <h2 className="font-display text-[34px] font-semibold leading-none text-brand-o">
                      {PORTFOLIO_CONTACT.name}
                    </h2>
                  </div>
                  <div className="text-right text-sm leading-relaxed">
                    <p>{PORTFOLIO_CONTACT.englishName}</p>
                    <p>{PORTFOLIO_CONTACT.role}</p>
                  </div>
                </div>

                <dl className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 text-sm">
                  <dt className="uppercase opacity-60">Phone</dt>
                  <dd>
                    <Link href={PORTFOLIO_CONTACT.phoneHref}>
                      <span className="actionable">
                        {PORTFOLIO_CONTACT.phone}
                      </span>
                    </Link>
                  </dd>
                  <dt className="uppercase opacity-60">Email</dt>
                  <dd>
                    <Link href={PORTFOLIO_CONTACT.emailHref}>
                      <span className="actionable">
                        {PORTFOLIO_CONTACT.email}
                      </span>
                    </Link>
                  </dd>
                  <dt className="uppercase opacity-60">Location</dt>
                  <dd>{PORTFOLIO_CONTACT.location}</dd>
                </dl>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={PORTFOLIO_CONTACT.phoneHref}
                    className="border border-brand-o px-3 py-2 text-center font-flauta uppercase transition-colors hover:bg-brand-o hover:text-black"
                  >
                    CALL NOW
                  </Link>
                  <Link
                    href={PORTFOLIO_CONTACT.emailHref}
                    className="bg-brand-o px-3 py-2 text-center font-flauta uppercase text-black transition-opacity hover:opacity-80"
                  >
                    SEND EMAIL →
                  </Link>
                </div>
              </div>
            </section>

            <div className="flex w-full items-center justify-between text-[12px] uppercase">
              <span>AVAILABLE FOR UX / VISUAL DESIGN</span>
              <span>{PORTFOLIO_CONTACT.location} · CHINA</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
