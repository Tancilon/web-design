import type { StaticImageData } from "next/image"

import zhouhu01 from "../../assets/Main-Work-1/wechat-image_20260825231949.png"
import zhouhu02 from "../../assets/Main-Work-1/wechat-image_20260825231954.png"
import zhouhu03 from "../../assets/Main-Work-1/wechat-image_20260825231958.png"
import zhouhu04 from "../../assets/Main-Work-1/wechat-image_20260825232001.png"
import zhouhu05 from "../../assets/Main-Work-1/wechat-image_20260825232005.png"
import qisong01 from "../../assets/Main-Work-2/wechat-image_20260825231842.jpg"
import qisong02 from "../../assets/Main-Work-2/wechat-image_20260825231850.png"
import qisong03 from "../../assets/Main-Work-2/wechat-image_20260825231855.png"
import qisong04 from "../../assets/Main-Work-2/wechat-image_20260825231900.png"
import qisong05 from "../../assets/Main-Work-2/wechat-image_20260825231910.png"
import qisong06 from "../../assets/Main-Work-2/wechat-image_20260825231914.png"
import qisong07 from "../../assets/Main-Work-2/wechat-image_20260825231917.png"
import qisong08 from "../../assets/Main-Work-2/wechat-image_20260825231920.png"
import qisong09 from "../../assets/Main-Work-2/wechat-image_20260825231923.png"
import guoqing01 from "../../assets/Main-Work-3/wechat-image_20260825232013.png"
import guoqing02 from "../../assets/Main-Work-3/wechat-image_20260825232018.png"
import guoqing03 from "../../assets/Main-Work-3/wechat-image_20260825232021.png"
import guoqing04 from "../../assets/Main-Work-3/wechat-image_20260825232024.png"
import guoqing05 from "../../assets/Main-Work-3/wechat-image_20260825232028.png"
import chiikawa01 from "../../assets/Main-Work-4/wechat-image_20260826212603.png"
import chiikawa02 from "../../assets/Main-Work-4/wechat-image_20260826212609.png"
import chiikawa03 from "../../assets/Main-Work-4/wechat-image_20260826212614.png"
import chiikawa04 from "../../assets/Main-Work-4/wechat-image_20260826212618.png"
import chiikawa05 from "../../assets/Main-Work-4/wechat-image_20260826212622.png"
import gameCommunity01 from "../../assets/Main-Work-5/1.png"
import gameCommunity02 from "../../assets/Main-Work-5/2.png"
import gameCommunity03 from "../../assets/Main-Work-5/3.png"
import gameCommunity04 from "../../assets/Main-Work-5/4.png"
import gameCommunity05 from "../../assets/Main-Work-5/5.png"
import gameCommunity06 from "../../assets/Main-Work-5/6.png"
import gameCommunity07 from "../../assets/Main-Work-5/7.png"
import gameCommunity08 from "../../assets/Main-Work-5/8.png"
import gameCommunity09 from "../../assets/Main-Work-5/9.png"
import gameCommunity10 from "../../assets/Main-Work-5/10.png"
import gameCommunity11 from "../../assets/Main-Work-5/11.png"
import gameCommunity12 from "../../assets/Main-Work-5/12.png"
import gameCommunity13 from "../../assets/Main-Work-5/13.png"
import gameCommunity14 from "../../assets/Main-Work-5/14.png"
import gameCommunity15 from "../../assets/Main-Work-5/15.png"
import gameCommunity16 from "../../assets/Main-Work-5/16.png"
import gameCommunity17 from "../../assets/Main-Work-5/17.png"
import gameCommunity18 from "../../assets/Main-Work-5/18.png"
import gameCommunity19 from "../../assets/Main-Work-5/19.png"
import superPlayer01 from "../../assets/Main-Work-6/111.png"
import superPlayer02 from "../../assets/Main-Work-6/222.png"
import superPlayer03 from "../../assets/Main-Work-6/333.png"
import superPlayer04 from "../../assets/Main-Work-6/444.png"
import superPlayer05 from "../../assets/Main-Work-6/555.png"
import superPlayer06 from "../../assets/Main-Work-6/666.png"
import superPlayer07 from "../../assets/Main-Work-6/777.png"
import superPlayer08 from "../../assets/Main-Work-6/888.png"
import type { ProjectCategorySlug } from "./project-taxonomy"

