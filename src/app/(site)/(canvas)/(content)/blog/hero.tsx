export function Hero({ count }: { count: number }) {
  return (
    <section className="grid-layout text-f-h0-mobile lg:text-f-h0">
      <h1 className="col-span-3 text-brand-w2 lg:col-start-1 lg:col-end-5">
        所有项目
      </h1>
      <p className="col-span-1 text-end tabular-nums text-brand-g1 lg:col-start-5 lg:text-start">
        {String(count).padStart(2, "0")}
      </p>
    </section>
  )
}
