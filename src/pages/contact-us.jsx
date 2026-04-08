import { motion } from "framer-motion";
import { Mail, MapPinned, Phone, Send, ShieldCheck } from "lucide-react";

const contactCards = [
  {
    icon: Mail,
    title: "Email us",
    value: "hello@sahispot.com",
    note: "Best for partnerships, support, and product questions.",
  },
  {
    icon: Phone,
    title: "Call support",
    value: "+91 98765 43210",
    note: "Available on business days for onboarding and urgent help.",
  },
  {
    icon: MapPinned,
    title: "Visit HQ",
    value: "Connaught Place, New Delhi",
    note: "Our product and operations teams are based here.",
  },
];

export default function ContactUsPage() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.14),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_22%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-20 h-44 w-44 rounded-full bg-orange-500/14 blur-3xl" />
        <div className="absolute right-[10%] bottom-20 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Contact us
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let’s make parking feel more intelligent, more premium, and less frustrating.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Reach out for support, demos, parking owner onboarding, or product collaboration. We’ll
            help you find the right next step.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            {contactCards.map(({ icon: Icon, title, value, note }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <Icon className="h-5 w-5 text-orange-300" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-base font-medium text-slate-200">{value}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">{note}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.78))] p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                <Send className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Send a message</h2>
                <p className="text-sm text-slate-400">We usually reply within one business day.</p>
              </div>
            </div>

            <form className="mt-6 grid gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
              />
              <input
                type="email"
                placeholder="Email address"
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
              />
              <textarea
                rows="6"
                placeholder="Tell us what you need help with..."
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Send inquiry
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Your details stay private and are only used to respond to your request.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
