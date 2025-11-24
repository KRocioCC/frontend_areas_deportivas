// src/features/pagos/IngresarTarjetaPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmarPago } from "../../../api/PagosApi";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";

export default function IngresarTarjetaPage() {
  const { state } = useLocation();
  const { pago } = state || {};
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");
  const [nombre, setNombre] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const { showToast } = useToast(); 

  if (!pago)
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-black"}`}>
        No hay pago seleccionado.
      </div>
    );

  async function handlePagar() {
    
    if (!numero.trim() || !cvv.trim() || !nombre.trim()) {
      showToast("Completa todos los campos", "warning");
      return;
    }
    setProcesando(true);
    setMensaje(null);
    try {
      await confirmarPago(pago.idPago, pago.codigoTransaccion);
       showToast("Pago con tarjeta confirmado ", "success");
      setTimeout(() => navigate(`/reservas/mihistorial`), 1500);
    } catch (e) {
      console.error(e);
      showToast("Error al procesar la tarjeta ", "error");
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div
      className={`min-h-screen p-4 pt-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0f1213] text-[#e6e6e6]' : 'bg-[#ffffff] text-[#0b0d0e]'
      }`}
      style={{ fontFamily: 'var(--font-Balo)' }}
    >
      <div className="max-w-md mx-auto">
        {/* ——— BOTÓN VOLVER ATRÁS (ROJO TEMÁTICO) ——— */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
          style={{
            fontFamily: 'var(--font-josefin)',
            background: isDarkMode ? '#8a2628' : '#d61727',
            color: '#FFFFFF',
            boxShadow: isDarkMode 
              ? '0 2px 6px rgba(138, 38, 40, 0.3)' 
              : '0 2px 6px rgba(214, 23, 39, 0.25)',
          }}
        >
          ← Volver
        </button>

        {/* ——— TÍTULO ——— */}
        <h1
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ fontFamily: 'var(--font-Oswald)' }}
        >
          Datos de tarjeta
        </h1>
        <p 
          className="text-sm opacity-85 mb-6"
          style={{ fontFamily: 'var(--font-Balo)' }}
        >
          Monto: <span className="font-semibold">S/ {pago.monto.toFixed(2)}</span>
        </p>

        {/* ——— FORMULARIO ——— */}
        <div className="space-y-4 mb-8">
          <div>
            <label 
              className="block text-xs opacity-80 mb-2 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-Alumni)' }}
            >
              Número de tarjeta
            </label>
            <input
              placeholder="•••• •••• •••• ••••"
              className="w-full p-4 rounded-lg text-base"
              value={numero}
              onChange={(e) => setNumero(e.target.value.replace(/\D/g, "").slice(0, 16))}
              style={{
                background: isDarkMode ? '#080a0b' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                color: isDarkMode ? '#e6e6e6' : '#0b0d0e',
                fontFamily: 'var(--font-Balo)',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-xs opacity-80 mb-2 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-Alumni)' }}
              >
                CVV
              </label>
              <input
                placeholder="•••"
                type="password"
                className="w-full p-4 rounded-lg text-base"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                style={{
                  background: isDarkMode ? '#080a0b' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                  color: isDarkMode ? '#e6e6e6' : '#0b0d0e',
                  fontFamily: 'var(--font-Balo)',
                }}
              />
            </div>

            <div>
              <label 
                className="block text-xs opacity-80 mb-2 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-Alumni)' }}
              >
                Nombre
              </label>
              <input
                placeholder="Nombre"
                className="w-full p-4 rounded-lg text-base"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  background: isDarkMode ? '#080a0b' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                  color: isDarkMode ? '#e6e6e6' : '#0b0d0e',
                  fontFamily: 'var(--font-Balo)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ——— BOTÓN PRINCIPAL ——— */}
        <button
          disabled={procesando}
          onClick={handlePagar}
          className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 active:scale-[0.99]"
          style={{
            fontFamily: 'var(--font-josefin)',
            background: procesando
              ? (isDarkMode ? '#2a2e30' : '#d1d5db')
              : (isDarkMode ? '#f35734' : '#41bfb2'),
            color: '#FFFFFF',
            boxShadow: !procesando
              ? (isDarkMode 
                  ? '0 4px 14px rgba(243, 87, 52, 0.35)' 
                  : '0 4px 14px rgba(65, 191, 178, 0.3)')
              : 'none',
          }}
        >
          {procesando ? (
            <>
              <span className="animate-spin mr-2">↻</span> Procesando…
            </>
          ) : (
            "Confirmar pago"
          )}
        </button>
      </div>
    </div>
  );
}