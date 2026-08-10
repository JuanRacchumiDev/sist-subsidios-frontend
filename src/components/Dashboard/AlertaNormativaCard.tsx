import React from "react";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AlertaNormativaProps {
  daysLimit: number;
  title: string;
  count: number;
  description: string;
  type: "no_consecutivos" | "consecutivos" | "global";
  badgeColor: string;
  borderColor: string;
}

export const AlertaNormativaCard: React.FC<AlertaNormativaProps> = ({
  daysLimit,
  title,
  count,
  description,
  type,
  badgeColor,
  borderColor,
}) => {
  return (
    <div
      className={`bg-white border-l-4 ${borderColor} border-y border-r border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${badgeColor}`}
          >
            {daysLimit} Días
          </span>
          <span className="text-xs font-bold text-slate-700">{title}</span>
        </div>
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
      </div>

      <div className="my-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{count}</span>
          <span className="text-xs font-medium text-slate-500">
            colaboradores excedentarios
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          {description}
        </p>
      </div>

      <Link
        to={`/canje?type=${type}&limit=${daysLimit}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2 border-t border-slate-100 transition-colors"
      >
        <span>Ver reporte de canjes</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
