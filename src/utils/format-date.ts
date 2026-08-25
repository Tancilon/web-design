export const formatDate = (
  date: string,
  includeTime = false,
  timeZone?: string,
  shortMonth?: boolean
) =>
  new Date(date).toLocaleDateString("en-US", {
    month: shortMonth ? "short" : "long",
    day: "numeric",
    year: "numeric",

    hour: includeTime ? "numeric" : undefined,
    minute: includeTime ? "numeric" : undefined,
    timeZone: timeZone
  })
