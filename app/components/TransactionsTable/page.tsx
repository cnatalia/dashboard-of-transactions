"use client";

import { useState } from "react";
import { CommonTable } from "@/components/CommonTable";
import { STATUS_ID, STATUS_MAP, TransactionDetail } from "@/constants";
import { CheckCircle, Error } from "@mui/icons-material";
import DetailModal from "@/app/components/DetailModal";
import TransactionsTableSkeleton from "./Skeleton";

interface TransactionsTableProps {
  data: TransactionDetail[];
  isLoading: boolean;
}

export default function TransactionsTable({
  data,
  isLoading,
}: TransactionsTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  if (isLoading) {
    return <TransactionsTableSkeleton />;
  }

  const handleRowClick = (rowData: any) => {
    const transactionId = rowData.id;
    setSelectedTransactionId(transactionId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransactionId(null);
  };

  // Buscar la transacción por ID en los datos
  const selectedTransaction = selectedTransactionId
    ? data.find((transaction) => transaction.id === selectedTransactionId)
    : null;
  const columns = [
    {
      header: "Transacción",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => (
        <div className="line-clamp-2 w-full text-left text-sm font-medium text-boldBlue flex items-center gap-2">
          {row.original.status === STATUS_MAP[STATUS_ID.SUCCESSFUL]?.label ? (
            <CheckCircle className="text-boldGreenLight" fontSize="small" />
          ) : (
            <Error className="text-amber-200" fontSize="small" />
          )}
          {row.original.status ?? ""}
        </div>
      ),
    },
    {
      header: "Fecha y hora",
      accessorKey: "createdAtFormatted",
    },
    {
      header: "Método de pago",
      accessorKey: "paymentMethod",
    },
    {
      header: "Tipo de venta",
      accessorKey: "salesType",
    },
    {
      header: "ID transacción Bold",
      accessorKey: "id",
    },
    {
      header: "Monto",
      accessorKey: "amountFormatted",
      cell: ({ row }: { row: any }) => (
        <div className="text-left text-sm font-medium">
          <span className="text-boldBlue font-medium">
            {row.original.amountFormatted}
          </span>
          {row.original.deduction && (
            <div className="text-xs text-boldGrayStrong flex items-start gap-1 flex-col">
              Deducción Bold
              <span className="text-boldRed">
                -{row.original.deductionFormatted}
              </span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <CommonTable
        columns={columns}
        data={data || []}
        onRowClick={handleRowClick}
      />
      <DetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        data={selectedTransaction as TransactionDetail}
      />
    </>
  );
}
