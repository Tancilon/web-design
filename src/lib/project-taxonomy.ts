export const projectCategories = [
  { title: "UI/UX", slug: "ui-ux" },
  { title: "活动视觉", slug: "campaign-visual" },
  { title: "产品设计", slug: "product-design" },
  { title: "人物插画", slug: "portrait-illustration" },
  { title: "角色设计", slug: "character-design" },
  { title: "叙事插画", slug: "narrative-illustration" }
] as const

export type ProjectCategorySlug = (typeof projectCategories)[number]["slug"]

export const getProjectCategory = (slug: string) =>
  projectCategories.find((category) => category.slug === slug)
