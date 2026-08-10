import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  User,
  KeyRound,
  LogOut,
  Bell,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useToast } from "../../context/ToastContext";
import { logoutAuth } from "../../services/authService";
import { getAuthData } from "../../utils/authMemo";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const userProfile = useMemo(() => getAuthData()?.usuario, []);

  const handleLogout = async () => {
    if (userProfile?.id_usuario) {
      try {
        const response = await logoutAuth(userProfile.id_usuario);
        const { result, message } = response;
        const classResult = result ? "success" : "error";

        showToast(classResult, message || "Sesión cerrada correctamente");
        if (result) {
          navigate("/");
        }
      } catch (error) {
        showToast(
          "error",
          "Error al conectar con el servidor para cerrar sesión",
        );
      }
    } else {
      showToast("error", "Error al cerrar sesión de usuario");
    }
  };

  // Helper para obtener las iniciales del nombre
  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 transition-all">
      <div className="flex h-full items-center justify-between">
        {/* Lado Izquierdo: Botón Toggle + Título Secciones */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            onClick={onToggleSidebar}
            title="Alternar menú lateral"
            aria-label="Alternar menú lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb o Titular Breve Institucional */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">DMS</span>
            <span>/</span>
            <span className="text-slate-500 font-medium">
              Gestión de Subsidios
            </span>
          </div>
        </div>

        {/* Lado Derecho: Notificaciones y Menú de Usuario */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón de Notificaciones / Alertas del Sistema */}
          <button
            type="button"
            className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notificaciones y alertas"
            onClick={() =>
              showToast(
                "warning",
                "No tiene alertas o notificaciones pendientes.",
              )
            }
          >
            <Bell className="w-5 h-5" />
            {/* Indicador o badge de notificación pendiente */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1" aria-hidden="true" />

          {/* Dropdown de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none"
              >
                {/* Avatar con Iniciales */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-800 to-indigo-900 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {getUserInitials(userProfile?.nombre_completo)}
                </div>

                {/* Nombre y Rol */}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight max-w-[150px]">
                    {userProfile?.nombre_completo || "Usuario"}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider leading-tight">
                    {userProfile?.nombre_perfil || "Perfil"}
                  </span>
                </div>

                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-60 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5 text-slate-700 z-50"
              align="end"
            >
              <DropdownMenuLabel className="px-2 py-2">
                <p className="text-xs font-bold text-slate-900">
                  {userProfile?.nombre_completo || "Usuario"}
                </p>
                <p className="text-[11px] text-slate-500 font-normal">
                  {userProfile?.email_personal || "usuario@dms.gob.pe"}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-slate-100 my-1" />

              {/* Opción 1: Ver Perfil */}
              <DropdownMenuItem
                asChild
                className="rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:bg-slate-100"
              >
                <Link to="/profile" className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>Mi Perfil</span>
                </Link>
              </DropdownMenuItem>

              {/* Opción 2: Cambiar Contraseña (Sugerida para seguridad) */}
              <DropdownMenuItem
                asChild
                className="rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:bg-slate-100"
              >
                <Link
                  to="/cambiar-password"
                  className="flex items-center gap-2.5"
                >
                  <KeyRound className="h-4 w-4 text-slate-500" />
                  <span>Cambiar Contraseña</span>
                </Link>
              </DropdownMenuItem>

              {/* Opción 3: Estado de Seguridad / Permisos */}
              <DropdownMenuItem
                onClick={() =>
                  showToast(
                    "warning",
                    "Su cuenta cuenta con autenticación segura activa.",
                  )
                }
                className="rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:bg-slate-100"
              >
                <div className="flex items-center gap-2.5 w-full">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Seguridad de Cuenta</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-100 my-1" />

              {/* Opción 4: Cerrar Sesión */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors focus:bg-rose-50"
              >
                <div className="flex items-center gap-2.5 w-full">
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Cerrar Sesión</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
