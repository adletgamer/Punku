/**
 * Punku — Perfil de demostración.
 *
 * Toda la data de este archivo es ficticia y sirve para el prototipo.
 * Representa a una emprendedora real de Lima: Rosa Q., 38 años,
 * vende menús caseros en San Juan de Lurigancho.
 *
 * La matemática (netos, promedios, márgenes) se calcula aquí con
 * reglas puras y deterministas. Ningún modelo decide sobre su dinero.
 */

import {
  capitalizar,
  diasTrabajoPor,
  inicialDe,
  primerNombre,
  tipoNegocioPor,
  type DatosOnboarding,
  type DiaRegistrado,
} from "./onboarding";

export type Ambito = "negocio" | "hogar";

export interface RegistroMensual {
  /** Etiqueta corta para el eje del gráfico: "May", "Jun"... */
  mes: string;
  mesLargo: string;
  ingresoNegocio: number;
  gastoNegocio: number;
  ingresoHogar: number;
  gastoHogar: number;
}

export interface Sello {
  id: string;
  nombre: string;
  descripcion: string;
  icono: "calendario" | "clientes" | "ahorro" | "proveedor";
  desbloqueado: boolean;
  /** Qué evidencia real sostiene el sello (solo si está desbloqueado). */
  evidencia?: string;
  fechaLogro?: string;
  /** Qué falta para conseguirlo (solo si está bloqueado). */
  requisito?: string;
  /** Avance hacia el requisito, de 0 a 1. */
  avance?: number;
}

export interface Hito {
  id: string;
  titulo: string;
  detalle: string;
  fecha: string;
  cumplido: boolean;
}

export interface PerfilDemo {
  nombre: string;
  nombreCorto: string;
  inicial: string;
  edad: number;
  negocio: string;
  rubro: string;
  zona: string;
  verificado: boolean;
  mesesDeHistorial: number;
  desde: string;
  /** Cifras de cabecera que resumen el negocio de un vistazo. */
  clientesRecurrentes: number;
  ticketPromedio: number;
  /** Cómo se cuenta cada venta: "por plato vendido", "por prenda vendida"... */
  unidadVenta: string;
  diasActivosPorSemana: number;
  registros: RegistroMensual[];
  sellos: Sello[];
  hitos: Hito[];
  /** Sugerencia generada a partir de sus propias cifras. Nunca decide por ella. */
  sugerencia: string;
}

