import React from "react";
import { IToastProps } from "../../interfaces/IToastProps";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
  HiInformationCircle,
} from "react-icons/hi";

const colors: Record<IToastProps["type"], string> = {
  success:
    "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
  error:
    "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
  warning:
    "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
  info: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800",
};

const icons: Record<IToastProps["type"], React.ReactNode> = {
  success: (
    <HiCheckCircle className="w-5 h-5 mr-2 shrink-0 text-emerald-600 dark:text-emerald-400" />
  ),
  error: (
    <HiXCircle className="w-5 h-5 mr-2 shrink-0 text-rose-600 dark:text-rose-400" />
  ),
  warning: (
    <HiExclamationCircle className="w-5 h-5 mr-2 shrink-0 text-amber-600 dark:text-amber-400" />
  ),
  info: (
    <HiInformationCircle className="w-5 h-5 mr-2 shrink-0 text-sky-600 dark:text-sky-400" />
  ),
};

const Toast: React.FC<IToastProps> = ({ type, message, onClose }) => {
  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 flex items-center justify-between max-w-md px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ease-in-out ${colors[type]}`}
    >
      <div className="flex items-center">
        {icons[type]}
        <span className="text-sm font-medium leading-snug">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="ml-4 p-1 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-current"
        >
          <span className="text-lg leading-none font-bold">&times;</span>
        </button>
      )}
    </div>
  );
};

export default Toast;
