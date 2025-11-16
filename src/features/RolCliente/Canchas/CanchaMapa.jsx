// src/features/RolCliente/Canchas/CanchaMapa.jsx
import { MapPin } from "lucide-react";
import { useState } from "react";

export default function CanchaMapa({ cancha }) {
  const lat = parseFloat(cancha.areaDeportiva?.latitud || -16.5);
  const lng = parseFloat(cancha.areaDeportiva?.longitud || -68.15);
  const direccion = cancha.areaDeportiva?.direccion || "Dirección no disponible";
  const nombreArea = cancha.areaDeportiva?.nombre || "Área Deportiva";

  // URL del mapa estático de OpenStreetMap
  const mapUrl = `https://image.maps.ls.hereapi.com/mia/1.6/mapview?lat=${lat}&lon=${lng}&z=15&w=400&h=200&apiKey=YOUR_API_KEY`;

  // Si usas HERE Maps, puedes obtener una API Key gratuita temporalmente.
  // Pero si prefieres OpenStreetMap, no hay API oficial para mapas estáticos,
  // así que la opción 1 (solo texto) es más confiable.

  // Para esta opción, usaremos un iframe con OpenStreetMap
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik`;

  return (
    <div className="bg-[var(--color-p-6)] rounded-lg p-4 shadow-sm">
      <h3 className="font-[var(--font-Oswald)] text-lg text-[var(--primary)] mb-3 flex items-center gap-2">
        <MapPin size={20} />
        Ubicación
      </h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          <strong>Área:</strong> {nombreArea}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Dirección:</strong> {direccion}
        </p>
      </div>

      {/* Mapa interactivo embebido */}
      <div className="mt-3 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="200"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={osmUrl}
          title="Mapa de ubicación"
        ></iframe>
      </div>

      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[var(--secondary)] hover:underline mt-2 block"
      >
        Abrir en OpenStreetMap
      </a>
    </div>
  );

//import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
{/*
export default function CanchaMapa({ cancha }) {

  const lat = parseFloat(cancha.areaDeportiva?.latitud || -16.5);
  const lng = parseFloat(cancha.areaDeportiva?.longitud || -68.15);
  const center = { lat, lng };

  return (

    <div className="bg-[var(--color-p-6)] rounded-lg p-4 shadow-sm">
      <h3 className="font-[var(--font-Oswald)] text-lg text-[var(--primary)] mb-3">Ubicación</h3>
      <LoadScript googleMapsApiKey="TU_API_KEY_DE_GOOGLE_MAPS">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "250px", borderRadius: "12px" }}
          center={center}
          zoom={15}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
      
  );

}
*/}

}
