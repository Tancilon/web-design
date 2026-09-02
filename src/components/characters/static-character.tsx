import { MeshDiscardMaterial } from "@react-three/drei"
import { useEffect, useMemo } from "react"
import {
  Box3,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  Vector3
} from "three"

import { useCurrentScene } from "@/hooks/use-current-scene"
import { useKTX2GLTF } from "@/hooks/use-ktx2-gltf"
import { useCursor } from "@/hooks/use-mouse"
import {
  createGlobalShaderMaterial,
  useCustomShaderMaterial
} from "@/shaders/material-global-shader"

interface StaticCharacterProps {
  model: string
  position: [number, number, number]
  rotation: [number, number, number]
  lightDirection: Vector3
  sceneName: string
  hoverName: string
  scale?: number
}

export function StaticCharacter({
  model,
  position,
  rotation,
  lightDirection,
  sceneName,
  hoverName,
  scale = 1
}: StaticCharacterProps) {
  const { scene } = useKTX2GLTF(model)
  const currentScene = useCurrentScene()
  const setCursor = useCursor()
  const isActiveScene = currentScene === sceneName

  const { character, materials, hitbox } = useMemo(() => {
    const clonedScene = scene.clone(true)
    const shaderMaterials: ShaderMaterial[] = []

    clonedScene.traverse((object) => {
      if (!(object instanceof Mesh)) return

      const sourceMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      const mappedMaterials = sourceMaterials.map((sourceMaterial) => {
        if (!(sourceMaterial instanceof MeshStandardMaterial)) {
          return sourceMaterial.clone()
        }

        const baseMaterial = sourceMaterial.clone()
        baseMaterial.userData.lightDirection = lightDirection.clone()

        const shaderMaterial = createGlobalShaderMaterial(baseMaterial, {
          LIGHT: true,
          FOG: true
        })
        shaderMaterials.push(shaderMaterial)
        return shaderMaterial
      })

      object.material =
        mappedMaterials.length === 1 ? mappedMaterials[0] : mappedMaterials

      // Static characters are decorative and must not intercept scene hotspots.
      object.raycast = () => undefined
      object.userData.hasGlobalMaterial = true
    })

    clonedScene.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(clonedScene, true)
    const center = bounds.getCenter(new Vector3())
    const size = bounds.getSize(new Vector3())

    return {
      character: clonedScene,
      materials: shaderMaterials,
      hitbox: {
        position: center.toArray() as [number, number, number],
        size: size.toArray() as [number, number, number]
      }
    }
  }, [lightDirection, scene])

  useEffect(() => {
    return () => {
      for (const material of materials) {
        useCustomShaderMaterial.getState().removeMaterial(material.id)
        material.dispose()
      }
    }
  }, [materials])

  useEffect(() => {
    if (!isActiveScene) setCursor("default", null)
  }, [isActiveScene, setCursor])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={character} />
      {isActiveScene && (
        <mesh
          position={hitbox.position}
          onPointerOver={(event) => {
            event.stopPropagation()
            setCursor("default", hoverName)
          }}
          onPointerOut={(event) => {
            event.stopPropagation()
            setCursor("default", null)
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <boxGeometry args={hitbox.size} />
          <MeshDiscardMaterial />
        </mesh>
      )}
    </group>
  )
}
