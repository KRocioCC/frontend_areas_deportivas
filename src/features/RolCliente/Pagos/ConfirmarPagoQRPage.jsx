// src/features/pagos/ConfirmarPagoQRPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmarPago } from "../../../api/PagosApi";
import QRCode from "react-qr-code";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";

export default function ConfirmarPagoQRPage() {
  const { state } = useLocation();
  const { pago } = state || {};
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  if (!pago)
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-black"}`}>
        No hay pago seleccionado.
      </div>
    );

  async function handlePagarQR() {
    try {
      await confirmarPago(pago.idPago, pago.codigoTransaccion);
      showToast("Pago confirmado vía QR ", "success");
      //alert("Pago confirmado via QR");
      navigate(`/reservas/mihistorial`);
    } catch (e) {
      console.error(e);
      showToast("Error al confirmar el pago ", "error");
      //alert("Error al confirmar pago QR");
    }
  }

  return (
    <div
      className={`min-h-screen pt-16 p-4 transition-colors duration-300 ${
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
          Confirmar pago
        </h1>
        <p 
          className="text-sm opacity-85 mb-6"
          style={{ fontFamily: 'var(--font-Balo)' }}
        >
          Escanea el código QR para completar
        </p>

        {/* ——— PANEL CON RESUMEN Y QR ——— */}
        <div
          className="rounded-xl p-5 mb-6 border shadow-sm"
          style={{
            background: isDarkMode ? '#080a0b' : '#FFFFFF',
            border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
            boxShadow: `0 4px 12px rgba(0,0,0,${isDarkMode ? '0.2' : '0.05'})`,
          }}
        >
          {/* Monto */}
          <div 
            className="text-center mb-5"
            style={{ fontFamily: 'var(--font-Alumni)' }}
          >
            <div className="text-xs opacity-80 uppercase tracking-wide">Monto</div>
            <div 
              className="font-bold text-2xl mt-1"
              style={{ 
                fontFamily: 'var(--font-Oswald)',
                color: isDarkMode ? '#f35734' : '#f28627'
              }}
            >
               {pago.monto.toFixed(2)} Bs
            </div>
          </div>

          {/* Contenedor del QR — fondo blanco obligatorio para escaneo */}
          <div 
            className="flex justify-center"
            style={{
              background: '#FFFFFF',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <QRCode
              value={pago.codigoTransaccion}
              size={180}
              bgColor="#FFFFFF"
              fgColor="#0b0d0e"
              style={{ display: 'block' }}
            />
          </div>

          <div 
            className="text-xs text-center opacity-70 mt-4"
            style={{ fontFamily: 'var(--font-Balo)' }}
          >
            Escanea con tu app de pagos
          </div>
        </div>

        {/* ——— BOTÓN PRINCIPAL ——— */}
        <button
          onClick={handlePagarQR}
          className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center active:scale-[0.99]"
          style={{
            fontFamily: 'var(--font-josefin)',
            background: isDarkMode ? '#f35734' : '#41bfb2',
            color: '#FFFFFF',
            boxShadow: isDarkMode 
              ? '0 4px 14px rgba(243, 87, 52, 0.35)' 
              : '0 4px 14px rgba(65, 191, 178, 0.3)',
          }}
        >
          Confirmar pago
        </button>
      </div>
    </div>
  );
}