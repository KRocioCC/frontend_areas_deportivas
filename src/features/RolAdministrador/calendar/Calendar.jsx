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
import ReservaCardCalendar from "./ReservaCardCalendar"; 

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

        const mappedEvents = data.map((reserva) => {
          // Determinar color según estado
          let bgColor = "#2596be"; // color por defecto
          
          if (reserva.estadoReserva === "CONFIRMADA") {
            bgColor = "#45bfb5"; // turquesa para confirmadas
          } else if (reserva.estadoReserva === "PENDIENTE") {
            bgColor = "#FF9800"; // naranja para pendientes
          } else if (reserva.estadoReserva === "CANCELADA") {
            bgColor = "#f44336"; // rojo para canceladas
          }

          return {
            id: reserva.idReserva.toString(),
            title: `${reserva.cliente?.nombre || "Cliente"} - ${
              reserva.cancha?.nombre || ""
            }`,
            start: `${reserva.fechaReserva}T${reserva.horaInicio}`,
            end: `${reserva.fechaReserva}T${reserva.horaFin}`,
            backgroundColor: bgColor,
            textColor: "#000000",
            borderColor: bgColor,
            extendedProps: {
              estado: reserva.estadoReserva,
              observaciones: reserva.observaciones,
              cliente: reserva.cliente,
              cancha: reserva.cancha,
              disciplina: reserva.disciplina,
              horaInicio: reserva.horaInicio,  
              horaFin: reserva.horaFin          
            },
          };
        });

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
            height="auto"
            contentHeight="750px"
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
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
        {isOpen && selectedEvent && (
  <ReservaCardCalendar
    reserva={{
      idReserva: selectedEvent.idReserva || parseInt(selectedEvent.id),
      fechaReserva: selectedEvent.fechaReserva || selectedEvent.start?.toISOString().split('T')[0],
      horaInicio: selectedEvent.horaInicio || selectedEvent.extendedProps?.horaInicio,
      horaFin: selectedEvent.horaFin || selectedEvent.extendedProps?.horaFin,
      estadoReserva: selectedEvent.estado || selectedEvent.extendedProps?.estadoReserva,
      observaciones: selectedEvent.observaciones || selectedEvent.extendedProps?.observaciones,
      totalPagado: selectedEvent.totalPagado || selectedEvent.extendedProps?.totalPagado,
      saldoPendiente: selectedEvent.saldoPendiente || selectedEvent.extendedProps?.saldoPendiente,
      pagadaCompleta: selectedEvent.pagadaCompleta || selectedEvent.extendedProps?.pagadaCompleta,
      duracionMinutos: selectedEvent.duracionMinutos || selectedEvent.extendedProps?.duracionMinutos,
      eliminado: selectedEvent.eliminado || selectedEvent.extendedProps?.eliminado,
      activo: selectedEvent.activo !== undefined ? selectedEvent.activo : selectedEvent.extendedProps?.activo,
      cliente: selectedEvent.cliente || selectedEvent.extendedProps?.cliente,
      cancha: selectedEvent.cancha || selectedEvent.extendedProps?.cancha,
      disciplina: selectedEvent.disciplina || selectedEvent.extendedProps?.disciplina
    }}
    onClose={closeModal}
    onCancelarReserva={(reserva) => {
      console.log('Cancelar reserva:', reserva.idReserva);
      // Aquí va tu lógica para cancelar la reserva
    }}
    onGenerarPDF={(reserva) => {
      console.log('Generar PDF para:', reserva.idReserva);
      // Aquí va tu lógica para generar PDF
    }}
  />
)}

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
