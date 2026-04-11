import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Zap, HandHeart } from 'lucide-react';

const messages = [
  { icon: ShieldCheck, text: "100% Secure & Verified Parking Slots" },
  { icon: Zap, text: "Instant Booking & Confirmation" },
  { icon: Star, text: "4.8/5 Average Driver Satisfaction" },
  { icon: HandHeart, text: "Transparent Pricing, No Hidden Fees" },
];

const InfiniteMarquee = () => {
  // We duplicate the array to create a seamless loop
  const items = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="relative flex w-full overflow-hidden bg-white/[0.02] border-y border-white/5 py-4 my-8">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#0d1522] to-transparent" />
      
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex shrink-0 items-center gap-12 px-6"
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <Icon size={18} className="text-orange-400" />
              <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">
                {item.text}
              </span>
              <span className="text-white/20 mx-6">•</span>
            </div>
          );
        })}
      </motion.div>

      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#0d1522] to-transparent" />
    </div>
  );
};

export default InfiniteMarquee;
