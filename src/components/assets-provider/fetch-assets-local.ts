import { ASSETS_BASE, INSPECTABLES_META } from "@/lib/3d-config/asset-manifest"
import { PERSONAL_HONORS } from "@/lib/personal-honors"
import { getSiteRouteLabel, normalizeSiteRoute } from "@/lib/site-navigation"
import type { PortableTextBlock } from "@/service/sanity/types"

import { fetchThreeDConfig } from "./fetch-3d-config-sanity"
import type { AssetsResult } from "./fetch-assets"

// One log per missing inspectable per process — without dedup the warn loop
// would fire on every request × every missing inspectable, flooding log drains.
const warnedMissingInspectables = new Set<string>()

const localRoutingOverrides: Record<string, string> = {
  Services2_Hover: "/blog"
}

const localHonorByInspectableId = new Map(
  [
    ["sotd-01", "honor-01"],
    ["sotd-02", "honor-03"],
    ["webby-kidsuper", "honor-04"],
    ["webby-mrbeast", "honor-06"]
  ].map(([inspectableId, honorId]) => [
    inspectableId,
    PERSONAL_HONORS.find((honor) => honor.id === honorId)!
  ])
)

interface LocalInspectableCopy {
  title: string
  specs: { label: string; value: string }[]
  description: string
}

const localInspectableCopy: Record<string, LocalInspectableCopy> = {
  "pink-floyd": {
    title: "月之暗面",
    specs: [
      { label: "发行时间", value: "1973年3月1日" },
      { label: "录制时间", value: "1972年5月31日至1973年2月9日" },
      { label: "时长", value: "42分50秒" },
      { label: "类型", value: "前卫摇滚" },
      { label: "播放量", value: "流媒体平台累计超过3000万次，仍在增长" },
      { label: "荣誉", value: "入选格莱美名人堂，并获得众多其他荣誉" },
      { label: "制作人", value: "平克·弗洛伊德" }
    ],
    description:
      "法昆多正沉浸在《月之暗面》中，听着吉尔摩的吉他独奏；何塞则随着坏痞兔的节拍享受音乐。我们各自偏爱不同的风格，却意外地十分合拍。顺带一提，法昆多还和平克·弗洛伊德的鼓手尼克·梅森合过影——只是一次与传奇人物的轻松相遇。"
  },
  patas: {
    title: "帕塔斯",
    specs: [
      { label: "项目", value: "地下室编年史" },
      { label: "使命", value: "拯救世界" },
      { label: "最好的朋友", value: "西奥" },
      { label: "操作系统", value: "未知" },
      { label: "机型", value: "麦金塔" },
      { label: "内存", value: "128KB" },
      { label: "获得认可", value: "Awwwards 每日网站奖" }
    ],
    description:
      "认识一下帕塔斯，你的数字伙伴。她一半故障、一半天才，百分之百是个麻烦制造者。她诞生于《地下室编年史》，来到这里是为了智胜恶意软件，探索网络中隐藏的角落。好奇心从来不是缺陷，而是一项功能。"
  }
}

