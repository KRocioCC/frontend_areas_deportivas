import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import intro from 'intro.js';
import { useAuth } from '../../auth/hooks/useAuth';
import { getAreadeportivaPorAdminId } from '../../api/AreadeportivaApi';

/**
 * AdminIntroTour
 * - Cross-page guided tour for first-time admin users using Intro.js
 * - Persists progress in localStorage under key 'adminTourStatus'
 *   { done: boolean, stage: 'start'|'mi-area'|'canchas'|'reservas', ts: number }
 */
export default function AdminIntroTour() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const storageKey = 'adminTourStatus';

  const readStatus = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : { done: false, stage: 'start', ts: Date.now() };
    } catch {
      return { done: false, stage: 'start', ts: Date.now() };
    }
  };

  // Helper to check if an element exists in DOM
  const exists = (sel) => !!document.querySelector(sel);

  useEffect(() => {
    // Ref global para instancia única y evitar tooltips superpuestos
    const introRef = (window.__adminIntroRef ||= { instance: null });
    // Solo continuar si hay usuario logueado (admin)
    if (!currentUser) return;

    const status = readStatus();
    // Don't re-run if finished
    if (status.done) return;

    // Stage machine (Sidebar-first overview)
    const path = location.pathname;

    // Función utilitaria para iniciar tours asegurando destrucción previa
    const startSingleTour = ({ steps, doneLabel, navigateTo, nextStage, skipLabel = 'X', onCompleteExtra, onExitExtra }) => {
      if (!Array.isArray(steps) || steps.length === 0) return;
      // Cerrar instancia previa si existe
      if (introRef.instance) {
        try { introRef.instance.exit(); } catch { /* noop */ }
      }
      const inst = intro();
      inst.setOptions({
        steps,
        nextLabel: 'Siguiente',
        prevLabel: 'Atrás',
        doneLabel,
        skipLabel,
        showProgress: true,
        showBullets: false,
        tooltipClass: 'customIntroTooltip',
        highlightClass: 'customIntroHighlight'
      });
      inst.oncomplete(() => {
        localStorage.setItem(storageKey, JSON.stringify({ ...status, stage: nextStage, ts: Date.now() }));
        if (navigateTo) navigate(navigateTo);
        if (onCompleteExtra) onCompleteExtra();
      });
      inst.onexit(() => {
        localStorage.setItem(storageKey, JSON.stringify({ ...status, stage: nextStage, ts: Date.now() }));
        if (navigateTo) navigate(navigateTo);
        if (onExitExtra) onExitExtra();
      });
      introRef.instance = inst;
      inst.start();
    };

    // Exponer un iniciador global para comenzar el tour sin recargar
    const startStartTour = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ done: false, stage: 'start', ts: Date.now() }));
      } catch { /* noop */ }
      startSingleTour({
        steps: [
          { element: '#tour-menu-mi-area', intro: ' <strong> 1: Empieza en Mi Área: PRIMERO debes crear tu área deportiva para continuar.</strong>' },
          { element: '#tour-menu-canchas', intro: '<strong>2: PRESIONA AQUI para crear y ver tus Canchas</strong>.' },
          { element: '#tour-menu-disciplinas', intro: '<strong>3: En Disciplinas puedes crear las disciplinas que se parctican en tu area deportiva, LUEGO PODRAS ASIGNARLAS A CANCHAS</strong>' },
          { element: '#tour-menu-reservas', intro: '<strong>4: En Reservas gestionas podras visualizar Reservas y Cancelaciones</strong>.' },
          { element: '#tour-menu-transacciones', intro: '<strong>5: En Transacciones podras ver los pagos y de las reservas</strong> ' },
          { element: '#tour-menu-calendario', intro: '<strong>6: El Calendario te da una vista por fecha de las reservas.</strong> ' }
        ],
        doneLabel: 'Ir a Mi Área',
        navigateTo: '/admin/mi_area',
        nextStage: 'mi-area'
      });
    };
    window.__adminStartTour = startStartTour;
    const onForceCheck = () => startStartTour();
    window.addEventListener('adminTourForceCheck', onForceCheck);

    if (status.stage === 'start') {
      // Solo auto-iniciar si el administrador NO tiene área deportiva creada.
      if (!window.__adminTourAreaCheck) {
        window.__adminTourAreaCheck = true;
        (async () => {
          try {
            const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
            if (area && area.idAreadeportiva) {
              // Tiene área: no iniciar tour automáticamente, marcar como done para evitar loops
              localStorage.setItem(storageKey, JSON.stringify({ ...status, done: true, stage: 'done', ts: Date.now() }));
              return;
            }
            // No tiene área: iniciar tour
            startSingleTour({
              steps: [
                { element: '#tour-menu-mi-area', intro: ' <strong> PRIMERO debes crear tu área deportiva para continuar.</strong>' },
                { element: '#tour-menu-canchas', intro: '<strong> En Canchas esta toda la gestion, crea, edita, asigna, ve reservas por cancha y desactiva</strong>.' },
                { element: '#tour-menu-disciplinas', intro: '<strong>En Disciplinas puedes crear las disciplinas que se practican en tu area deportiva, luego podras asignarlas a canchas.</strong>' },
                { element: '#tour-menu-reservas', intro: '<strong> En Reservas podras visualizar informacion de Reservas  y Cancelaciones</strong>.' },
                { element: '#tour-menu-transacciones', intro: '<strong>En Transacciones podras ver los pagos de las reservas</strong> ' },
                { element: '#tour-menu-calendario', intro: '<strong>6TO: El Calendario te da una vista por fecha de las reservas programadas por clientes.</strong> ' }
              ],
              doneLabel: 'Ir a Mi Área',
              navigateTo: '/admin/mi_area',
              nextStage: 'mi-area'
            });
          } catch (e) {
            // En caso de error al consultar área, igual iniciar tour para ayudar al usuario
            startSingleTour({
              steps: [
                { element: '#tour-menu-mi-area', intro: ' <strong> PRIMERO debes crear tu área deportiva para continuar.</strong>' },
                { element: '#tour-menu-canchas', intro: '<strong> En Canchas esta toda la gestion, crea, edita, asigna, ve reservas por cancha y desactiva</strong>.' },
                { element: '#tour-menu-disciplinas', intro: '<strong>En Disciplinas puedes crear las disciplinas que se practican en tu area deportiva, luego podras asignarlas a canchas.</strong>' },
                { element: '#tour-menu-reservas', intro: '<strong> En Reservas podras visualizar informacion de Reservas  y Cancelaciones</strong>.' },
                { element: '#tour-menu-transacciones', intro: '<strong>En Transacciones podras ver los pagos de las reservas</strong> ' },
                { element: '#tour-menu-calendario', intro: '<strong>6TO: El Calendario te da una vista por fecha de las reservas programadas por clientes.</strong> ' }
              ],
              doneLabel: 'Ir a Mi Área',
              navigateTo: '/admin/mi_area',
              nextStage: 'mi-area'
            });
          }
        })();
      }
      return;
    }

    // Mi Área page tour
    if (status.stage === 'mi-area' && path === '/admin/mi_area') {
      const steps = [
        exists('#mi-area-edit') && { element: '#mi-area-edit', intro: 'Haz clic en <strong>Editar Área</strong> para completar la información.' },
        exists('#mi-area-form') && { element: '#mi-area-form', intro: 'Llena los campos (nombre, contacto, zona) y guarda.' }
      ].filter(Boolean);

      if (steps.length) {
        startSingleTour({
          steps,
          doneLabel: 'Lista el área',
          nextStage: 'wait-area-creation'
        });
      }
      return;
    }

    // Esperar a que el usuario cree su área antes de continuar
    if (status.stage === 'wait-area-creation' && path === '/admin/mi_area') {
      // No hacer nada, solo esperar que el admin complete su área
      // Cuando navegue a otra página (ej: Canchas), avanzar el tour
      return;
    }

    // Si el usuario ya completó Mi Área y navega a Canchas, continuar el tour
    if (status.stage === 'wait-area-creation' && path === '/admin/canchas_admin') {
      localStorage.setItem(storageKey, JSON.stringify({ ...status, stage: 'canchas', ts: Date.now() }));
      // No return, dejar que continúe al siguiente if
    }

    // Canchas page tour
    if (status.stage === 'canchas' && path === '/admin/canchas_admin') {
      // Pequeño delay para asegurar que la página cargó completamente
      const timer = setTimeout(() => {
        const hasCrear = exists('#btn-abrir-wizard-crear-cancha');
        const hasCtaPrimer = exists('#cta-primer-cancha');
        const hasVerReservas = exists('.tour-btn-ver-reservas');

        const steps = [
          { intro: 'Listo, ahora <strong>crea las canchas</strong> de tu área deportiva.' },
          (hasCrear || hasCtaPrimer) && { 
            element: hasCtaPrimer ? '#cta-primer-cancha' : '#btn-abrir-wizard-crear-cancha', 
            intro: 'Haz clic aquí para <strong>crear tu primera cancha</strong>.<br><br>Necesitarás completar información como:<br>• Nombre de la cancha<br>• Tipo de superficie<br>• Capacidad<br>• Costo por hora<br>• Horarios disponibles' 
          },
          hasVerReservas && { 
            element: '.tour-btn-ver-reservas', 
            intro: 'Una vez que tengas canchas creadas, desde este botón <strong>"Ver Reservas"</strong> podrás gestionar todas las reservas de cada cancha.<br><br>Aquí verás quién reservó, a qué hora, y podrás administrar las reservas.' 
          }
        ].filter(Boolean);

        if (steps.length) {
          startSingleTour({
            steps,
            doneLabel: 'Ir a Disciplinas',
            nextStage: 'disciplinas',
            navigateTo: '/admin/disciplinas'
          });
        } else {
          localStorage.setItem(storageKey, JSON.stringify({ ...status, stage: 'disciplinas', ts: Date.now() }));
          navigate('/admin/disciplinas');
        }
      }, 800); // Delay de 800ms para que la página se renderice completamente

      return () => clearTimeout(timer);
    }

    // Disciplinas page tour
    if (status.stage === 'disciplinas' && path === '/admin/disciplinas') {
      const steps = [
        { intro: 'Ahora define las <strong>Disciplinas</strong> que se pueden practicar en tus canchas.' },
        { intro: 'Luego podrás asignarlas a cada cancha para gestionar reservas por disciplina.' },
        { element: '#tour-menu-reservas', intro: 'Sigamos al módulo de <strong>Reservas</strong>.' }
      ];

      startSingleTour({
        steps,
        doneLabel: 'Ir a Reservas',
        nextStage: 'reservas',
        navigateTo: '/admin/reservaslist'
      });
      return;
    }

    // Reservas page tour
    if (status.stage === 'reservas' && (path === '/admin/reservaslist' || path.startsWith('/admin/reservas'))) {
      // Abrir dropdown Reservas si está cerrado para asegurar visibilidad de subitems
      const reservasHeader = document.getElementById('tour-menu-reservas');
      const cancelacionesItem = document.getElementById('tour-sub-cancelaciones');
      const todasReservasItem = document.getElementById('tour-sub-reservas-todas');
      if (reservasHeader && (!cancelacionesItem || !todasReservasItem)) {
        reservasHeader.click();
      }

      // Reconstruir después de posible click
      const steps = [
        { intro: 'Módulo <strong>Reservas</strong>: aquí gestionas pendientes y confirmadas.' },
        cancelacionesItem && { element: '#tour-sub-cancelaciones', intro: 'En <strong>Cancelaciones</strong> revisas reservas anuladas y motivos.' },
        todasReservasItem && { element: '#tour-sub-reservas-todas', intro: 'En <strong>Todas las Reservas</strong> ves el listado completo para control global.' },
        { element: '#tour-menu-transacciones', intro: 'Continuemos al módulo de <strong>Pagos</strong>.' }
      ].filter(Boolean);

      startSingleTour({
        steps,
        doneLabel: 'Ir a Pagos',
        nextStage: 'pagos',
        navigateTo: '/admin/pagos'
      });
      return;
    }

    // Pagos page tour
    if (status.stage === 'pagos' && path === '/admin/pagos') {
      const steps = [
        { intro: 'Aquí se muestran los <strong>Pagos</strong> y el control de transacciones.' },
        { element: '#tour-menu-calendario', intro: 'Por último, veamos el <strong>Calendario</strong>.' }
      ];

      startSingleTour({
        steps,
        doneLabel: 'Ir a Calendario',
        nextStage: 'calendario',
        navigateTo: '/admin/calendario'
      });
      return;
    }

    // Calendario page tour -> luego Gestión Usuarios
    if (status.stage === 'calendario' && path === '/admin/calendario') {
      const steps = [
        { intro: 'Aquí tienes una vista <strong>visual</strong> por fecha de las reservas.' },
        { element: '#tour-menu-usuarios', intro: 'Sigamos a <strong>Gestión Usuarios</strong> para ver usuarios del sistema.' }
      ];

      startSingleTour({
        steps,
        doneLabel: 'Ir a Usuarios',
        nextStage: 'usuarios-control',
        navigateTo: '/admin/usuarios-control'
      });
      return;
    }

    // Usuarios Control page tour
    if (status.stage === 'usuarios-control' && path === '/admin/usuarios-control') {
      // asegurar que el dropdown esté abierto para mostrar subitems
      const header = document.getElementById('tour-menu-usuarios');
      if (header) {
        const dropdownMenuAlreadyVisible = !!document.getElementById('tour-sub-usuarios-control');
        if (!dropdownMenuAlreadyVisible) {
          header.click();
        }
      }
      const steps = [
        { element: '#tour-menu-usuarios', intro: 'Este es el módulo de <strong>Gestión Usuarios</strong>.' },
        { element: '#tour-sub-usuarios-control', intro: 'Aquí gestionas los <strong>Usuarios Control</strong> relacionados a tu administración.' },
        { element: '#tour-sub-clientes', intro: 'Veamos también los <strong>Clientes</strong> que realizan reservas.' }
      ];
      startSingleTour({
        steps,
        doneLabel: 'Ir a Clientes',
        nextStage: 'clientes',
        navigateTo: '/admin/clientes'
      });
      return;
    }

    // Clientes page tour (final)
    if (status.stage === 'clientes' && path === '/admin/usuarios/clientes') {
      const steps = [
        { intro: 'Aquí puedes visualizar y gestionar los <strong>Clientes</strong> que realizan reservas en tus canchas.' },
        { intro: 'Con esto terminas el recorrido completo. ¡Buen trabajo! 🎉' }
      ];
      startSingleTour({
        steps,
        doneLabel: 'Finalizar',
        nextStage: 'done'
      });
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentUser]);

  // Limpieza global (cuando el componente se desmonte por cambio de layout)
  useEffect(() => {
    return () => {
      try {
        window.removeEventListener('adminTourForceCheck', window.__adminStartTour);
      } catch { /* noop */ }
    };
  }, []);

  return null;
}
