import React from 'react';
import { motion } from 'motion/react';

export interface CircularProgressProps {
  percentage: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  color?: string; // CSS color or Tailwind class
  trackColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function CircularProgress({
  percentage,
  size = 110,
  strokeWidth = 9,
  color = '#10b981', // Emerald primary
  trackColor = '#e2e8f0',
  label,
  sublabel,
  className = '',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          className="dark:stroke-slate-800"
        />
        {/* Animated Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
        {label ? (
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums leading-none">
            {label}
          </span>
        ) : (
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums leading-none">
            {percentage}%
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
