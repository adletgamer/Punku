/**
 * Punku — Catálogo del onboarding.
 *
 * Aquí viven las opciones que la usuaria elige en sus primeras tres pantallas
 * y las reglas para traducirlas en un perfil. Sin JSX y sin dependencias:
 * así lo puede importar tanto el contexto del cliente como el motor del perfil.
 */

export type TipoNegocioId = "comida" | "bodega" | "ropa" | "belleza" | "servicios";
export type DiasTrabajoId = "todos" | "casi-todos" | "medios" | "fines";

export interface TipoNegocio {
  id: TipoNegocioId;
  emoji: string;
  etiqueta: string;
  /** Cómo se llamará su negocio en el perfil. */
  negocio: (nombre: string) => string;
  rubro: string;
  /** Qué vende cada vez: "por plato vendido", "por prenda vendida"... */
  unidadVenta: string;
  ticketPromedio: number;
  /** Cómo nombra Punku su venta del día en la boleta. */
  venta: string;
  ventaDetalle: string;
  insumo: string;
}

export const TIPOS_NEGOCIO: TipoNegocio[] = [
  {
    id: "comida",
    emoji: "🍲",
    etiqueta: "Comida",
    negocio: (n) => `Menús de ${n}`,
    rubro: "Menús caseros a la hora del almuerzo",
    unidadVenta: "por plato vendido",
    ticketPromedio: 10,
    venta: "Venta de menús",
    ventaDetalle: "20 platos a S/ 10",
    insumo: "Compra de pollo",
  },
  {
    id: "bodega",
    emoji: "🛒",
    etiqueta: "Bodega",
    negocio: (n) => `Bodega ${n}`,
    rubro: "Abarrotes y productos del día a día",
    unidadVenta: "por compra",
    ticketPromedio: 12,
    venta: "Ventas del día",
    ventaDetalle: "20 ventas a S/ 10",
    insumo: "Reposición de mercadería",
  },
  {
    id: "ropa",
    emoji: "👗",
    etiqueta: "Ropa",
    negocio: (n) => `Ropa de ${n}`,
    rubro: "Ropa y confecciones al detalle",
    unidadVenta: "por prenda vendida",
    ticketPromedio: 35,
    venta: "Venta de prendas",
    ventaDetalle: "20 prendas a S/ 10",
    insumo: "Compra de tela",
  },
  {
    id: "belleza",
    emoji: "🧴",
    etiqueta: "Belleza",
    negocio: (n) => `Belleza ${n}`,
    rubro: "Cuidado personal y belleza",
    unidadVenta: "por atención",
    ticketPromedio: 25,
    venta: "Atenciones del día",
    ventaDetalle: "20 atenciones a S/ 10",
    insumo: "Compra de insumos",
  },
  {
    id: "servicios",
    emoji: "💼",
    etiqueta: "Servicios",
    negocio: (n) => `Servicios de ${n}`,
    rubro: "Servicios a domicilio y por encargo",
    unidadVenta: "por servicio",
    ticketPromedio: 40,
    venta: "Servicios cobrados",
    ventaDetalle: "20 servicios a S/ 10",
    insumo: "Materiales del día",
  },
];

export interface DiasTrabajo {
  id: DiasTrabajoId;
  etiqueta: string;
  detalle: string;
  diasPorSemana: number;
}

export const DIAS_TRABAJO: DiasTrabajo[] = [
  { id: "todos", etiqueta: "Todos los días", detalle: "Los 7 días", diasPorSemana: 7 },
  { id: "casi-todos", etiqueta: "5 o 6 días", detalle: "Descanso un día", diasPorSemana: 6 },
  { id: "medios", etiqueta: "3 o 4 días", detalle: "Media semana", diasPorSemana: 4 },
  { id: "fines", etiqueta: "Fines de semana", detalle: "Sábado y domingo", diasPorSemana: 2 },
];

export function tipoNegocioPor(id: TipoNegocioId | null): TipoNegocio | null {
  return TIPOS_NEGOCIO.find((t) => t.id === id) ?? null;
}

export function diasTrabajoPor(id: DiasTrabajoId | null): DiasTrabajo | null {
  return DIAS_TRABAJO.find((d) => d.id === id) ?? null;
}

/** Primera letra en mayúscula, para el avatar del perfil. */
export function inicialDe(nombre: string): string {
  return (nombre.trim()[0] ?? "R").toUpperCase();
}

/** "rosa maría" -> "Rosa María". Lo que escriba se ve bien igual. */
export function capitalizar(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** Solo el primer nombre: así la saludamos como la saludaría una amiga. */
export function primerNombre(nombre: string): string {
  return capitalizar(nombre).split(" ")[0] ?? "";
}

/* ------------------------------------------------------------------ */
/* Lo que el onboarding recoge y el perfil consume.                    */
/* ------------------------------------------------------------------ */

export interface DiaRegistrado {
  /** Lo que dijo, tal cual quedó en el textarea. */
  transcripcion: string;
  fechaISO: string;
  ingresoNegocio: number;
  gastoNegocio: number;
  gastoHogar: number;
  neto: number;
}

export interface DatosOnboarding {
  nombre: string;
  tipoNegocio: TipoNegocioId | null;
  diasTrabajo: DiasTrabajoId | null;
  dia: DiaRegistrado | null;
}

export const ONBOARDING_VACIO: DatosOnboarding = {
  nombre: "",
  tipoNegocio: null,
  diasTrabajo: null,
  dia: null,
};
