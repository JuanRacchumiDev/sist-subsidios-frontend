import React from "react";

import { BarChart, BarChart2 } from "lucide-react";

export const RevnueChart = () => {
  const data = [
    { month: "Jan", revenue: 45000, expenses: 32000 },
    { month: "Feb", revenue: 52000, expenses: 38000 },
    { month: "Mar", revenue: 45000, expenses: 32000 },
    { month: "Apr", revenue: 52000, expenses: 38000 },
    { month: "May", revenue: 45000, expenses: 32000 },
    { month: "Jun", revenue: 52000, expenses: 38000 },
    { month: "Jul", revenue: 45000, expenses: 32000 },
    { month: "Aug", revenue: 52000, expenses: 38000 },
    { month: "Sep", revenue: 45000, expenses: 32000 },
    { month: "Oct", revenue: 52000, expenses: 38000 },
    { month: "Nov", revenue: 45000, expenses: 32000 },
    { month: "Dec", revenue: 52000, expenses: 38000 },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Revenuve Chart
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly revneue and expenses
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full"></div>
            <div className="text-sm text-slate-600 dark:text-slate-600">
              <span>Revenue</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"></div>
            <div className="text-sm text-slate-600 dark:text-slate-600">
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-80"></div>
    </div>
  );
};
