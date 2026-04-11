import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-6 hover:bg-white/[0.04] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-xl bg-gradient-to-r ${color} p-3`}>
            <Icon size={20} className="text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/50 mt-1">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