export const perfilDemo: PerfilDemo = {
  nombre: "Rosa Q.",
  nombreCorto: "Rosa",
  inicial: "R",
  edad: 38,
  negocio: "Menús Doña Rosa",
  rubro: "Menús caseros a la hora del almuerzo",
  zona: "San Juan de Lurigancho, Lima",
  verificado: true,
  mesesDeHistorial: 4,
  desde: "Mayo 2026",
  clientesRecurrentes: 12,
  ticketPromedio: 10,
  unidadVenta: "por plato vendido",
  diasActivosPorSemana: 6,

  registros: [
    {
      mes: "May",
      mesLargo: "Mayo",
      ingresoNegocio: 3120,
      gastoNegocio: 1980,
      ingresoHogar: 3120,
      gastoHogar: 2450,
    },
    {
      mes: "Jun",
      mesLargo: "Junio",
      ingresoNegocio: 3480,
      gastoNegocio: 2090,
      ingresoHogar: 3480,
      gastoHogar: 2380,
    },
    {
      mes: "Jul",
      mesLargo: "Julio",
      ingresoNegocio: 3960,
      gastoNegocio: 2240,
      ingresoHogar: 3960,
      gastoHogar: 2520,
    },
    {
      mes: "Ago",
      mesLargo: "Agosto",
      ingresoNegocio: 4310,
      gastoNegocio: 2360,
      ingresoHogar: 4310,
      gastoHogar: 2470,
    },
  ],

  sellos: [
    {
      id: "constancia",
      nombre: "Constancia",
      descripcion: "Registró su actividad todos los meses, sin faltar.",
      icono: "calendario",
      desbloqueado: true,
      evidencia: "4 meses seguidos con registros: mayo, junio, julio y agosto de 2026.",
      fechaLogro: "Agosto 2026",
    },
    {
      id: "clientela",
      nombre: "Clientela fiel",
      descripcion: "Tiene clientes que vuelven cada semana.",
      icono: "clientes",
      desbloqueado: true,
      evidencia: "12 clientes le compraron 4 semanas o más dentro de los últimos 3 meses.",
      fechaLogro: "Julio 2026",
    },
    {
      id: "colchon",
      nombre: "Colchón propio",
      descripcion: "Guarda una reserva que cubre los gastos flojos.",
      icono: "ahorro",
      desbloqueado: false,
      requisito: "Guardar S/ 600 y mantenerlos durante 2 meses seguidos. Ya lleva S/ 390.",
      avance: 0.65,
    },
    {
      id: "proveedor",
      nombre: "Trato directo",
      descripcion: "Compra al por mayor y negocia mejores precios.",
      icono: "proveedor",
      desbloqueado: false,
      requisito:
        "Registrar 3 compras seguidas al mismo proveedor. Ya lleva 1 de 3.",
      avance: 0.33,
    },
  ],

  hitos: [
    {
      id: "h1",
      titulo: "Primer mes registrado",
      detalle: "Rosa contó su primer día de ventas con una nota de voz.",
      fecha: "Mayo 2026",
      cumplido: true,
    },
    {
      id: "h2",
      titulo: "Separó el negocio del hogar",
      detalle: "Por primera vez vio cuánto deja el negocio de verdad.",
      fecha: "Junio 2026",
      cumplido: true,
    },
    {
      id: "h3",
      titulo: "10 clientes recurrentes",
      detalle: "Su clientela del mediodía empezó a repetir cada semana.",
      fecha: "Julio 2026",
      cumplido: true,
    },
    {
      id: "h4",
      titulo: "Cuatro meses de historial verificable",
      detalle: "Su perfil ya se puede mostrar a un banco o proveedor.",
      fecha: "Agosto 2026",
      cumplido: true,
    },
    {
      id: "h5",
      titulo: "Colchón de S/ 600",
      detalle: "El siguiente sello que está por alcanzar.",
      fecha: "En camino",
      cumplido: false,
    },
  ],

  sugerencia:
    "Tus almuerzos de viernes dejan más que el resto de la semana. Si preparas 5 menús extra ese día, podrías cerrar el mes con cerca de S/ 180 adicionales.",
};

/* ------------------------------------------------------------------ */
/* Motor determinista: puras funciones sobre la data de arriba.        */
/* ------------------------------------------------------------------ */

export interface PuntoFlujo {
  mes: string;
  mesLargo: string;
  negocio: number;
  hogar: number;
}

/** Serie de netos mensuales, lista para el gráfico. */
export function serieDeFlujo(perfil: PerfilDemo = perfilDemo): PuntoFlujo[] {
  return perfil.registros.map((r) => ({
    mes: r.mes,
    mesLargo: r.mesLargo,
    negocio: r.ingresoNegocio - r.gastoNegocio,
    hogar: r.ingresoHogar - r.gastoHogar,
  }));
}

/** Neto del último mes cerrado, por ámbito. */
export function netoDelMes(ambito: Ambito, perfil: PerfilDemo = perfilDemo): number {
  const serie = serieDeFlujo(perfil);
  const ultimo = serie[serie.length - 1];
  return ambito === "negocio" ? ultimo.negocio : ultimo.hogar;
}

/** Variación contra el mes anterior, en porcentaje entero. */
export function variacionMensual(ambito: Ambito, perfil: PerfilDemo = perfilDemo): number {
  const serie = serieDeFlujo(perfil);
  if (serie.length < 2) return 0;
  const actual = ambito === "negocio" ? serie[serie.length - 1].negocio : serie[serie.length - 1].hogar;
  const previo = ambito === "negocio" ? serie[serie.length - 2].negocio : serie[serie.length - 2].hogar;
  if (previo === 0) return 0;
  return Math.round(((actual - previo) / previo) * 100);
}

