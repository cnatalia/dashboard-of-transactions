import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useFilters } from '@/providers/filters-context';
import { formatTransactions, type FormattedTransactionsResponse, type ApiResponse } from '../lib/api/format-transactions';
import { TRANSACTIONS_ENDPOINT } from '@/lib/api/config';

type TransactionsResponse = FormattedTransactionsResponse;

/**
 * Custom hook para obtener y formatear transacciones desde la API.
 * 
 * Utiliza React Query para caching y gestión de estado del servidor.
 * Puede recibir `initialData` desde un Server Component para mejor performance y SEO.
 * 
 * Formatea los datos de transacciones agregando campos formateados:
 * - `createdAtFormatted`: Fecha en formato "dd/MM/yyyy - HH:mm:ss"
 * - `amountFormatted`: Monto en moneda colombiana (COP)
 * - `deductionFormatted`: Deducción en moneda colombiana (COP)
 * 
 * Calcula el total de ventas exitosas según el filtro de fecha activo (today, thisWeek, thisMonth),
 * restando las deducciones. Si no hay filtro de fecha, muestra todas las transacciones exitosas.
 * 
 * @param {ApiResponse | undefined} initialData - Datos iniciales desde Server Component (opcional)
 * @returns {UseQueryResult<TransactionsResponse>} Objeto de React Query con:
 *   - `data`: Objeto con `transactions` (array formateado) y `totalCountFormatted` (string)
 *   - `isLoading`: Estado de carga
 *   - `error`: Error si existe
 * 
 */
const useGetTransactions = (initialData?: ApiResponse) => {
  const { dateFilter } = useFilters();

  const rawDataQuery = useQuery<ApiResponse>({
    queryKey: ['get-transactions-raw'],
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
    
    placeholderData: initialData,
    initialData: initialData,

    queryFn: async () => {
      const response = await fetch(TRANSACTIONS_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data: ApiResponse = await response.json();
      return data;
    },
  });

  const formattedData = useMemo(() => {
    if (!rawDataQuery.data) return undefined;
    
    return formatTransactions(rawDataQuery.data, dateFilter);
  }, [rawDataQuery.data, dateFilter]);

  return {
    ...rawDataQuery,
    data: formattedData,
  } as typeof rawDataQuery & { data: TransactionsResponse | undefined };
};

export default useGetTransactions;
