import { CanvasTexture, SRGBColorSpace } from "three"

import { PORTFOLIO_MARK } from "@/lib/portfolio-brand"

const TEXTURE_WIDTH = 2048
const TEXTURE_HEIGHT = 302
const MAX_TEXT_WIDTH = TEXTURE_WIDTH * 0.9

function getDisplayFontFamily() {
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-display")
    .trim()

  return family || '"PingFang SC", sans-serif'
}

function drawLogo(context: CanvasRenderingContext2D) {
  const fontFamily = getDisplayFontFamily()
  let fontSize = 220

  context.clearRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)

  while (fontSize > 48) {
    context.font = `600 ${fontSize}px ${fontFamily}`
    if (context.measureText(PORTFOLIO_MARK).width <= MAX_TEXT_WIDTH) break
    fontSize -= 2
  }

  context.fillStyle = "#f2f2f2"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(PORTFOLIO_MARK, TEXTURE_WIDTH / 2, TEXTURE_HEIGHT / 2)
}

function createPortfolioLogoCanvas() {
  const canvas = document.createElement("canvas")
  canvas.width = TEXTURE_WIDTH
  canvas.height = TEXTURE_HEIGHT

  const context = canvas.getContext("2d")
  if (context) drawLogo(context)

  return { canvas, context }
}

export function createPortfolioLogoTexture() {
  const { canvas, context } = createPortfolioLogoCanvas()
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.flipY = false
  texture.name = "FeiFeiPortfolioLogo"

  if (!context) return texture

  void document.fonts.ready.then(() => {
    drawLogo(context)
    texture.needsUpdate = true
  })

  return texture
}
