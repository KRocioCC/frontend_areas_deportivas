// src/Reserva/components/CalendarSelector.jsx
import Calendar from "react-calendar";
//import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./CalendarSelector.css";

export default function CalendarSelector({ fecha, onChange }) {
  // Console log para ver la fecha seleccionada
  console.log("CalendarSelector - Fecha actual:", fecha ? format(fecha, "yyyy-MM-dd") : "No seleccionada");

  return (
    <div
      className="bg-p-6 p-4 rounded-2xl shadow-lg border border-p-6"
      style={{
        fontFamily: "var(--font-Balo)",
        maxWidth: "560px", 
        margin: "0 auto",
      }}
    >

      <div className="calendar-wrapper">
        <Calendar
          onChange={(date) => {
            console.log("Fecha seleccionada en calendario:", format(date, "yyyy-MM-dd"));
            onChange(date);
          }}
          value={fecha}
          minDate={new Date()}
          locale="es"
          className="custom-calendar-large"
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
            format(date, "MMMM yyyy", { locale: es }).replace(/^\w/, (c) => c.toUpperCase())
          }
        />
      </div>

      {/* Leyenda mínima */}
      <div className="mt-5 flex justify-center gap-6 text-tm" style={{ fontFamily: "var(--font-josefin)" }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-p-1)" }}></div>
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-3 border-p-6 bg-b-2"></div>
          <span>Seleccionada</span>
        </div>
      </div>
    </div>
  );
}