// Locally hosted recording. See public/audio/CREDITS.txt for attribution.
export class AmbientMusic {
  private audio = new Audio("/audio/airport-lounge.mp3")
  private active = false
  onstatechange: (() => void) | null = null

  constructor(volume: number) {
    this.audio.loop = true
    this.audio.preload = "metadata"
    this.setVolume(volume)
    this.audio.onplaying = () => this.update(true)
    this.audio.onpause = () => this.update(false)
    this.audio.onwaiting = () => this.update(false)
    this.audio.onerror = () => this.update(false)
  }

  private update(playing: boolean) {
    this.active = playing
    this.onstatechange?.()
  }

  get isPlaying() {
    return this.active
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume))
  }

  async play() {
    if (this.audio.paused) await this.audio.play()
  }

  async pause() {
    this.audio.pause()
  }

  dispose() {
    this.onstatechange = null
    this.audio.onplaying = null
    this.audio.onpause = null
    this.audio.onwaiting = null
    this.audio.onerror = null
    this.audio.pause()
    this.audio.removeAttribute("src")
    this.audio.load()
  }
}
