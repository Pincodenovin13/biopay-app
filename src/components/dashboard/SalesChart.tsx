import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Calendar } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';

interface DataPoint {
  day: string;
  amount: number; // in thousands of Tomans
  orders: number;
}

// 30-day realistic sample data
const SALES_DATA: DataPoint[] = [
  { day: '۱ مهر', amount: 850, orders: 3 },
  { day: '۴ مهر', amount: 1200, orders: 4 },
  { day: '۷ مهر', amount: 950, orders: 3 },
  { day: '۱۰ مهر', amount: 1800, orders: 6 },
  { day: '۱۳ مهر', amount: 1400, orders: 5 },
  { day: '۱۶ مهر', amount: 2400, orders: 8 },
  { day: '۱۹ مهر', amount: 2100, orders: 7 },
  { day: '۲۲ مهر', amount: 3100, orders: 11 },
  { day: '۲۵ مهر', amount: 2800, orders: 9 },
  { day: '۲۸ مهر', amount: 3900, orders: 14 },
  { day: '۱ آبان', amount: 4850, orders: 16 },
];

export function SalesChart() {
  const { t } = useI18n();
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const maxAmount = Math.max(...SALES_DATA.map((d) => d.amount));
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Calculate coordinates
  const points = SALES_DATA.map((d, index) => {
    const x = paddingX + (index / (SALES_DATA.length - 1)) * (svgWidth - 2 * paddingX);
    const y = svgHeight - paddingY - (d.amount / maxAmount) * (svgHeight - 2 * paddingY);
    return { x, y, data: d };
  });

  // Generate SVG path command with smooth bezier curves
  const linePath = points.reduce((acc, curr, index, arr) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[index - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  // Generate closed area path for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <Card className="p-6 text-start space-y-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('dashboard.salesChartTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            روند تجمیعی سفارش‌های موفق ثبت‌شده از طریق لینک بیو
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/60">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+۲۸.۴٪ رشد ماهانه</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>۳۰ روز اخیر</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 select-none"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = svgHeight - paddingY - ratio * (svgHeight - 2 * paddingY);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#salesGradient)" />

          {/* Animated Line Stroke */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Interactive Data Dots */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-transform hover:scale-150"
                onMouseEnter={() => setHoveredPoint(pt.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 start-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono shadow-lg border border-slate-700 pointer-events-none flex items-center gap-3">
            <span>{hoveredPoint.day}</span>
            <span className="text-emerald-400 font-bold">
              {(hoveredPoint.amount * 1000).toLocaleString('fa-IR')} تومان
            </span>
            <span className="text-slate-400">({hoveredPoint.orders} سفارش)</span>
          </div>
        )}
      </div>

      {/* Date Axis Labels */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-6">
        <span>۱ مهر</span>
        <span>۱۰ مهر</span>
        <span>۲۰ مهر</span>
        <span>۱ آبان (امروز)</span>
      </div>
    </Card>
  );
}
