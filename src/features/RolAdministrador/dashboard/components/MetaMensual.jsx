import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Dropdown } from './ui/dropdown/Dropdown';
import { DropdownItem } from './ui/dropdown/DropdownItem';
import { MoreDotIcon } from '../icons';
import { getReservasPorRangoFechas } from '../../../../api/ReservaApi';
// import { calcularIngresos } from '../../../api/ReservaApi'; // ← Descomenta cuando actives el endpoint

const MetaMensual = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reservasMes, setReservasMes] = useState(0);
  const metaReservas = 20;

  // const [ingresosMes, setIngresosMes] = useState(0);
  // const metaIngresos = 20000;

  useEffect(() => {
    async function fetchReservasDelMes() {
      try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        const formato = (fecha) => fecha.toISOString().split('T')[0];
        const reservas = await getReservasPorRangoFechas(
          formato(inicioMes),
          formato(finMes)
        );
        setReservasMes(reservas.length);
      } catch (error) {
        console.error('Error al cargar reservas del mes:', error);
      }
    }

    fetchReservasDelMes();
  }, []);

  /*
  useEffect(() => {
    async function fetchIngresosDelMes() {
      try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        const formato = (fecha) => fecha.toISOString().split('T')[0];
        const data = await calcularIngresos(formato(inicioMes), formato(finMes));
        setIngresosMes(data.ingresos || 0);
      } catch (error) {
        console.error('Error al calcular ingresos del mes:', error);
      }
    }

    fetchIngresosDelMes();
  }, []);
  */

  const progreso = Math.min((reservasMes / metaReservas) * 100, 100).toFixed(2);
  const series = [parseFloat(progreso)];

  const options = {
    colors: ['#94ebd2'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'radialBar',
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: '80%' },
        track: {
          background: '#E4E7EC',
          strokeWidth: '100%',
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '36px',
            fontWeight: '600',
            offsetY: -40,
            color: '#1D2939',
            formatter: (val) => val + '%',
          },
        },
      },
    },
    fill: { type: 'solid', colors: ['#465FFF'] },
    stroke: { lineCap: 'round' },
    labels: ['Progreso'],
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Meta Mensual
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Reservas acumuladas este mes
            </p>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 w-6 h-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onItemClick={closeDropdown}>Ver más</DropdownItem>
              <DropdownItem onItemClick={closeDropdown}>Eliminar</DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
            {reservasMes} / {metaReservas}
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Has alcanzado el {progreso}% de tu meta mensual de reservas.
        </p>
      </div>
    </div>
  );
};

export default MetaMensual;
