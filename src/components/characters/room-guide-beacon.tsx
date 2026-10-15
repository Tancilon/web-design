import { Html } from "@react-three/drei"

import styles from "@/components/layout/room-guide.module.css"
import { useRoomGuide } from "@/components/layout/room-guide-store"
import { useAppLoadingStore } from "@/components/loading/app-loading-handler"
import { useNavigationStore } from "@/components/navigation-handler/navigation-store"

export function RoomGuideBeacon() {
  const home = useNavigationStore(
    (state) => state.currentScene?.name === "home"
  )
  const transitioning = useNavigationStore(
    (state) => state.isCameraTransitioning
  )
  const ready = useAppLoadingStore((state) => state.canRunMainApp)
  const open = useRoomGuide((state) => state.open)
  const inView = useRoomGuide((state) => state.inView)
  if (!home || !ready || transitioning || !inView || open) return null
  return (
    <Html position={[2.62, 2.3, -10.16]} center zIndexRange={[90, 80]}>
      <button
        className={styles.beacon}
        aria-label="和 RYN 聊聊，了解各个房间的功能"
        aria-expanded={false}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          useRoomGuide.setState({ open: true })
        }}
      >
        <span className={styles.beaconCopy}>
          <span className={styles.beaconLabel}>
            RYN <span aria-hidden="true">/</span> 空间向导
          </span>
          <span className={styles.beaconTitle}>一起逛逛这个世界</span>
        </span>
        <span className={styles.beaconArrow} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6H18V18" />
          </svg>
        </span>
      </button>
    </Html>
  )
}
