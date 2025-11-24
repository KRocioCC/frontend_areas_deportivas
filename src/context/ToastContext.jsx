import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; 

// CONTEXTO
const ToastContext = createContext();

// HOOK
export function useToast() {
  return useContext(ToastContext);
}

// PROVIDER
export function ToastProvider({ children }) {
  const { isDarkMode } = useTheme(); 
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
    const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
    return () => clearTimeout(timer);
  }, []);


  const getToastStyle = (type) => {
    const base = {
      bgColor: isDarkMode ? "#080a0b" : "#FFFFFF",
      borderColor: "#2C7366", // fallback
      iconColor: "#2C7366",
      shadow: isDarkMode 
        ? "0 6px 20px rgba(0,0,0,0.3)" 
        : "0 6px 20px rgba(0,0,0,0.12)",
    };

    switch (type) {
      case "success":
        return {
          ...base,
          borderColor: isDarkMode ? "#2C7366" : "#41bfb2",
          iconColor: isDarkMode ? "#46c4b7" : "#2C7366",
        };
      case "error":
        return {
          ...base,
          borderColor: isDarkMode ? "#8a2628" : "#d61727",
          iconColor: isDarkMode ? "#f35734" : "#d61727",
        };
      case "warning":
        return {
          ...base,
          borderColor: isDarkMode ? "#f38321" : "#f28627",
          iconColor: isDarkMode ? "#f38321" : "#f28627",
        };
      case "info":
        return {
          ...base,
          borderColor: isDarkMode ? "#46c4b7" : "#41bfb2",
          iconColor: isDarkMode ? "#46c4b7" : "#2C7366",
        };
      default:
        return base;
    }
  };

  const style = getToastStyle(toast.type);

  // ✅ ÍCONOS CON COLOR DINÁMICO
  const iconos = {
    success: <CheckCircle className="w-6 h-6" style={{ color: style.iconColor }} />,
    error: <XCircle className="w-6 h-6" style={{ color: style.iconColor }} />,
    warning: <AlertCircle className="w-6 h-6" style={{ color: style.iconColor }} />,
    info: <Info className="w-6 h-6" style={{ color: style.iconColor }} />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              fixed top-6 right-6 z-50
              flex items-center gap-4
              rounded-xl
              px-5 py-4
              border-l-4
              shadow-lg
              ${isDarkMode ? 'text-[#e6e6e6]' : 'text-[#0b0d0e]'}
            `}
            style={{
              background: style.bgColor,
              borderLeftColor: style.borderColor,
              boxShadow: style.shadow,
              fontFamily: "var(--font-Balo)",
            }}
          >
            {iconos[toast.type]}
            <p 
              className="text-base font-semibold leading-tight"
              style={{ 
                fontFamily: "var(--font-josefin)",
                color: isDarkMode ? "#e6e6e6" : "#0b0d0e",
              }}
            >
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}