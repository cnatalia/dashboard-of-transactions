import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { montserrat } from "@/ui/fonts";
import { ReactQueryProvider } from "@/providers/react-query-providers";
import { FiltersProvider } from "@/providers/filters-context";
import Loading from "./loading";


export const metadata: Metadata = {
  title: "Dashboard de Transacciones - Bold",
  description: "Panel de control para visualizar y filtrar transacciones de Bold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.className} antialiased`}
      >
        <ReactQueryProvider>
          <Suspense fallback={<Loading />}>
            <FiltersProvider>
              {children}
            </FiltersProvider>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
