import React, { HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ children, className = '', hoverEffect = false, ...props }: CardProps) {
  const baseStyles = 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-card shadow-card transition-all duration-300';
  const hoverStyles = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700'
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 border-b border-slate-100 dark:border-slate-800/80 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 rounded-b-card ${className}`} {...props}>
      {children}
    </div>
  );
}
