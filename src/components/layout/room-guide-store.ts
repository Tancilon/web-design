import { create } from "zustand"

export const useRoomGuide = create<{ open: boolean; inView: boolean }>(() => ({
  open: false,
  inView: true
}))
