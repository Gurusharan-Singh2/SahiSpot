import { motion } from "framer-motion";
import { Building2, HeartHandshake, MapPinned, Radar, ShieldCheck, Users } from "lucide-react";

const values = [
  {
    icon: Radar,
    title: "Map-first clarity",
    description: "We reduce parking chaos with live spatial context, not guesswork.",
  },
  {
    icon: ShieldCheck,
    title: "Trust in every booking",
    description: "Drivers and owners should feel safe, informed, and in control.",
  },
  {
    icon: HeartHandshake,
    title: "Less friction, more flow",
    description: "Every step should remove stress instead of adding another form or dead end.",
  },
];

const metrics = [
  { label: "Drivers served", value: "90k+" },
  { label: "Parking partners", value: "1,200+" },
  { label: "Cities activated", value: "18" },
];

export default function AboutUsPage() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),transparent_25%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-24 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute right-[10%] top-32 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              About SahiSpot
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              We’re building parking software that feels more like product design than infrastructure.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              SahiSpot started with one simple frustration: drivers waste too much time before the
              trip even begins. We’re building a calmer, map-first layer for urban parking, where
              users discover better spots faster and owners manage inventory with more confidence.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.86),rgba(2,6,23,0.75))] p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06]">
              <Building2 className="h-7 w-7 text-orange-300" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">What we believe</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Parking should not feel like a low-quality afterthought. It deserves the same care we
              expect from booking flights, ordering rides, or managing hospitality spaces.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              That means better maps, cleaner workflows, owner-grade tooling, and design that lowers
              stress instead of amplifying it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
              Who we design for
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Two sides of parking, one experience layer.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5">
              <Users className="h-6 w-6 text-orange-300" />
              <h3 className="mt-4 text-lg font-semibold text-white">Drivers</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Better discovery, clearer pricing, cleaner booking decisions, and more confidence on arrival.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5">
              <MapPinned className="h-6 w-6 text-emerald-300" />
              <h3 className="mt-4 text-lg font-semibold text-white">Owners</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                More control over visibility, occupancy, slot inventory, and premium customer perception.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
