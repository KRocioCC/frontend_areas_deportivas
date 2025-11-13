// src/features/RolCliente/Cancha/CanchaInfo.jsx
import { FaMoneyBillWave, FaUsers } from "react-icons/fa6";

export default function CanchaInfo({ cancha }) {
  const infoItems = [
    {
      label: "Costo / hora",
      value: `Bs ${cancha.costoHora?.toFixed(2)}`,
      color: "text-[var(--accent1)]",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Capacidad",
      value: `${cancha.capacidad} pers.`,
      color: "text-[var(--secondary)]",
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {infoItems.map((item, i) => (
        <div
          key={i}
          className="bg-[var(--color-p-6)] flex flex-col items-center justify-center p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className={`text-2xl mb-2 ${item.color}`}>{item.icon}</div>
          <h4 className="font-[var(--font-Alumni)] text-md text-[var(--color-t-3)]">
            {item.label}
          </h4>
          <p
            className={`font-[var(--font-Oswald)] text-xl ${item.color} tracking-wide`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
