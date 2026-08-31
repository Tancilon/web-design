import { useEffect, useMemo } from "react"
import { Mesh, MeshStandardMaterial, ShaderMaterial, Vector3 } from "three"

import { useKTX2GLTF } from "@/hooks/use-ktx2-gltf"
import {
  createGlobalShaderMaterial,
  useCustomShaderMaterial
} from "@/shaders/material-global-shader"

interface StaticCharacterProps {
  model: string
  position: [number, number, number]
  rotation: [number, number, number]
  lightDirection: Vector3
  scale?: number
}

export function StaticCharacter({
  model,
  position,
  rotation,
  lightDirection,
  scale = 1
}: StaticCharacterProps) {
  const { scene } = useKTX2GLTF(model)

  const { character, materials } = useMemo(() => {
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

    return { character: clonedScene, materials: shaderMaterials }
  }, [lightDirection, scene])

  useEffect(() => {
    return () => {
      for (const material of materials) {
        useCustomShaderMaterial.getState().removeMaterial(material.id)
        material.dispose()
      }
    }
  }, [materials])

  return (
    <primitive
      object={character}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}
