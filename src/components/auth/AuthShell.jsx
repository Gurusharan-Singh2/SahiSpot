import { motion } from "framer-motion";
import { ArrowRight, Bike, CarFront, CheckCircle2, MapPinned, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const featureItems = [
  {
    icon: MapPinned,
    title: "Live map discovery",
    description: "Explore nearby parking with a real-time, map-first experience.",
  },
  {
    icon: ShieldCheck,
    title: "Safer arrivals",
    description: "Access trusted parking spaces with slot visibility and verified locations.",
  },
  {
    icon: CheckCircle2,
    title: "Fast booking flow",
    description: "Move from search to payment in a few clean steps.",
  },
];

const vehicleBadges = [
  { icon: CarFront, label: "Car" },
  { icon: Bike, label: "Bike" },
  { icon: Zap, label: "EV" },
];

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  panel = "signin",
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),transparent_26%),radial-gradient(circle_at_80%_15%,_rgba(16,185,129,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,#07111f_0%,#09131d_45%,#030712_100%)] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        <div className="absolute left-[8%] top-24 h-40 w-40 rounded-full bg-orange-500/18 blur-3xl" />
        <div className="absolute bottom-10 right-[12%] h-56 w-56 rounded-full bg-emerald-400/14 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.86))] p-8 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] lg:block"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">
            SahiSpot Parking
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.02]">
            Parking SaaS that feels calm before the car even stops.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
            Give drivers a premium booking journey and give parking owners a cleaner way to
            manage occupancy, visibility, and revenue.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {vehicleBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/85 backdrop-blur"
              >
                <Icon className="h-4 w-4 text-emerald-300" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4">
            {featureItems.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
              <div
                key={itemTitle}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-emerald-400/15 p-3">
                    <Icon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{itemTitle}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/65">{itemDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.04] to-transparent p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Ready to explore</p>
                <p className="mt-2 text-lg font-semibold">Search, book, manage, repeat.</p>
              </div>
              <Link
                to="/find-parking"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Open map
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-2 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-3"
        >
          <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,26,0.94),rgba(12,19,32,0.9))] p-5 text-white sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                {description}
              </p>
            </div>

            {panel === "signup" ? (
              <div className="mb-6 grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
                <Link
                  to="/auth/login"
                  className="rounded-full px-4 py-2 text-center text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  Login
                </Link>
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_10px_30px_-15px_rgba(249,115,22,0.8)]">
                  Create account
                </div>
              </div>
            ) : panel === "signin" ? (
              <div className="mb-6 grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_10px_30px_-15px_rgba(249,115,22,0.8)]">
                  Login
                </div>
                <Link
                  to="/auth/signup"
                  className="rounded-full px-4 py-2 text-center text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  Create account
                </Link>
              </div>
            ) : null}

            {children}

            {footer ? <div className="mt-8 border-t border-white/10 pt-5">{footer}</div> : null}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
