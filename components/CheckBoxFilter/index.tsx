"use client";

import { useState } from "react";
import { useFilters, SalesTypeFilter } from "@/providers/filters-context";
import { SALES_TYPE_FILTER, SALES_TYPE_FILTER_MAP_LABEL } from "@/constants";
import { CloseRounded, FilterListRounded } from "@mui/icons-material";

export default function CheckBoxFilter() {
  const { salesTypeFilters, setSalesTypeFilters } = useFilters();
  const [open, setOpen] = useState(false);
  const [tempSelections, setTempSelections] = useState<SalesTypeFilter[]>(
    () => salesTypeFilters || []
  );

  const handleClick = () => {
    setOpen(!open);
    setTempSelections(salesTypeFilters || []); // Reset temp selections when opening
  };

  const handleClose = () => {
    setOpen(false);
    setTempSelections(salesTypeFilters || []); // Reset temp selections when closing without applying
  };

  const handleBackdropClick = () => {
    setOpen(false);
    setTempSelections(salesTypeFilters || []);
  };

  const handleToggle = (value: SalesTypeFilter) => {
    setTempSelections((prev) => {
      // Si se selecciona "ver todo", solo dejar ese
      if (value === SALES_TYPE_FILTER.ALL) {
        return [SALES_TYPE_FILTER.ALL];
      }

      // Si ya está seleccionado "ver todo", removerlo y agregar el nuevo
      if (prev.includes(SALES_TYPE_FILTER.ALL)) {
        return [value];
      }

      // Toggle normal
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleApply = () => {
    setSalesTypeFilters(tempSelections);
    setOpen(false);
  };

  return (
    <div className="relative flex justify-end">
      <button
        onClick={handleClick}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="filter-menu"
        className={`flex items-center justify-center gap-2 py-3 px-4 bg-white shadow-md hover:shadow-lg text-boldBlue transition-all duration-300 ease-in-out ${
          open ? "rounded-t-lg w-[280px]" : "rounded-2xl w-full"
        }`}
      >
        <span className="text-sm font-semibold">Filtrar</span>
        <FilterListRounded className="text-boldBlue" fontSize="small" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {open && (
        <div
          id="filter-menu"
          className="absolute top-full right-0 bg-white rounded-b-lg shadow-lg min-w-[280px] overflow-hidden z-50 animate-fade-in"
          role="menu"
          aria-labelledby="filter-button"
          onClick={(e) => e.stopPropagation()}
          style={{
            animationDelay: "300ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <fieldset className="py-1 border-none m-0 p-0">
            <legend className="sr-only">Filtrar por tipo de venta</legend>
            {Object.values(SALES_TYPE_FILTER).map((option) => (
              <label
                key={option}
                className="flex items-center min-w-[200px] py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors"
                role="checkbox"
                aria-checked={tempSelections.includes(
                  option as SalesTypeFilter
                )}
              >
                <input
                  type="checkbox"
                  checked={tempSelections.includes(option as SalesTypeFilter)}
                  onChange={() => handleToggle(option as SalesTypeFilter)}
                  className="w-4 h-4 text-boldBlue border-gray-300 rounded focus:ring-boldBlue focus:ring-2 cursor-pointer mr-2"
                  aria-label={
                    SALES_TYPE_FILTER_MAP_LABEL[option as SalesTypeFilter]
                      .filterLabel
                  }
                />
                <span className="text-sm font-medium text-boldBlue">
                  {
                    SALES_TYPE_FILTER_MAP_LABEL[option as SalesTypeFilter]
                      .filterLabel
                  }
                </span>
              </label>
            ))}
          </fieldset>

          <div className="px-4 pb-4 pt-2">
            <button
              onClick={handleApply}
              type="button"
              className={`w-full bg-boldRed py-3 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity ${
                tempSelections.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Aplicar filtros seleccionados"
              disabled={tempSelections.length === 0}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
