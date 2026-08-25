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

export interface PortfolioProject {
  index: string
  slug: string
  title: string
  images: StaticImageData[]
}

export const portfolioProjects: PortfolioProject[] = [
  {
    index: "01",
    slug: "zhouhu-aurora-project",
    title: "昼虎记账·极光计划",
    images: [zhouhu01, zhouhu02, zhouhu03, zhouhu04, zhouhu05]
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
    ]
  },
  {
    index: "03",
    slug: "guoqing-cloud-tour",
    title: "国庆逐光行·云游中国",
    images: [guoqing01, guoqing02, guoqing03, guoqing04, guoqing05]
  }
]

export const getPortfolioProject = (slug: string) =>
  portfolioProjects.find((project) => project.slug === slug)
