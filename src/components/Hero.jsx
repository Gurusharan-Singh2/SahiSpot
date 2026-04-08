import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  CarFront,
  MapPin,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickStats = [
  { label: "Parking hubs", value: "1,200+" },
  { label: "Average time saved", value: "17 min" },
  { label: "Monthly bookings", value: "48k" },
];

const vehicleChips = [
  { icon: CarFront, label: "Car" },
  { icon: Bike, label: "Bike" },
  { icon: Zap, label: "EV" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-6 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-6 h-44 w-44 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute right-[8%] top-20 h-52 w-52 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-300 backdrop-blur sm:text-sm">
            <Sparkles className="h-4 w-4 text-orange-300" />
            <span className="truncate">Parking SaaS for drivers, owners, and EV-ready cities</span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Book the right parking spot before the street steals your time.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
              SahiSpot blends live map discovery, role-based parking operations, and smoother
              payments into one dark, focused platform that feels premium from search to exit.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/find-parking")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_-20px_rgba(249,115,22,0.8)] transition hover:brightness-110 sm:w-auto sm:px-7"
            >
              Explore parking now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/about-us")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] sm:w-auto sm:px-7"
            >
              Why SahiSpot works
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                    Live nearby map
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Connaught Place Hub</h2>
                </div>
                <div className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  26 slots open
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),transparent_32%),linear-gradient(180deg,#101827_0%,#0b1220_100%)] p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Best match</p>
                      <p className="mt-2 text-lg font-semibold text-white">Underground secure parking</p>
                      <p className="mt-1 text-sm text-slate-400">2 minutes from your destination</p>
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
                        CCTV and owner verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Bookings today</p>
                  <p className="mt-2 text-xl font-semibold text-white">182</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Repeat users</p>
                  <p className="mt-2 text-xl font-semibold text-white">74%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Owner revenue</p>
                  <p className="mt-2 text-xl font-semibold text-white">Rs. 1.9L</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
