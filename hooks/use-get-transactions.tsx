import { useQuery } from '@tanstack/react-query';
import { pipe, map } from 'remeda';
import { format } from 'date-fns';
import { STATUS_ID, STATUS_MAP } from '@/constants';
import { useFilters } from '@/providers/filters-context';
import { matchesDateFilter } from '@/utils/filters';

type Transaction = {
  id: string;
  status: string;
  paymentMethod: string;
  salesType: string;
  createdAt: number;
  transactionReference: number;
  amount: number;
  deduction?: number;
};

type TransactionsResponse = {
  transactions: (Transaction & { createdAtFormatted: string; amountFormatted: string; deductionFormatted: string })[];
  totalCountFormatted: string;
};

/**
 * Custom hook para obtener y formatear transacciones desde la API.
 * 
 * Utiliza React Query para caching y gestión de estado del servidor.
 * Formatea los datos de transacciones agregando campos formateados:
 * - `createdAtFormatted`: Fecha en formato "dd/MM/yyyy - HH:mm:ss"
 * - `amountFormatted`: Monto en moneda colombiana (COP)
 * - `deductionFormatted`: Deducción en moneda colombiana (COP)
 * 
 * Calcula el total de ventas exitosas según el filtro de fecha activo (today, thisWeek, thisMonth),
 * restando las deducciones. Si no hay filtro de fecha, muestra todas las transacciones exitosas.
 * 
 * @returns {UseQueryResult<TransactionsResponse>} Objeto de React Query con:
 *   - `data`: Objeto con `transactions` (array formateado) y `totalCountFormatted` (string)
 *   - `isLoading`: Estado de carga
 *   - `error`: Error si existe
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useGetTransactions();
 * if (isLoading) return <Loading />;
 * return <Table data={data?.transactions} />;
 * ```
 */
const useGetTransactions = () => {
  const { dateFilter } = useFilters();
  const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return useQuery<TransactionsResponse>({
    queryKey: ['get-transactions'],
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)

    queryFn: async () => {
      const response = await fetch('https://bold-fe-api.vercel.app/api');
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();
      const transactions = data.data || [];


      const formattedStatus = pipe(
        transactions, map((t: Transaction) => ({
        ...t,
        status: STATUS_MAP[t.status as STATUS_ID]?.label,
      })));

      const formattedTransactions = pipe(
        formattedStatus,
        map((t: Transaction) => ({
          ...t,
          createdAtFormatted: format(new Date(t.createdAt), 'dd/MM/yyyy - HH:mm:ss'),
          amountFormatted: currencyFormatter.format(t.amount),
          deductionFormatted: currencyFormatter.format(t.deduction ?? 0),
        }))
      );
      
      // Calcular total de ventas exitosas según el filtro de fecha activo
      const totalCount = formattedTransactions
        .filter(t => {
          const isSuccessful = t.status === STATUS_MAP[STATUS_ID.SUCCESSFUL]?.label;
          const matchesDate = matchesDateFilter(t.createdAt, dateFilter);
          return isSuccessful && matchesDate;
        })
        .reduce((acc, t) => {
          const deduction = t.deduction ?? 0;   
          return acc + (t.amount - deduction);
        }, 0);

      return {
        transactions: formattedTransactions,
        totalCountFormatted: currencyFormatter.format(totalCount),
      };
    },
  });
};

export default useGetTransactions;
