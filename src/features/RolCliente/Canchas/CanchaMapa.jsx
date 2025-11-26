// src/features/RolCliente/Canchas/CanchaMapa.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

export default function CanchaMapa({ cancha }) {
  const lat = parseFloat(cancha.areaDeportiva?.latitud || -16.5);
  const lng = parseFloat(cancha.areaDeportiva?.longitud || -68.15);
  const nombreArea = cancha.areaDeportiva?.nombreArea || "Área Deportiva";
  const direccion = cancha.areaDeportiva?.direccion || "Dirección no disponible";

  // Icono personalizado para el marcador
  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Link directo a Google Maps
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="bg-[var(--color-p-6)] rounded-lg p-4 z-1 shadow-sm">
      <h3 className="font-[var(--font-Oswald)] text-lg text-[var(--primary)] mb-3 flex items-center gap-2">
        <MapPin size={20} /> Nos encontramos en : 
      </h3>

      <div className="map-wrapper" style={{ height: "250px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
        <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              <strong>{nombreArea}</strong>
              <br />
              {direccion}
              <br />
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Abrir en Google Maps
              </a>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
