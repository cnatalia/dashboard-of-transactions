"use client";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { useState, useMemo } from "react";
import {
  useFilters,
} from "@/providers/filters-context";
import { customGlobalFilterFn, dateColumnFilterFn } from "@/utils/filters";
import { SALES_TYPE_FILTER } from "@/constants";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface Props<T> {
  /** Array de datos a mostrar en la tabla */
  data: T[];
  /** Definición de columnas usando react-table ColumnDef */
  columns: ColumnDef<T, any>[];
  /** Tamaño de página para paginación (default: 10) */
  pageSize?: number;
  /** Callback opcional que se ejecuta al hacer click en una fila */
  onRowClick?: (rowData: T) => void;
}

/**
 * Componente de tabla genérica construido con @tanstack/react-table.
 * 
 * Características:
 * - Ordenamiento por columnas (click en headers)
 * - Paginación con controles personalizados
 * - Filtrado global (búsqueda de texto) y por columna (fecha, tipo de venta)
 * - Click en filas para abrir detalles
 * - Elemento de accesibilidad visual (barra lateral alternada)
 * - Scroll horizontal automático cuando el contenido excede el ancho disponible
 * - Responsive y accesible (ARIA, navegación por teclado)
 * 
 * Los filtros se obtienen automáticamente del `FiltersContext`:
 * - `globalFilter`: Búsqueda de texto
 * - `dateFilter`: Filtro de fecha
 * - `salesTypeFilters`: Filtros de tipo de venta
 * 
 * @template T - Tipo de los datos de las filas
 * @param {Props<T>} props - Props del componente
 * @returns {JSX.Element} Tabla con funcionalidades completas
 * 
 * @example
 * ```tsx
 * const columns = [
 *   { header: "Nombre", accessorKey: "name" },
 *   { header: "Email", accessorKey: "email" }
 * ];
 * 
 * <CommonTable 
 *   data={users} 
 *   columns={columns}
 *   onRowClick={(user) => openModal(user)}
 * />
 * ```
 */

// Custom filter function that combines globalFilter (text search) and dateFilter

// Filter function for date column

/**
 * Función de filtro para la columna de tipo de venta.
 * 
 * Soporta múltiples valores seleccionados (array). Si el array incluye "all",
 * muestra todas las filas. Si está vacío, también muestra todas.
 * 
 * @param {Row} row - Fila de la tabla
 * @param {string} columnId - ID de la columna
 * @param {string[] | null} filterValue - Array de valores de tipo de venta a filtrar
 * @returns {boolean} `true` si la fila pasa el filtro
 */
const salesTypeFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue: string[] | null
) => {
  if (!filterValue || filterValue.length === 0) return true;
  if (filterValue.includes("all")) return true;

  const rowSalesType = row.original.salesType;
  return filterValue.includes(rowSalesType);
};

export function CommonTable<T>({ data, columns, pageSize = 10, onRowClick }: Props<T>) {
  const { globalFilter, dateFilter, salesTypeFilters } = useFilters();
  const [sorting, setSorting] = useState<SortingState>([]);

  // Combine both filters into a single filter value for react-table
  const combinedFilter = useMemo(
    () => ({ globalFilter, dateFilter }),
    [globalFilter, dateFilter]
  );

  // Build column filters array with useMemo to prevent infinite loops
  const activeColumnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (dateFilter) {
      filters.push({ id: "createdAtFormatted", value: dateFilter });
    }
    if (salesTypeFilters.length > 0 && !salesTypeFilters.includes(SALES_TYPE_FILTER.ALL)) {
      filters.push({ id: "salesType", value: salesTypeFilters });
    }
    return filters;
  }, [dateFilter, salesTypeFilters]);

  // Enhance columns with custom filter functions - memoized to prevent re-renders
  const enhancedColumns = useMemo(() => {
    return columns.map((col, index) => {
      const colWithKey = col as ColumnDef<T, any> & {
        accessorKey?: string;
        id?: string;
      };
      const columnId =
        colWithKey.id || colWithKey.accessorKey || `col-${index}`;

      // Asignar filterFn personalizado según la columna
      if (columnId === "createdAt" || columnId === "createdAtFormatted") {
        return {
          ...col,
          filterFn: dateColumnFilterFn,
        };
      }
      if (columnId === "salesType") {
        return {
          ...col,
          filterFn: salesTypeFilterFn,
        };
      }
      return col;
    });
  }, [columns]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      globalFilter: combinedFilter,
      sorting,
      columnFilters: activeColumnFilters,
    },
    onSortingChange: setSorting,
    globalFilterFn: customGlobalFilterFn,
    filterFns: {
      dateColumnFilter: dateColumnFilterFn,
      salesTypeFilter: salesTypeFilterFn,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // <-- Filtra por globalFilter, dateFilter y columnFilters
    getSortedRowModel: getSortedRowModel(), // <-- Sorting headers
    getPaginationRowModel: getPaginationRowModel(), // <-- Paginated table

    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="border border-boldGrayLight bg-white overflow-hidden">
      {/* ------------------- TABLE WITH HORIZONTAL SCROLL ------------------- */}
      <div className="overflow-x-auto">
        <Table 
          sx={{ fontFamily: "var(--font-montserrat), sans-serif", minWidth: 650 }}
          aria-label="Tabla de transacciones"
          id="transactions-table"
        >
        <caption className="sr-only">
          Lista de transacciones con filtros aplicados. Usa las flechas para ordenar las columnas.
        </caption>
        <TableHead>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              <TableCell
                sx={{
                  height: "15px",
                  padding: "4px 0",
                  width: "4px",
                  minWidth: "4px",
                  maxWidth: "4px",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              />
              {hg.headers.map((h) => (
                <TableCell
                  key={h.id}
                  role="columnheader"
                  className="cursor-pointer select-none text-sm font-medium text-gray-500"
                  onClick={h.column.getToggleSortingHandler()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      h.column.getToggleSortingHandler()?.(e as any);
                    }
                  }}
                  tabIndex={0}
                  aria-sort={
                    h.column.getIsSorted() === 'asc' 
                      ? 'ascending' 
                      : h.column.getIsSorted() === 'desc' 
                      ? 'descending' 
                      : 'none'
                  }
                  sx={{
                    height: "15px",
                    padding: "4px 16px",
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                >
                  {h.isPlaceholder ? null : (
                    <>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" && " ↑"}
                      {h.column.getIsSorted() === "desc" && " ↓"}
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <TableRow 
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              sx={{
                '&:hover': {
                  backgroundColor: '#F3F3F3', // boldGrayLight
                  cursor: onRowClick ? 'pointer' : 'default',
                },
              }}
            >
              {/* Elemento rectangular de accesibilidad - alterna azul oscuro y gris */}
              <TableCell
                sx={{
                  width: "2px",
                  minWidth: "2px",
                  maxWidth: "2px",
                  padding: 0,
                  backgroundColor: rowIndex % 2 === 0 ? "#121E6C" : "#A1A1A0", // boldBlue y boldGrayLight
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              />
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  sx={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-4 text-gray-500"
                sx={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>


      <nav aria-label="Paginación de la tabla">
        <div className="flex justify-between items-center p-3 border-t">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowBack/>
             Anterior
          </button>
          <span aria-current="page">
            Página {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Página siguiente"
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente <ArrowForward/>
          </button>
        </div>
      </nav>
    </div>
  );
}
