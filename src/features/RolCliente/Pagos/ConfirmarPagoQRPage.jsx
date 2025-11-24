// src/features/pagos/ConfirmarPagoQRPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmarPago } from "../../../api/PagosApi";
import QRCode from "react-qr-code";
import { useTheme } from "../../../context/ThemeContext";

export default function ConfirmarPagoQRPage() {
  const { state } = useLocation();
  const { pago } = state || {};
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  if (!pago)
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-black"}`}>
        No hay pago seleccionado.
      </div>
    );

  async function handlePagarQR() {
    try {
      await confirmarPago(pago.idPago, pago.codigoTransaccion);
      alert("Pago confirmado via QR");
      navigate(`/reservas/mihistorial`);
    } catch (e) {
      console.error(e);
      alert("Error al confirmar pago QR");
    }
  }

  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-black"
      }`}
    >
      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-3 py-2 bg-[#46c4b7] text-white rounded-lg"
      >
        Volver
      </button>

      <h1 className="text-xl font-bold mb-4">Confirmar pago QR</h1>

      {/* CONTENEDOR */}
      <div
        className={`mb-6 p-4 border rounded text-center transition-all ${
          isDarkMode ? "border-[#444] bg-[#1a1d1f]" : "border-gray-300 bg-white"
        }`}
      >
        <p className="mb-2">Monto a pagar: S/ {pago.monto.toFixed(2)}</p>

        {/* FONDO DEL QR */}
        <div
          className={`inline-block p-4 rounded shadow transition-all ${
            isDarkMode ? "bg-white" : "bg-white"
          }`}
        >
          <QRCode value={pago.codigoTransaccion} />
        </div>
      </div>

      {/* BOTÓN PAGAR */}
      <button
        onClick={handlePagarQR}
        className="w-full py-3 rounded-lg bg-[#46c4b7] text-white"
      >
        Pagar
      </button>
    </div>
  );
}
