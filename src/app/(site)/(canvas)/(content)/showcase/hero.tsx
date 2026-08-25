import { BEYOND_DESIGN_COUNT } from "@/lib/beyond-design"

export function Hero() {
  return (
    <section className="grid-layout !text-[3.5rem] text-f-h0-mobile">
      <h1 className="col-span-3 text-brand-w2 lg:col-start-1 lg:col-end-7 lg:text-f-h0">
        设计之外
      </h1>
      <div className="col-span-1 text-end text-brand-g1 lg:col-start-7 lg:col-end-12 lg:text-start lg:text-f-h0">
        {BEYOND_DESIGN_COUNT}
      </div>
    </section>
  )
}
