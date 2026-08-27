import { PORTFOLIO_CONTACT } from "@/lib/portfolio-contact"

import { Link } from "../primitives/link"

export const Contact = () => (
  <div className="grid-layout pb-16 pt-12 lg:pb-32 lg:pt-16">
    <div className="relative col-span-full grid h-fit grid-cols-4 gap-2 !px-0 lg:col-span-10 lg:col-start-2 lg:grid-cols-10 2xl:col-start-3">
      <div className="with-diagonal-lines pointer-events-none !absolute inset-0" />

      <h2 className="relative col-span-2 mb-2 text-f-h3-mobile text-brand-g1 lg:text-f-h3">
        联系方式
      </h2>

      <p className="relative col-span-8 row-start-2 font-display text-f-h1-mobile text-brand-w2 lg:text-f-h1">
        期待与你交流设计与体验
      </p>

      <div className="relative col-span-full row-start-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[2rem] text-f-h1-mobile text-brand-w1 lg:text-f-h1">
        <Link href={PORTFOLIO_CONTACT.emailHref}>
          <span className="actionable">{PORTFOLIO_CONTACT.email}</span>
        </Link>
        <Link href={PORTFOLIO_CONTACT.phoneHref}>
          <span className="actionable">{PORTFOLIO_CONTACT.phone}</span>
        </Link>
      </div>
    </div>
  </div>
)
