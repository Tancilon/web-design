import { memo, useCallback, useEffect } from "react"
import { create } from "zustand"

import { useAudioUrls } from "@/hooks/use-audio-urls"
import { AudioSource, WebAudioPlayer } from "@/lib/audio"
import { SFX_VOLUME } from "@/lib/audio/constants"
import { onIdle } from "@/utils/idle"

export type SiteAudioSFXKey =
  | "BASKETBALL_THROW"
  | "BASKETBALL_NET"
  | "BASKETBALL_THUMP"
  | "TIMEOUT_BUZZER"
  | "BASKETBALL_STREAK"
  | `BLOG_LOCKED_DOOR_${number}`
  | `BLOG_DOOR_${number}_OPEN`
  | `BLOG_DOOR_${number}_CLOSE`
  | `BLOG_LAMP_${number}_PULL`
  | `BLOG_LAMP_${number}_RELEASE`
  | "CONTACT_INTERFERENCE"
  | "CONTACT_KNOB_TURNING"
  | "CONTACT_ANTENNA"

interface SiteAudioStore {
  player: WebAudioPlayer | null
  audioSfxSources: Record<SiteAudioSFXKey, AudioSource> | null
}

interface SiteAudioHook {
  player: WebAudioPlayer | null
  playSoundFX: (sfx: SiteAudioSFXKey, volume?: number, pitch?: number) => void
  playInspectableFX: (
    url: string,
    volume?: number,
    pitch?: number
  ) => Promise<AudioSource | null>
}

const useSiteAudioStore = create<SiteAudioStore>(() => ({
  player: null,
  audioSfxSources: null
}))

export { useSiteAudioStore }

export const useInitializeAudioContext = () => {
  const player = useSiteAudioStore((s) => s.player)

  useEffect(() => {
    const targetElement = document
    let unlocked = false

    const unlock = () => {
      if (player) {
        targetElement.removeEventListener("click", unlock)
        return
      }
      if (unlocked) return
      unlocked = true

      // The gesture creates/resumes the AudioContext (autoplay policy). Graph
      // construction runs after the next paint so the first interaction's INP
      // is not billed for the audio bootstrap.
      const audioContext = new AudioContext()
      audioContext.resume()

      setTimeout(() => {
        const newPlayer = new WebAudioPlayer(audioContext)
        useSiteAudioStore.setState({ player: newPlayer })
      }, 0)
    }
    targetElement.addEventListener("click", unlock, { passive: true })

    return () => targetElement.removeEventListener("click", unlock)
  }, [player])
}

