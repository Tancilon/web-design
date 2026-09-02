import {
  BoxGeometry,
  BufferAttribute,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
  Texture
} from "three"

const SERVICE_AWARDS = [
  { mesh: "SM_SOTD_01", textureIndex: 0 },
  { mesh: "SM_SOTD_02", textureIndex: 1 }
] as const

const CABINET_AWARDS = [
  { mesh: "SM_WebbyKidSuper", textureIndex: 2 },
  { mesh: "SM_WebbyMrBeast", textureIndex: 3 }
] as const

const AWARD_SURFACE_MATERIAL = "TX_SOTD"

function normalizeAwardUv(mesh: Mesh) {
  const uv = mesh.geometry.getAttribute("uv")
  if (!(uv instanceof BufferAttribute) || uv.count === 0) return

  let minU = Infinity
  let maxU = -Infinity
  let minV = Infinity
  let maxV = -Infinity

  for (let index = 0; index < uv.count; index += 1) {
    minU = Math.min(minU, uv.getX(index))
    maxU = Math.max(maxU, uv.getX(index))
    minV = Math.min(minV, uv.getY(index))
    maxV = Math.max(maxV, uv.getY(index))
  }

  const width = maxU - minU
  const height = maxV - minV
  if (width <= 0 || height <= 0) return

  const normalizedUv = uv.clone()
  for (let index = 0; index < normalizedUv.count; index += 1) {
    normalizedUv.setXY(
      index,
      (uv.getX(index) - minU) / width,
      (uv.getY(index) - minV) / height
    )
  }

  const geometry = mesh.geometry.clone()
  geometry.setAttribute("uv", normalizedUv)
  mesh.geometry = geometry
}

function prepareAwardTexture(texture: Texture, flipY: boolean) {
  texture.colorSpace = SRGBColorSpace
  texture.flipY = flipY
  texture.generateMipmaps = true
  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipmapLinearFilter
  texture.anisotropy = 8
  texture.needsUpdate = true
}

function replaceAwardSurface(root: Object3D, texture: Texture) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return

    const currentMaterials = Array.isArray(child.material)
      ? child.material
      : [child.material]
    let replaced = false

    const nextMaterials = currentMaterials.map((material) => {
      if (
        !(material instanceof MeshStandardMaterial) ||
        material.name !== AWARD_SURFACE_MATERIAL
      ) {
        return material
      }

      const awardMaterial = material.clone()
      normalizeAwardUv(child)
      awardMaterial.map = texture
      awardMaterial.color.set(0xffffff)
      awardMaterial.needsUpdate = true
      replaced = true

      return awardMaterial
    })

    if (!replaced) return
    child.material = Array.isArray(child.material)
      ? nextMaterials
      : nextMaterials[0]
  })
}

function createCabinetAwardFrame(root: Object3D, texture: Texture) {
  if (!(root instanceof Mesh) || root.userData.isServiceAwardFrame) return

  const image = texture.image as { width?: number; height?: number } | undefined
  const aspect =
    image?.width && image?.height ? image.width / image.height : 0.71
  const certificateHeight = 0.34
  const certificateWidth = certificateHeight * aspect
  const border = 0.012
  const depth = 0.018

  root.geometry = new BoxGeometry(
    certificateWidth + border * 2,
    certificateHeight + border * 2,
    depth
  )
  root.material = new MeshStandardMaterial({
    name: "Mtl_ServiceAwardFrame",
    color: 0x11100f,
    metalness: 0.16,
    roughness: 0.48
  })
  root.rotation.set(0, Math.PI / 2, 0)
  root.scale.setScalar(1)

  const certificate = new Mesh(
    new PlaneGeometry(certificateWidth, certificateHeight),
    new MeshStandardMaterial({
      name: "Mtl_ServiceAwardCertificate",
      color: 0xffffff,
      map: texture,
      metalness: 0,
      roughness: 0.72
    })
  )
  certificate.name = `${root.name}_Certificate`
  certificate.position.z = depth / 2 + 0.0005
  root.add(certificate)

  const glass = new Mesh(
    new PlaneGeometry(certificateWidth, certificateHeight),
    new MeshStandardMaterial({
      name: "Mtl_ServiceAwardGlass",
      color: 0xffffff,
      transparent: true,
      opacity: 0.055,
      metalness: 0.08,
      roughness: 0.12,
      depthWrite: false
    })
  )
  glass.name = `${root.name}_Glass`
  glass.position.z = depth / 2 + 0.001
  root.add(glass)

  root.userData.isServiceAwardFrame = true
}

export function applyServiceAwardDisplays(
  officeItems: Object3D,
  textures: Texture[]
) {
  SERVICE_AWARDS.forEach(({ textureIndex }) => {
    const texture = textures[textureIndex]
    if (texture) prepareAwardTexture(texture, false)
  })

  CABINET_AWARDS.forEach(({ textureIndex }) => {
    const texture = textures[textureIndex]
    if (texture) prepareAwardTexture(texture, true)
  })

  SERVICE_AWARDS.forEach(({ mesh, textureIndex }) => {
    const award = officeItems.getObjectByName(mesh)
    const texture = textures[textureIndex]
    if (award && texture) replaceAwardSurface(award, texture)
  })

  CABINET_AWARDS.forEach(({ mesh, textureIndex }) => {
    const award = officeItems.getObjectByName(mesh)
    const texture = textures[textureIndex]
    if (award && texture) createCabinetAwardFrame(award, texture)
  })
}
