import {
    BarChart3,
    Briefcase,
    Building,
    Calendar,
    ChevronDown,
    CreditCard,
    DollarSign,
    FileText,
    HeartPulse,
    LayoutDashboard,
    MessagesSquare,
    Package,
    RefreshCw,
    Settings,
    ShoppingBag,
    User2Icon,
    UserCheck,
    Users,
    Wallet,
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
        icon: Building,
        label: "Empresas",
        active: false,
        path: "/empresa",
    },
    {
        id: "trabajador-social",
        icon: User2Icon,
        label: "Trabajadores sociales",
        active: false,
        path: "/trabajador-social"
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
        id: "especialista-cliente",
        icon: Users,
        label: "Especialistas Cliente",
        active: false,
        badge: "New",
        path: "/especialista-cliente",
    },
    {
        id: "especialista-sh",
        icon: Users,
        label: "Especialistas SH",
        active: false,
        badge: "New",
        path: "/especialista-sh",
    },
    {
        id: "descanso-medico",
        icon: HeartPulse,
        label: "Descansos médicos",
        active: false,
        path: "/descanso-medico",
    },
    {
        id: "canje",
        icon: RefreshCw,
        label: "Canjes",
        active: false,
        path: "/canje",
    },
    {
        id: "reembolso",
        icon: Wallet,
        label: "Reembolsos",
        active: false,
        path: "/reembolso",
    },
    {
        id: "cobro",
        icon: DollarSign,
        label: "Cobros",
        active: false,
        path: "/cobro",
    },
    {
        id: "usuario",
        icon: UserCheck,
        label: "Usuarios",
        active: false,
        path: "/usuario",
    },
    {
        id: "mantenimiento",
        icon: Settings,
        label: "Mantenimiento",
        submenu: [
            {
                id: "cargo",
                label: "Cargo",
                icon: Briefcase,
                path: "/mantenimiento/cargo"
            },
            {
                id: "documento-tipo-contingencia",
                label: "Documentos Tipo Contingencia",
                icon: FileText,
                path: "/mantenimiento/documento-tipo-contingencia"
            },
            {
                id: "diagnostico",
                label: "Diagnóstico",
                icon: Briefcase,
                path: "/mantenimiento/diagnostico"
            }
        ],
    },
];