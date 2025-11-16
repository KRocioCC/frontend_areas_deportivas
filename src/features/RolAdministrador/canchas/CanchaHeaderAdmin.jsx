export default function CanchaHeaderAdmin({ cancha }) {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
      <img
        src={cancha.urlImagen || "/images/default-cancha.jpg"}
        alt={cancha.nombre}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <h1 className="text-2xl font-[var(--font-Oswald)] tracking-wide">{cancha.nombre}</h1>
        <p className="text-sm opacity-80">ID: {cancha.idCancha}</p>
      </div>
    </div>
  );
}
