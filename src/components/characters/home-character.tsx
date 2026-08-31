import { Vector3 } from "three"

import { useAssets } from "../assets-provider"
import { StaticCharacter } from "./static-character"

const HOME_CHARACTER_POSITION: [number, number, number] = [2.62, 0.66, -10.16]
const HOME_CHARACTER_ROTATION: [number, number, number] = [
  0,
  (50 * Math.PI) / 180,
  0
]
const HOME_CHARACTER_LIGHT_DIRECTION = new Vector3(-0.35, 0.8, 0.45).normalize()

export function HomeCharacter() {
  const { homeModel } = useAssets().characters

  return (
    <StaticCharacter
      model={homeModel}
      position={HOME_CHARACTER_POSITION}
      rotation={HOME_CHARACTER_ROTATION}
      lightDirection={HOME_CHARACTER_LIGHT_DIRECTION}
    />
  )
}
