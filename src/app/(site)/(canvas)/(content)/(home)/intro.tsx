import { HOME_INTRO_SUBTITLE_LINES, HOME_INTRO_TITLE } from "@/lib/home-intro"

export const Intro = () => {
  return (
    <section className="grid-layout">
      <article className="col-span-full flex flex-col gap-4 text-brand-w1 lg:col-span-11">
        <div>
          <h1 className="text-pretty text-f-h0-mobile lg:text-[5.4375rem] lg:leading-[4.875rem] 3xl:text-f-h0">
            {HOME_INTRO_TITLE}
          </h1>
        </div>
        <div className="w-full lg:w-[60%]">
          <p className="text-balance text-f-h4-mobile lg:text-f-h4">
            {HOME_INTRO_SUBTITLE_LINES.map((line, index) => (
              <span key={line}>
                {line}
                {index < HOME_INTRO_SUBTITLE_LINES.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      </article>
    </section>
  )
}
