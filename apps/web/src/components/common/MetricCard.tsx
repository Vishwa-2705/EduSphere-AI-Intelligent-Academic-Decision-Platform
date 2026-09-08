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
  variant?: 'lavender' | 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';
}

const variantStyles = {
  lavender: {
    iconBg: 'bg-lavender-100 text-lavender-800 border border-lavender-200',
    border: 'hover:border-lavender-300',
  },
  indigo: {
    iconBg: 'bg-lavender-100 text-lavender-800 border border-lavender-200',
    border: 'hover:border-lavender-300',
  },
  purple: {
    iconBg: 'bg-lavender-100 text-lavender-800 border border-lavender-200',
    border: 'hover:border-lavender-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    border: 'hover:border-emerald-300',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-800 border border-amber-200',
    border: 'hover:border-amber-300',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-800 border border-rose-200',
    border: 'hover:border-rose-300',
  },
  slate: {
    iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
    border: 'hover:border-slate-300',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  variant = 'lavender',
}) => {
  const styles = variantStyles[variant] || variantStyles.lavender;

  return (
    <div
      className={clsx(
        'relative bg-white border border-lavender-200/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-200 hover:shadow-card font-serif',
        styles.border
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 font-serif">
            {title}
          </p>
          <h3 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {value}
          </h3>
        </div>

        <div className={clsx('h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm', styles.iconBg)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-5 pt-3.5 border-t border-lavender-100 flex items-center justify-between gap-2 text-xs sm:text-sm font-serif">
          {subtext && <span className="text-slate-500 truncate">{subtext}</span>}
          {trend && (
            <span
              className={clsx(
                'px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap',
                trend.isNeutral
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : trend.isPositive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
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
