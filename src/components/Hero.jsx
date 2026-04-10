import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  CalendarClock,
  CarFront,
  CreditCard,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickStats = [
  { label: "Cities onboarded", value: "24+" },
  { label: "Average booking time", value: "under 40 sec" },
  { label: "Driver satisfaction", value: "4.8/5" },
];

const vehicleChips = [
  { icon: CarFront, label: "Car parking" },
  { icon: Bike, label: "Bike parking" },
  { icon: Zap, label: "EV friendly" },
];

const trustPoints = [
  "Clear pricing before you book",
  "Verified spaces and owners",
  "Mobile-first flow with fewer steps",
];

const actions = [
  { icon: Search, label: "Search", description: "Find nearby parking by location" },
  { icon: CalendarClock, label: "Reserve", description: "Lock a spot before arrival" },
  { icon: CreditCard, label: "Pay", description: "Complete payment in one flow" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-3 pb-12 pt-8 sm:px-5 sm:pb-16 sm:pt-10 lg:px-6 xl:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(251,146,60,0.1),transparent)]" />
        <div className="absolute left-[8%] top-6 h-48 w-48 rounded-full bg-orange-500/16 blur-3xl" />
        <div className="absolute right-[6%] top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[90rem] items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-7"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/8 px-4 py-2 text-xs text-orange-100 backdrop-blur sm:text-sm">
            <Sparkles className="h-4 w-4 text-orange-300" />
            <span className="truncate">Built for real drivers, operators, and busy city trips</span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Parking that feels easy before you even leave home.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              SahiSpot helps people find, compare, book, and pay for parking in one calm flow.
              No guessing, no circling, and no confusing screens between search and arrival.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {actions.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/12">
                  <Icon className="h-5 w-5 text-orange-300" />
                </div>
                <p className="mt-4 text-lg font-semibold text-white">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/find-parking")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_-20px_rgba(249,115,22,0.8)] transition hover:brightness-110 sm:w-auto sm:px-7"
            >
              Find parking now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] sm:w-auto sm:px-7"
            >
              Create free account
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {vehicleChips.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
              >
                <Icon className="h-4 w-4 text-emerald-300" />
                {label}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {quickStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative"
        >
          <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(9,14,26,0.88))] p-4 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.95)] sm:p-5">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                    Today&apos;s best nearby option
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    Connaught Place Central Hub
                  </h2>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified location
                  </div>
                </div>
                <div className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  26 slots open
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),transparent_32%),linear-gradient(180deg,#101827_0%,#0b1220_100%)] p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Why users pick this</p>
                      <p className="mt-2 text-lg font-semibold text-white">Fast entry, secure basement parking</p>
                      <p className="mt-1 text-sm text-slate-400">
                        2 minutes from your destination with CCTV, lighting, and easy exit.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="h-4 w-4 text-orange-300" />
                        Rajiv Chowk, New Delhi
                      </div>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        Rs. 50
                        <span className="ml-1 text-sm font-normal text-slate-500">/hour</span>
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                        <Navigation className="h-4 w-4 text-sky-300" />
                        Best route sent after booking
                      </div>
                    </div>
                  </div>

                  <div className="relative min-h-[220px] w-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-4 sm:min-h-[250px] lg:w-[220px]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-[46%] top-[36%] z-10"
                    >
                      <MapPin className="h-10 w-10 text-orange-400 drop-shadow-[0_12px_18px_rgba(249,115,22,0.5)]" />
                    </motion.div>
                    <div className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-right">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">ETA</p>
                      <p className="text-sm font-semibold text-white">3 min walk</p>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-300" />
                        CCTV, owner verified, instant confirmation
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {trustPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                        <BadgeCheck className="h-4 w-4 text-emerald-300" />
                      </div>
                      <p className="text-sm leading-6 text-slate-300">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
