export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const valueRemap = (
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) => start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))

export const normalizeDelta = (delta: number) =>
  Math.round(((1000 * delta) / 8) * 10_000) / 10_000
