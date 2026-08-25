import type { Metadata } from "next"
import Image from "next/image"

import resumePhoto from "../../../assets/Personal-resume-photo.jpg"
import { linkClass, Section } from "./components"

export const metadata: Metadata = {
  title: { absolute: "江含 | UX设计师" },
  description:
    "UX设计师江含的个人简历，包含个人简介、工作经历、荣誉奖项与教育背景。",
  alternates: { canonical: "/ai" },
  openGraph: {
    title: "江含 | UX设计师",
    description:
      "UX设计师江含的个人简历，包含个人简介、工作经历、荣誉奖项与教育背景。",
    type: "website",
    url: "/ai",
    siteName: "江含个人简历"
  },
  twitter: {
    card: "summary",
    title: "江含 | UX设计师",
    description:
      "UX设计师江含的个人简历，包含个人简介、工作经历、荣誉奖项与教育背景。"
  }
}

const profileDetails = [
  { label: "性别", value: "女" },
  { label: "出生日期", value: "2002.9.1" },
  { label: "所在地", value: "浙江" }
]

const aboutItems = [
  {
    label: "学业背景",
    content:
      "综合类大学毕业，学习成绩优异，曾获校奖学金、励志奖学金，累计获得各类设计奖励10余项。"
  },
  {
    label: "专业能力",
    content:
      "了解构图、文字、色彩的部分基础设计法则，手绘能力强，可以画较为复杂的设计场景。"
  },
  {
    label: "综合素质",
    content:
      "抗压能力强，善于独立思考、思路开阔，具备较强的沟通表达、组织协调和解决问题的能力。"
  }
]

const experiences = [
  {
    company: "深圳艾宠科技有限公司",
    period: "2025.01–至今",
    role: "UX设计师",
    summary: "参与宠好伴移动端产品迭代UX设计工作。",
    phases: [
      {
        title: "前期",
        items: [
          "通过用户体验，参与制定可行的产品品质提升方案，实现UX设计迭代。",
          "参与产品调研会，产出设计原型图，包括下单、接单、订单流转状态。"
        ]
      },
      {
        title: "中期",
        items: [
          "参与制定、完善、优化设计流程和设计规范。",
          "根据产品需求完成前端UI设计，包括下单链路页面、订单界面、上门接单页面、金刚区icon、消息页面、客服页面。"
        ]
      },
      {
        title: "后期",
        items: [
          "参与UX迭代前期规划并提供改版方案，完成原型图制作。",
          "根据产品体验需求实现前端UI的样式以及动态交互体验。",
          "持续跟进产品开发进度，推进产品研发。"
        ]
      },
      {
        title: "获得成绩",
        items: [
          "通过优化6.1.8版本下单、接单链路，增加用户留存率10%。",
          "对设计规范重新设计，提高用户点击率15%。"
        ]
      }
    ]
  },
  {
    company: "北京假日阳光环球旅行社有限公司",
    period: "2024.10–2024.12",
    role: "设计岗（实习）",
    summary: "参与阳光出行动端国企运营项目。",
    phases: [
      {
        title: "前期",
        items: [
          "参与产品调研分析会以及市场调研，产出游戏、打卡界面、弹窗界面等原型图，与产品经理、交互设计师合作，制定设计策略。"
        ]
      },
      {
        title: "中期",
        items: [
          "主导产品学习链路的优化设计，探索视觉风格，并主导运营主会场、游戏、抽奖、任务、弹窗、IP设计页面的制作与产出。"
        ]
      },
      {
        title: "后期",
        items: [
          "参与制作产品动效以及宣传动画等，并持续跟进产品开发进度，推动产品研发。"
        ]
      }
    ]
  }
]

const prizes = [
  "中国大学生广告艺术节学院奖三等奖",
  "大广赛国三、NCDA三等奖",
  "站酷大火、首页推荐"
]

