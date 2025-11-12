export default function CanchaCard({ cancha, onClick }) {
  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={cancha.urlImagen || "/images/cancha-default.jpg"}
        alt={cancha.nombre}
        className="w-full h-40 object-cover group-hover:scale-105 transition"
      />
      <div className="absolute bottom-2 left-2 text-white text-xs">
        <p className="font-bold">{cancha.nombre}</p>
        <p>S/{cancha.costoHora?.toFixed(2)}</p>
        <p>Capacidad: {cancha.capacidad}</p>
      </div>
    </div>
  );
}
