"use client";

import { motion } from 'motion/react';
import { Activity, TrendingUp, Zap } from 'lucide-react';

export function StatsCard({ title, value, icon: Icon, trend, color = "green" }) {
  const colorClasses = {
    green: "from-[#306754] to-[#254f42] shadow-[#306754]/20",
    blue: "from-blue-600 to-blue-700 shadow-blue-600/20",
    orange: "from-orange-600 to-orange-700 shadow-orange-600/20"
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative"
    >
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
        {/* Icon Badge */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">{trend}</span>
              <span className="text-gray-500">vs dernier mois</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
