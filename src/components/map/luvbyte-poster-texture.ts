import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  ShaderMaterial,
  SRGBColorSpace
} from "three"

// Pixel coordinates in the original 1024 × 1024 TX_Poster atlas.
// Cover the two large titles and the third poster's vertical wordmark.
// Photography, captions, borders and the two small posters remain original.
const WORDMARKS = [
  { x: 7, y: 9, width: 346, height: 81, color: "#dededc", vertical: false },
  { x: 366, y: 3, width: 356, height: 119, color: "#ed460d", vertical: false },
  { x: 668, y: 675, width: 40, height: 344, color: "#dededc", vertical: true }
]
const SCALE = 2
let overlayTexture: CanvasTexture | undefined

function createOverlay() {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1024 * SCALE
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Unable to create the poster wordmark canvas")

  const texture = new CanvasTexture(canvas)
  texture.name = "LUVBYTE-poster-wordmarks"
  texture.colorSpace = SRGBColorSpace
  texture.flipY = false
  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipmapLinearFilter

  const draw = () => {
    const family =
      getComputedStyle(document.body)
        .getPropertyValue("--font-display")
        .trim() || '"Arial Black", sans-serif'
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0)
    context.clearRect(0, 0, 1024, 1024)

    for (const box of WORDMARKS) {
      context.fillStyle = "#0c0c0c"
      context.fillRect(box.x, box.y, box.width, box.height)
      // Fit visible ink bounds to the original title, including the tall
      // red typography, without depending on font baseline/line-box metrics.
      context.font = `900 100px ${family}`
      const metrics = context.measureText("LUVBYTE")
      const inkWidth =
        metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
      const inkHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
      context.save()
      if (box.vertical) {
        // The original sidebar reads bottom to top along the poster edge.
        context.translate(box.x + 3, box.y + box.height - 4)
        context.rotate(-Math.PI / 2)
        context.scale((box.height - 8) / inkWidth, (box.width - 6) / inkHeight)
      } else {
        context.translate(box.x + 3, box.y + 4)
        context.scale((box.width - 6) / inkWidth, (box.height - 8) / inkHeight)
      }
      context.fillStyle = box.color
      context.fillText(
        "LUVBYTE",
        metrics.actualBoundingBoxLeft,
        metrics.actualBoundingBoxAscent
      )
      context.restore()

      // Deterministic print grain matches the surrounding printed artwork.
      for (let y = box.y; y < box.y + box.height; y += 2) {
        for (let x = box.x; x < box.x + box.width; x += 2) {
          const grain = ((x * 17 + y * 31) % 13) / 180
          context.fillStyle = `rgba(0,0,0,${grain})`
          context.fillRect(x, y, 1, 1)
        }
      }
    }
    texture.needsUpdate = true
  }

  draw()
  void document.fonts.ready.then(draw)
  return texture
}

export function applyLuvbytePosterOverlay(
  material: ShaderMaterial,
  enabled: boolean
) {
  overlayTexture ??= createOverlay()
  material.uniforms.posterWordmarks = { value: overlayTexture }
  material.uniforms.posterWordmarksEnabled = { value: enabled }
  material.fragmentShader = material.fragmentShader
    .replace(
      "uniform sampler2D map;",
      "uniform sampler2D map;\nuniform sampler2D posterWordmarks;\nuniform bool posterWordmarksEnabled;"
    )
    .replace(
      "vec3 color = baseColor * mapSample.rgb;",
      `if (posterWordmarksEnabled) {
      vec4 wordmark = texture2D(posterWordmarks, mapUv);
      mapSample.rgb = mix(mapSample.rgb, wordmark.rgb, wordmark.a);
    }
    vec3 color = baseColor * mapSample.rgb;`
    )
  material.needsUpdate = true
}
