// src/features/reservas/components/ModalReservaList.js
import React, { useState, useEffect, useMemo } from "react";
import { getCancha } from "../../../api/CanchaApi"; // para traer imágenes completas
import { X, Users, Clock, CreditCard, CalendarDays } from "lucide-react";
import Button from "../../../components/ui/Button";
import "./ModalReservaList.css";

export default function ModalReservaList({ initialData, onCancel }) {
  // Hooks deben declararse siempre sin retornar antes
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const [cargandoImagen, setCargandoImagen] = useState(true);

  // Memo para evitar recrear objeto en cada render y ruido en dependencias
  const cancha = useMemo(() => (initialData?.cancha || {}), [initialData]);
  const cliente = initialData?.cliente || {};
  const pago = initialData?.pago || {};

  // No retornamos antes de hooks; manejamos estado sin datos en el render.

  // === LÓGICA DE IMÁGENES ADAPTADA DE CanchaCard ===
  // (Declarado arriba antes de cualquier return)

  const getUrlImagenCompleta = (urlAcceso) => {
    if (!urlAcceso) return "https://placehold.co/600x400?text=Sin+Imagen";
    if (urlAcceso.startsWith("http")) return urlAcceso;
    const baseUrl = "http://localhost:8032";
    return `${baseUrl}${urlAcceso.startsWith('/') ? urlAcceso : '/' + urlAcceso}`;
  };

  useEffect(() => {
    let cancelado = false;
    async function cargarImagenes() {
      setCargandoImagen(true);
      try {
        // 1. Si la reserva ya trae imágenes en cancha, usarlas
        if (cancha && Array.isArray(cancha.imagenes) && cancha.imagenes.length > 0) {
          const primera = cancha.imagenes[0];
          const url = getUrlImagenCompleta(primera?.urlAcceso);
          if (!cancelado) setImagenPrincipal(url);
          const img = new Image();
          img.onload = () => !cancelado && setCargandoImagen(false);
          img.onerror = () => {
            if (!cancelado) {
              setImagenPrincipal("https://placehold.co/600x400?text=Error+Cargando");
              setCargandoImagen(false);
            }
          };
          img.src = url;
          return;
        }

        // 2. Intentar arrays directos en el objeto de reserva
        const arraysAlternativos = [initialData?.imagenes, initialData?.imagenesCancha];
        for (const arr of arraysAlternativos) {
          if (Array.isArray(arr) && arr.length > 0) {
            const primera = arr[0];
            const url = getUrlImagenCompleta(primera?.urlAcceso);
            if (!cancelado) setImagenPrincipal(url);
            setCargandoImagen(false);
            return;
          }
        }

        // 3. Fetch adicional a la API de cancha para obtener imágenes
        if (cancha?.idCancha) {
          const canchaCompleta = await getCancha(cancha.idCancha);
          const imgs = canchaCompleta?.imagenes;
          if (Array.isArray(imgs) && imgs.length > 0) {
            const url = getUrlImagenCompleta(imgs[0]?.urlAcceso);
            if (!cancelado) setImagenPrincipal(url);
            setCargandoImagen(false);
            return;
          }
        }

        // 4. Campos directos urlImagen / imageUrl
        const directa = cancha?.urlImagen || cancha?.imageUrl || initialData?.urlImagen || initialData?.imageUrl;
        if (directa) {
          const url = getUrlImagenCompleta(directa);
          if (!cancelado) setImagenPrincipal(url);
          setCargandoImagen(false);
          return;
        }

        // 5. Fallback final
        if (!cancelado) {
          setImagenPrincipal("https://placehold.co/600x400?text=Sin+Imágenes");
          setCargandoImagen(false);
        }
      } catch (err) {
        console.error('[ModalReservaList] Error cargando imágenes cancha:', err);
        if (!cancelado) {
          setImagenPrincipal("https://placehold.co/600x400?text=Error");
          setCargandoImagen(false);
        }
      }
    }
    cargarImagenes();
    return () => { cancelado = true; };
  }, [cancha, initialData]);

  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/300x300/2563eb/white?text=Sin+Imagen";
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[ModalReservaList] initialData completo:', initialData);
    console.log('[ModalReservaList] cancha.imagenes:', cancha?.imagenes);
    console.log('[ModalReservaList] imagenPrincipal:', imagenPrincipal, 'cargando:', cargandoImagen);
  }

  return (
    <div className="modal-reserva-overlay text-gray-500">
      <div className="modal-reserva-blur"></div>

      <div className="modal-reserva-container">
        <div className="modal-reserva-content">
          {/* Header */}
          <div className="modal-reserva-header">
            <h2>Detalle de Reserva</h2>
            <button onClick={onCancel} className="modal-reserva-close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Imagen y datos principales */}
          <div className="modal-reserva-grid">
            <div className="modal-reserva-image">
              {cargandoImagen ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-xs text-gray-600">
                  <span>Cargando imagen...</span>
                  <span>{cancha.nombre}</span>
                </div>
              ) : (
                <img
                  src={imagenPrincipal}
                  alt={cancha.nombre}
                  onError={(e) => {
                    handleImageError(e);
                    e.target.src = "https://placehold.co/600x400?text=Error+Mostrando+Imagen";
                  }}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="modal-reserva-info">
              <h3>{cancha.nombre || "Cancha sin nombre"}</h3>
              <div
              className={`modal-reserva-box estado-${initialData.estadoReserva?.toLowerCase()}`}
            >
              <div className="label">Estado</div>
              <div className="value">{initialData.estadoReserva}</div>
            </div>


              <div className="modal-reserva-box">
                <Users className="icon" />
                <span>Capacidad: {cancha.capacidad || "?"} personas</span>
              </div>

              <div className="modal-reserva-box">
                <Clock className="icon" />
                <span>Horario: {initialData.horaInicio?.slice(0,5)} - {initialData.horaFin?.slice(0,5)}</span>
              </div>

              <div className="modal-reserva-box">
                <CalendarDays className="icon" />
                <span>Fecha: {initialData.fechaReserva?.slice(0,10)}</span>
              </div>

              <div className="modal-reserva-box">
                <CreditCard className="icon" />
                <span>Pago: Bs {pago.monto || initialData.totalPagado || 0} ({pago.metodoPago || "Método no registrado"})</span>
              </div>
            </div>
          </div>

          {/* Detalles extendidos */}
          <div className="modal-reserva-details">
            <h4>Información del Cliente</h4>
            <div className="modal-reserva-detail-grid">
              <div>
                <div className="label">Nombre</div>
                <div className="value">{cliente.nombre || initialData.nombreUsuario || "Sin nombre"}</div>
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">{cliente.email || "No disponible"}</div>
              </div>
              <div>
                <div className="label">Teléfono</div>
                <div className="value">{cliente.telefono || "No disponible"}</div>
              </div>
              <div>
                <div className="label">Observaciones</div>
                <div className="value">{initialData.observaciones || "Sin observaciones"}</div>
              </div>
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="modal-reserva-footer">
            <Button variant="secondary" onClick={onCancel}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}