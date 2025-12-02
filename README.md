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
- **Optimización de Performance**: 
  - Patrón híbrido (Server + Client) con ISR
  - React Query para caching inteligente
  - Debounce en búsqueda
  - Separación de datos RAW y transformación con `useMemo`

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
│       ├── config.ts          # Configuración centralizada (URLs de API)
│       ├── format-transactions.ts # Función unificada para formatear transacciones
│       └── transactions.ts    # Función para fetch en Server Components
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

### Patrón Híbrido (Server + Client)

El proyecto implementa el **patrón híbrido** siguiendo las mejores prácticas de Next.js App Router:

1. **Server Component** (`app/page.tsx`):
   - Obtiene datos iniciales con `getTransactions()` en el servidor
   - ISR (Incremental Static Regeneration) con `revalidate: 60s`
   - Mejora SEO, performance y UX (datos disponibles inmediatamente)
   - Pasa `initialData` a Client Components

2. **Client Component** (`DashboardClient.tsx`):
   - Recibe `initialData` del servidor
   - Usa `useGetTransactions(initialData)` para formatear y reaccionar a cambios
   - Re-calcula `totalCount` cuando cambia `dateFilter` usando `useMemo`

**Beneficios:**
- ✅ Datos en HTML inicial (mejor SEO)
- ✅ Menos requests HTTP desde el cliente
- ✅ Caching en servidor (ISR) + cliente (React Query)
- ✅ `totalCount` se actualiza correctamente cuando cambia el filtro


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

**Parámetros:**
- `initialData?: ApiResponse`: Datos iniciales desde Server Component (opcional)

**Retorna:**
- `data`: Objeto con `transactions` y `totalCountFormatted`
- `isLoading`: Estado de carga
- `error`: Error si existe

**Características:**
- **Patrón Híbrido**: Acepta `initialData` del servidor para mejor performance
- **Separación de Datos RAW y Transformación**:
  - Datos RAW se cachean una vez (no se re-fetch innecesariamente)
  - Transformación se re-calcula con `useMemo` cuando cambia `dateFilter`
- **Formateo Automático**:
  - Montos a moneda colombiana (COP)
  - Fechas a formato legible ("dd/MM/yyyy - HH:mm:ss")
  - Status a texto legible
- **Cálculo Dinámico**: `totalCountFormatted` se actualiza automáticamente cuando cambia `dateFilter`
- **Caching**: `staleTime: 5min`, `gcTime: 10min`

**Arquitectura Interna:**
```typescript
// 1. Query para datos RAW (se cachean)
const rawDataQuery = useQuery<ApiResponse>({
  queryKey: ['get-transactions-raw'],
  initialData: initialData, // Del servidor
});

// 2. Transformación con useMemo (re-calcula cuando cambia dateFilter)
const formattedData = useMemo(() => {
  return formatTransactions(rawDataQuery.data, dateFilter);
}, [rawDataQuery.data, dateFilter]);
```

**Relación con `lib/api/`:**
- `lib/api/transactions.ts`: Función para Server Components (`getTransactions()`)
- `lib/api/format-transactions.ts`: Función unificada para formatear transacciones
- `lib/api/config.ts`: Configuración centralizada (URLs de API)

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

Este repositorio está configurado para **desplegarse automáticamente en Vercel**.

### Despliegue Automático

El despliegue es completamente automático:

- **Push a `main`**: Se despliega automáticamente a producción
- **Pull Request**: Se crea un preview deployment con su propia URL única
- **Sin configuración adicional**: Vercel detecta automáticamente Next.js y configura el build

### URLs de Despliegue

- **Producción**: `https://dashboard-bold.vercel.app` (actualiza con cada push a `main`)
- **Preview**: `https://dashboard-bold-git-feature-branch.vercel.app` (una URL por cada PR)


### Build Local (Para Testing)

Para probar el build de producción localmente:

```bash
npm run build
npm run start
```

Esto iniciará un servidor en `http://localhost:3000` con la versión optimizada de producción.

## 💡 Decisiones Técnicas

### ¿Por qué Next.js App Router?

- **Server Components** para mejor performance y SEO
- **Streaming y Suspense** nativos
- **ISR (Incremental Static Regeneration)** para caching en servidor
- **Patrón Híbrido**: Combina lo mejor de Server y Client Components

### ¿Por qué React Query?

- **Caching automático** de datos RAW
- **Revalidación inteligente** con `staleTime` y `gcTime`
- **Manejo de estado del servidor** simplificado
- **Separación de datos RAW y transformación**: Los datos se cachean una vez, la transformación se re-calcula cuando cambian los filtros

### ¿Por qué React Table?

- **Flexibilidad** para filtros personalizados
- **Performance optimizada** para grandes datasets
- **API extensible** con funciones de filtro custom

### ¿Por qué Context API para filtros?

- **Estado global compartido** entre componentes
- **Sincronización con URL** sin `useEffect` (directa)
- **Simplicidad** para este caso de uso

### ¿Por qué Patrón Híbrido?

- **Mejor SEO**: Datos en HTML inicial
- **Mejor Performance**: Menos requests HTTP, caching en servidor
- **Mejor UX**: Datos disponibles inmediatamente, sin "flash" de contenido vacío
- **ISR**: Caching automático en servidor con revalidación cada 60s

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

- **Fuente Montserrat**: Se aplica globalmente a toda la aplicación
- **Colores personalizados**: Definidos en `tailwind.config.ts` (boldBlue, boldRed, etc.)
- **Breakpoints personalizados**: Permiten diseño responsive fino (xs, sm, md, lg, xl, 2xl, 3xl)
- **Accesibilidad**: Optimizada con ARIA, semántica HTML5 y navegación por teclado
- **URLs centralizadas**: Todas las URLs de API están en `lib/api/config.ts` para fácil mantenimiento
