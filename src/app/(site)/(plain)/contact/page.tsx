import type { Metadata } from "next"

import { Link } from "@/components/primitives/link"
import { PORTFOLIO_CONTACT } from "@/lib/portfolio-contact"
import { PageJsonLd } from "@/lib/structured-data/page-json-ld"

export const metadata: Metadata = {
  title: "联系方式",
  description: `联系UX设计师${PORTFOLIO_CONTACT.name}，电话 ${PORTFOLIO_CONTACT.phone}，邮箱 ${PORTFOLIO_CONTACT.email}。`,
  alternates: { canonical: "/contact" }
}

const contactItems = [
  {
    index: "01",
    label: "电话 / Phone",
    value: PORTFOLIO_CONTACT.phone,
    href: PORTFOLIO_CONTACT.phoneHref,
    action: "拨打电话"
  },
  {
    index: "02",
    label: "邮箱 / Email",
    value: PORTFOLIO_CONTACT.email,
    href: PORTFOLIO_CONTACT.emailHref,
    action: "发送邮件"
  },
  {
    index: "03",
    label: "所在地 / Location",
    value: PORTFOLIO_CONTACT.location
  }
] as const

const Contact = () => (
  <>
    <PageJsonLd />
    <div className="mx-auto flex min-h-[100svh] w-full max-w-[120rem] flex-col px-4 pb-6 pt-[calc(2.25rem+1px)] text-brand-w2">
      <div className="grid flex-1 gap-10 py-8 lg:grid-cols-12 lg:gap-4 lg:py-12">
        <header className="flex flex-col justify-between gap-10 lg:col-span-5">
          <div>
            <p className="mb-4 text-f-p text-brand-g1">
              // PERSONAL CONTACT · 个人联系
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.82] tracking-[-0.05em] text-brand-w1">
              联系方式
            </h1>
          </div>

          <div className="border-l border-brand-g1 pl-4">
            <p className="font-display text-f-h2-mobile text-brand-w1 lg:text-f-h2">
              {PORTFOLIO_CONTACT.name}
            </p>
            <p className="mt-2 text-brand-g1">
              {PORTFOLIO_CONTACT.englishName} · {PORTFOLIO_CONTACT.role}
            </p>
          </div>
        </header>

        <section
          aria-label="个人联系方式"
          className="flex flex-col border-y border-brand-g1/60 lg:col-span-7 lg:col-start-6"
        >
          {contactItems.map((item) => (
            <article
              key={item.index}
              className="grid min-h-36 grid-cols-[2.5rem_1fr] items-center gap-3 border-b border-brand-g1/40 py-6 last:border-b-0 sm:grid-cols-[3rem_minmax(8rem,0.5fr)_minmax(0,1fr)_auto] sm:gap-6"
            >
              <span className="self-start text-brand-g1 sm:self-center">
                {item.index}
              </span>
              <p className="self-start text-brand-g1 sm:self-center">
                {item.label}
              </p>
              <p className="col-start-2 break-all font-display text-[clamp(1.75rem,4vw,3.75rem)] font-semibold leading-none text-brand-w1 sm:col-start-auto">
                {item.value}
              </p>
              {"href" in item && (
                <Link
                  href={item.href}
                  className="col-start-2 mt-2 w-fit text-brand-w1 sm:col-start-auto sm:mt-0"
                >
                  <span className="actionable">{item.action} →</span>
                </Link>
              )}
            </article>
          ))}
        </section>
      </div>

      <footer className="flex flex-col gap-2 border-t border-brand-g1/40 pt-4 text-brand-g1 sm:flex-row sm:items-center sm:justify-between">
        <p>期待与你交流设计、产品与用户体验。</p>
        <Link href="/" className="w-fit text-brand-w1">
          <span className="actionable">返回首页</span>
        </Link>
      </footer>
    </div>
  </>
)

export default Contact
