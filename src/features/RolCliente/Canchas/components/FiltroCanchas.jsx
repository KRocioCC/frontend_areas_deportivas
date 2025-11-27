import { useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

import {
  buscarCanchasPorNombre,
  buscarCanchasPorNombreDisciplina,
  getCanchas,
  getCanchasActivas,
  getCanchasPorTipoSuperficie,
  getCanchasPorIluminacion,
  getCanchasPorCubierta,
} from "../../../../api/CanchaApi";

const FiltrosCanchas = ({ onFilter, onReset }) => {
  const { isDarkMode } = useTheme();

  // =====================
  // ESTADOS DE FILTRO
  // =====================
  const [isOpen, setIsOpen] = useState(true);

  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState("");

  const [capacidadMin, setCapacidadMin] = useState("");
  const [capacidadMax, setCapacidadMax] = useState("");

  const [costoMin, setCostoMin] = useState("");
  const [costoMax, setCostoMax] = useState("");

  const [superficie, setSuperficie] = useState("");
  const [iluminacion, setIluminacion] = useState("");
  const [cubierta, setCubierta] = useState("");

  const [activas, setActivas] = useState(true);

  //const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const debouncedNombre = useDebounce(nombre, 400);
  const debouncedDisciplina = useDebounce(disciplina, 400);

  // ============================================================
  // FUNCIÓN PRINCIPAL → SE ENCARGA DE ELEGIR EL ENDPOINT CORRECTO
  // ============================================================
  const aplicarFiltros = async () => {
    try {
      let data = [];

      // 1️⃣ DISPONIBILIDAD (prioridad máxima)
      /*if (fecha && horaInicio && horaFin) {
        data = await getCanchasDisponibles(fecha, horaInicio, horaFin);
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }*/

      // 2️⃣ POR NOMBRE
      if (debouncedNombre.length >= 2) {
        data = await buscarCanchasPorNombre(debouncedNombre);
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }

      // 3️⃣ POR DISCIPLINA
      if (debouncedDisciplina.length >= 2) {
        data = await buscarCanchasPorNombreDisciplina(debouncedDisciplina);
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }

          // 4️⃣ SUPERFICIE (API — SOLO ACTIVAS)
      if (superficie) {
        data = await getCanchasPorTipoSuperficie(superficie);
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }

      // 5️⃣ ILUMINACIÓN (API — SOLO ACTIVAS)
      if (iluminacion) {
        data = await getCanchasPorIluminacion(iluminacion);
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }

      // 6️⃣ CUBIERTA (API — SOLO ACTIVAS)
      if (cubierta) {
        data = await getCanchasPorCubierta(cubierta);
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }

      // 4️⃣ COMBINADOS (carga todas y filtra en frontend)
      const tieneFiltros =
        capacidadMin ||
        capacidadMax ||
        costoMin ||
        costoMax ||
        superficie ||
        iluminacion ||
        cubierta;

      if (tieneFiltros) {
        data = activas ? await getCanchasActivas() : await getCanchas();
        data = filtrarLocales(data);
        onFilter(data);
        return;
      }

      // 5️⃣ SIN NINGÚN FILTRO ⇒ retornamos todas activas
      data = activas ? await getCanchasActivas() : await getCanchas();
      onFilter(data);
    } catch (error) {
      console.error("❌ Error aplicando filtros:", error);
      onFilter([]);
    }
  };

  // ==================================================
  // FUNCIÓN PARA FILTRAR LOCALMENTE (NO API)
  // ==================================================
  const filtrarLocales = (lista) => {
    return lista.filter((c) => {
      if (capacidadMin && c.capacidad < Number(capacidadMin)) return false;
      if (capacidadMax && c.capacidad > Number(capacidadMax)) return false;

      if (costoMin && c.costoHora < Number(costoMin)) return false;
      if (costoMax && c.costoHora > Number(costoMax)) return false;

      if (superficie && c.tipoSuperficie !== superficie) return false;

      if (iluminacion && c.iluminacion !== iluminacion)return false;

      if (cubierta && (c.cubierta ? "abierta" : "cubierta") !== cubierta)
        return false;

      return true;
    });
  };

  // Ejecutar filtros cuando cambie algo
  useEffect(() => {
    aplicarFiltros();
  }, [
    debouncedNombre,
    debouncedDisciplina,
    capacidadMin,
    capacidadMax,
    costoMin,
    costoMax,
    superficie,
    iluminacion,
    cubierta,
    activas,
    horaInicio,
    horaFin
  ]);

  // =====================================
  // RESET TOTAL
  // =====================================
  const resetFilters = () => {
    setNombre("");
    setDisciplina("");
    setCapacidadMin("");
    setCapacidadMax("");
    setCostoMin("");
    setCostoMax("");
    setSuperficie("");
    setIluminacion("");
    setCubierta("");
    setActivas(true);
    //setFecha("");
    setHoraInicio("");
    setHoraFin("");

    if (onReset) onReset();
  };
  //estilos
  const bgCard = isDarkMode ? "bg-[#0f1213] border border-[#2a2e2f]" : "bg-[#FFFFFF] border border-[#e0e0e0]";
  const inputBg = isDarkMode ? "bg-[#141717]" : "bg-[#f2efeb]";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const labelColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const resetBtnBg = isDarkMode ? "bg-[#1c2021] hover:bg-[#252a2b]" : "bg-[#f2efeb] hover:bg-[#e8e4e0]";


  return (
    <div className={`rounded-2xl p-6 mb-8 shadow-[0_4px_12px_#00000010] ${bgCard}`}>
      {/* HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer pb-4"
      >
        <h3
          className={`font-bold text-lg flex items-center gap-2 ${textColor} font-['Oswald'] tracking-wide`}
        >
          <Search className="w-5 h-5" />
          Filtros de canchas
        </h3>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""} ${textColor}`}
        />
      </div>

      {/* CONTENIDO */}
      {isOpen && (
        <div className="space-y-6 mt-6">
          {/* Nombre & Disciplina */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputFiltroTexto
              label="Nombre"
              placeholder="Ej: Central"
              value={nombre}
              setValue={setNombre}
              isDarkMode={isDarkMode}
            />
            <InputFiltroTexto
              label="Disciplina"
              placeholder="Ej: Fútbol"
              value={disciplina}
              setValue={setDisciplina}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Rangos numéricos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <InputFiltroNum
              label="Capacidad (min)"
              value={capacidadMin}
              setValue={setCapacidadMin}
              isDarkMode={isDarkMode}
            />
            <InputFiltroNum
              label="Capacidad (max)"
              value={capacidadMax}
              setValue={setCapacidadMax}
              isDarkMode={isDarkMode}
            />
            <InputFiltroNum
              label="Costo/hora (min)"
              value={costoMin}
              setValue={setCostoMin}
              isDarkMode={isDarkMode}
            />
            <InputFiltroNum
              label="Costo/hora (max)"
              value={costoMax}
              setValue={setCostoMax}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectFiltro
              label="Superficie"
              value={superficie}
              setValue={setSuperficie}
              options={[
                ["", "Cualquiera"],
                ["cesped natural", "Césped Natural"],
                ["cesped sintetico", "Césped Sintético"],
                ["cemento", "Cemento"],
                ["parquet", "Parquet"],
                ["arena", "Arena"]
              ]}
              isDarkMode={isDarkMode}
            />
            <SelectFiltro
              label="Iluminación"
              value={iluminacion}
              setValue={setIluminacion}
              options={[
                ["", "Cualquiera"],
                ["halogena", "Halógena"],
                ["led", "LED"],
                ["fluorescente", "Fluorescente"],
                ["natural", "Natural"]
              ]}
              isDarkMode={isDarkMode}
            />
            <SelectFiltro
              label="Cubierta"
              value={cubierta}
              setValue={setCubierta}
              options={[
                ["", "Cualquiera"],
                ["abierta", "Abierta"],
                ["cubierta", "Cubierta"]
              ]}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Disponibilidad + Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/*<InputFiltroFecha
              label="Fecha"
              value={fecha}
              setValue={setFecha}
              isDarkMode={isDarkMode}
            />
            <InputFiltroFecha
              label="Hora inicio"
              type="time"
              value={horaInicio}
              setValue={setHoraInicio}
              isDarkMode={isDarkMode}
            />
            <InputFiltroFecha
              label="Hora fin"
              type="time"
              value={horaFin}
              setValue={setHoraFin}
              isDarkMode={isDarkMode}
            />*/}
           {/*<div className="flex items-end">
              <label className={`flex items-center gap-2 text-sm ${labelColor} font-['Alumni']`}>
                <input
                  type="checkbox"
                  checked={activas}
                  onChange={(e) => setActivas(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#41bfb2] dark:accent-[#2C7366]"
                />
                Solo activas
              </label>
            </div>*/}
          </div>

          {/* Botón de reset */}
          <div className="flex justify-end pt-2">
            <button
              onClick={resetFilters}
              className={`px-5 py-2.5 rounded-xl font-['Josefin'] text-sm font-medium transition-all duration-200 transform hover:scale-[0.98] active:scale-[0.96] shadow-[0_4px_14px_#00000020] ${resetBtnBg} ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// COMPONENTES DE INPUT/SUBCOMPONENTES — DISEÑO ACTUALIZADO
// ===========================================
const InputFiltroTexto = ({ label, placeholder, value, setValue, isDarkMode }) => (
  <div>
    <label className={`block text-sm mb-2 font-['Alumni'] ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl font-['Balo'] text-sm ${
        isDarkMode ? "bg-[#141717] text-white placeholder:text-gray-500" : "bg-[#f2efeb] text-black placeholder:text-gray-500"
      } focus:outline-none focus:ring-2 focus:ring-[#41bfb2] dark:focus:ring-[#2C7366] transition`}
    />
  </div>
);

const InputFiltroNum = ({ label, value, setValue, isDarkMode }) => (
  <div>
    <label className={`block text-sm mb-2 font-['Alumni'] ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl font-['Balo'] text-sm ${
        isDarkMode ? "bg-[#141717] text-white placeholder:text-gray-500" : "bg-[#f2efeb] text-black placeholder:text-gray-500"
      } focus:outline-none focus:ring-2 focus:ring-[#41bfb2] dark:focus:ring-[#2C7366] transition`}
    />
  </div>
);

const InputFiltroFecha = ({ label, type = "date", value, setValue, isDarkMode }) => (
  <div>
    <label className={`block text-sm mb-2 font-['Alumni'] ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl font-['Balo'] text-sm ${
        isDarkMode ? "bg-[#141717] text-white" : "bg-[#f2efeb] text-black"
      } focus:outline-none focus:ring-2 focus:ring-[#41bfb2] dark:focus:ring-[#2C7366] transition`}
    />
  </div>
);

const SelectFiltro = ({ label, value, setValue, options, isDarkMode }) => (
  <div>
    <label className={`block text-sm mb-2 font-['Alumni'] ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl font-['Balo'] text-sm appearance-none ${
        isDarkMode ? "bg-[#141717] text-white" : "bg-[#f2efeb] text-black"
      } focus:outline-none focus:ring-2 focus:ring-[#41bfb2] dark:focus:ring-[#2C7366] transition`}
    >
      {options.map(([val, text]) => (
        <option key={val} value={val} className="font-['Balo']">
          {text}
        </option>
      ))}
    </select>
  </div>
);

// =============== DEBOUNCE (NO TOCADO) =================
function useDebounce(value, delay) {
  const [debouncedValue, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default FiltrosCanchas;