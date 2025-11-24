// src/features/pagos/IngresarTarjetaPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmarPago } from "../../../api/PagosApi";
import { useTheme } from "../../../context/ThemeContext";

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

  if (!pago)
    return (
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-black"}`}>
        No hay pago seleccionado.
      </div>
    );

  async function handlePagar() {
    setProcesando(true);
    setMensaje(null);
    try {
      await confirmarPago(pago.idPago, pago.codigoTransaccion);
      setMensaje({ type: "success", text: "Pago con tarjeta confirmado." });

      setTimeout(() => navigate(`/reservas/mihistorial`), 1500);
    } catch (e) {
      console.error(e);
      setMensaje({ type: "error", text: "Error al procesar tarjeta" });
    } finally {
      setProcesando(false);
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

      <h1 className="text-xl font-bold mb-4">Ingresar datos de tarjeta</h1>

      {/* CAMPOS */}
      <input
        placeholder="Número de tarjeta"
        className={`w-full mb-3 p-3 border rounded transition-all ${
          isDarkMode ? "bg-[#1a1d1f] border-[#444] text-white" : "bg-white border-gray-300 text-black"
        }`}
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />

      <input
        placeholder="CVV"
        className={`w-full mb-3 p-3 border rounded transition-all ${
          isDarkMode ? "bg-[#1a1d1f] border-[#444] text-white" : "bg-white border-gray-300 text-black"
        }`}
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
      />

      <input
        placeholder="Nombre del titular"
        className={`w-full mb-3 p-3 border rounded transition-all ${
          isDarkMode ? "bg-[#1a1d1f] border-[#444] text-white" : "bg-white border-gray-300 text-black"
        }`}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* BOTÓN PAGAR */}
      <button
        disabled={procesando}
        onClick={handlePagar}
        className={`w-full py-3 rounded-lg text-white transition-all ${
          procesando ? "bg-[#348f85]" : "bg-[#46c4b7]"
        }`}
      >
        {procesando ? "Procesando..." : "Pagar"}
      </button>

      {/* MENSAJE */}
      {mensaje && (
        <div
          className={`mt-3 p-3 rounded text-white ${
            mensaje.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {mensaje.text}
        </div>
      )}
    </div>
  );
}
