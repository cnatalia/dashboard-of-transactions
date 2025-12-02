
import { pipe, map } from 'remeda';
import { format } from 'date-fns';
import { STATUS_ID, STATUS_MAP } from '@/constants';
import { matchesDateFilter } from '@/utils/filters';
import { DateFilterType } from '@/providers/filters-context';

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

type ApiResponse = {
  data: Transaction[];
};

type FormattedTransaction = Transaction & {
  createdAtFormatted: string;
  amountFormatted: string;
  deductionFormatted: string;
};

type FormattedTransactionsResponse = {
  transactions: FormattedTransaction[];
  totalCountFormatted: string;
};

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formatea transacciones agregando campos formateados.
 * 
 * Acepta tanto un array de transacciones como una respuesta de API completa.
 * 
 * @param {Transaction[] | ApiResponse} transactionsOrResponse - Array de transacciones o respuesta de API
 * @param {DateFilterType} dateFilter - Filtro de fecha activo (opcional)
 * @returns {FormattedTransactionsResponse} Objeto con transacciones formateadas y totalCountFormatted
 * 
 */
export function formatTransactions(
  transactionsOrResponse: Transaction[] | ApiResponse,
  dateFilter: DateFilterType = null
): FormattedTransactionsResponse {
  // Extraer array de transacciones (puede venir directamente o dentro de ApiResponse)
  const transactions: Transaction[] = Array.isArray(transactionsOrResponse)
    ? transactionsOrResponse
    : transactionsOrResponse.data || [];

  // Formatear status
  const formattedStatus = pipe(
    transactions,
    map((t: Transaction) => ({
      ...t,
      status: STATUS_MAP[t.status as STATUS_ID]?.label || t.status,
    }))
  );

  // Formatear fechas y montos
  const formattedTransactions = pipe(
    formattedStatus,
    map((t: Transaction): FormattedTransaction => ({
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
}

export type { Transaction, ApiResponse, FormattedTransaction, FormattedTransactionsResponse };