export const SiteAudioSFXsLoader = memo((): null => {
  const player = useSiteAudioStore((s) => s.player)
  const { GAME_AUDIO_SFX, BLOG_AUDIO_SFX, CONTACT_AUDIO_SFX } = useAudioUrls()

  useEffect(() => {
    if (!player) return

    // TODO: dont load audio sources if the user is not in the scene where the audio will be played!
    const loadAudioSources = async () => {
      const newSources = {} as Record<SiteAudioSFXKey, AudioSource>

      try {
        const promises: Array<() => Promise<void>> = []

        promises.push(
          ...Object.keys(GAME_AUDIO_SFX).map((key) => async () => {
            const audioKey = key as SiteAudioSFXKey
            const source = await player.loadAudioFromURL(
              GAME_AUDIO_SFX[audioKey as keyof typeof GAME_AUDIO_SFX],
              true
            )
            source.setVolume(SFX_VOLUME)
            newSources[audioKey] = source
          })
        )

        promises.push(
          ...BLOG_AUDIO_SFX.LOCKED_DOOR.map((lockedDoor, index) => async () => {
            const source = await player.loadAudioFromURL(lockedDoor, true)
            source.setVolume(SFX_VOLUME)
            newSources[`BLOG_LOCKED_DOOR_${index}`] = source
          })
        )

        promises.push(
          ...BLOG_AUDIO_SFX.DOOR.map((door, index) => async () => {
            const source = await player.loadAudioFromURL(door.OPEN, true)
            source.setVolume(SFX_VOLUME)
            newSources[`BLOG_DOOR_${index}_OPEN`] = source
            const sourceClose = await player.loadAudioFromURL(door.CLOSE, true)
            sourceClose.setVolume(SFX_VOLUME)
            newSources[`BLOG_DOOR_${index}_CLOSE`] = sourceClose
          })
        )

        promises.push(
          ...BLOG_AUDIO_SFX.LAMP.map((lamp, index) => async () => {
            const source = await player.loadAudioFromURL(lamp.PULL, true)
            source.setVolume(SFX_VOLUME)
            newSources[`BLOG_LAMP_${index}_PULL`] = source
            const sourceRelease = await player.loadAudioFromURL(
              lamp.RELEASE,
              true
            )
            sourceRelease.setVolume(SFX_VOLUME)
            newSources[`BLOG_LAMP_${index}_RELEASE`] = sourceRelease
          })
        )

        promises.push(async () => {
          const source = await player.loadAudioFromURL(
            CONTACT_AUDIO_SFX.INTERFERENCE,
            true
          )
          source.setVolume(SFX_VOLUME)
          newSources["CONTACT_INTERFERENCE"] = source
        })

        promises.push(async () => {
          const source = await player.loadAudioFromURL(
            CONTACT_AUDIO_SFX.KNOB_TURNING,
            true
          )
          source.setVolume(SFX_VOLUME)
          newSources["CONTACT_KNOB_TURNING"] = source
        })

        promises.push(async () => {
          const source = await player.loadAudioFromURL(
            CONTACT_AUDIO_SFX.ANTENNA,
            true
          )
          source.setVolume(SFX_VOLUME)
          newSources["CONTACT_ANTENNA"] = source
        })

        // Batched instead of one ~40-request burst: the burst competed with
        // the GLB/KTX2 fetches on mobile connections and its decode callbacks
        // landed as a long-task pileup right after the unlocking tap.
        // one flaky fetch shouldn't discard every SFX that loaded
        const results: PromiseSettledResult<void>[] = []
        const BATCH_SIZE = 5
        for (let i = 0; i < promises.length; i += BATCH_SIZE) {
          results.push(
            ...(await Promise.allSettled(
              promises.slice(i, i + BATCH_SIZE).map((load) => load())
            ))
          )
          // yield to the main thread between batches
          await new Promise((resolve) => setTimeout(resolve, 0))
        }

        const failed = results.filter((r) => r.status === "rejected")
        if (failed.length) {
          console.error(
            `Failed to load ${failed.length}/${results.length} audio sources`,
            failed.map((r) => r.reason)
          )
        }

        useSiteAudioStore.setState({
          audioSfxSources: newSources
        })
      } catch (error) {
        console.error("Error loading audio sources:", error)
      }
    }

    // The player appears right after the first tap — wait for idle so the SFX
    // warmup never shares the frame with that interaction. Cancelled on
    // cleanup so a Strict Mode replay doesn't schedule the ~40 fetch+decodes
    // twice.
    return onIdle(loadAudioSources)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])

  return null
})

export const useSiteAudio = (): SiteAudioHook => {
  const player = useSiteAudioStore((s) => s.player)
  const audioSfxSources = useSiteAudioStore((s) => s.audioSfxSources)

  const playSoundFX = useCallback(
    (sfx: SiteAudioSFXKey, volume = SFX_VOLUME, pitch = 1) => {
      if (!audioSfxSources) return

      const sfxSource = audioSfxSources[sfx]

      if (!sfxSource) return

      sfxSource.stop()
      sfxSource.setVolume(volume)
      sfxSource.setPitch(pitch)
      sfxSource.play()
    },
    [audioSfxSources]
  )

  const playInspectableFX = useCallback(
    async (url: string, volume = SFX_VOLUME, pitch = 1) => {
      if (!player) return null

      try {
        const audioSource = await player.loadAudioFromURL(url, true)

        audioSource.setVolume(volume)
        audioSource.setPitch(pitch)
        audioSource.play()

        return audioSource
      } catch (error) {
        console.error("Failed to load or play custom sound effect:", error)
        return null
      }
    },
    [player]
  )

  return {
    player,
    playSoundFX,
    playInspectableFX
  }
}
