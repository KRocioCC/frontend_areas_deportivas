import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const showAlert = ({ type = "info", title, message, duration = 3000 }) => {
    const id = Date.now();

    setAlerts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, duration);
  };

  const icons = {
    success: <CheckCircle size={22} />,
    error: <XCircle size={22} />,
    warning: <AlertTriangle size={22} />,
    info: <Info size={22} />,
  };

  const colors = {
    success: "#4CAF50",
    error: "#E53935",
    warning: "#FBC02D",
    info: "#29B6F6",
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* CONTENEDOR DE ALERTAS */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25 }}
              style={{
                background: "#fff",
                minWidth: 260,
                maxWidth: 300,
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                borderLeft: `5px solid ${colors[alert.type]}`,
                padding: "14px 16px",
                display: "flex",
                gap: 12,
              }}
            >
              <span
                style={{
                  color: colors[alert.type],
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icons[alert.type]}
              </span>

              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    marginBottom: 4,
                    color: "#1a1a1a",
                  }}
                >
                  {alert.title}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {alert.message}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
}