function createDescription(key: string, text: string): PortableTextBlock[] {
  return [
    {
      _type: "block",
      _key: `${key}-description`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${key}-description-text`,
          text,
          marks: []
        }
      ]
    }
  ]
}

/** Joins the repo manifest with Sanity content into one `AssetsResult`. */
export async function fetchAssetsLocal(): Promise<AssetsResult> {
  const config = await fetchThreeDConfig()

  const inspectableContentById = new Map(
    (config.inspectables ?? []).map((c) => [c.inspectableId ?? "", c])
  )

  const inspectables = INSPECTABLES_META.map((meta) => {
    const content = inspectableContentById.get(meta.id)
    const localHonor = localHonorByInspectableId.get(meta.id)
    const localizedCopy = localInspectableCopy[meta.id]
    if (!content && !warnedMissingInspectables.has(meta.id)) {
      warnedMissingInspectables.add(meta.id)
      console.warn(
        `[3d-config] no Sanity inspectableContent for id="${meta.id}"; rendering with empty copy.`
      )
    }
    return {
      id: meta.id,
      _title: localizedCopy?.title ?? localHonor?.title ?? content?.title ?? "",
      specs: localizedCopy
        ? localizedCopy.specs.map((spec, index) => ({
            _id: `${meta.id}-spec-${index}`,
            _title: spec.label,
            value: spec.value
          }))
        : localHonor
          ? [
              {
                _id: `${localHonor.id}-award`,
                _title: "赛事",
                value: localHonor.award
              },
              {
                _id: `${localHonor.id}-level`,
                _title: "奖项",
                value: localHonor.level
              },
              {
                _id: `${localHonor.id}-date`,
                _title: "时间",
                value: localHonor.date
              },
              {
                _id: `${localHonor.id}-category`,
                _title: "类别",
                value: localHonor.category
              }
            ]
          : (content?.specs ?? []).map((s) => ({
              _id: s.specId ?? "",
              _title: s.title ?? "",
              value: s.value ?? ""
            })),
      description: localizedCopy
        ? createDescription(meta.id, localizedCopy.description)
        : localHonor
          ? createDescription(localHonor.id, localHonor.description)
          : Array.isArray(content?.description)
            ? (content.description as PortableTextBlock[])
            : undefined,
      mesh: meta.mesh,
      xOffset: meta.xOffset,
      yOffset: meta.yOffset,
      xRotationOffset: meta.xRotationOffset,
      sizeTarget: meta.sizeTarget,
      scenes: [...meta.scenes],
      fx: meta.fx
    }
  })

  const disabledScenes = new Set(["lab", "people"])
  const scenes = (config.scenes ?? [])
    .filter(
      (scene) => !disabledScenes.has(scene.sceneName?.toLowerCase() ?? "")
    )
    .map((s) => ({
      name: s.sceneName ?? "",
      cameraConfig: {
        position: [
          s.cameraConfig?.posX ?? 0,
          s.cameraConfig?.posY ?? 0,
          s.cameraConfig?.posZ ?? 0
        ] as [number, number, number],
        target: [
          s.cameraConfig?.tarX ?? 0,
          s.cameraConfig?.tarY ?? 0,
          s.cameraConfig?.tarZ ?? 0
        ] as [number, number, number],
        fov: s.cameraConfig?.fov ?? 60,
        targetScrollY: s.cameraConfig?.targetScrollY ?? -1.5,
        offsetMultiplier: s.cameraConfig?.offsetMultiplier ?? 1
      },
      tabs: (s.tabs ?? [])
        .map((tab) => {
          const tabRoute = normalizeSiteRoute(
            localRoutingOverrides[tab.tabClickableName ?? ""] ??
              tab.tabRoute ??
              ""
          )

          return {
            tabName: tab.tabName ?? "",
            tabRoute,
            tabHoverName: getSiteRouteLabel(tabRoute) ?? tab.tabHoverName ?? "",
            tabClickableName: tab.tabClickableName ?? "",
            plusShapeScale: tab.plusShapeScale ?? 1
          }
        })
        .filter(
          (tab) =>
            !disabledScenes.has(tab.tabRoute.replace(/^\/+/, "").toLowerCase())
        ),
      postprocessing: {
        contrast: s.postprocessing?.contrast ?? 1,
        brightness: s.postprocessing?.brightness ?? 1,
        exposure: s.postprocessing?.exposure ?? 1,
        gamma: s.postprocessing?.gamma ?? 1,
        vignetteRadius: s.postprocessing?.vignetteRadius ?? 1,
        vignetteSpread: s.postprocessing?.vignetteSpread ?? 1,
        bloomStrength: s.postprocessing?.bloomStrength ?? 1,
        bloomRadius: s.postprocessing?.bloomRadius ?? 1,
        bloomThreshold: s.postprocessing?.bloomThreshold ?? 1
      }
    }))

  const physicsParams = (config.physics?.physicsParams ?? []).map((p) => ({
    _title: p.title ?? "",
    value: p.value ?? 0
  }))

  return {
    ...ASSETS_BASE,
    inspectables,
    scenes,
    physicsParams
  }
}
