import {
    ArrowLeftRight,
    Briefcase,
    Building2,
    CircleDollarSign,
    FileText,
    HandCoins,
    HeartHandshake,
    HeartPulse,
    LayoutDashboard,
    Settings,
    Stethoscope,
    UserCheck,
    UserCog,
    Users,
    UserSquare2
} from "lucide-react";

export const ADMIN_MENU_ITEMS = [
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
        icon: Building2,
        label: "Empresas",
        active: false,
        path: "/empresa",
    },
    {
        id: "trabajador-social",
        icon: HeartHandshake,
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
        icon: UserCheck,
        label: "Especialistas Cliente",
        active: false,
        badge: "New",
        path: "/especialista-cliente",
    },
    {
        id: "especialista-sh",
        icon: UserCog,
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
        icon: ArrowLeftRight,
        label: "Canjes",
        active: false,
        path: "/canje",
    },
    {
        id: "reembolso",
        icon: HandCoins,
        label: "Reembolsos",
        active: false,
        path: "/reembolso",
    },
    {
        id: "cobro",
        icon: CircleDollarSign,
        label: "Cobros",
        active: false,
        path: "/cobro",
    },
    {
        id: "usuario",
        icon: UserSquare2,
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
                icon: Stethoscope,
                path: "/mantenimiento/diagnostico"
            }
        ],
    },
];

export const ESP_EMPRESA_MENU_ITEMS = [
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
        icon: HeartPulse,
        label: "Descansos médicos",
        active: false,
        path: "/descanso-medico",
    },
    {
        id: "canje",
        icon: ArrowLeftRight,
        label: "Canjes",
        active: false,
        path: "/canje",
    },
    {
        id: "reembolso",
        icon: HandCoins,
        label: "Reembolsos",
        active: false,
        path: "/reembolso",
    },
    {
        id: "cobro",
        icon: CircleDollarSign,
        label: "Cobros",
        active: false,
        path: "/cobro",
    }
];

export const ESP_SH_MENU_ITEMS = [
    {
        id: "colaborador",
        icon: Users,
        label: "Colaboradores",
        active: false,
        badge: "New",
        path: "/colaborador",
    },
    {
        id: "trabajador-social",
        icon: HeartHandshake,
        label: "Trabajadores sociales",
        active: false,
        path: "/trabajador-social"
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
        icon: ArrowLeftRight,
        label: "Canjes",
        active: false,
        path: "/canje",
    },
    {
        id: "reembolso",
        icon: HandCoins,
        label: "Reembolsos",
        active: false,
        path: "/reembolso",
    },
    {
        id: "cobro",
        icon: CircleDollarSign,
        label: "Cobros",
        active: false,
        path: "/cobro",
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
                icon: Stethoscope,
                path: "/mantenimiento/diagnostico"
            }
        ],
    },
];

export const COLABORADOR_MENU_ITEMS = [
    {
        id: "descanso-medico",
        icon: HeartPulse,
        label: "Descansos médicos",
        active: false,
        path: "/descanso-medico",
    },
];