import { MapPin } from "lucide-react";

export default function CanchaMapaAdmin({ cancha }) {
  const lat = parseFloat(cancha.areaDeportiva?.latitud || -16.5);
  const lng = parseFloat(cancha.areaDeportiva?.longitud || -68.15);
  const direccion = cancha.areaDeportiva?.direccion || "Dirección no disponible";
  const nombreArea = cancha.areaDeportiva?.nombre || "Área Deportiva";

  // URL para OpenStreetMap embebido
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
}
