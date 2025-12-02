import { DateFilterType } from "@/providers/filters-context";
import { FilterFn } from "@tanstack/react-table";
import { es } from "date-fns/locale";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, isSameDay, isWithinInterval } from "date-fns";
import { capitalize } from "remeda";
import { DATE_FILTER_MAP } from "@/constants";

/**
 * Verifica si una transacción coincide con un filtro de fecha.
 * 
 * @param {number} createdAt - Timestamp de creación de la transacción
 * @param {DateFilterType} filterValue - Tipo de filtro de fecha ('today', 'thisWeek', 'thisMonth', o null)
 * @returns {boolean} `true` si la transacción coincide con el filtro, `false` en caso contrario
 * 
 * @example
 * ```ts
 * matchesDateFilter(1640995200000, 'today') // true si es hoy
 * matchesDateFilter(1640995200000, 'thisWeek') // true si es esta semana
 * ```
 */
export const matchesDateFilter = (createdAt: number, filterValue: DateFilterType): boolean => {
  if (!filterValue) return true;
  if (!createdAt) return false;

  const now = new Date();
  const today = startOfDay(now);
  const transactionDate = new Date(createdAt);

  switch (filterValue) {
    case DATE_FILTER_MAP.TODAY:
      // Comparar solo el día, sin hora
      return isSameDay(transactionDate, today);
    
    case DATE_FILTER_MAP.THIS_WEEK: {
      // Semana empieza en lunes (weekStartsOn: 1)
      const weekStart = startOfDay(startOfWeek(today, { weekStartsOn: 1 })); // Lunes a las 00:00
      // Incluir toda la semana actual hasta el final de la semana (domingo)
      const weekEnd = endOfDay(endOfWeek(now, { weekStartsOn: 1 })); // Domingo hasta las 23:59:59.999
      return isWithinInterval(transactionDate, { 
        start: weekStart, 
        end: weekEnd 
      });
    }
    
    case DATE_FILTER_MAP.THIS_MONTH: {
      const monthStart = startOfDay(startOfMonth(today)); // Primer día del mes a las 00:00
      // Incluir todo el mes actual hasta el final del mes
      const monthEnd = endOfDay(endOfMonth(now)); // Último día del mes hasta las 23:59:59.999
      return isWithinInterval(transactionDate, { 
        start: monthStart, 
        end: monthEnd 
      });
    }
    
    default:
      return true;
  }
};

/**
 * Función de filtro para la columna de fecha en react-table.
 * 
 * Utilizada en `columnFilters` para filtrar filas por fecha.
 * 
 * @param {Row} row - Fila de la tabla
 * @param {string} _columnId - ID de la columna (no usado)
 * @param {DateFilterType} filterValue - Valor del filtro de fecha
 * @returns {boolean} `true` si la fila pasa el filtro
 */
export const dateColumnFilterFn: FilterFn<any> = (row, _columnId, filterValue: DateFilterType) => {
  return matchesDateFilter(row.original.createdAt, filterValue);
};

/**
 * Función de filtro global que combina búsqueda de texto y filtro de fecha.
 * 
 * Aplica ambos filtros con lógica AND: la fila debe pasar ambos filtros para ser mostrada.
 * 
 * @param {Row} row - Fila de la tabla
 * @param {string} columnId - ID de la columna (no usado en este caso)
 * @param {Object} filterValue - Objeto con `globalFilter` (string) y `dateFilter` (DateFilterType)
 * @returns {boolean} `true` si la fila pasa ambos filtros
 * 
 * @example
 * ```ts
 * // Filtra por fecha "today" Y texto "pago"
 * customGlobalFilterFn(row, '', { globalFilter: 'pago', dateFilter: 'today' })
 * ```
 */
export const customGlobalFilterFn: FilterFn<any> = (row, columnId, filterValue: { globalFilter: string; dateFilter: DateFilterType }) => {
  const { globalFilter, dateFilter } = filterValue;
  
  // Apply date filter using the helper function
  if (dateFilter) {
    if (!matchesDateFilter(row.original.createdAt, dateFilter)) {
      return false;
    }
  }
  
  // Apply global filter (text search)
  if (globalFilter) {
    const searchValue = globalFilter.toLowerCase();
    const rowValues = Object.values(row.original).join(' ').toLowerCase();
    return rowValues.includes(searchValue);
  }
  
  return true;
};


/**
 * Formatea la fecha de hoy en español.
 * 
 * @returns {string} Fecha formateada como "d 'de' MMMM 'de' yyyy" (ej: "15 de enero de 2024")
 */
export const formatToday = () => {
  return format(startOfDay(new Date()), "d 'de' MMMM 'de' yyyy", { locale: es });
};

/**
 * Formatea el rango de la semana actual (lunes a hoy) en español.
 * 
 * Si hoy es lunes, retorna solo la fecha de hoy.
 * Si no, retorna el rango "d a [fecha de hoy]".
 * 
 * @returns {string} Rango formateado (ej: "15 a 20 de enero de 2024")
 */
export const formatWeekRange = () => {
  const today = startOfDay(new Date());
  const monday = startOfDay(startOfWeek(today, { weekStartsOn: 1 }));
  
  // Si hoy es lunes, mostrar solo la fecha de hoy
  if (isSameDay(monday, today)) {
    return formatToday();
  }
  
  const mondayDay = format(monday, "d", { locale: es });
  const todayFormatted = formatToday();
  return `${mondayDay} a ${todayFormatted}`;
};

/**
 * Formatea el mes y año actual en español con primera letra mayúscula.
 * 
 * @returns {string} Mes y año formateado (ej: "Enero, 2024")
 */
export const formatMonthYear = () => {
  return capitalize(format(new Date(), "MMMM, yyyy", { locale: es }));
};