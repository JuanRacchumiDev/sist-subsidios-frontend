import {
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    badge: "New",
    path: "/dashboard",
  },
  {
    id: "colaborador",
    icon: Users,
    label: "Colaboradores",
    active: false,
    badge: "New",
    path: "/colaborador",
    // submenu: [
    //   { id: "listColaborador", label: "Listado", path: "/colaborador/listado" },
    //   { id: "nuevoColaborador", label: "Nuevo", path: "/colaborador/nuevo" },
    // ],
  },
  {
    id: "empresa",
    icon: Users,
    label: "Empresas",
    active: false,
    path: "/empresa",
  },
  {
    id: "descanso-medico",
    icon: Users,
    label: "Descansos médicos",
    active: false,
    path: "/descanso-medico",
  },
  {
    id: "canje",
    icon: Users,
    label: "Canjes",
    active: false,
    path: "/canje",
  },
  {
    id: "reembolso",
    icon: Users,
    label: "Reembolsos",
    active: false,
    path: "/reembolso",
  },
  {
    id: "cobro",
    icon: Users,
    label: "Cobros",
    active: false,
    path: "/cobro",
  },
  {
    id: "usuario",
    icon: Users,
    label: "Usuarios",
    active: false,
    path: "/usuario",
  },
  {
    id: "mantenimiento",
    icon: Users,
    label: "Mantenimiento",
    submenu: [
      { id: "cargo", label: "Cargo", path: "/mantenimiento/cargo" },
      // { id: "nuevoCargo", label: "Nuevo", path: "/cargo/nuevo" },
    ],
  },
  // {
  //   id: "analytics",
  //   icon: BarChart3,
  //   label: "Analytics",
  //   submenu: [
  //     { id: "overview", label: "Overview", path: "/analytics/overview" },
  //     { id: "reports", label: "Reports", path: "/analytics/reports" },
  //     { id: "insights", label: "Insights", path: "/analytics/insights" },
  //   ],
  // },
  // {
  //   id: "users",
  //   icon: Users,
  //   label: "Users",
  //   count: "2.4k",
  //   submenu: [
  //     { id: "all-users", label: "All Users", path: "/users/all-users" },
  //     { id: "roles", label: "Roles & Permissions", path: "/users/roles" },
  //     { id: "activity", label: "User Activity", path: "/rules/activity" },
  //   ],
  // },
  // {
  //   id: "ecommerce",
  //   icon: ShoppingBag,
  //   label: "E-commerce",
  //   submenu: [
  //     { id: "products", label: "Products", path: "/ecommerce/products" },
  //     { id: "orders", label: "Orders", path: "/ecommerce/orders" },
  //     { id: "customers", label: "Customers", path: "/ecommerce/customers" },
  //   ],
  // },
  // {
  //   id: "inventory",
  //   icon: Package,
  //   label: "Inventory",
  //   count: "847",
  //   path: "/inventory",
  // },
  // {
  //   id: "transactions",
  //   icon: CreditCard,
  //   label: "Transactions",
  //   path: "/transactions",
  // },
  // {
  //   id: "messages",
  //   icon: MessagesSquare,
  //   label: "Messages",
  //   badge: "12",
  //   path: "/messages",
  // },
  // {
  //   id: "calendar",
  //   icon: Calendar,
  //   label: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   id: "reports",
  //   icon: FileText,
  //   label: "Reports",
  //   path: "/reports",
  // },
  // {
  //   id: "settings",
  //   icon: Settings,
  //   label: "Settings",
  //   path: "/settings",
  // },
];

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

  return (
    // <div
    //   className={`${
    //     collapsed ? "w-20" : "w-72"
    //   } transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}
    // >
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
        {menuItems.map((item) => {
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
              {/* <button
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  currentPage === item.id || item.active
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => {
                  if (item.submenu) {
                    toggleExpanded(item.id);
                  } else {
                    onPageChange(item.id);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5`} />

                  {!collapsed && (
                    <>
                      <span className="font-medium ml-2">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {!collapsed && item.submenu && (
                  <ChevronDown className={`w-4 h-4 transition-transform`} />
                )}
              </button> */}

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

              {/* {!collapsed && item.submenu && expandedItems.has(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu?.map((subitem) => {
                    return (
                      <button className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all">
                        {subitem.label}
                      </button>
                    );
                  })}
                </div>
              )} */}
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
                  Alex Johson
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
