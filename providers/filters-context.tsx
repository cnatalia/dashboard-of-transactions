'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DATE_FILTER_MAP, SALES_TYPE_FILTER } from '@/constants';

export type DateFilterType = DATE_FILTER_MAP | null;
export type SalesTypeFilter = SALES_TYPE_FILTER;

interface FiltersContextType {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  dateFilter: DateFilterType;
  setDateFilter: (value: DateFilterType) => void;
  salesTypeFilters: SalesTypeFilter[];
  setSalesTypeFilters: (value: SalesTypeFilter[]) => void;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

/**
 * Provider de Context API para gestión global de filtros.
 * 
 * Maneja el estado de:
 * - `globalFilter`: Búsqueda de texto global
 * - `dateFilter`: Filtro de fecha (today, thisWeek, thisMonth)
 * - `salesTypeFilters`: Filtros de tipo de venta (array)
 * 
 * Sincroniza automáticamente los filtros con los parámetros de la URL:
 * - `?search=texto` → `globalFilter`
 * - `?date=today` → `dateFilter`
 * - `?salesTypes=PAYMENT_LINK,TERMINAL` → `salesTypeFilters`
 * 
 * Los filtros se persisten en la URL sin usar `useEffect`, actualizando directamente
 * cuando se cambian mediante los setters.
 * 
 * @param {ReactNode} children - Componentes hijos que tendrán acceso al contexto
 * 
 * @example
 * ```tsx
 * <FiltersProvider>
 *   <App />
 * </FiltersProvider>
 * ```
 */
export function FiltersProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Leer valores iniciales desde URL params
  const initialGlobalFilter = searchParams.get('search') || '';
  const initialDateFilter = (searchParams.get('date') as DateFilterType) || DATE_FILTER_MAP.TODAY;
  const initialSalesTypeFilters: SalesTypeFilter[] = (() => {
    const param = searchParams.get('salesTypes');
    if (!param) return [];
    const validValues: SalesTypeFilter[] = [SALES_TYPE_FILTER.PAYMENT_LINK, SALES_TYPE_FILTER.TERMINAL, SALES_TYPE_FILTER.ALL];
    return param.split(',').filter(v => validValues.includes(v as SalesTypeFilter)) as SalesTypeFilter[];
  })();

  const [globalFilter, setGlobalFilterState] = useState<string>(initialGlobalFilter);
  const [dateFilter, setDateFilterState] = useState<DateFilterType>(initialDateFilter);
  const [salesTypeFilters, setSalesTypeFiltersState] = useState<SalesTypeFilter[]>(initialSalesTypeFilters);

  /**
   * Actualiza los parámetros de la URL con los valores de filtros actuales.
   * 
   * Construye un nuevo URLSearchParams y reemplaza la URL sin recargar la página.
   * 
   * @param {string} newGlobalFilter - Nuevo valor de búsqueda global
   * @param {DateFilterType} newDateFilter - Nuevo filtro de fecha
   * @param {SalesTypeFilter[]} newSalesTypeFilters - Nuevos filtros de tipo de venta
   */
  const updateUrlParams = useCallback((
    newGlobalFilter: string, 
    newDateFilter: DateFilterType,
    newSalesTypeFilters: SalesTypeFilter[]
  ) => {
    const params = new URLSearchParams();
    
    if (newGlobalFilter) {
      params.set('search', newGlobalFilter);
    }
    
    if (newDateFilter) {
      params.set('date', newDateFilter);
    }
    
    if (newSalesTypeFilters.length > 0) {
      params.set('salesTypes', newSalesTypeFilters.join(','));
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router]);

  // Wrapper que actualiza estado y URL
  const setGlobalFilter = useCallback((value: string) => {
    setGlobalFilterState(value);
    updateUrlParams(value, dateFilter,  salesTypeFilters);
  }, [dateFilter,  salesTypeFilters, updateUrlParams]);

  const setDateFilter = useCallback((value: DateFilterType) => {
    setDateFilterState(value);
    updateUrlParams(globalFilter, value,  salesTypeFilters);
  }, [globalFilter, salesTypeFilters, updateUrlParams]);


  const setSalesTypeFilters = useCallback((value: SalesTypeFilter[]) => {
    setSalesTypeFiltersState(value);
    updateUrlParams(globalFilter, dateFilter,  value);
  }, [globalFilter, dateFilter, updateUrlParams]);

  return (
    <FiltersContext.Provider value={{ 
      globalFilter, 
      setGlobalFilter,
      dateFilter,
      setDateFilter,
      salesTypeFilters,
      setSalesTypeFilters,
    }}>
      {children}
    </FiltersContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto de filtros.
 * 
 * Debe ser usado dentro de un componente envuelto por `FiltersProvider`.
 * 
 * @returns {FiltersContextType} Objeto con:
 *   - `globalFilter`: Búsqueda de texto actual
 *   - `setGlobalFilter`: Setter para búsqueda global
 *   - `dateFilter`: Filtro de fecha actual
 *   - `setDateFilter`: Setter para filtro de fecha
 *   - `salesTypeFilters`: Array de filtros de tipo de venta
 *   - `setSalesTypeFilters`: Setter para filtros de tipo de venta
 * 
 * @throws {Error} Si se usa fuera de `FiltersProvider`
 * 
 * @example
 * ```tsx
 * const { globalFilter, setGlobalFilter } = useFilters();
 * <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
 * ```
 */
export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}

