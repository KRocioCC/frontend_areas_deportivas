// src/features/RolCliente/Cancha/CanchaDetallesExtras.jsx
import { 
  FaRulerCombined, 
  FaToolbox, 
  FaLightbulb, 
  FaUmbrellaBeach, 
  FaClock, 
  FaLayerGroup 
} from "react-icons/fa6";

export default function CanchaDetallesExtras({ cancha }) {
  const detalles = [
    { icon: <FaLayerGroup />, titulo: "Tipo de Superficie", valor: cancha.tipoSuperficie },
    { icon: <FaRulerCombined />, titulo: "Tamaño", valor: cancha.tamano },
    { icon: <FaToolbox />, titulo: "Mantenimiento", valor: cancha.mantenimiento },
    { icon: <FaLightbulb />, titulo: "Iluminación", valor: cancha.iluminacion === "Si" ? "Sí" : "No" },
    { icon: <FaUmbrellaBeach />, titulo: "Cubierta", valor: cancha.cubierta === "Si" ? "Sí" : "No" },
    { icon: <FaClock />, titulo: "Horario", valor: cancha.horaInicio ? `${cancha.horaInicio} - ${cancha.horaFin}` : "No especificado" },
  ];

  return (
    <div className=" rounded-2xl  p-0 transition-all hover:shadow-md">
      <h3 className="font-[var(--font-Oswald)] text-xl text-[var(--primary)] mb-5 tracking-wide">
        Detalles de la Cancha
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {detalles.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-[var(--color-pb-4)] rounded-lg transition-all">
            <div className="text-[var(--secondary)] text-xl">{item.icon}</div>
            <div>
              <h4 className="font-[var(--font-josefin)] text-[var(--color-t-1)] text-sm font-semibold">
                {item.titulo}
              </h4>
              <p className="font-[var(--font-Balo)] text-[var(--color-t-2)] text-sm">
                {item.valor || "No especificado"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
