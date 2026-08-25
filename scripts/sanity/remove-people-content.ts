import { getCliClient } from "sanity/cli"

const client = getCliClient({
  apiVersion: "2026-03-01",
  perspective: "raw"
})

const apply = process.argv.includes("--apply")
const targetTypes = [
  "peoplePage",
  "person",
  "department",
  "value",
  "openPosition",
  "testimonial"
]
const peopleVideoMeshes = new Set(["SM_PeopleMonitorA", "SM_PeopleMonitorD"])

type UnknownRecord = Record<string, unknown>

interface ContentDocument {
  _id: string
  _type: string
  authors?: unknown[]
  people?: unknown[]
  content?: UnknownRecord[]
}

interface ArrayDocument {
  _id: string
  inspectables?: UnknownRecord[]
  scenes?: UnknownRecord[]
  videos?: UnknownRecord[]
}

const unique = <T>(values: Array<T | null | undefined>): T[] => [
  ...new Set(values.filter((value): value is T => value != null))
]

const normalizeRoute = (value: unknown) =>
  typeof value === "string" ? value.replace(/^\/+/, "").toLowerCase() : ""

async function commitMutations(
  mutations: Array<(tx: ReturnType<typeof client.transaction>) => void>
) {
  for (let start = 0; start < mutations.length; start += 50) {
    const tx = client.transaction()
    for (const mutate of mutations.slice(start, start + 50)) mutate(tx)
    await tx.commit({ visibility: "sync" })
  }
}

