import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function StatCard({ title, value, icon: Icon, trend, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-xl bg-gradient-to-br ${color} p-3`}>
            <Icon size={20} className="text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp size={14} />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-sm text-white/60 mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
export default StatCard;