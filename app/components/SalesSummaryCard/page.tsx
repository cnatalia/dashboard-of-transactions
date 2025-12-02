"use client";

import { DATE_FILTER_MAP, DATE_FILTER_MAP_LABEL } from "@/constants";
import { useFilters } from "@/providers/filters-context";
import { formatMonthYear, formatToday, formatWeekRange } from "@/utils/filters";
import { Info, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useState, useMemo } from "react";
import SalesSummaryCardSkeleton from "./Skeleton";

interface SalesSummaryCardProps {
  totalCountFormatted?: string;
}

export default function SalesSummaryCard({ totalCountFormatted }: SalesSummaryCardProps) {
  // Mostrar skeleton si no hay datos disponibles
  if (!totalCountFormatted) {
    return <SalesSummaryCardSkeleton />;
  }
  const { dateFilter } = useFilters();
  const [open, setOpen] = useState(false);

  const handleTooltipOpen = () => {
    setOpen(!open);
  };

  // Estado derivado: usar useMemo para evitar recálculos innecesarios
  const dateText = useMemo(() => {
    switch (dateFilter) {
      case DATE_FILTER_MAP.TODAY:
        return formatToday();
      
      case DATE_FILTER_MAP.THIS_WEEK:
        return formatWeekRange();
      
      case DATE_FILTER_MAP.THIS_MONTH:
        return formatMonthYear();
      
      default:
        return formatMonthYear();
    }
  }, [dateFilter]);

  return (
    <div className="flex items-center flex-col md:w-2/3 w-full gap-4 rounded-lg bg-white pb-2 shadow-lg">
      <h2 className="text-white bg-bold-gradient text-sm w-full p-3 rounded-t-lg flex items-center justify-between">
        Total de ventas de {DATE_FILTER_MAP_LABEL[dateFilter as DATE_FILTER_MAP]}
        <Tooltip 
          title="Total de ventas de la fecha seleccionada"
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          slotProps={{
            popper: {
              disablePortal: true,
            },
          }}
          aria-describedby="sales-tooltip"
        >
          <InfoOutlined 
            id="sales-info-icon"
            fontSize="small" 
            className="cursor-pointer text-white" 
            onClick={handleTooltipOpen}
            role="button"
            aria-label="Información sobre total de ventas"
          />
        </Tooltip>
      </h2>
      <p className="text-2xl font-bold bg-bold-red-gradient bg-clip-text [-webkit-text-fill-color:transparent]">
        {totalCountFormatted}
      </p>
      <time dateTime={new Date().toISOString()}>
        {dateText}
      </time>
    </div>
  );
}