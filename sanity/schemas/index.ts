import { award } from "./documents/award"
import { client } from "./documents/client"
import { project } from "./documents/project"
import { projectCategory } from "./documents/projectCategory"
import { quote } from "./objects/quote"
import { showcaseItem } from "./objects/showcaseItem"
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
  quote,
  showcaseItem
]
