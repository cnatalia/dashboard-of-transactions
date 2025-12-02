import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-20 bg-bold-gradient w-full py-4 px-12">
      <Link href="/" aria-label="Ir al inicio">
        <Image
          src="/icons/logo_white.svg"
          alt="Logo Bold"
          width={100}
          height={100}
        />
      </Link>
      <nav aria-label="Navegación principal">
        <menu className="flex items-center gap-4 flex-row text-white text-sm">
          <li>
            <Link 
              href="/"
              className="hover:underline"
            >
              Mi negocio
            </Link>
          </li>
          <li>
            <Link 
              href="/"
              className="hover:underline"
            >
              Ayuda
            </Link>
          </li>
        </menu>
      </nav>
    </header>
  );
}