const ResumePage = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 pb-24 pt-12 text-f-p-mobile leading-relaxed text-machine-base sm:px-8 lg:gap-14 lg:px-10 lg:pt-16 lg:text-f-p">
      <header className="grid gap-8 border-b border-machine-dim/50 pb-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-8 md:pt-4">
          <div className="flex flex-col gap-3">
            <p className="text-machine-dim">// PERSONAL RESUME · 个人简历</p>
            <p className="text-machine-bright">UX设计师</p>
            <h1 className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.08em] text-machine-bright">
              <span>江含</span>
              <span className="text-[0.3em] font-normal tracking-normal text-machine-base">
                Jianghan
              </span>
            </h1>
          </div>

          <div className="grid max-w-2xl gap-x-8 gap-y-3 border-l border-machine-base/50 pl-4 sm:grid-cols-3">
            {profileDetails.map((item) => (
              <p key={item.label} className="flex flex-col gap-1">
                <span className="text-machine-dim">{item.label}</span>
                <span className="text-machine-bright">{item.value}</span>
              </p>
            ))}
            <p className="flex flex-col gap-1 sm:col-span-3">
              <span className="text-machine-dim">联系方式</span>
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                <a className={linkClass} href="tel:15157062932">
                  15157062932
                </a>
                <a className={linkClass} href="mailto:1209215981@qq.com">
                  1209215981@qq.com
                </a>
              </span>
            </p>
          </div>
        </div>

        <figure className="relative order-first w-full max-w-[18rem] justify-self-start border border-machine-base/60 p-1 md:order-none md:max-w-none md:justify-self-end">
          <span className="absolute -left-px -top-6 text-machine-dim">
            [PORTRAIT_01]
          </span>
          <Image
            src={resumePhoto}
            alt="江含个人照片"
            priority
            sizes="(max-width: 767px) 288px, (max-width: 1023px) 288px, 320px"
            className="aspect-[3/4] w-full object-cover object-[center_36%] saturate-[0.9]"
          />
          <figcaption className="flex justify-between px-1 pt-2 text-machine-dim">
            <span>UX / VISUAL</span>
            <span>2026</span>
          </figcaption>
        </figure>
      </header>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-12">
          <Section title="关于我 / About me">
            <div className="grid gap-5 sm:grid-cols-3">
              {aboutItems.map((item) => (
                <article
                  key={item.label}
                  className="border-t border-machine-base/40 pt-3"
                >
                  <h3 className="mb-2 text-machine-bright">{item.label}</h3>
                  <p>{item.content}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section title="工作经历 / Experience">
            <div className="flex flex-col gap-12">
              {experiences.map((experience, experienceIndex) => (
                <article
                  key={experience.company}
                  className="relative border-l border-machine-base/50 pl-5 sm:pl-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-1 top-1.5 size-[7px] bg-machine-bright shadow-[0_0_10px_currentColor]"
                  />
                  <div className="mb-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
                    <div>
                      <p className="mb-1 text-machine-dim">
                        0{experienceIndex + 1} / {experience.period}
                      </p>
                      <h3 className="text-lg text-machine-bright lg:text-xl">
                        {experience.company}
                      </h3>
                    </div>
                    <p className="text-machine-bright sm:text-right">
                      {experience.role}
                    </p>
                  </div>

                  <p className="mb-5 border border-machine-dim/40 px-3 py-2 text-machine-bright">
                    负责内容：{experience.summary}
                  </p>

                  <div className="flex flex-col gap-5">
                    {experience.phases.map((phase) => (
                      <div key={phase.title}>
                        <h4 className="mb-2 text-machine-bright">
                          {"> "}
                          {phase.title}
                        </h4>
                        <ol className="flex list-decimal flex-col gap-1 pl-5 marker:text-machine-dim">
                          {phase.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </div>

        <aside className="flex min-w-0 flex-col gap-12 lg:sticky lg:top-8">
          <Section title="荣誉奖项 / Prize">
            <ul className="flex flex-col divide-y divide-machine-dim/40 border-y border-machine-dim/40">
              {prizes.map((prize, index) => (
                <li
                  key={prize}
                  className="grid grid-cols-[2rem_1fr] gap-3 py-3"
                >
                  <span className="text-machine-dim">0{index + 1}</span>
                  <span className="text-machine-bright">{prize}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="教育背景 / Education">
            <div className="flex flex-col gap-5 border-l border-machine-base/50 pl-5">
              <div>
                <h3 className="text-lg text-machine-bright">
                  福州大学（985/211）
                </h3>
                <p className="text-machine-dim">视觉传达设计专业</p>
              </div>
              <p>
                专业成绩良好，多次获得奖学金及荣誉称号。积极参与学院组织的专业竞赛、设计展览与实践活动，作品曾入选校内优秀课程作业展，并在视觉设计、品牌设计、文创设计等相关项目中获得认可。
              </p>
            </div>
          </Section>
        </aside>
      </div>

      <footer className="flex flex-col gap-2 border-t border-machine-dim/50 pt-5 text-machine-dim sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 江含 · UX设计师</p>
        <a href="/" className={linkClass}>
          ← 返回首页
        </a>
        <p className="sm:text-right">/* END OF RESUME */</p>
      </footer>
    </main>
  )
}

export default ResumePage
