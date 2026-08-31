import { memo, useCallback, useMemo, useRef } from "react"
import { Color, Group } from "three"

import { useCurrentScene } from "@/hooks/use-current-scene"
import { useFrameCallback } from "@/hooks/use-pausable-time"

import { Character } from "."
import { BlogCharacter } from "./blog-character"
import { generateCharacterIds } from "./character-utils"
import { CharacterAnimationName } from "./characters-config"
import { HomeCharacter } from "./home-character"
import { ServicesCharacter } from "./services-character"

export const CharactersSpawn = memo(CharactersSpawnInner)

const CHARACTERS_IN_OFFICE = 10

const degToRad = (deg: number) => (deg * Math.PI) / 180

function CharactersSpawnInner() {
  const spinningTatoRef = useRef<Group>(null)
  const currentScene = useCurrentScene()

  useFrameCallback(() => {
    if (spinningTatoRef.current) {
      spinningTatoRef.current.rotation.y += 0.01
    }
  })

  const characterIds = useMemo(() => {
    return generateCharacterIds(CHARACTERS_IN_OFFICE)
  }, [])

  const getCharacterId = useCallback(
    (num: number) => {
      return num < CHARACTERS_IN_OFFICE ? characterIds[num] : 0
    },
    [characterIds]
  )

  // return (
  //   <group position={[6, 0, -13]}>
  //     {Array.from({ length: 2 }).map((_, rowIndex) =>
  //       Array.from({ length: 5 }).map((_, colIndex) => (
  //         <Character
  //           characterId={getCharacterId(rowIndex * 5 + colIndex)}
  //           key={`${rowIndex}-${colIndex}`}
  //           position={[rowIndex * 1, 0, colIndex * 1]}
  //           rotation={[0, Math.PI / -2, 0]}
  //           animationName={CharacterAnimationName["Services.01"]}
  //         />
  //       ))
  //     )}
  //   </group>
  // )

  return (
    <>
      <HomeCharacter />
      {currentScene === "services" && <ServicesCharacter />}
      {/* Downstairs01 */}
      <Character
        characterId={getCharacterId(2)}
        position={[3.32, 0.03, -16.57]}
        rotation={[0, degToRad(70), 0]}
        animationName={CharacterAnimationName["People.02.a"]}
        initialTime={0.5}
        // debugLight
        uniforms={{
          uLightDirection: {
            value: [-1, 0, 0, 1]
          },
          uLightColor: {
            value: [...new Color("#a9abff").toArray(), 1]
          },
          uPointLightPosition: {
            value: [3.8, 1.1, -16.5, 0.6]
          },
          uPointLightColor: {
            value: [...new Color("#cecfff").toArray(), 5]
          }
        }}
      />
      {/* Downstairs02 */}
      <Character
        characterId={getCharacterId(3)}
        position={[4.55, 0.03, -17.53]}
        rotation={[0, degToRad(-20), 0]}
        animationName={CharacterAnimationName["People.02.a"]}
        // debugLight
        uniforms={{
          uLightDirection: {
            value: [-1, 0, 0, 0]
          },
          uLightColor: {
            value: [...new Color("#a9abff").toArray(), 1]
          },
          uPointLightPosition: {
            value: [4.55, 1.1, -17.1, 0.6]
          },
          uPointLightColor: {
            value: [...new Color("#cecfff").toArray(), 10]
          }
        }}
      />
      {currentScene === "blog" && <BlogCharacter />}
    </>
  )
}
