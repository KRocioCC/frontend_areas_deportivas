import { useState, useRef, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import { Modal } from "./components/ui/modal";
import { useModal } from "./hooks/useModal";
import PageMeta from "./components/common/PageMeta";
import { getReservasPorAdministradorEnRango } from "../../../api/ReservaApi";
import { AuthContext } from "../../../auth/context/AuthContext";
import "./calendar.css";


const Calendar = () => {
  const { currentUser } = useContext(AuthContext);
  const idAdministrador = currentUser?.id;

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  // reservas del backend
  useEffect(() => {
    const fetchReservas = async () => {
      if (!idAdministrador) return;

      try {
        const inicio = new Date().toISOString().split("T")[0]; // hoy
        const fin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 días
          .toISOString()
          .split("T")[0];

        const data = await getReservasPorAdministradorEnRango(
          idAdministrador,
          inicio,
          fin
        );

        const mappedEvents = data.map((reserva) => ({
          id: reserva.idReserva.toString(),
          title: `${reserva.cliente?.nombre || "Cliente"} - ${
            reserva.cancha?.nombre || ""
          }`,
          start: `${reserva.fechaReserva}T${reserva.horaInicio}`,
          end: `${reserva.fechaReserva}T${reserva.horaFin}`,
          backgroundColor: "#F28627", // color naranja
            textColor: "#fff",          // 
          extendedProps: {
            estado: reserva.estadoReserva,
            observaciones: reserva.observaciones,
            cliente: reserva.cliente,
            cancha: reserva.cancha,
            disciplina: reserva.disciplina,
            horaInicio: reserva.horaInicio,  
            horaFin: reserva.horaFin          
          },
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      }
    };

    fetchReservas();
  }, [idAdministrador]);

  const handleDateSelect = (selectInfo) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

const handleEventClick = (clickInfo) => {
  const calendarEvent = clickInfo.event; 
  setSelectedEvent({
    ...calendarEvent.extendedProps,
    start: calendarEvent.start,
    end: calendarEvent.end,
  });
  openModal();
};


  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      const newEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta
        title="Calendario de Reservas | Panel Administrador"
        description="Calendario con reservas del administrador en sus canchas"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-12">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[esLocale]}
            locale="es"
            headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            />

        </div>
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[700px] p-6 lg:p-10"
            >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                    Detalles de la Reserva
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Información completa de la reserva seleccionada
                </p>
                </div>

                {selectedEvent && (
                <div className="mt-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Cliente:</strong> {selectedEvent.cliente?.nombre} {selectedEvent.cliente?.apaterno} {selectedEvent.cliente?.amaterno}</p>
                    <p><strong>Email:</strong> {selectedEvent.cliente?.email}</p>
                    <p><strong>Teléfono:</strong> {selectedEvent.cliente?.telefono}</p>
                    <p><strong>Cancha:</strong> {selectedEvent.cancha?.nombre}</p>
                    <p><strong>Disciplina:</strong> {selectedEvent.disciplina?.nombre}</p>
                    <p><strong>Hora:</strong> {selectedEvent?.start?.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })} - {selectedEvent?.end?.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p><strong>Hora:</strong> {selectedEvent.horaInicio?.slice(0,5)} - {selectedEvent.horaFin?.slice(0,5)}</p>
                    <p><strong>Estado:</strong> {selectedEvent.estado}</p>
                    <p><strong>Observaciones:</strong> {selectedEvent.observaciones || "Sin observaciones"}</p>
                </div>
                )}

                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                <button
                    onClick={closeModal}
                    type="button"
                    className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
                >
                    Cerrar
                </button>
                </div>
            </div>
            </Modal>

      </div>
    </>
  );
};
const renderEventContent = (eventInfo) => {
  const { cliente, cancha, horaInicio, horaFin, estado } = eventInfo.event.extendedProps;

  const nombreCompleto = `${cliente?.nombre || ""} ${cliente?.apaterno || ""} `.trim();

  const estadoColorMap = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    CONFIRMADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };

  const colorClass = estadoColorMap[estado] || "bg-orange-100";
  return (
    <div className={`px-2 py-1 rounded shadow-sm ${colorClass} text-black`}>
      <div className="font-semibold text-sm">Cliente: {nombreCompleto}</div>
      <div className="text-xs">
        {horaInicio?.slice(0, 5)} - {horaFin?.slice(0, 5)}
      </div>
      <div className="text-xs italic">Cancha: {cancha?.nombre}</div>
    </div>
  );
};



export default Calendar;
