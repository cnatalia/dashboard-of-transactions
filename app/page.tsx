import { Suspense } from 'react';
import Header from "@/components/Header";
import DashboardClient from "./components/DashboardClient";
import Loading from './loading';

/**
 * Server Component - Main page
 * This component is a Server Component by default in Next.js App Router
 * It can fetch data on the server and pass it to Client Components
 */
export default function Home() {
  return (
    <div className="bg-boldBackground flex flex-col">
      {/* Header can be a Server Component if it doesn't need interactivity */}
      <Header />
      
      {/* Client Component with all interactive logic */}
      <Suspense fallback={<Loading />}>
        <DashboardClient />
      </Suspense>
    </div>
  );
}
