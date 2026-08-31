import { PERSONAL_HONORS_INTRO } from "@/lib/personal-honors"

export const Hero = () => (
  <section className="grid-layout !gap-y-6 lg:!gap-y-2">
    <div className="col-span-full lg:col-start-1 lg:col-end-8">
      <p className="text-f-h5 mb-2 font-sans text-brand-g1">
        PERSONAL HONORS / 2022—2025
      </p>
      <h1 className="font-display text-f-h0-mobile text-brand-w2 lg:text-f-h0">
        个人荣誉
      </h1>
    </div>
    <p className="col-span-full max-w-[38rem] font-sans text-f-h3-mobile text-brand-w2 lg:col-start-9 lg:col-end-13 lg:text-f-h4">
      {PERSONAL_HONORS_INTRO}
    </p>
  </section>
)
