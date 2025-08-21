import { Route, Routes } from "react-router-dom";

export const AnalyticsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        Analytics
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Manage your analytics and reports here.
      </p>

      <Routes>
        <Route path="/overview" element={<AnalyticsOverview />} />
        <Route path="/reports" element={<AnalyticsReports />} />
        <Route path="/insights" element={<AnalyticsInsights />} />
      </Routes>
    </div>
  );
};

// Create a component for the Overview submenu
export const AnalyticsOverview = () => {
  return (
    <div className="mt-6 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Overview
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        This is the analytics overview page.
      </p>
    </div>
  );
};

// Create a component for the Reports submenu
export const AnalyticsReports = () => {
  return (
    <div className="mt-6 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Reports
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        This is the analytics reports page.
      </p>
    </div>
  );
};

// Create a component for the Insights submenu
export const AnalyticsInsights = () => {
  return (
    <div className="mt-6 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Insights
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        This is the analytics insights page.
      </p>
    </div>
  );
};
