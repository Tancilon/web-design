import { SITE_URL } from "@/lib/constants"
import type { PersonalHonor } from "@/lib/personal-honors"

export const generatePersonalHonorsSchema = (
  honors: PersonalHonor[],
  description: string
) => ({
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/services#webpage`,
  name: "个人荣誉",
  description,
  url: `${SITE_URL}/services`,
  mainEntity: {
    "@type": "ItemList",
    "@id": `${SITE_URL}/services#honors`,
    name: "个人荣誉档案",
    numberOfItems: honors.length,
    itemListElement: honors.map((honor, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${honor.title}｜${honor.level}`,
      description: honor.description,
      url: `${SITE_URL}/services#${honor.id}`
    }))
  }
})
