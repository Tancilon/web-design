export class AudioSource {
  public audioSource: AudioBufferSourceNode | undefined
  private audioContext: AudioContext
  private buffer: AudioBuffer
  public outputNode: GainNode
  public isPlaying: boolean
  private startedAt = 0
  private pausedAt = 0
  public loop = false
  private pitch = 1
  public isSFX: boolean = false
  public originalVolume?: number

  constructor(
    audioPlayer: WebAudioPlayer,
    buffer: AudioBuffer,
    isSFX: boolean = false
  ) {
    this.audioContext = audioPlayer.audioContext
    this.outputNode = this.audioContext.createGain()
    this.outputNode.connect(audioPlayer.masterOutput)
    this.buffer = buffer
    this.isPlaying = false
    this.isSFX = isSFX
  }

  play() {
    if (this.isPlaying) {
      this?.stop()
    }

    this.audioSource = this.audioContext.createBufferSource()
    this.audioSource.buffer = this.buffer
    this.audioSource.loop = this.loop
    this.audioSource.playbackRate.value = this.pitch
    this.audioSource.connect(this.outputNode)

    let offset = this.pausedAt
    if (this.loop) {
      offset = this.pausedAt % this.buffer.duration
    }
    this.audioSource.start(0, offset)

    this.startedAt = this.audioContext.currentTime - offset
    this.pausedAt = 0
    this.isPlaying = true
  }

  pause() {
    /* Store it before this.stop flushes the startedAt */
    const elapsed = this.audioContext.currentTime - this.startedAt

    this?.stop()
    this.pausedAt = elapsed
  }

  stop() {
    if (this.audioSource) {
      try {
        this.audioSource.disconnect()
        this.audioSource?.stop(0)
      } catch (error) {
        console.debug("Error stopping audio source:", error)
      }
      this.audioSource = undefined
    }

    this.pausedAt = 0
    this.startedAt = 0
    this.isPlaying = false
  }

  setVolume(volume: number) {
    this.outputNode.gain.value = volume
  }

  setPitch(pitch: number) {
    this.pitch = pitch
    if (this.audioSource) {
      this.audioSource.playbackRate.value = pitch
    }
  }

  /**
   * Get the total duration of the audio track in seconds
   */
  getDuration(): number {
    return this.buffer.duration
  }

  /**
   * Get the current playback position in seconds
   */
  getCurrentTime(): number {
    if (!this.isPlaying) {
      return this.pausedAt
    }
    return this.audioContext.currentTime - this.startedAt
  }

  /**
   * Get the remaining time in seconds
   */
  getTimeRemaining(): number {
    if (!this.isPlaying) {
      return this.buffer.duration - this.pausedAt
    }
    return Math.max(
      0,
      this.buffer.duration - (this.audioContext.currentTime - this.startedAt)
    )
  }
}
export class WebAudioPlayer {
  public audioContext: AudioContext
  public masterOutput: GainNode
  public sfxChannel: GainNode
  public isPlaying: boolean
  public volume: number
  private audioSources: Set<AudioSource> = new Set()

  // Accepts an existing context so the unlock gesture can create/resume the
  // AudioContext synchronously (autoplay policy) while the graph construction
  // here runs deferred, off the tap's INP-measured critical path.
  constructor(audioContext?: AudioContext) {
    this.audioContext = audioContext ?? new AudioContext()

    // master output
    this.masterOutput = this.audioContext.createGain()
    this.masterOutput.gain.value = 1
    this.masterOutput.connect(this.audioContext.destination)

    // SFX channel
    this.sfxChannel = this.audioContext.createGain()
    this.sfxChannel.gain.value = 1
    this.sfxChannel.connect(this.masterOutput)

    this.isPlaying = true
    this.volume = 1
  }

  loadAudioFromURL(url: string, isSFX: boolean = false): Promise<AudioSource> {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch audio (${response.status}): ${url}`
            )
          }
          return response.arrayBuffer()
        })
        .then((arrayBuffer) => {
          return this.audioContext.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              const source = new AudioSource(this, buffer, isSFX)
              source.outputNode.disconnect()

              if (isSFX) {
                source.outputNode.connect(this.sfxChannel)
              } else {
                source.outputNode.connect(this.masterOutput)
              }

              // Track this audio source
              this.audioSources.add(source)

              resolve(source)
            },
            (error) => {
              console.error("Error loading audio from URL:", error)
              reject(error)
            }
          )
        })
        // a network failure must reject, or awaiters hang forever
        .catch(reject)
    })
  }

  setVolume(volume: number) {
    this.masterOutput.gain.value = volume
    this.volume = volume
  }
}
