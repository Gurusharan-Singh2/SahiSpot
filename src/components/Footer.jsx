import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050a14] pb-8 pt-12 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h2 className="mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
              Sahi Spot
            </h2>
            <p className="mb-6 leading-relaxed text-slate-400">
              Map-first parking discovery and premium owner operations in one darker, calmer product experience.
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

          <div>
            <h3 className="mb-4 font-bold text-white">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-slate-400 transition-colors hover:text-orange-300">About Us</Link></li>
              <li><Link to="/find-parking" className="text-slate-400 transition-colors hover:text-orange-300">Find Parking</Link></li>
              <li><Link to="/manage-parking" className="text-slate-400 transition-colors hover:text-orange-300">Manage Parking</Link></li>
              <li><Link to="/contact-us" className="text-slate-400 transition-colors hover:text-orange-300">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/auth/login" className="text-slate-400 transition-colors hover:text-orange-300">Login</Link></li>
              <li><Link to="/auth/signup" className="text-slate-400 transition-colors hover:text-orange-300">Create Account</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 transition-colors hover:text-orange-300">User Dashboard</Link></li>
              <li><Link to="/owner" className="text-slate-400 transition-colors hover:text-orange-300">Owner Panel</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Stay in touch</h3>
            <p className="mb-4 text-sm text-slate-400">Get product updates, launch notes, and parking growth ideas.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-medium text-white sm:w-auto"
              >
                Join
                <ArrowRight size={16} />
              </motion.button>
            </div>
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
