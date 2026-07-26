import QRCode from "qrcode";
import BookingForm from "@/components/BookingForm";
import CashAppPayment from "@/components/CashAppPayment";
import { BUSINESS, SERVICES } from "@/lib/business";
import { SERVICE_ICONS, ShieldIcon, ClockIcon, HomeIcon, CheckBadgeIcon, CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const TRUST_BADGES = [
  { icon: ShieldIcon, label: "Licensed & insured" },
  { icon: ClockIcon, label: "Fast, reliable scheduling" },
  { icon: HomeIcon, label: "Locally owned & operated" },
  { icon: CheckBadgeIcon, label: "Satisfaction guaranteed" },
];

export default async function HomePage() {
  const qrDataUrl = await QRCode.toDataURL(BUSINESS.cashAppUrl, {
    margin: 1,
    width: 320,
  });

  return (
    <main className="bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                <path d="M4 20c8 0 16-6 16-16C10 4 4 12 4 20Z" />
                <path d="M6 18c3-4 6-7 12-13" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-gray-900">{BUSINESS.name}</span>
          </div>
          <nav className="hidden gap-8 text-[13px] font-medium text-gray-600 md:flex">
            <a href="#services" className="transition hover:text-gray-900">Services</a>
            <a href="#booking" className="transition hover:text-gray-900">Book / get a quote</a>
            <a href="#pay" className="transition hover:text-gray-900">Pay</a>
            <a href="#contact" className="transition hover:text-gray-900">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href={BUSINESS.phoneHref} className="hidden text-[13px] font-medium text-gray-600 hover:text-gray-900 sm:block">
              {BUSINESS.phone}
            </a>
            <a
              href="#booking"
              className="rounded-md bg-gray-900 px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-black"
            >
              Get a free estimate
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          style={{
            background:
              "radial-gradient(60% 50% at 22% 0%, rgba(87,181,107,0.16) 0%, rgba(87,181,107,0) 60%), radial-gradient(45% 40% at 85% 10%, rgba(30,97,47,0.12) 0%, rgba(30,97,47,0) 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-medium text-gray-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Now booking in {BUSINESS.serviceArea}
            </span>
            <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-gray-900 sm:text-6xl">
              Lawn care,
              <br />
              done right.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-500">
              Mowing, leaf cleanup, mulch, and trimming for homes and businesses across{" "}
              {BUSINESS.serviceArea}. Request an estimate online in a couple minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#booking"
                className="rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
              >
                Request a free estimate
              </a>
              <a
                href={BUSINESS.phoneHref}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 transition hover:text-gray-900"
              >
                Call {BUSINESS.phone}
                <span className="transition group-hover:translate-x-0.5">→</span>
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-400">Open {BUSINESS.hoursLabel}</p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-100 pt-8 sm:grid-cols-4">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span className="text-[13px] leading-snug text-gray-600">{label}</span>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_20px_40px_-8px_rgba(15,23,42,0.10)] sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <p className="text-[13px] font-semibold text-gray-900">Get a free estimate</p>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                  ~2 min
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {[
                  "No-obligation quote, no pressure",
                  "Pick a date that already fits our schedule",
                  "Pay easily with Cash App once the job's done",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-gray-600">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className="mt-6 flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Start my estimate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-[13px] font-semibold text-brand-700">What we do</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Services &amp; pricing</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
            Small, medium, and large yards welcome — plus commercial properties. Jobs outside
            of mowing are quoted based on the size and time of the work.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = SERVICE_ICONS[s.id];
            return (
              <div key={s.id} className="bg-white p-7 transition hover:bg-gray-50/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  {Icon && <Icon className="h-5 w-5" />}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-gray-900">{s.label}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">{s.description}</p>
                <ul className="mt-5 space-y-1.5 text-[13.5px]">
                  {s.pricing.map((p) => (
                    <li key={p.tier} className="flex justify-between text-gray-500">
                      <span>{p.tier}</span>
                      <span className="font-semibold text-gray-900">{p.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-y border-gray-100 bg-gray-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-[13px] font-semibold text-brand-700">Booking</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              Book a job / request an estimate
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
              Pick a date, tell us about the job, and we&apos;ll follow up by email
              {" "}(and phone, if you leave one) to confirm.
            </p>
          </div>
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_16px_32px_-12px_rgba(15,23,42,0.08)] sm:p-10">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Payment */}
      <section id="pay" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-[13px] font-semibold text-brand-700">Payment</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Pay for completed work</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
            Already had a job done? Pay quickly with Cash App.
          </p>
        </div>
        <div className="mt-8">
          <CashAppPayment qrDataUrl={qrDataUrl} />
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="bg-gray-950 text-gray-400">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-700 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4 20c8 0 16-6 16-16C10 4 4 12 4 20Z" />
                  <path d="M6 18c3-4 6-7 12-13" />
                </svg>
              </span>
              <span className="text-[15px] font-semibold text-white">{BUSINESS.name}</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-gray-500">
              Lawn mowing, leaf cleanup, mulch, and trimming for residential and commercial
              properties.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Contact</h3>
            <ul className="mt-4 space-y-2 text-[13.5px]">
              <li>
                <a href={BUSINESS.phoneHref} className="font-semibold text-white hover:underline">
                  {BUSINESS.phone}
                </a>
              </li>
              <li>{BUSINESS.serviceArea}</li>
              <li>Open {BUSINESS.hoursLabel}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Quick links</h3>
            <ul className="mt-4 space-y-2 text-[13.5px]">
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#booking" className="hover:text-white">Book a job</a></li>
              <li><a href="#pay" className="hover:text-white">Pay with Cash App</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          <span className="mx-2">·</span>
          <a href="/admin/login" className="hover:text-white hover:underline">Owner Login</a>
        </div>
      </footer>
    </main>
  );
}
