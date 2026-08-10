import {
  ShieldCheck,
  HeartPulse,
  FileText,
  Lock,
  Building2,
} from "lucide-react";
import { LoginForm } from "../LoginForm";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  return (
    <div
      className="h-screen w-screen m-0 p-0 overflow-hidden flex bg-slate-50 font-sans antialiased selection:bg-teal-500 selection:text-white"
      style={{ padding: "0px", margin: "0px" }}
    >
      {/* 1. Panel Izquierdo: Identidad Institucional (Solo visible en pantallas LG) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-8 xl:p-10 text-white shrink-0 h-full">
        {/* Capa de degradado dinámico */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-950 opacity-90" />
        <div
          className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10"
          aria-hidden="true"
        />

        {/* Branding Superior */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white leading-none">
              DMS
            </h2>
            <p className="text-[10px] text-teal-300 font-bold tracking-wider uppercase mt-0.5">
              Gestión de Subsidios de Salud
            </p>
          </div>
        </div>

        {/* Contenido Central */}
        <div className="relative z-10 max-w-lg my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Sistema Institucional DMS</span>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Control integral de descansos médicos y canjes de subsidios.
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Plataforma centralizada para la validación, seguimiento acumulativo
            y auditoría de incapacidades temporales e incapacidades laborales.
          </p>

          {/* Tarjetas Informativas Integradas */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div className="flex gap-2.5 items-start">
              <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-teal-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">
                  Límites y Reglas
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Alertas automatizadas para 90, 150 y 340 días.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-indigo-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">
                  Garantía Normativa
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Validación alineada a la entidad prestadora.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Informativo */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encriptación de 256 bits</span>
          </div>
          <span>&copy; {new Date().getFullYear()} DMS System</span>
        </div>
      </div>

      {/* 2. Panel Derecho: Formulario Ampliado (Sin Scroll) */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-between h-full max-w-full overflow-hidden p-6 sm:p-8"
        style={{ padding: "24px !important" }}
      >
        {/* Encabezado Responsive */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base leading-none">
                DMS
              </span>
              <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider lg:hidden mt-0.5">
                Subsidios de Salud
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md">
            v2.4.0 • Producción
          </span>
        </div>

        {/* Contenedor del Formulario Centrado y Ampliado */}
        <div className="my-auto w-full max-w-md mx-auto space-y-4 py-2">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Ingrese sus credenciales institucionales para acceder al sistema{" "}
              <strong className="text-slate-700">DMS</strong>.
            </p>
          </div>

          <LoginForm onLoginSuccess={onLoginSuccess} />

          {/* Advertencia Institucional */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 leading-snug">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="break-words">
              Acceso exclusivo para personal autorizado. Todas las consultas son
              monitoreadas y auditadas conforme a ley.
            </p>
          </div>
        </div>

        {/* Footer Derecho */}
        <div className="text-center lg:text-left text-xs text-slate-400 w-full pt-2">
          ¿Problemas con su acceso? Contacte a{" "}
          <a
            href="mailto:soporte@dms.gob.pe"
            className="text-indigo-600 font-semibold hover:underline inline-block break-all"
          >
            Soporte Técnico DMS
          </a>
        </div>
      </div>
    </div>
  );
};
