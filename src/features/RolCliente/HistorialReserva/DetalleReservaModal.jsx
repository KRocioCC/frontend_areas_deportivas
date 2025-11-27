import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Info,
} from "lucide-react";

export default function DetalleReservaModal({ open, onClose, reserva, isDarkMode }) {
  if (!open || !reserva) return null;

  const pago = reserva.pagos?.[0];

  const formatTime = (timeStr) => timeStr?.split(":").slice(0, 2).join(":") || "—";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div
        className={`w-full max-w-4xl rounded-2xl p-5 relative shadow-xl transition-all duration-300 ${
          isDarkMode ? "bg-[#0f1213] text-gray-200" : "bg-[var(--color-pb-6)] text-gray-900"
        }`}
        style={{
          boxShadow: isDarkMode
            ? "0 8px 30px rgba(0, 0, 0, 0.4)"
            : "0 8px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1.5 rounded-md transition-colors ${
            isDarkMode
              ? "hover:bg-[rgba(44,115,102,0.15)] text-[var(--color-p-11)]"
              : "hover:bg-[rgba(65,191,178,0.15)] text-[var(--color-pb-5)]"
          }`}
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2
          className="text-xl font-bold mb-4 text-center"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          Detalles de la Reserva
        </h2>

        {/* Layout horizontal en escritorio — vertical en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Columna izquierda: Información principal + QR */}
          <div className="space-y-4">
            <div className="space-y-2.5" style={{ fontFamily: "var(--font-Balo)" }}>
              <div className="flex items-center gap-2.5">
                <Calendar className={`w-4.5 h-4.5 flex-shrink-0 ${isDarkMode ? "text-[var(--color-p-11)]" : "text-[var(--color-pb-5)]"}`} />
                <span><b style={{ fontFamily: "var(--font-Alumni)" }}>Fecha:</b> {reserva.fechaReserva || "—"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className={`w-4.5 h-4.5 flex-shrink-0 ${isDarkMode ? "text-[var(--color-p-11)]" : "text-[var(--color-pb-5)]"}`} />
                <span><b style={{ fontFamily: "var(--font-Alumni)" }}>Horario:</b> {formatTime(reserva.horaInicio)} – {formatTime(reserva.horaFin)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Info className={`w-4.5 h-4.5 flex-shrink-0 ${isDarkMode ? "text-[var(--color-p-11)]" : "text-[var(--color-pb-5)]"}`} />
                <span><b style={{ fontFamily: "var(--font-Alumni)" }}>Estado:</b> {reserva.estadoReserva || "—"}</span>
              </div>
              {reserva.observaciones && (
                <div className="flex items-start gap-2.5 pt-1">
                  <span className="w-4.5 opacity-0" />
                  <p className="text-sm opacity-90">
                    <b style={{ fontFamily: "var(--font-Alumni)" }}>Notas:</b> {reserva.observaciones}
                  </p>
                </div>
              )}
            </div>

            
          </div>

          {/* Columna derecha: Cancha, Disciplina, Pago */}
          <div className="space-y-4">
            {/* Cancha */}
            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-Alumni)" }}>
                <MapPin
                  className={isDarkMode ? "text-[var(--color-p-11)]" : "text-[var(--color-pb-5)]"}
                  size={16}
                />
                Cancha
              </h3>
              <div
                className={`p-3 rounded-xl text-sm space-y-1.5 ${
                  isDarkMode ? "bg-[#141717]" : "bg-[var(--color-pb-4)]"
                }`}
                style={{ fontFamily: "var(--font-Balo)" }}
              >
                <p><b>Nombre:</b> {reserva.cancha?.nombre || "— "}</p>
                <p><b>Superficie:</b> {reserva.cancha?.tipoSuperficie || "—"}</p>
                <p><b>Tamaño:</b> {reserva.cancha?.tamano || "—"}</p>
                <p><b>Iluminación:</b> {reserva.cancha?.iluminacion || "—"}</p>
                <p><b>Cubierta:</b> {reserva.cancha?.cubierta || "—"}</p>
              </div>
            </div>

            {/* Disciplina */}
            <div>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-Alumni)" }}>
                Disciplina
              </h3>
              <div
                className={`p-3 rounded-xl text-sm ${
                  isDarkMode ? "bg-[#141717]" : "bg-[var(--color-pb-4)]"
                }`}
                style={{ fontFamily: "var(--font-Balo)" }}
              >
                <p className="font-semibold">{reserva.disciplina?.nombre || "Sin disciplina"}</p>
                <p className="opacity-85 mt-1">
                  {reserva.disciplina?.descripcion
                    ? `${reserva.disciplina.descripcion.substring(0, 100)}${reserva.disciplina.descripcion.length > 100 ? "..." : ""}`
                    : "Sin descripción"}
                </p>
              </div>
            </div>

            {/* Pago */}
            {pago && (
              <div>
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-Alumni)" }}>
                  <CreditCard
                    className={isDarkMode ? "text-[var(--color-p-2)]" : "text-[var(--color-pb-3)]"}
                    size={16}
                  />
                  Pago
                </h3>
                <div
                  className={`p-3 rounded-xl text-sm space-y-1.5 ${
                    isDarkMode ? "bg-[#141717]" : "bg-[var(--color-pb-4)]"
                  }`}
                  style={{ fontFamily: "var(--font-Balo)" }}
                >
                  <p><b>Monto:</b> Bs {pago.monto || "—"}</p>
                  <p><b>Método:</b> {pago.metodoPago || "—"}</p>
                  <p><b>Estado:</b> {pago.estado || "—"}</p>
                  <p><b>Transacción:</b> {pago.codigoTransaccion || "—"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón compacto */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 shadow-[0_3px_10px_#00000015] ${
              isDarkMode
                ? "bg-[var(--color-p-2)] text-white hover:bg-[#f56a46]"
                : "bg-[var(--color-pb-3)] text-white hover:bg-[#f49540]"
            }`}
            style={{ fontFamily: "var(--font-josefin)" }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}