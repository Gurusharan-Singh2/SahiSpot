import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  LineChart,
  MapPinned,
  TimerReset,
} from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    icon: MapPinned,
    title: "Discover live spaces",
    description: "See available parking hubs on a real map instead of guessing from flat lists.",
  },
  {
    icon: TimerReset,
    title: "Reserve before arrival",
    description: "Choose the right slot and arrive with less uncertainty, less circling, and less stress.",
  },
  {
    icon: CreditCard,
    title: "Pay with less friction",
    description: "Move from booking to payment inside the same polished driver flow.",
  },
  {
    icon: LineChart,
    title: "Run owner operations",
    description: "Track occupancy, manage slots, and present parking inventory in a premium interface.",
  },
];

const steps = [
  "Search nearby parking with map-first discovery",
  "Compare pricing, slot count, and fit for your vehicle",
  "Book, pay, and navigate with fewer clicks",
];

export default function Working() {
  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Why it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              A darker, calmer product surface for a messy real-world problem.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              SahiSpot is designed to cut noise. Drivers get clarity. Owners get control.
              Everyone gets a cleaner journey from discovery to revenue.
            </p>

            <div className="mt-8 space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-[1.4rem] border border-white/10 bg-slate-950/50 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-200 sm:text-base">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.72))] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.95)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <Icon className="h-6 w-6 text-orange-300" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(90deg,rgba(15,23,42,0.9),rgba(17,24,39,0.84))] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              Ready to move
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              Bring the dark premium experience across discovery, booking, and parking operations.
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
              Use SahiSpot to modernize how parking looks and feels for both drivers and operators.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/find-parking"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Open map
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
