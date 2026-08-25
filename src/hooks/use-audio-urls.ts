import { useAssets } from "@/components/assets-provider"

export const useAudioUrls = () => {
  const { sfx } = useAssets()

  return {
    GAME_AUDIO_SFX: {
      BASKETBALL_THROW: sfx.basketballSwoosh,
      BASKETBALL_NET: sfx.basketballNet,
      BASKETBALL_THUMP: sfx.basketballThump,
      TIMEOUT_BUZZER: sfx.basketballBuzzer,
      BASKETBALL_STREAK: sfx.basketballStreak
    },
    BLOG_AUDIO_SFX: {
      LOCKED_DOOR: sfx.blog.lockedDoor,
      DOOR: sfx.blog.door.map((item) => ({
        OPEN: item.open,
        CLOSE: item.close
      })),
      LAMP: sfx.blog.lamp.map((item) => ({
        PULL: item.pull,
        RELEASE: item.release
      }))
    },
    CONTACT_AUDIO_SFX: {
      INTERFERENCE: sfx.contact.interference,
      KNOB_TURNING: sfx.knobTurning,
      ANTENNA: sfx.antenna
    }
  } as const
}
