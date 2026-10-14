import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { IToastProps } from "../interfaces/IToastProps";
import Toast from "../components/Common/Toast";

interface ToastContextType {
  showToast: (type: IToastProps["type"], message: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<IToastProps | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (type: IToastProps["type"], message: string) => {
      // Limpiar temporizador previo si existe
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({ type, message });

      // Ocultar notificación tras 5 segundos
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, 5000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser utilizado dentro de un ToastProvider");
  }
  return context;
};
