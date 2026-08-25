import type { StaticImageData } from "next/image"

import work01 from "../../assets/Beyond-Design/wechat-image_20260825232059.png"
import work02 from "../../assets/Beyond-Design/wechat-image_20260825232104.png"
import work03 from "../../assets/Beyond-Design/wechat-image_20260825232107.png"
import work04 from "../../assets/Beyond-Design/wechat-image_20260825232110.png"
import work05 from "../../assets/Beyond-Design/wechat-image_20260825232113.png"
import work06 from "../../assets/Beyond-Design/wechat-image_20260825232116.jpg"
import work07 from "../../assets/Beyond-Design/wechat-image_20260825232120.jpg"
import work08 from "../../assets/Beyond-Design/wechat-image_20260825232122.jpg"
import work09 from "../../assets/Beyond-Design/wechat-image_20260825232126.jpg"
import work10 from "../../assets/Beyond-Design/wechat-image_20260825232137.jpg"
import work11 from "../../assets/Beyond-Design/wechat-image_20260825232141.jpg"
import work12 from "../../assets/Beyond-Design/wechat-image_20260825232144.jpg"
import work13 from "../../assets/Beyond-Design/wechat-image_20260825232149.jpg"
import work14 from "../../assets/Beyond-Design/wechat-image_20260825232152.jpg"
import work15 from "../../assets/Beyond-Design/wechat-image_20260825232156.jpg"
import work16 from "../../assets/Beyond-Design/wechat-image_20260825232200.jpg"
import work17 from "../../assets/Beyond-Design/wechat-image_20260825232204.jpg"
import work18 from "../../assets/Beyond-Design/wechat-image_20260825232211.jpg"
import work19 from "../../assets/Beyond-Design/wechat-image_20260825232214.jpg"

export interface BeyondDesignWork {
  id: string
  label: string
  image: StaticImageData
}

const images = [
  work01,
  work02,
  work03,
  work04,
  work05,
  work06,
  work07,
  work08,
  work09,
  work10,
  work11,
  work12,
  work13,
  work14,
  work15,
  work16,
  work17,
  work18,
  work19
]

export const beyondDesignWorks: BeyondDesignWork[] = images.map(
  (image, index) => {
    const number = String(index + 1).padStart(2, "0")
    return {
      id: `work-${number}`,
      label: `设计作品 ${number}`,
      image
    }
  }
)

export const BEYOND_DESIGN_COUNT = beyondDesignWorks.length
