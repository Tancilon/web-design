import { defineField, defineType } from "sanity"

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "array",
      of: [{ type: "block" }]
    })
  ]
})
