# Dashboard de Transacciones - Bold

Dashboard web para visualizar y gestionar transacciones de Bold, construido con Next.js 16, React 19, TypeScript y Material-UI.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Scripts](#scripts)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Componentes Principales](#componentes-principales)
- [Hooks Personalizados](#hooks-personalizados)
- [Filtros y Búsqueda](#filtros-y-búsqueda)
- [Despliegue](#despliegue)
- [Decisiones Técnicas](#decisiones-técnicas)

## ✨ Características

- **Visualización de Transacciones**: Tabla interactiva con paginación, ordenamiento y filtros
- **Filtros Avanzados**: 
  - Búsqueda global por texto
  - Filtros por fecha (Hoy, Esta semana, Este mes)
  - Filtros por tipo de venta (Link de pago, Terminal)
- **Persistencia de Estado**: Los filtros se guardan en la URL para compartir y recargar
- **Modal de Detalles**: Vista lateral con información completa de cada transacción
- **Responsive Design**: Diseño adaptativo para móviles y escritorio
- **Accesibilidad**: Implementación de ARIA, semántica HTML5 y navegación por teclado
- **Optimización de Performance**: React Query para caching, debounce en búsqueda, Server Components

## 🛠 Tecnologías

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS v4, Material-UI v7
- **Estado del Servidor**: React Query (@tanstack/react-query)
- **Tablas**: React Table (@tanstack/react-table)
- **Testing**: Jest con jest-environment-jsdom
- **Utilidades**: 
  - `date-fns` para manejo de fechas
  - `remeda` para programación funcional
  - `lodash.debounce` para optimización de búsqueda

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd dashboard
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## 🚀 Scripts

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter de ESLint
- `npm test`: Ejecuta los tests unitarios con Jest
- `npm run test:watch`: Ejecuta los tests en modo watch
- `npm run test:coverage`: Ejecuta los tests con reporte de cobertura

## 📁 Estructura del Proyecto

```
dashboard/
├── app/                          # Next.js App Router
│   ├── components/              # Componentes específicos de la app
│   │   ├── DashboardClient.tsx  # Cliente wrapper para hooks
│   │   ├── DetailModal/         # Modal lateral de detalles
│   │   ├── SalesSummaryCard/     # Card de resumen de ventas
│   │   └── TransactionsTable/   # Tabla de transacciones
│   ├── layout.tsx               # Layout raíz con providers
│   ├── page.tsx                # Página principal (Server Component)
│   ├── loading.tsx             # Estado de carga global
│   ├── error.tsx               # Manejo de errores global
│   └── not-found.tsx           # Página 404
├── components/                  # Componentes reutilizables
│   ├── CheckBoxFilter/         # Filtro de checkboxes
│   ├── CommonTable/            # Tabla genérica con react-table
│   ├── Header/                 # Header de la aplicación
│   ├── SearchBar/              # Barra de búsqueda
│   └── TabsFilter/             # Filtros de fecha tipo tabs
├── hooks/                      # Custom hooks
│   └── use-get-transactions.tsx # Hook para obtener transacciones
├── lib/                        # Utilidades y funciones del servidor
│   └── api/
│       └── transactions.ts     # Función para fetch en Server Components
├── providers/                  # Context providers
│   ├── filters-context.tsx    # Context para filtros globales
│   └── react-query-providers.tsx # Provider de React Query
├── utils/                      # Funciones utilitarias
│   ├── filters.tsx             # Funciones de filtrado y formateo
│   └── __tests__/              # Tests unitarios
│       └── filters.test.ts     # Tests para funciones de filtrado
├── constants/                  # Constantes de la aplicación
│   └── index.ts                # Enums y mapeos
└── ui/                         # Configuración de UI
    └── fonts.ts                # Configuración de fuentes
```

## 🏗 Arquitectura

### Server Components vs Client Components

- **Server Components** (`app/page.tsx`): Renderizado en el servidor, ideal para data fetching inicial
- **Client Components**: Marcados con `"use client"`, usan hooks y estado del cliente

### Gestión de Estado

- **React Context API**: Para filtros globales (`filters-context.tsx`)
- **React Query**: Para estado del servidor y caching de datos
- **URL Parameters**: Persistencia de filtros en la URL 

### Filtrado

- **Filtros Globales**: Búsqueda de texto y filtro de fecha combinados
- **Filtros de Columna**: Filtros específicos por columna (fecha, tipo de venta)
- **Lógica AND**: Los filtros se combinan con lógica AND
- **Lógica OR**: Los tabs de fecha funcionan con lógica OR (solo uno activo)

## 🧩 Componentes Principales

### `CommonTable`

Tabla genérica construida con `@tanstack/react-table`. Soporta:
- Ordenamiento por columnas
- Paginación
- Filtrado global y por columna
- Click en filas para abrir detalles

**Props:**
- `data: T[]`: Array de datos
- `columns: ColumnDef<T, any>[]`: Definición de columnas
- `pageSize?: number`: Tamaño de página (default: 10)
- `onRowClick?: (rowData: T) => void`: Callback al hacer click en una fila

### `SalesSummaryCard`

Card que muestra el total de ventas formateado y la fecha según el filtro activo.

**Props:**
- `totalCountFormatted?: string`: Total formateado en moneda colombiana

### `DetailModal`

Modal lateral (drawer) que muestra detalles completos de una transacción seleccionada.

**Props:**
- `open: boolean`: Controla si el modal está abierto
- `onClose: () => void`: Callback para cerrar el modal
- `data?: TransactionDetail`: Datos de la transacción a mostrar

### `TabsFilter`

Componente de tabs para filtrar por fecha (Hoy, Esta semana, Este mes).

### `CheckBoxFilter`

Componente de menú desplegable con checkboxes para filtrar por tipo de venta.

### `SearchBar`

Barra de búsqueda con debounce para optimizar las búsquedas.

## 🎣 Hooks Personalizados

### `useGetTransactions`

Hook que utiliza React Query para obtener y formatear transacciones desde la API.

**Retorna:**
- `data`: Objeto con `transactions` y `totalCountFormatted`
- `isLoading`: Estado de carga
- `error`: Error si existe

**Características:**
- Formatea montos a moneda colombiana (COP)
- Formatea fechas a formato legible
- Calcula total de ventas exitosas del día actual
- Caching con `staleTime` y `gcTime`

## 🔍 Filtros y Búsqueda

### Filtros Disponibles

1. **Búsqueda Global**: Busca en todos los campos de la transacción
2. **Filtro de Fecha**: 
   - `today`: Solo transacciones de hoy
   - `thisWeek`: Transacciones de la semana actual
   - `thisMonth`: Transacciones del mes actual
3. **Filtro de Tipo de Venta**:
   - `PAYMENT_LINK`: Cobro con link de pago
   - `TERMINAL`: Cobro con datáfono
   - `ALL`: Ver todo

### Persistencia en URL

Los filtros se guardan automáticamente en la URL:
- `?search=texto`: Búsqueda global
- `?date=today`: Filtro de fecha
- `?salesTypes=PAYMENT_LINK,TERMINAL`: Filtros de tipo de venta

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno si es necesario
3. Deploy automático en cada push a `main`

### Build Manual

```bash
npm run build
npm run start
```

## 💡 Decisiones Técnicas

### ¿Por qué Next.js App Router?

- Server Components para mejor performance
- Streaming y Suspense nativos
- Mejor SEO y carga inicial

### ¿Por qué React Query?

- Caching automático
- Revalidación inteligente
- Manejo de estado del servidor simplificado

### ¿Por qué React Table?

- Flexibilidad para filtros personalizados
- Performance optimizada para grandes datasets
- API extensible

### ¿Por qué Context API para filtros?

- Estado global compartido
- Sincronización con URL sin `useEffect`
- Simplicidad para este caso de uso

## 🧪 Testing

El proyecto utiliza **Jest** para pruebas unitarias. Los tests están ubicados en `utils/__tests__/` y cubren:

- Funciones de filtrado de fechas (`matchesDateFilter`)
- Funciones de filtrado combinado (`customGlobalFilterFn`)
- Funciones de formateo de fechas (`formatToday`, `formatWeekRange`, `formatMonthYear`)

Para ejecutar los tests:
```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch (re-ejecuta al cambiar archivos)
npm run test:coverage # Con reporte de cobertura
```

## 📝 Notas Adicionales

- La fuente Montserrat se aplica globalmente a toda la aplicación
- Los colores personalizados están definidos en `tailwind.config.ts`
- Los breakpoints personalizados permiten diseño responsive fino
- La aplicación está optimizada para accesibilidad (ARIA, semántica HTML5)