export interface PortfolioProject {
  index: string
  slug: string
  title: string
  images: StaticImageData[]
  coverImage?: StaticImageData
  description: string
  category: ProjectCategorySlug
  tags: string[]
  date: string
  displayDate?: string
  showOnHome: boolean
}

export const portfolioProjects: PortfolioProject[] = [
  {
    index: "01",
    slug: "zhouhu-aurora-project",
    title: "昼虎记账·极光计划",
    images: [zhouhu01, zhouhu02, zhouhu03, zhouhu04, zhouhu05],
    description:
      "将记账流程、财务数据和情绪化视觉整合为清晰的移动端体验，让日常记录更轻盈。",
    category: "ui-ux",
    tags: ["UI/UX", "移动产品", "视觉系统"],
    date: "2026-03-15",
    showOnHome: true
  },
  {
    index: "02",
    slug: "qisong-erp",
    title: "企松云管 ERP",
    images: [
      qisong01,
      qisong02,
      qisong03,
      qisong04,
      qisong05,
      qisong06,
      qisong07,
      qisong08,
      qisong09
    ],
    description:
      "围绕企业后台的复杂任务重组信息层级、表格与状态反馈，提升高频管理效率。",
    category: "ui-ux",
    tags: ["UI/UX", "企业服务", "设计系统"],
    date: "2026-05-22",
    showOnHome: true
  },
  {
    index: "03",
    slug: "guoqing-cloud-tour",
    title: "国庆逐光行·云游中国",
    images: [guoqing01, guoqing02, guoqing03, guoqing04, guoqing05],
    description:
      "以国庆出游路线为叙事线索，将地域文化、节庆视觉与线上互动体验串联起来。",
    category: "campaign-visual",
    tags: ["活动视觉", "互动体验", "视觉设计"],
    date: "2026-07-08",
    showOnHome: true
  },
  {
    index: "04",
    slug: "chiikawa-collaborative-design",
    title: "吉伊卡哇联名设计",
    images: [chiikawa01, chiikawa02, chiikawa03, chiikawa04, chiikawa05],
    coverImage: chiikawa03,
    description:
      "围绕吉伊卡哇 IP 延展联名周边与传播物料，在角色识别度和产品落地之间保持一致。",
    category: "product-design",
    tags: ["产品设计", "IP 联名", "视觉延展"],
    date: "2026-08-18",
    showOnHome: false
  },
  {
    index: "05",
    slug: "hk-game-community-v1-2",
    title: "HK聚玩社 V1.2",
    images: [
      gameCommunity01,
      gameCommunity02,
      gameCommunity03,
      gameCommunity04,
      gameCommunity05,
      gameCommunity06,
      gameCommunity07,
      gameCommunity08,
      gameCommunity09,
      gameCommunity10,
      gameCommunity11,
      gameCommunity12,
      gameCommunity13,
      gameCommunity14,
      gameCommunity15,
      gameCommunity16,
      gameCommunity17,
      gameCommunity18,
      gameCommunity19
    ],
    description:
      "围绕跨平台游戏社区体验，整合资讯、社交、组队与商城等核心场景，构建统一的移动端产品体验。",
    category: "ui-ux",
    tags: ["UI/UX", "游戏社区", "移动产品"],
    date: "2024",
    displayDate: "2024",
    showOnHome: false
  },
  {
    index: "06",
    slug: "super-player-program",
    title: "聚玩社·超级玩家计划",
    images: [
      superPlayer01,
      superPlayer02,
      superPlayer03,
      superPlayer04,
      superPlayer05,
      superPlayer06,
      superPlayer07,
      superPlayer08
    ],
    coverImage: superPlayer04,
    description:
      "围绕“超级玩家计划”延展主视觉、角色、贴纸、活动弹窗与运营物料，建立统一的游戏社群传播形象。",
    category: "campaign-visual",
    tags: ["活动视觉", "角色设计", "运营设计"],
    date: "2025",
    displayDate: "2024–2025",
    showOnHome: false
  }
]

export const featuredPortfolioProjects = portfolioProjects.filter(
  (project) => project.showOnHome
)

export const getPortfolioProject = (slug: string) =>
  portfolioProjects.find((project) => project.slug === slug)
