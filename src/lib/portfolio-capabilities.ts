export interface PortfolioCapability {
  title: string
  description: string
  tags: readonly string[]
}

export const PORTFOLIO_CAPABILITIES_SECTION_TITLE = "我的能力"

export const PORTFOLIO_CAPABILITIES_INTRO_LINES = [
  "从理解问题开始，",
  "让体验、视觉与产品目标自然连接。"
] as const

export const PORTFOLIO_CAPABILITIES = [
  {
    title: "用户体验与需求梳理",
    description:
      "从用户场景和业务目标出发，梳理核心问题、使用路径与关键触点，为设计建立清晰依据。",
    tags: ["用户场景", "需求分析", "体验路径"]
  },
  {
    title: "交互设计与原型",
    description:
      "将复杂流程转化为直观的信息结构和交互方案，通过原型验证逻辑、效率与可用性。",
    tags: ["信息架构", "交互流程", "原型设计"]
  },
  {
    title: "界面与视觉设计",
    description:
      "在一致的视觉语言中处理信息层级、组件与细节，让界面清晰易用，也保留恰当的视觉表达。",
    tags: ["UI设计", "视觉规范", "组件设计"]
  },
  {
    title: "动效与落地协作",
    description:
      "用动效补充状态与反馈，并持续跟进开发实现，在协作与迭代中保证体验完整。",
    tags: ["交互动效", "开发协作", "迭代优化"]
  }
] as const satisfies readonly PortfolioCapability[]
