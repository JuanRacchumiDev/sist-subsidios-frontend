import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconBgColor = "bg-indigo-50",
  iconColor = "text-indigo-600",
  badge,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>
        <div className={cn("p-2.5 rounded-xl shrink-0", iconBgColor)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-400 font-medium">{subtitle}</span>
          )}
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
