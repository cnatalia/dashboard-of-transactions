import { HomeMaxOutlined } from '@mui/icons-material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-boldBackground"
    >
      <h1 className="text-[120px] font-bold text-boldBlue mb-4 leading-none">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-boldBlue">
        Página no encontrada
      </h2>
      <p className="mb-8 text-boldGrayStrong max-w-lg">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-boldBlue hover:bg-[#0f1855] text-white font-medium py-3 px-6 rounded-lg transition-colors"
        aria-label="Volver al inicio"
      >
        {/* SVG guardado en /public/icons/home-icon.svg */}
        <HomeMaxOutlined className="text-white" fontSize="large" />
        Volver al inicio
      </Link>
    </main>
  );
}

