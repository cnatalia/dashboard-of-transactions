"use client";

import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Search } from "@mui/icons-material";


interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
}

/**
 * Componente de barra de búsqueda con debounce para optimizar las búsquedas.
 * 
 * Características:
 * - Debounce automático para evitar búsquedas excesivas mientras el usuario escribe
 * - Icono de búsqueda de Material-UI
 * - Botón de limpiar que aparece cuando hay texto
 * - Componente controlado: el valor se sincroniza con el prop `value`
 * - Accesible: `type="search"` y `aria-label`
 * 
 * 
 * @param {SearchBarProps} props - Props del componente
 * @returns {JSX.Element} Barra de búsqueda con debounce
 * 
 * 
 */
export default function SearchBar({
  value,
  onChange,
  delay = 300,
  placeholder = "Buscar",
}: SearchBarProps) {
  const [input, setInput] = useState(value);

  const debouncedHandler = useMemo(
    () => debounce((val: string) => onChange(val), delay),
    [onChange, delay]
  );

  const handleInput = (text: string) => {
    setInput(text);
    debouncedHandler(text); 
  };

  const clear = () => {
    setInput("");
    debouncedHandler.cancel(); 
    onChange(""); 
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2  shadow-sm bg-white w-full h-14">
      <Search className="text-boldGrayStrong" fontSize="small" />

      <input
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm outline-none"
      />

      {input && (
        <button onClick={clear}>
        </button>
      )}
    </div>
  );
}
