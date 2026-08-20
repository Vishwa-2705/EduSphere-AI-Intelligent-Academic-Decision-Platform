import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  variant?: 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';
}

const variantStyles = {
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-600',
    border: 'hover:border-indigo-300',
  },
  purple: {
    iconBg: 'bg-purple-50 text-purple-600',
    border: 'hover:border-purple-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600',
    border: 'hover:border-emerald-300',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600',
    border: 'hover:border-amber-300',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-600',
    border: 'hover:border-rose-300',
  },
  slate: {
    iconBg: 'bg-slate-100 text-slate-700',
    border: 'hover:border-slate-300',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  variant = 'indigo',
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={clsx(
        'relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md font-serif',
        styles.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-serif">
            {title}
          </p>
          <h3 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            {value}
          </h3>
        </div>

        <div className={clsx('h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm', styles.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-serif">
          {subtext && <span className="text-slate-500 truncate">{subtext}</span>}
          {trend && (
            <span
              className={clsx(
                'px-2.5 py-0.5 rounded-full font-bold text-[11px] whitespace-nowrap',
                trend.isNeutral
                  ? 'bg-slate-100 text-slate-600'
                  : trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
