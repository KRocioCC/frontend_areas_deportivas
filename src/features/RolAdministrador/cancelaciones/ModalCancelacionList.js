// src/features/cancelaciones/components/ModalCancelacionList.js
import React, { useState, useEffect, useMemo } from "react";
import { X, Users, Clock, CreditCard, CalendarDays } from "lucide-react";
import Button from "../../../components/ui/Button";
import { getCancha } from "../../../api/CanchaApi";
import "./ModalCancelacionList.css";

export default function ModalCancelacionList({ initialData, onCancel }) {
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const [cargandoImagen, setCargandoImagen] = useState(true);

  const cancha = useMemo(() => initialData?.cancha || {}, [initialData]);
  const cliente = initialData?.cliente || {};
  const pago = initialData?.pago || {};

  const getUrlImagenCompleta = (urlAcceso) => {
    if (!urlAcceso) return "https://placehold.co/600x400?text=Sin+Imagen";
    if (urlAcceso.startsWith("http")) return urlAcceso;
    const baseUrl = "http://localhost:8032";
    return `${baseUrl}${urlAcceso.startsWith('/') ? urlAcceso : '/' + urlAcceso}`;
  };

  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      setCargandoImagen(true);
      try {
        if (cancha && Array.isArray(cancha.imagenes) && cancha.imagenes.length > 0) {
          const primera = cancha.imagenes[0];
          const url = getUrlImagenCompleta(primera?.urlAcceso);
          if (!cancelado) setImagenPrincipal(url);
          setCargandoImagen(false);
          return;
        }
        const alternos = [initialData?.imagenes, initialData?.imagenesCancha];
        for (const arr of alternos) {
          if (Array.isArray(arr) && arr.length > 0) {
            const url = getUrlImagenCompleta(arr[0]?.urlAcceso);
            if (!cancelado) setImagenPrincipal(url);
            setCargandoImagen(false);
            return;
          }
        }
        if (cancha?.idCancha) {
          const canchaFull = await getCancha(cancha.idCancha);
          const imgs = canchaFull?.imagenes;
          if (Array.isArray(imgs) && imgs.length > 0) {
            const url = getUrlImagenCompleta(imgs[0]?.urlAcceso);
            if (!cancelado) setImagenPrincipal(url);
            setCargandoImagen(false);
            return;
          }
        }
        const directa = cancha?.urlImagen || cancha?.imageUrl || initialData?.urlImagen || initialData?.imageUrl;
        if (directa) {
          const url = getUrlImagenCompleta(directa);
          if (!cancelado) setImagenPrincipal(url);
          setCargandoImagen(false);
          return;
        }
        if (!cancelado) {
          setImagenPrincipal("https://placehold.co/600x400?text=Sin+Imágenes");
          setCargandoImagen(false);
        }
      } catch (err) {
        console.error('[ModalCancelacionList] Error cargando imagen:', err);
        if (!cancelado) {
          setImagenPrincipal("https://placehold.co/600x400?text=Error");
          setCargandoImagen(false);
        }
      }
    }
    if (initialData) cargar(); else setCargandoImagen(false);
    return () => { cancelado = true; };
  }, [initialData, cancha]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/300x300/2563eb/white?text=Sin+Imagen";
  };

  if (!initialData) return null;

  return (
    <div className="modal-cancelacion-overlay">
      <div className="modal-cancelacion-blur"></div>

      <div className="modal-cancelacion-container">
        <div className="modal-cancelacion-content">
          {/* Header */}
          <div className="modal-cancelacion-header">
            <h2>Detalle de Cancelación</h2>
            <button onClick={onCancel} className="modal-cancelacion-close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Imagen y datos principales */}
          <div className="modal-cancelacion-grid">
            <div className="modal-cancelacion-image">
              {cargandoImagen ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-xs text-gray-600">
                  <span>Cargando imagen...</span>
                  <span>{cancha?.nombre}</span>
                </div>
              ) : (
                <img 
                  src={imagenPrincipal} 
                  alt={cancha?.nombre} 
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="modal-cancelacion-info">
              <h3>{cancha.nombre || "Cancha sin nombre"}</h3>
              <div className="modal-cancelacion-box estado-cancelado">
                <div className="label">Estado</div>
                <div className="value">{initialData.estadoReserva}</div>
              </div>

              <div className="modal-cancelacion-box">
                <Users className="icon" />
                <span>
                  Capacidad: {cancha.capacidad || "?"} personas
                </span>
              </div>

              <div className="modal-cancelacion-box">
                <Clock className="icon" />
                <span>
                  Horario: {initialData.horaInicio?.slice(0, 5)} -{" "}
                  {initialData.horaFin?.slice(0, 5)}
                </span>
              </div>

              <div className="modal-cancelacion-box">
                <CalendarDays className="icon" />
                <span>
                  Fecha: {initialData.fechaReserva?.slice(0, 10)}
                </span>
              </div>

              <div className="modal-cancelacion-box">
                <CreditCard className="icon" />
                <span>
                  Pago: Bs{" "}
                  {pago.monto || initialData.totalPagado || 0} 
                </span>
              </div>
            </div>
          </div>

          {/* Detalles extendidos */}
          <div className="modal-cancelacion-details">
            <h4>Información del Cliente</h4>
            <div className="modal-cancelacion-detail-grid">
              <div>
                <div className="label">Nombre</div>
                <div className="value">
                  {cliente.nombre ||
                    initialData.nombreUsuario ||
                    "Sin nombre"}
                </div>
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">
                  {cliente.email || "No disponible"}
                </div>
              </div>
              <div>
                <div className="label">Teléfono</div>
                <div className="value">
                  {cliente.telefono || "No disponible"}
                </div>
              </div>
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="modal-cancelacion-footer">
            <Button variant="secondary" onClick={onCancel}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}