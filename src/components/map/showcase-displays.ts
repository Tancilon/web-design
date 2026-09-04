import {
  BoxGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
  Texture
} from "three"

import { SHOWCASE_DISPLAYS } from "@/lib/3d-config/showcase-displays"

/** Run before material conversion and recording inspectable rest transforms. */
export function applyShowcaseDisplays(items: Object3D, textures: Texture[]) {
  SHOWCASE_DISPLAYS.forEach((display, index) => {
    const original = items.getObjectByName(display.mesh)
    const texture = textures[index]
    if (!original || !texture || original.userData.isShowcaseFrame) return
    const root = original instanceof Mesh ? original : new Mesh()
    if (root !== original) {
      root.name = original.name
      root.position.copy(original.position)
      original.parent?.add(root)
      original.removeFromParent()
    }

    const image = texture.image as { width: number; height: number }
    texture.colorSpace = SRGBColorSpace
    texture.flipY = true
    texture.generateMipmaps = true
    texture.magFilter = LinearFilter
    texture.minFilter = LinearMipmapLinearFilter
    texture.anisotropy = 8
    texture.needsUpdate = true

    const border = 0.012
    const depth = 0.018
    const height = display.height - border * 2
    const width = (height * image.width) / image.height

    // Detach straps, glass, screens and poster overlays; don't dispose shared GLB assets.
    root.clear()
    root.geometry = new BoxGeometry(width + border * 2, display.height, depth)
    root.material = new MeshStandardMaterial({
      name: "ShowcaseFrame",
      color: 0x11100f,
      roughness: 0.48,
      metalness: 0.16
    })
    root.rotation.set(0, Math.PI / 2, 0)
    root.scale.setScalar(1)
    if (display.bottom !== null)
      root.position.y = display.bottom + display.height / 2

    const picture = new Mesh(
      new PlaneGeometry(width, height),
      new MeshStandardMaterial({
        name: "ShowcasePicture",
        map: texture,
        roughness: 0.72
      })
    )
    picture.name = `${root.name}_Picture`
    picture.position.z = depth / 2 + 0.0005
    const glass = new Mesh(
      new PlaneGeometry(width, height),
      new MeshStandardMaterial({
        name: "ShowcaseGlass",
        transparent: true,
        opacity: 0.035,
        roughness: 0.12,
        metalness: 0.08,
        depthWrite: false
      })
    )
    glass.name = `${root.name}_Glass`
    glass.position.z = depth / 2 + 0.001
    root.add(picture, glass)
    root.userData.isShowcaseFrame = true
  })
}
