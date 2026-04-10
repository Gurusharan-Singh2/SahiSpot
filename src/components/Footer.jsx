import { motion } from "framer-motion";
import { ArrowRight, Facebook, Instagram, Linkedin, MapPin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Find Parking", to: "/find-parking" },
    { label: "Manage Parking", to: "/manage-parking" },
    { label: "Owner Panel", to: "/owner" },
  ],
  Company: [
    { label: "About Us", to: "/about-us" },
    { label: "Contact Us", to: "/contact-us" },
    { label: "Login", to: "/auth/login" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050a14] pb-8 pt-12 sm:pt-16">
      <div className="mx-auto max-w-[90rem] px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.7),rgba(5,10,20,0.85))] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
                Parking made calmer
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                A more welcoming interface for drivers and a more credible product for owners.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                SahiSpot now feels more like a service people can trust, with stronger guidance,
                clearer choices, and a cleaner product story.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-medium text-slate-300">Get launch updates and product news</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 font-medium text-white sm:w-auto"
                >
                  Join
                  <ArrowRight size={16} />
                </motion.button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-orange-300" />
                Built for growing city parking networks
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h2 className="mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
              Sahi Spot
            </h2>
            <p className="mb-6 leading-relaxed text-slate-400">
              Smart parking discovery, cleaner booking flows, and stronger operations in one modern product.
            </p>
            <div className="flex flex-wrap gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3, color: "#fb923c" }}
                  className="text-slate-500 transition-colors hover:text-orange-400"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 font-bold text-white">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-slate-400 transition-colors hover:text-orange-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 font-bold text-white">Why people stay</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Simple booking flow for everyday drivers</li>
              <li>Cleaner admin and owner experience</li>
              <li>Modern brand feel instead of a student project look</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-slate-500 md:flex-row md:text-left">
          <p>© 2026 Sahi Spot. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:justify-end md:gap-6">
            <Link to="/about-us" className="hover:text-slate-300">About</Link>
            <Link to="/contact-us" className="hover:text-slate-300">Contact</Link>
            <Link to="/find-parking" className="hover:text-slate-300">Explore</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
