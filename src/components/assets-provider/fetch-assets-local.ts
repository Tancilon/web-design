import { ASSETS_BASE, INSPECTABLES_META } from "@/lib/3d-config/asset-manifest"
import { SHOWCASE_DISPLAYS } from "@/lib/3d-config/showcase-displays"
import { beyondDesignWorks } from "@/lib/beyond-design"
import { PERSONAL_HONORS } from "@/lib/personal-honors"
import { PORTFOLIO_CONTACT } from "@/lib/portfolio-contact"
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

// Fictional cabinet stories are separate from the actual portfolio descriptions.
const showcaseStories: Record<string, string> = {
  "vercel-ship-2324":
    "RYN 在这幅画前停了一会儿，没有急着给它起一个故事。蓝紫色的光落在侧脸上，让她想起那些还没说出口的话。MIU 问她在看什么，她只指了指画面边缘：‘这里留一点空白，好像就能听见风。’",
  geist:
    "MIU 说，画里的人像是听见了什么，才忽然抬起头。LUNE 却觉得，他只是发现今天的光很好。她们没有争出答案，倒是一起把椅子挪到了窗边。有时候，一个新想法就从这样一次抬头开始。",
  "mr-beast":
    "LUNE 把这幅画想成一个尚未结束的梦：蝴蝶刚刚停下，画里的人还没有睁眼。RYN 想知道下一秒会发生什么，她却笑着摇头。不是每个故事都要赶着写完，有些瞬间，留在这里就很好。"
}

const localInspectableCopy: Record<string, LocalInspectableCopy> = {
  ...Object.fromEntries(
    SHOWCASE_DISPLAYS.map((display) => {
      const work = beyondDesignWorks.find((work) => work.id === display.workId)
      return [
        display.id,
        {
          title: work?.label ?? display.photo!,
          specs: [
            { label: "类别", value: work ? work.tags.join(" / ") : "个人照片" }
          ],
          description:
            work && showcaseStories[display.id]
              ? `${work.description}\n\n展柜小故事（虚构）：${showcaseStories[display.id]}`
              : (work?.description ?? display.photo!)
        }
      ]
    })
  ),
  nextjs: {
    title: "个人照片 01｜关于我",
    specs: [
      { label: "姓名", value: PORTFOLIO_CONTACT.name },
      { label: "职业", value: PORTFOLIO_CONTACT.role }
    ],
    description:
      "你好，我是江含，一名 UX 设计师。我的工作围绕用户需求、交互流程与界面设计展开，也通过手绘和视觉练习探索不同的表达。这份作品集收录了我的项目实践，以及设计之外的另一面，希望让你既看到作品，也认识作品背后的我。"
  },
  "dl-frame": {
    title: "个人照片 02｜我的工作方式",
    specs: [{ label: "关注方向", value: "用户体验 / 交互设计 / 落地协作" }],
    description:
      "从梳理需求、绘制原型，到完善界面细节、跟进开发，我关注设计如何真正落地。我习惯独立思考，也重视沟通与协作。对我而言，设计不止于完成一张画面，更在于把问题理清楚，与团队一起把体验做好。"
  },
  edglrd: {
    title: "EDGLRD 滑板",
    specs: [
      { label: "类别", value: "场景陈设 / 滑板" },
      { label: "故事设定", value: "RYN 的收藏（虚构）" }
    ],
    description:
      "RYN 把滑板靠在展柜边，像给随时出发留了一个位置。遇到想不通的事，她会招呼 MIU 出门转转，约好不讨论刚才的难题。等她们回来，LUNE 已经留好座位，而那个绕了半天的想法，往往也有了新的走向。"
  },
  "kiss-bag": {
    title: "Kiss Bag 粉色手袋",
    specs: [
      { label: "类别", value: "场景陈设 / 手袋" },
      { label: "故事设定", value: "MIU 的收藏（虚构）" }
    ],
    description:
      "MIU 的粉色手袋里，总有几张折起来的草稿和一支找了半天的笔。RYN 打趣说，它装的不是东西，是还没完成的计划。MIU 一边翻找一边点头，最后掏出一颗糖递给 LUNE：‘还有一点应付坏心情的准备。’"
  },
  swaggersouls: {
    title: "SwaggerSouls 头盔公仔",
    specs: [
      { label: "类别", value: "场景陈设 / 公仔" },
      { label: "故事设定", value: "三人的展柜守卫（虚构）" }
    ],
    description:
      "这位戴头盔的小守卫，总是一脸认真地站在展柜上。MIU 给它安排了看守草稿的任务，RYN 偶尔把便签藏在它身后，只有 LUNE 会记得替它摆正位置。它从不发表意见，却见证了她们把一个个不太成熟的点子慢慢做完。"
  },
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
      "想法打结的时候，MIU 会放下手里的工作，听一会儿《月之暗面》。她喜欢封面上那束穿过棱镜的光：看起来平平无奇，换个角度却藏着好多颜色。帕塔斯的屏幕在一旁轻轻闪烁，像在跟着节拍点头。等音乐结束，MIU 往往会在草稿角落添上一笔——刚才没想通的事，好像有了新的方向。"
  },
  "sm-07-02": {
    title: "Rocket Espresso 咖啡机",
    specs: [
      { label: "类型", value: "意式咖啡机" },
      { label: "锅炉容量", value: "1.80 升" },
      { label: "PID 压力控制", value: "无" },
      { label: "年份", value: "2023" },
      { label: "材质", value: "钢" },
      { label: "咖啡师模式", value: "开启" }
    ],
    description:
      "读到喜欢的段落，LUNE 会夹好书签，起身给自己做一杯咖啡。研磨、萃取，等香气慢慢散开，是她留给自己的小小间奏。拉花偶尔不太听话，她也不急着重来，只笑着把杯子端回沙发。书还停在刚才那一页，下一章的冒险，可以从这一口开始。"
  },
  patas: {
    title: "帕塔斯",
    specs: [
      { label: "项目", value: "地下室编年史" },
      { label: "使命", value: "拯救世界" },
      { label: "最好的朋友", value: "MIU" },
      { label: "操作系统", value: "未知" },
      { label: "机型", value: "麦金塔" },
      { label: "内存", value: "128KB" }
    ],
    description:
      "帕塔斯是 MIU 的灵感搭档，一台偶尔闹点小故障的老电脑。MIU 总把突如其来的点子讲给她听，她则用闪烁的屏幕回应——有时是线索，有时只是一个顽皮的玩笑。128KB 装不下整个世界，却足够存放她们下一次冒险的开场。"
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
