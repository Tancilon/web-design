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
import type { ProjectCategorySlug } from "./project-taxonomy"

export interface BeyondDesignWork {
  id: string
  label: string
  image: StaticImageData
  description: string
  category: ProjectCategorySlug
  tags: string[]
  date: string
}

export const beyondDesignWorks: BeyondDesignWork[] = [
  {
    id: "work-01",
    label: "蓝紫侧影",
    image: work01,
    description:
      "用蓝紫渐变与柔光塑造安静的人物侧影，探索冷色氛围中的情绪表达。",
    category: "portrait-illustration",
    tags: ["人物插画", "海报设计"],
    date: "2026-02-28"
  },
  {
    id: "work-02",
    label: "追光",
    image: work02,
    description: "以绿色光域和暖色高光形成对比，表现人物迎向光线的瞬间。",
    category: "portrait-illustration",
    tags: ["人物插画", "光影练习"],
    date: "2026-02-07"
  },
  {
    id: "work-03",
    label: "蝶醒",
    image: work03,
    description:
      "将青蓝人像与蝴蝶意象结合，用留白和微光营造轻盈、苏醒般的画面。",
    category: "portrait-illustration",
    tags: ["人物插画", "海报设计"],
    date: "2026-01-16"
  },
  {
    id: "work-04",
    label: "赤蝶",
    image: work04,
    description: "通过红色底调、白发人物与蝶群建立强烈视觉张力。",
    category: "portrait-illustration",
    tags: ["人物插画", "色彩练习"],
    date: "2025-12-21"
  },
  {
    id: "work-05",
    label: "夏日蓝调",
    image: work05,
    description: "以高饱和蓝色和橙色轮廓光呈现明快、松弛的青春气息。",
    category: "portrait-illustration",
    tags: ["人物插画", "海报设计"],
    date: "2025-11-30"
  },
  {
    id: "work-06",
    label: "弦上少年",
    image: work06,
    description: "把人物、乐器与蓝紫光影统一在竖版构图中，强化舞台感与节奏。",
    category: "portrait-illustration",
    tags: ["人物插画", "角色设计"],
    date: "2025-11-08"
  },
  {
    id: "work-07",
    label: "黑羽造型",
    image: work07,
    description: "围绕黑色服装、银发和羽饰完成角色造型练习，突出材质层次。",
    category: "character-design",
    tags: ["角色设计", "造型设定"],
    date: "2025-10-18"
  },
  {
    id: "work-08",
    label: "云上回声",
    image: work08,
    description: "利用蓝白雾化光线弱化边界，营造人物漂浮在云端的感受。",
    category: "portrait-illustration",
    tags: ["人物插画", "光影练习"],
    date: "2025-09-27"
  },
  {
    id: "work-09",
    label: "粉雾蝶语",
    image: work09,
    description: "用粉紫色域与蝶群细节表现柔和、梦境化的人物氛围。",
    category: "portrait-illustration",
    tags: ["人物插画", "色彩练习"],
    date: "2025-09-05"
  },
  {
    id: "work-10",
    label: "萌趣商业街",
    image: work10,
    description: "以高密度角色、商品和街区元素构成热闹的 IP 营销主视觉。",
    category: "campaign-visual",
    tags: ["活动视觉", "IP 视觉", "营销设计"],
    date: "2025-08-14"
  },
  {
    id: "work-11",
    label: "夜羽礼装",
    image: work11,
    description: "以深紫、金属配饰和羽毛元素建立华丽而克制的幻想角色形象。",
    category: "character-design",
    tags: ["角色设计", "概念艺术"],
    date: "2025-07-24"
  },
  {
    id: "work-12",
    label: "墨羽共生",
    image: work12,
    description: "将水墨肌理、人物与灵兽轮廓叠合，探索东方幻想角色关系。",
    category: "character-design",
    tags: ["角色设计", "概念艺术"],
    date: "2025-07-03"
  },
  {
    id: "work-13",
    label: "花境幻舞",
    image: work13,
    description: "用花卉、丝带与舞台式构图塑造轻盈的女性幻想角色。",
    category: "character-design",
    tags: ["角色设计", "概念艺术"],
    date: "2025-06-12"
  },
  {
    id: "work-14",
    label: "月下织梦",
    image: work14,
    description: "以深色空间和悬垂构图组织人物与装饰细节，强化神秘叙事。",
    category: "character-design",
    tags: ["角色设计", "概念艺术"],
    date: "2025-05-23"
  },
  {
    id: "work-15",
    label: "盛夏单车",
    image: work15,
    description: "通过逆光、草地与双人骑行场景记录富有动势的夏日片段。",
    category: "narrative-illustration",
    tags: ["叙事插画", "场景设计"],
    date: "2025-05-02"
  },
  {
    id: "work-16",
    label: "星河相逢",
    image: work16,
    description: "以柔焦色彩和群像关系呈现介于现实与梦境之间的相遇。",
    category: "narrative-illustration",
    tags: ["叙事插画", "氛围设计"],
    date: "2025-04-11"
  },
  {
    id: "work-17",
    label: "林间午后",
    image: work17,
    description: "用自然色调和多人互动构成松弛的林间叙事，强调生活感。",
    category: "narrative-illustration",
    tags: ["叙事插画", "场景设计"],
    date: "2025-03-21"
  },
  {
    id: "work-18",
    label: "紫羽长歌",
    image: work18,
    description: "通过紫色羽饰、长尾造型与大幅留白完成幻想角色概念图。",
    category: "character-design",
    tags: ["角色设计", "概念艺术"],
    date: "2025-02-28"
  },
  {
    id: "work-19",
    label: "甜梦小屋视觉提案",
    image: work19,
    description: "将色板、空间拆解、贴纸与周边展示整合为完整的文创视觉提案。",
    category: "product-design",
    tags: ["产品设计", "文创设计", "视觉系统"],
    date: "2025-01-17"
  }
]

export const BEYOND_DESIGN_COUNT = beyondDesignWorks.length
