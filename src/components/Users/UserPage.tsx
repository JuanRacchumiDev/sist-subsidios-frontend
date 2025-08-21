import { Route, Routes } from "react-router-dom";

export const UserPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        Users
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Manage your users, roles, and permissions here.
      </p>

      <Routes>
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/roles" element={<RolesPermissions />} />
        <Route path="/activity" element={<UserActivity />} />
      </Routes>
    </div>
  );
};

// Create a component for the All Users submenu
export const AllUsers = () => {
  return (
    <div className="mt-6 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        All Users
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        This page lists all registered users.
      </p>
    </div>
  );
};

// Create a component for the Roles & Permissions submenu
export const RolesPermissions = () => {
  return (
    <div className="mt-6 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Roles & Permissions
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        This page is for managing user roles.
      </p>
    </div>
  );
};

// Create a component for the User Activity submenu
export const UserActivity = () => {
  return (
    <div className="mt-6 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        User Activity
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        This page shows the activity log for users.
      </p>
    </div>
  );
};
