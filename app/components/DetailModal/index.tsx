"use client";

import { Divider, SwipeableDrawer, IconButton } from "@mui/material";
import { CheckCircle, Error, Close } from "@mui/icons-material";
import {
  SALES_TYPE_FILTER,
  SALES_TYPE_FILTER_MAP_LABEL,
  STATUS_ID,
  STATUS_MAP,
  TransactionDetail,
} from "@/constants";



interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  data?: TransactionDetail;
}

export default function DetailModal({ open, onClose, data }: DetailModalProps) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      onOpen={() => {}}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "480px", md: "500px" },
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          borderBottomLeftRadius:{xs: "0px", sm: "16px"},
          borderTopLeftRadius:{xs: "0px", sm: "16px"},
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <main className="h-full flex flex-col">
        <header className="flex justify-end items-center px-6 pt-2 pb-0">
          <IconButton
            onClick={onClose}
            sx={{
              padding: "8px",
              "&:hover": {
                backgroundColor: "#F3F3F3",
              },
            }}
            aria-label="Cerrar modal"
          >
            <Close sx={{ color: "#606060" }} />
            <span className="sr-only">Cerrar modal</span>
          </IconButton>
        </header>
        <section className="flex-1 overflow-auto p-6">
          {data ? (
            <article className="flex flex-col gap-6">
              <section className="flex items-center justify-center gap-2 flex-col">
                {data.status === STATUS_MAP[STATUS_ID.SUCCESSFUL]?.label ? (
                  <CheckCircle className="text-boldGreenLight" fontSize="medium" />
                ) : (
                  <Error className="text-amber-200" fontSize="medium" />
                )}
                <div className="flex items-center justify-center flex-col">
                  <span className="text-black text-base font-semibold mt-0.5 text-center">
                    {data.status || "N/A"}
                  </span>
                  <span className="text-boldBlue text-2xl font-semibold mt-0.5">
                    {data.amountFormatted || "N/A"}
                  </span>
                  <time 
                    dateTime={new Date(data.createdAt).toISOString()}
                    className="text-boldGrayStrong text-sm font-normal mt-0.5"
                  >
                    {data.createdAtFormatted || "N/A"}
                  </time>
                </div>
              </section>
              <section className="flex items-center justify-center gap-2 flex-col mt-7">
                <dl className="w-full space-y-3">
                  <div className="flex items-center justify-between w-full gap-2 flex-row">
                    <dt className="text-boldGrayStrong text-sm font-medium">
                      ID transacción Bold
                    </dt>
                    <dd className="text-black text-sm font-semibold mt-0.5">
                      {data.id || "N/A"}
                    </dd>
                  </div>
                  {data.deduction && (
                    <div className="flex items-center justify-between w-full gap-2 flex-row">
                      <dt className="text-boldGrayStrong text-sm font-medium">
                        Deducción Bold
                      </dt>
                      <dd className="text-boldRed text-sm font-semibold mt-0.5">
                        -{data.deductionFormatted || "N/A"}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <Divider className=' bg-black' />

              <section className="flex items-center justify-between w-full gap-2 flex-col">
                <dl className="w-full space-y-3">
                  <div className="flex items-center justify-between w-full gap-2 flex-row">
                    <dt className="text-boldGrayStrong text-sm font-medium">
                      Método de pago
                    </dt>
                    <dd className="text-black text-sm font-semibold mt-0.5">
                      {data.paymentMethod || "N/A"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2 flex-row">
                    <dt className="text-boldGrayStrong text-sm font-medium">
                      Tipo de venta
                    </dt>
                    <dd className="text-black text-sm font-semibold mt-0.5">
                      {(
                        SALES_TYPE_FILTER_MAP_LABEL[
                          data.salesType as SALES_TYPE_FILTER
                        ] as any
                      )?.modalLabel ||
                        SALES_TYPE_FILTER_MAP_LABEL[
                          data.salesType as SALES_TYPE_FILTER
                        ]?.filterLabel ||
                        "N/A"}
                    </dd>
                  </div>
                </dl>
              </section>
            </article>
          ) : (
            <p className="text-boldGrayStrong">No hay datos disponibles</p>
          )}
        </section>
      </main>
    </SwipeableDrawer>
  );
}
