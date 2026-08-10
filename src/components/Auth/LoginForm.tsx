import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { loginAuth } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { TAuthResponse } from "../../types/TAuthResponse";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      showToast("error", "Email y contraseña son requeridos");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("error", "Por favor ingrese un correo institucional válido");
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await loginAuth(email, password);
      const { result, status, message, error } = response as TAuthResponse;

      if (result && status === 200) {
        showToast("success", message || "Acceso concedido exitosamente");
        onLoginSuccess();
        navigate("/dashboard");
        return;
      }
      showToast("error", message || error || "Credenciales incorrectas");
    } catch (error) {
      console.error("Login error:", error);
      showToast("error", "Error de conexión con el servidor de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3 w-full max-w-full">
      {/* Campo Email */}
      <div className="space-y-1 w-full">
        <label
          htmlFor="email"
          className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
        >
          Correo Institucional
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="h-3.5 w-3.5 shrink-0" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
            placeholder="usuario@institucion.gob.pe"
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* Campo Contraseña */}
      <div className="space-y-1 w-full">
        <div className="flex items-center justify-between gap-1">
          <label
            htmlFor="password"
            className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
          >
            Contraseña
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showToast(
                "warning",
                "Contacte al administrador del sistema DMS para solicitar restablecimiento.",
              );
            }}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ¿Olvidó su contraseña?
          </a>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="h-3.5 w-3.5 shrink-0" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
            placeholder="••••••••••••"
            autoComplete="current-password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Eye className="w-3.5 h-3.5 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Botón de Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full !mt-3 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-600/20 hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 text-white shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Autenticando...</span>
          </>
        ) : (
          <>
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span>Ingresar al Sistema</span>
          </>
        )}
      </button>
    </form>
  );
};
