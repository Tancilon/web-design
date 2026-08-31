export interface HonorImage {
  src: string
  width: number
  height: number
}

export interface HonorDetail {
  label: string
  value: string
}

export interface PersonalHonor {
  id: string
  index: string
  title: string
  award: string
  level: string
  date: string
  category: string
  description: string
  details: HonorDetail[]
  image: HonorImage
}

export const PERSONAL_HONORS_INTRO =
  "这些荣誉记录了我在产品设计、视觉传达、色彩设计、文创与协作实践中的阶段性成果。它们不是终点，而是持续检验想法、方法与表达的坐标。"

export const PERSONAL_HONORS: PersonalHonor[] = [
  {
    id: "honor-01",
    index: "01",
    title: "纤纤温变杯",
    award: "中国大学生广告艺术节学院奖 2022 秋季征集大赛",
    level: "优秀奖",
    date: "2022.12",
    category: "衍生品设计",
    description:
      "围绕碧生源命题展开衍生品设计，以温变杯为载体探索产品创意与品牌表达。",
    details: [
      { label: "命题企业", value: "碧生源" },
      { label: "作者", value: "江含" },
      { label: "指导老师", value: "李双、李庆昌" },
      { label: "参赛院校", value: "福州大学" }
    ],
    image: {
      src: "/images/personal-honors/01-xianxian-temperature-cup.jpg",
      width: 2400,
      height: 3392
    }
  },
  {
    id: "honor-02",
    index: "02",
    title: "不齿于人类的狗屎堆",
    award: "中国大学生广告艺术节学院奖 2022 秋季征集大赛",
    level: "优秀奖",
    date: "2022.12",
    category: "产品设计",
    description:
      "团队围绕索力高命题完成产品设计，由任田宇、王静雅、江含、吴桐协作完成。",
    details: [
      { label: "命题企业", value: "索力高" },
      { label: "作者", value: "任田宇、王静雅、江含、吴桐" },
      { label: "指导老师", value: "李双、李庆昌" },
      { label: "参赛院校", value: "福州大学" }
    ],
    image: {
      src: "/images/personal-honors/02-solic-pet-product.jpg",
      width: 2400,
      height: 3392
    }
  },
  {
    id: "honor-03",
    index: "03",
    title: "墨染东方",
    award: "2025“华夏奖”文化艺术设计大赛（秋季）",
    level: "优秀奖",
    date: "2025",
    category: "视觉传达类",
    description:
      "以东方视觉语言完成《墨染东方》，在 2025 秋季赛事视觉传达类别中获得优秀奖。",
    details: [
      { label: "作者", value: "江含" },
      { label: "指导教师", value: "李双" },
      { label: "参赛院校", value: "福州大学" }
    ],
    image: {
      src: "/images/personal-honors/03-ink-orient.jpg",
      width: 1058,
      height: 1487
    }
  },
  {
    id: "honor-04",
    index: "04",
    title: "知尘",
    award: "第六届香港新锐当代设计奖",
    level: "铜奖",
    date: "2024.06",
    category: "当代设计",
    description: "作品《知尘》代表福州大学参评，并获得赛事铜奖。",
    details: [
      { label: "获奖者", value: "江含" },
      { label: "指导教师", value: "罗健" },
      { label: "参赛院校", value: "福州大学" }
    ],
    image: {
      src: "/images/personal-honors/04-zhichen.jpg",
      width: 1056,
      height: 1490
    }
  },
  {
    id: "honor-05",
    index: "05",
    title: "砚池荷风",
    award: "第三届“虎门杯”中国国际高校色彩设计大赛",
    level: "入围奖",
    date: "2024.04.20",
    category: "色彩设计",
    description: "以色彩设计为核心创作《砚池荷风》，入围第三届赛事评选。",
    details: [
      { label: "设计者", value: "江含" },
      { label: "参赛院校", value: "福州大学" },
      { label: "获奖编号", value: "517" }
    ],
    image: {
      src: "/images/personal-honors/05-yan-chi-he-feng.jpg",
      width: 1058,
      height: 1487
    }
  },
  {
    id: "honor-06",
    index: "06",
    title: "上青天·善美文创集",
    award: "2022 SGADC 新加坡金沙艺术设计大赛",
    level: "中国赛区铜奖",
    date: "2022.10.05",
    category: "文创设计",
    description: "以文化创意产品为方向完成系列设计，并获得中国赛区铜奖。",
    details: [{ label: "赛区", value: "中国赛区" }],
    image: {
      src: "/images/personal-honors/06-shang-qing-tian.jpg",
      width: 1058,
      height: 1486
    }
  },
  {
    id: "honor-07",
    index: "07",
    title: "G CROSS AWARD 2022",
    award: "G CROSS AWARD 2022 全国总决赛",
    level: "优秀指导教师",
    date: "2022",
    category: "设计指导",
    description:
      "按证书原文记录“全国总决赛优秀指导教师”荣誉，不延伸或改写其身份含义。",
    details: [
      { label: "荣誉获得者", value: "江含" },
      { label: "院校", value: "福州大学" }
    ],
    image: {
      src: "/images/personal-honors/07-g-cross-instructor.jpg",
      width: 1089,
      height: 1445
    }
  }
]

export const PERSONAL_HONORS_COUNT = PERSONAL_HONORS.length
