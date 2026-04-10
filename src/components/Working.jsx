import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  CreditCard,
  LineChart,
  MapPinned,
  Shield,
  TimerReset,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    icon: MapPinned,
    title: "Map-first discovery",
    description: "Users can understand nearby options faster with live location context, not confusing lists.",
  },
  {
    icon: TimerReset,
    title: "Faster decision making",
    description: "Parking availability, walking time, and price are surfaced early so booking feels simpler.",
  },
  {
    icon: CreditCard,
    title: "One clear checkout",
    description: "Booking and payment live in a single journey that reduces friction and drop-off.",
  },
  {
    icon: LineChart,
    title: "Operational clarity",
    description: "Owners can manage occupancy, listings, and performance from a cleaner workspace.",
  },
];

const steps = [
  "Search nearby parking from a map that feels familiar on mobile.",
  "Compare price, distance, and slot availability at a glance.",
  "Book confidently and arrive with navigation and confirmation ready.",
];

const useCases = [
  { icon: CarFront, title: "Daily commuters", text: "Find reliable parking before office hours get hectic." },
  { icon: Users, title: "Families and shoppers", text: "Pick spots closer to your destination with less stress." },
  { icon: Shield, title: "Property owners", text: "Turn parking inventory into a managed digital product." },
];

const testimonials = [
  {
    quote: "The flow feels easy. I can check nearby parking and confirm in less than a minute.",
    author: "Rohit, daily commuter",
  },
  {
    quote: "It finally feels like a real service, not a rough parking listing tool.",
    author: "Neha, weekend city driver",
  },
];

export default function Working() {
  return (
    <section className="px-3 pb-18 pt-8 sm:px-5 lg:px-6 xl:px-8">
      <div className="mx-auto max-w-[90rem] space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              User-friendly by design
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              A product journey that explains itself in seconds.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Good visuals matter, but trust and clarity matter more. This experience now leads
              users from discovery to booking with less effort and fewer confusing choices.
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

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,31,0.92),rgba(5,10,20,0.88))] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              Built for real use
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {useCases.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
                    <Icon className="h-5 w-5 text-orange-300" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              What users should feel
            </p>
            <div className="mt-5 space-y-4">
              {testimonials.map((item) => (
                <div key={item.author} className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-base leading-7 text-slate-200">&quot;{item.quote}&quot;</p>
                  <p className="mt-4 text-sm font-medium text-slate-400">{item.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(90deg,rgba(15,23,42,0.9),rgba(17,24,39,0.84))] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              Ready to move
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              Turn SahiSpot into a product people trust from the first screen.
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
              The interface now speaks more clearly, guides action better, and feels closer to a launch-ready platform.
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
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
