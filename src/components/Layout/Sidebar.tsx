import React, { useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "../../utils/menuItems";
import { ChevronDown, Zap } from "lucide-react";

interface UserData {
  nombre_completo: string;
  nombre_perfil: string;
  slug_perfil: string;
}

interface AuthData {
  usuario: UserData;
}

export const Sidebar = ({ collapsed, onToggle, currentPage }) => {
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]));
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpanded = (itemid: string) => {
    const newExpanded = new Set(expandedItems);

    if (newExpanded.has(itemid)) {
      newExpanded.delete(itemid);
    } else {
      newExpanded.add(itemid);
    }

    setExpandedItems(newExpanded);
  };

  const authData = useMemo(() => {
    try {
      const auth = localStorage.getItem("auth");
      return auth ? (JSON.parse(auth) as AuthData) : null;
    } catch (e) {
      console.error("Failed to parse auth data from localStorage", e);
      return null;
    }
  }, []);

  const userProfile = authData?.usuario;

  // Filtrar el menú de acuerdo al perfil del usuario
  const filteredMenuItems = useMemo(() => {
    if (!userProfile) {
      return [];
    }

    const { slug_perfil } = userProfile;

    switch (slug_perfil) {
      case "colaborador":
        return MENU_ITEMS.filter((item) => item.id === "descanso-medico");
      case "especialista":
        return MENU_ITEMS.filter(
          (item) =>
            item.id === "colaborador" ||
            item.id === "empresa" ||
            item.id === "descanso-medico" ||
            item.id === "canje" ||
            item.id === "reembolso" ||
            item.id === "cobro" ||
            item.id === "usuario" ||
            item.id === "mantenimiento"
        );
      case "administrador":
        return MENU_ITEMS;
      default:
        return [];
    }
  }, [userProfile]);

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 ease-in-out bg-slate-900 backdrop-blur-xl border-r border-slate-700 flex flex-col relative z-10`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>

          {/* Conditional Rendering */}
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Nexus
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation I will display Dynamic Menus */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const isItemActive =
            item.path && location.pathname.startsWith(item.path);

          return (
            <div key={item.id}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5`} />
                    {!collapsed && (
                      <span className="font-medium ml-2">{item.label}</span>
                    )}
                  </div>
                </NavLink>
              ) : (
                <button
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                    isItemActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5`} />
                    {!collapsed && (
                      <span className="font-medium ml-2">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.has(item.id) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              )}

              {/* Submenu */}
              {!collapsed && item.submenu && expandedItems.has(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <NavLink
                      key={subitem.id}
                      to={subitem.path}
                      className={({ isActive }) =>
                        `w-full block text-left p-2 text-sm rounded-lg transition-all ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`
                      }
                    >
                      {subitem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile */}
      {!collapsed && (
        <div className="p-4 border-l border-slate-200/50 dark: dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src=""
              alt="user"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {userProfile.nombre_completo || "Usuario"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {userProfile.nombre_perfil || "Perfil"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