/** Promedio mensual del ámbito, redondeado a soles enteros. */
export function promedioMensual(ambito: Ambito, perfil: PerfilDemo = perfilDemo): number {
  const serie = serieDeFlujo(perfil);
  const suma = serie.reduce((acc, p) => acc + (ambito === "negocio" ? p.negocio : p.hogar), 0);
  return Math.round(suma / serie.length);
}

/** Ingresos y gastos del negocio en el último mes cerrado. */
export function ultimoMes(perfil: PerfilDemo = perfilDemo) {
  const r = perfil.registros[perfil.registros.length - 1];
  return {
    ...r,
    netoNegocio: r.ingresoNegocio - r.gastoNegocio,
    netoHogar: r.ingresoHogar - r.gastoHogar,
  };
}

/** Margen del negocio en el último mes, en porcentaje entero. */
export function margenNegocio(perfil: PerfilDemo = perfilDemo): number {
  const r = ultimoMes(perfil);
  if (r.ingresoNegocio === 0) return 0;
  return Math.round((r.netoNegocio / r.ingresoNegocio) * 100);
}

/** Formato de soles peruanos, sin decimales para que se lea de un vistazo. */
export function soles(monto: number): string {
  return `S/ ${Math.abs(Math.round(monto)).toLocaleString("es-PE")}`;
}

/* ------------------------------------------------------------------ */
/* El perfil de la usuaria: el demo, vestido con lo que ella nos contó. */
/* ------------------------------------------------------------------ */

/**
 * Devuelve el perfil de demostración personalizado con los datos del
 * onboarding. Si todavía no contó nada, devuelve el perfil tal cual:
 * la demo nunca se queda en blanco.
 */
export function perfilPersonalizado(
  datos: DatosOnboarding,
  base: PerfilDemo = perfilDemo
): PerfilDemo {
  const nombre = primerNombre(datos.nombre);
  const rubro = tipoNegocioPor(datos.tipoNegocio);
  const dias = diasTrabajoPor(datos.diasTrabajo);

  let perfil: PerfilDemo = { ...base };

  if (nombre) {
    perfil = {
      ...perfil,
      nombre: capitalizar(datos.nombre),
      nombreCorto: nombre,
      inicial: inicialDe(nombre),
      negocio: rubro ? rubro.negocio(nombre) : `Negocio de ${nombre}`,
    };
  }

  if (rubro) {
    perfil = {
      ...perfil,
      rubro: rubro.rubro,
      unidadVenta: rubro.unidadVenta,
      ticketPromedio: rubro.ticketPromedio,
    };
  }

  if (dias) {
    perfil = { ...perfil, diasActivosPorSemana: dias.diasPorSemana };
  }

  if (datos.dia) {
    perfil = conDiaRegistrado(perfil, datos.dia);
  }

  return perfil;
}

/**
 * Suma el día que acaba de contar al mes en curso y le agrega el hito.
 * Así, al volver al perfil, ve que su día efectivamente entró.
 */
function conDiaRegistrado(perfil: PerfilDemo, dia: DiaRegistrado): PerfilDemo {
  const registros = perfil.registros.map((r, i) =>
    i === perfil.registros.length - 1
      ? {
          ...r,
          ingresoNegocio: r.ingresoNegocio + dia.ingresoNegocio,
          gastoNegocio: r.gastoNegocio + dia.gastoNegocio,
          ingresoHogar: r.ingresoHogar + dia.ingresoNegocio,
          gastoHogar: r.gastoHogar + dia.gastoHogar,
        }
      : r
  );

  const hito: Hito = {
    id: "hoy",
    titulo: "Contaste tu día de hoy",
    detalle: `Punku separó ${soles(dia.ingresoNegocio)} de ventas y ${soles(
      dia.gastoNegocio + dia.gastoHogar
    )} de gastos. Te quedaron ${soles(dia.neto)}.`,
    fecha: "Hoy",
    cumplido: true,
  };

  // El hito de hoy va antes de lo que todavía está en camino.
  const cumplidos = perfil.hitos.filter((h) => h.cumplido);
  const pendientes = perfil.hitos.filter((h) => !h.cumplido);

  return { ...perfil, registros, hitos: [...cumplidos, hito, ...pendientes] };
}
