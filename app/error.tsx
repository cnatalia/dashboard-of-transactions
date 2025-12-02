"use client";

import { WarningAmberRounded } from "@mui/icons-material";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-boldBackground"
      role="alert"
      aria-live="assertive"
    >
      {/* SVG guardado en /public/icons/error-icon.svg */}
      <WarningAmberRounded className="text-boldRed" fontSize="large" />

      <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-boldBlue">
        Algo salió mal
      </h1>
      <p className="mb-6 text-boldGrayStrong max-w-lg">
        {error.message ||
          "Ocurrió un error inesperado. Por favor, intenta nuevamente."}
      </p>
      <button
        onClick={reset}
        type="button"
        className="bg-boldBlue hover:bg-[#0f1855] text-white font-medium py-3 px-6 rounded-lg transition-colors"
        aria-label="Intentar de nuevo"
      >
        Intentar de nuevo
      </button>
      {error.digest && (
        <p
          className="mt-4 text-boldGrayStrong text-sm font-mono"
          aria-label="ID de error"
        >
          Error ID: {error.digest}
        </p>
      )}
    </main>
  );
}
