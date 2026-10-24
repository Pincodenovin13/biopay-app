'use client';

import React from 'react';
import { SalesChart } from '../../../components/dashboard/SalesChart';
import { RecentOrdersTable } from '../../../components/dashboard/RecentOrdersTable';
import { Card } from '../../../components/ui/Card';
import { CircularProgress } from '../../../components/ui/CircularProgress';
import { useI18n } from '../../../lib/i18n';

export default function DashboardPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* 4 Circular Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center justify-between text-start">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {t('dashboard.totalRevenue')}
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              ۲۸,۴۵۰,۰۰۰
            </div>
            <div className="text-[11px] text-slate-500">{t('common.currencyToman')}</div>
          </div>
          <CircularProgress
            percentage={78}
            size={64}
            strokeWidth={6}
            color="#10b981"
            label="۷۸٪"
          />
        </Card>

        <Card className="p-5 flex items-center justify-between text-start">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {t('dashboard.totalOrders')}
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              ۱۲۴
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">+۱۴ این هفته</div>
          </div>
          <CircularProgress
            percentage={85}
            size={64}
            strokeWidth={6}
            color="#059669"
            label="۸۵٪"
          />
        </Card>

        <Card className="p-5 flex items-center justify-between text-start">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {t('dashboard.activeProducts')}
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              ۱۸
            </div>
            <div className="text-[11px] text-slate-500">از سقف نامحدود</div>
          </div>
          <CircularProgress
            percentage={40}
            size={64}
            strokeWidth={6}
            color="#f59e0b"
            label="۴۰٪"
          />
        </Card>

        <Card className="p-5 flex items-center justify-between text-start">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {t('dashboard.planDaysLeft')}
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              ۲۴ روز
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">اشتراک حرفه‌ای فعال</div>
          </div>
          <CircularProgress
            percentage={80}
            size={64}
            strokeWidth={6}
            color="#3b82f6"
            label="۸۰٪"
          />
        </Card>
      </div>

      {/* 30-Day Sales Chart */}
      <SalesChart />

      {/* Recent Orders Table */}
      <RecentOrdersTable />
    </div>
  );
}
