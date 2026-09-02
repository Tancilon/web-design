import { Vector3 } from "three"

import { useAssets } from "../assets-provider"
import { StaticCharacter } from "./static-character"
import { STATIC_CHARACTER_IDENTITIES } from "./static-character-config"

const SERVICES_CHARACTER_POSITION: [number, number, number] = [4.1, 0.82, -6.55]
const SERVICES_CHARACTER_ROTATION: [number, number, number] = [
  0,
  (70 * Math.PI) / 180,
  0
]
const SERVICES_CHARACTER_LIGHT_DIRECTION = new Vector3(1, 1, -1).normalize()

export function ServicesCharacter() {
  const { servicesModel } = useAssets().characters
  const identity = STATIC_CHARACTER_IDENTITIES.services

  return (
    <StaticCharacter
      model={servicesModel}
      position={SERVICES_CHARACTER_POSITION}
      rotation={SERVICES_CHARACTER_ROTATION}
      lightDirection={SERVICES_CHARACTER_LIGHT_DIRECTION}
      sceneName={identity.sceneName}
      hoverName={identity.hoverName}
      scale={1.15}
    />
  )
}
