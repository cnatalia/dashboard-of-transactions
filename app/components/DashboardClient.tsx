'use client';

import { Suspense } from 'react';
import TabsFilter from "@/components/TabsFilter";
import SalesSummaryCard from "./SalesSummaryCard/page";
import TransactionsTable from "./TransactionsTable/page";
import useGetTransactions from "@/hooks/use-get-transactions";
import SearchBar from "@/components/SearchBar";
import { useFilters } from "@/providers/filters-context";
import CheckBoxFilter from "@/components/CheckBoxFilter";
import { DATE_FILTER_MAP, DATE_FILTER_MAP_LABEL } from "@/constants";
import { Box, CircularProgress } from '@mui/material';
import type { ApiResponse } from '@/lib/api/transactions';

/**
 * Componente de carga para el fallback de Suspense.
 * 
 * Muestra un spinner centrado mientras se cargan las transacciones.
 * 
 * @returns {JSX.Element} Spinner de carga
 */
function TransactionsLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <CircularProgress sx={{ color: '#121E6C' }} />
    </Box>
  );
}

interface DashboardClientProps {
  initialData?: ApiResponse;
}

/**
 * Componente cliente que orquesta el dashboard principal.
 * 
 * Este componente encapsula toda la lógica del lado del cliente:
 * - Obtiene datos de transacciones con `useGetTransactions` (puede usar initialData del servidor)
 * - Gestiona filtros globales con `useFilters`
 * - Renderiza todos los componentes del dashboard:
 *   - `SalesSummaryCard`: Resumen de ventas
 *   - `TabsFilter`: Filtros de fecha
 *   - `CheckBoxFilter`: Filtros de tipo de venta
 *   - `SearchBar`: Búsqueda global
 *   - `TransactionsTable`: Tabla de transacciones
 * 
 * Utiliza `Suspense` para manejar el estado de carga de `TransactionsTable`.
 * 
 * @param {DashboardClientProps} props - Props del componente
 * @param {ApiResponse} props.initialData - Datos iniciales desde Server Component (opcional)
 * @returns {JSX.Element} Dashboard completo con todos los componentes
 * 
 */
export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { globalFilter, setGlobalFilter, dateFilter } = useFilters();
  const { data: transactionsData, isLoading } = useGetTransactions(initialData);

  return (
    <div className="flex flex-col lg:px-12 px-4 container mx-auto py-14 gap-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <SalesSummaryCard
          totalCountFormatted={transactionsData?.totalCountFormatted}
        />

        <div className="flex flex-col gap-4 w-full justify-start items-end">
          <TabsFilter />
          <CheckBoxFilter />
        </div>
      </div>
      <div className="rounded-lg">
        <div className="text-bold-gray-strong text-white text-sm bg-bold-gradient p-4 rounded-t-lg">
          Tu ventas de{" "}
          {DATE_FILTER_MAP_LABEL[dateFilter as DATE_FILTER_MAP] || DATE_FILTER_MAP_LABEL[DATE_FILTER_MAP.TODAY]}
        </div>
        <SearchBar
          placeholder="Buscar"
          value={globalFilter}
          onChange={setGlobalFilter}
        />
        <Suspense fallback={<TransactionsLoading />}>
          <TransactionsTable
            data={transactionsData?.transactions || []}
            isLoading={isLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}

