import { award } from "./documents/award"
import { client } from "./documents/client"
import { post } from "./documents/post"
import { postCategory } from "./documents/postCategory"
import { project } from "./documents/project"
import { projectCategory } from "./documents/projectCategory"
import { codeBlock } from "./objects/codeBlock"
import { codeSandbox } from "./objects/codeSandbox"
import { gridGallery } from "./objects/gridGallery"
import { quote } from "./objects/quote"
import { showcaseItem } from "./objects/showcaseItem"
import { sideNote } from "./objects/sideNote"
import { tweetEmbed } from "./objects/tweetEmbed"
import { videoEmbed } from "./objects/videoEmbed"
import { companyInfo } from "./singletons/companyInfo"
import { faqPage } from "./singletons/faqPage"
import { homepage } from "./singletons/homepage"
import { inspectablesConfig } from "./singletons/inspectablesConfig"
import { physicsConfig } from "./singletons/physicsConfig"
import { scenesConfig } from "./singletons/scenesConfig"
import { servicesPage } from "./singletons/servicesPage"
import { showcasePage } from "./singletons/showcasePage"
import { threeDAssets } from "./singletons/threeDAssets"

export const schemaTypes = [
  // Document types
  award,
  client,
  post,
  postCategory,
  project,
  projectCategory,

  // Singleton types
  companyInfo,
  faqPage,
  homepage,
  inspectablesConfig,
  physicsConfig,
  scenesConfig,
  servicesPage,
  showcasePage,
  threeDAssets,

  // Object types
  codeBlock,
  codeSandbox,
  gridGallery,
  quote,
  showcaseItem,
  sideNote,
  tweetEmbed,
  videoEmbed
]
