import { Vector3 } from "three"

import { useAssets } from "../assets-provider"
import { StaticCharacter } from "./static-character"
import { STATIC_CHARACTER_IDENTITIES } from "./static-character-config"

const BLOG_CHARACTER_POSITION: [number, number, number] = [9.21, 4.03, -17.82]
const BLOG_CHARACTER_ROTATION: [number, number, number] = [
  0,
  (15 * Math.PI) / 180,
  0
]
const BLOG_CHARACTER_LIGHT_DIRECTION = new Vector3(0.4, 0.4, 0).normalize()

export function BlogCharacter() {
  const { blogModel } = useAssets().characters
  const identity = STATIC_CHARACTER_IDENTITIES.blog

  return (
    <StaticCharacter
      model={blogModel}
      position={BLOG_CHARACTER_POSITION}
      rotation={BLOG_CHARACTER_ROTATION}
      lightDirection={BLOG_CHARACTER_LIGHT_DIRECTION}
      sceneName={identity.sceneName}
      hoverName={identity.hoverName}
    />
  )
}
