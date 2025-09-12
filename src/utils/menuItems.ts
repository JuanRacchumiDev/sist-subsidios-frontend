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

export const MENU_ITEMS = [
    {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        active: true,
        badge: "New",
        path: "/dashboard",
    },
    {
        id: "empresa",
        icon: Users,
        label: "Empresas",
        active: false,
        path: "/empresa",
    },
    {
        id: "colaborador",
        icon: Users,
        label: "Colaboradores",
        active: false,
        badge: "New",
        path: "/colaborador",
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
            { id: "documento-tipo-contingencia", label: "Documentos Tipo Contingencia", path: "/mantenimiento/documento-tipo-contingencia" }
        ],
    },
];