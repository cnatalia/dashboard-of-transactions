'use client';

import { DATE_FILTER_MAP } from "@/constants";
import { DateFilterType, useFilters } from "@/providers/filters-context";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { capitalize } from "remeda";

/**
 * Componente de tabs para filtrar transacciones por fecha.
 * 
 * Características:
 * - Tres opciones: "Hoy", "Esta semana", "Este mes" (mes actual dinámico)
 * - Comportamiento OR: solo un tab puede estar activo a la vez
 * - Toggle: click en el tab activo lo deselecciona
 * - Sincroniza con `FiltersContext` automáticamente
 * - Accesible: `role="tablist"`, `role="tab"`, `aria-selected`
 * 
 * El mes actual se muestra dinámicamente en español con primera letra mayúscula.
 * 
 * @returns {JSX.Element} Componente de tabs para filtros de fecha
 * 
 * @example
 * ```tsx
 * <TabsFilter />
 * // Al hacer click en "Hoy", actualiza dateFilter en el contexto
 * ```
 */
export default function TabsFilter() {
  const { dateFilter, setDateFilter } = useFilters();

  // Obtener el nombre del mes actual en español
  const currentMonthName = format(new Date(), 'MMMM', { locale: es });

  const handleTabClick = (filterType: DateFilterType) => {
    setDateFilter(dateFilter === filterType ? null : filterType);
  };

  return (
    <div 
      className='flex items-center gap-2 text-md font-montserrat bg-white rounded-lg p-2 w-full text-boldBlue'
      role="tablist"
      aria-label="Filtros de fecha"
    >
      <button
        role="tab"
        aria-selected={dateFilter === DATE_FILTER_MAP.TODAY}
        aria-controls="transactions-table"
        className={`rounded-3xl w-full cursor-pointer hover:bg-boldGrayLight ${
          dateFilter === DATE_FILTER_MAP.TODAY ? 'bg-boldGrayLight' : 'bg-white'
        }`}
        onClick={() => handleTabClick(DATE_FILTER_MAP.TODAY)}
      >
        Hoy
      </button>
      <button
        role="tab"
        aria-selected={dateFilter === DATE_FILTER_MAP.THIS_WEEK}
        aria-controls="transactions-table"
        className={`rounded-3xl w-full cursor-pointer hover:bg-boldGrayLight ${
          dateFilter === DATE_FILTER_MAP.THIS_WEEK ? 'bg-boldGrayLight' : 'bg-white'
        }`}
        onClick={() => handleTabClick(DATE_FILTER_MAP.THIS_WEEK)}
      >
        Esta semana
      </button>
      <button
        role="tab"
        aria-selected={dateFilter === DATE_FILTER_MAP.THIS_MONTH}
        aria-controls="transactions-table"
        className={`rounded-3xl w-full cursor-pointer hover:bg-boldGrayLight ${
          dateFilter === DATE_FILTER_MAP.THIS_MONTH ? 'bg-boldGrayLight' : 'bg-white'
        }`}
        onClick={() => handleTabClick(DATE_FILTER_MAP.THIS_MONTH)}
      >
        {capitalize(currentMonthName.toLowerCase())}
      </button>
    </div>
  );
}