import { Suspense } from 'react';
import Header from "@/components/Header";
import DashboardClient from "./components/DashboardClient";
import Loading from './loading';
import { getTransactions } from '@/lib/api/transactions';

/**
 * Server Component - Main page
 * 
 * Este componente obtiene los datos iniciales en el servidor usando `getTransactions`,
 * lo que mejora SEO, performance y UX. Los datos se pasan a `DashboardClient` que los
 * formatea y reacciona a cambios de filtros.
 * 
 * @returns {Promise<JSX.Element>} Página principal con datos iniciales
 */
export default async function Home() {
  // Obtener datos iniciales en el servidor (ISR con revalidate: 60s)
  const initialData = await getTransactions();

  return (
    <div className="bg-boldBackground flex flex-col">
      <Header />
      
      {/* Client Component with all interactive logic */}
      <Suspense fallback={<Loading />}>
        <DashboardClient initialData={initialData} />
      </Suspense>
    </div>
  );
}
