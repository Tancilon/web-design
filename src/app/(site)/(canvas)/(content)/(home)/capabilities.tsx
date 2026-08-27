import {
  PORTFOLIO_CAPABILITIES,
  PORTFOLIO_CAPABILITIES_INTRO_LINES,
  PORTFOLIO_CAPABILITIES_SECTION_TITLE
} from "@/lib/portfolio-capabilities"

export const SkillsSection = () => {
  return (
    <div className="grid-layout">
      <h2 className="col-span-full mb-2 text-f-h3-mobile text-brand-g1 lg:col-start-2 lg:text-f-h3 2xl:col-start-3">
        {PORTFOLIO_CAPABILITIES_SECTION_TITLE}
      </h2>

      <p className="col-span-full font-display text-f-h1-mobile text-brand-w2 lg:text-f-h1">
        {PORTFOLIO_CAPABILITIES_INTRO_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <div className="grid-layout relative col-span-full mt-16 !px-0">
        <div className="col-start-1 col-end-11 grid grid-cols-2 gap-x-3 gap-y-8 lg:col-start-2 lg:grid-cols-8 2xl:col-start-3">
          {PORTFOLIO_CAPABILITIES.map((capability) => (
            <div
              key={capability.title}
              className="col-span-1 mt-1.25 flex flex-col gap-y-6 text-brand-w1 lg:col-span-2"
            >
              <h3 className="text-f-h4-mobile lg:text-f-h4">
                {capability.title}
              </h3>

              <p className="-mt-1 text-f-h4-mobile text-brand-w2 lg:text-f-h4">
                {capability.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {capability.tags.map((tag) => (
                  <p
                    key={tag}
                    title={tag}
                    className="line-clamp-1 w-fit bg-brand-g2 px-1 text-f-p-mobile text-brand-w1 lg:text-f-p"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