async function main() {
  const [
    documents,
    posts,
    projects,
    inspectableConfigs,
    sceneConfigs,
    assets,
    protectedDocumentCounts
  ] = await Promise.all([
    client.fetch<ContentDocument[]>(
      `*[_type in $targetTypes]{_id, _type, image, preOpenPositionsSideImages, avatar}`,
      { targetTypes }
    ),
    client.fetch<ContentDocument[]>(
      `*[_type == "post" && (defined(authors) || count(content[_type == "quoteWithAuthor"]) > 0)]{_id, _type, authors, content}`
    ),
    client.fetch<ContentDocument[]>(
      `*[_type == "project" && defined(people)]{_id, _type, people}`
    ),
    client.fetch<ArrayDocument[]>(
      `*[_type == "inspectablesConfig" && count(inspectables[inspectableId in ["mate", "termo"]]) > 0]{_id, inspectables}`
    ),
    client.fetch<ArrayDocument[]>(`*[_type == "scenesConfig"]{_id, scenes}`),
    client.fetch<{
      imageIds: Array<string | null>
      fileIds: Array<string | null>
    }>(`{
        "imageIds": array::unique(
          *[_type == "person"].image.asset._ref +
          *[_type == "value"].image.asset._ref +
          *[_type == "peoplePage"].preOpenPositionsSideImages[].asset._ref +
          *[_type == "post"].content[_type == "quoteWithAuthor"].avatar.asset._ref +
          *[_type == "testimonial"].avatar.asset._ref
        ),
        "fileIds": array::unique(
          *[_type == "threeDAssets"][0].videos[mesh in ["SM_PeopleMonitorA", "SM_PeopleMonitorD"]].url.asset._ref
        )
      }`),
    client.fetch<Record<string, number>>(`{
        "posts": count(*[_type == "post"]),
        "projects": count(*[_type == "project"]),
        "services": count(*[_type == "service"])
      }`)
  ])

  const threeDAssets = await client.fetch<ArrayDocument[]>(
    `*[_type == "threeDAssets" && count(videos[mesh in ["SM_PeopleMonitorA", "SM_PeopleMonitorD"]]) > 0]{_id, videos}`
  )
  const candidateAssetIds = unique([
    ...(assets.imageIds ?? []),
    ...(assets.fileIds ?? [])
  ])

  const counts = Object.fromEntries(
    targetTypes.map((type) => [
      type,
      documents.filter((document) => document._type === type).length
    ])
  )
  console.info("Target document counts (published + drafts):", counts)
  console.info("Posts to anonymize:", posts.length)
  console.info("Projects to detach:", projects.length)
  console.info("People-only inspectable configs:", inspectableConfigs.length)
  console.info("Scene configs to normalize:", sceneConfigs.length)
  console.info("Legacy 3D asset configs:", threeDAssets.length)
  console.info("Candidate media assets:", candidateAssetIds.length)
  console.info("Protected document counts:", protectedDocumentCounts)

  if (!apply) {
    console.info("Dry run only. Re-run with --apply to mutate production.")
    return
  }

  const patchMutations: Array<
    (tx: ReturnType<typeof client.transaction>) => void
  > = []

  for (const post of posts) {
    const hasAttributedQuote = post.content?.some(
      (block) => block._type === "quoteWithAuthor"
    )
    const nextContent = hasAttributedQuote
      ? post.content?.map((block) =>
          block._type === "quoteWithAuthor"
            ? {
                _type: "quote",
                ...(block._key ? { _key: block._key } : {}),
                ...(block.quote ? { quote: block.quote } : {})
              }
            : block
        )
      : undefined

    patchMutations.push((tx) => {
      let patch = tx.patch(post._id, (builder) => builder.unset(["authors"]))
      if (nextContent) {
        patch = patch.patch(post._id, (builder) =>
          builder.set({ content: nextContent })
        )
      }
      return patch
    })
  }

  for (const project of projects) {
    patchMutations.push((tx) =>
      tx.patch(project._id, (builder) => builder.unset(["people"]))
    )
  }

  for (const config of inspectableConfigs) {
    const inspectables = (config.inspectables ?? []).filter(
      (item) => !["mate", "termo"].includes(String(item.inspectableId ?? ""))
    )
    patchMutations.push((tx) =>
      tx.patch(config._id, (builder) => builder.set({ inspectables }))
    )
  }

  for (const config of sceneConfigs) {
    const scenes = (config.scenes ?? [])
      .filter(
        (scene) => String(scene.sceneName ?? "").toLowerCase() !== "people"
      )
      .map((scene) => ({
        ...scene,
        tabs: Array.isArray(scene.tabs)
          ? scene.tabs.filter(
              (tab) =>
                !(
                  typeof tab === "object" &&
                  tab != null &&
                  normalizeRoute((tab as UnknownRecord).tabRoute) === "people"
                )
            )
          : scene.tabs
      }))
    patchMutations.push((tx) =>
      tx.patch(config._id, (builder) => builder.set({ scenes }))
    )
  }

  for (const config of threeDAssets) {
    const videos = (config.videos ?? []).filter(
      (video) => !peopleVideoMeshes.has(String(video.mesh ?? ""))
    )
    patchMutations.push((tx) =>
      tx.patch(config._id, (builder) => builder.set({ videos }))
    )
  }

  await commitMutations(patchMutations)

  const targetIds = documents.map((document) => document._id)
  const unexpectedReferrers = targetIds.length
    ? await client.fetch<Array<{ _id: string; _type: string }>>(
        `*[_id not in $targetIds && references($targetIds)]{_id, _type}`,
        { targetIds }
      )
    : []
  if (unexpectedReferrers.length) {
    throw new Error(
      `Refusing to delete referenced documents: ${JSON.stringify(unexpectedReferrers)}`
    )
  }

  await commitMutations(
    targetIds.map(
      (id) => (tx: ReturnType<typeof client.transaction>) => tx.delete(id)
    )
  )

  const orphanAssetIds: string[] = []
  for (const assetId of candidateAssetIds) {
    const referenceCount = await client.fetch<number>(
      `count(*[references($assetId)])`,
      { assetId }
    )
    if (referenceCount === 0) orphanAssetIds.push(assetId)
  }
  await commitMutations(
    orphanAssetIds.map(
      (id) => (tx: ReturnType<typeof client.transaction>) => tx.delete(id)
    )
  )

  const verification = await client.fetch<UnknownRecord>(
    `{
      "targetDocuments": count(*[_type in $targetTypes]),
      "postAuthors": count(*[_type == "post" && defined(authors)]),
      "projectPeople": count(*[_type == "project" && defined(people)]),
      "attributedQuotes": count(*[_type == "post" && count(content[_type == "quoteWithAuthor"]) > 0]),
      "peopleScenes": count(*[_type == "scenesConfig" && count(scenes[lower(sceneName) == "people"]) > 0]),
      "peopleTabs": count(*[_type == "scenesConfig" && count(scenes[].tabs[lower(string::split(tabRoute, "/")[-1]) == "people"]) > 0]),
      "peopleInspectables": count(*[_type == "inspectablesConfig" && count(inspectables[inspectableId in ["mate", "termo"]]) > 0]),
      "peopleVideos": count(*[_type == "threeDAssets" && count(videos[mesh in ["SM_PeopleMonitorA", "SM_PeopleMonitorD"]]) > 0])
    }`,
    { targetTypes }
  )
  console.info("Deleted orphan media assets:", orphanAssetIds.length)
  console.info("Verification:", verification)

  const protectedDocumentCountsAfter = await client.fetch<
    Record<string, number>
  >(`{
    "posts": count(*[_type == "post"]),
    "projects": count(*[_type == "project"]),
    "services": count(*[_type == "service"])
  }`)
  console.info(
    "Protected document counts after migration:",
    protectedDocumentCountsAfter
  )

  if (Object.values(verification).some((value) => value !== 0)) {
    throw new Error("Sanity verification failed")
  }
  if (
    Object.entries(protectedDocumentCounts).some(
      ([type, count]) => protectedDocumentCountsAfter[type] !== count
    )
  ) {
    throw new Error("Protected Sanity document counts changed")
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
