import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

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
