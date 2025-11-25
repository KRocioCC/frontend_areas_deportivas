// src/Reserva/components/CalendarSelector.jsx
import Calendar from "react-calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "../../../../context/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CalendarSelector.css";

export default function CalendarSelector({ fecha, onChange }) {
  const { isDarkMode } = useTheme();

  // Colores dinámicos
  const bgColor = isDarkMode ? '#1a1d1e' : '#ffffff';
  const textColor = isDarkMode ? '#e2e8f0' : '#1f2937';
  const secondaryText = isDarkMode ? '#a0aec0' : '#6b7280';
  const todayColor = isDarkMode ? '#f35734' : '#f28627'; // tu color secundario
  const selectedColor = isDarkMode ? '#2C7366' : '#41bfb2'; // tu color principal
  const saturdayColor = isDarkMode ? '#8a2628' : '#d61727'; // rojo para sábados

  return (
    <div
      className="p-5 rounded-xl shadow-sm border transition-colors duration-300 mx-auto max-w-[560px]"
      style={{
        fontFamily: "var(--font-Balo)",
        backgroundColor: bgColor,
        borderColor: isDarkMode ? '#2d3748' : '#e5e7eb',
      }}
    >
      <div className="calendar-wrapper">
        <Calendar
          onChange={(date) => onChange(date)}
          value={fecha}
          minDate={new Date()}
          locale="es"
          className={`custom-calendar-large ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
          weekStartsOn={1}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = fecha && date.toDateString() === fecha.toDateString();
            let classes = "tile-large";
            if (isToday) classes += " today-large";
            if (isSelected) classes += " selected-large";
            if (date.getDay() === 6) classes += " saturday";
            return classes;
          }}
          formatShortWeekday={(locale, date) =>
            ["L", "M", "M", "J", "V", "S", "D"][(date.getDay() + 6) % 7]
          }
          next2Label={null}
          prev2Label={null}
          navigationLabel={({ date }) =>
            format(date, "MMMM yyyy", { locale: es }).replace(/^\w/, c => c.toUpperCase())
          }
          nextLabel={<ChevronRight size={20} />}
          prevLabel={<ChevronLeft size={20} />}
        />
      </div>

      {/* Leyenda */}
      <div className="mt-5 flex justify-center gap-6" style={{ fontFamily: "var(--font-josefin)" }}>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: todayColor }}
          ></div>
          <span style={{ color: secondaryText, fontSize: '0.875rem' }}>Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ 
              backgroundColor: selectedColor,
              boxShadow: '0 0 0 2px ' + (isDarkMode ? '#1a202c' : '#f2efeb')
            }}
          ></div>
          <span style={{ color: secondaryText, fontSize: '0.875rem' }}>Seleccionada</span>
        </div>
      </div>
    </div>
  );
}