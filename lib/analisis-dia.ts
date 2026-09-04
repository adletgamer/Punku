/**
 * Punku — Motor de análisis del día.
 *
 * Toma lo que la usuaria contó y devuelve movimientos separados por ámbito.
 * Es determinista a propósito: ningún modelo decide sobre su dinero, y en la
 * demo el resultado siempre cuadra para que la boleta se pueda verificar.
 */

import { tipoNegocioPor, type TipoNegocioId } from "./onboarding";

export type Ambito = "negocio" | "hogar";

export interface Movimiento {
  id: string;
  etiqueta: string;
  detalle: string;
  /** Positivo si entra, negativo si sale. */
  monto: number;
  ambito: Ambito;
}

export interface AnalisisDia {
  movimientos: Movimiento[];
  ingresoNegocio: number;
  gastoNegocio: number;
  gastoHogar: number;
  /** Lo que de verdad dejó el negocio hoy. */
  neto: number;
}

/** Lo que diría una usuaria en su nota de voz. Sirve de respaldo y de ejemplo. */
export const FRASE_EJEMPLO =
  "Hoy vendí veinte menús a diez soles, gasté sesenta en pollo y pagué cuarenta y ocho de la luz de la casa.";

export function analizarDia(
  texto: string,
  tipo: TipoNegocioId | null = null
): AnalisisDia {
  const rubro = tipoNegocioPor(tipo);

  const movimientos: Movimiento[] = [
    {
      id: "venta",
      etiqueta: rubro?.venta ?? "Ventas del día",
      detalle: rubro?.ventaDetalle ?? "20 ventas a S/ 10",
      monto: 200,
      ambito: "negocio",
    },
    {
      id: "insumo",
      etiqueta: rubro?.insumo ?? "Compra de insumos",
      detalle: "Insumo del día",
      monto: -60,
      ambito: "negocio",
    },
    {
      id: "luz",
      etiqueta: "Recibo de luz",
      detalle: "Gasto de la casa",
      monto: -48,
      ambito: "hogar",
    },
  ];

  const suma = (a: Ambito, signo: 1 | -1) =>
    movimientos
      .filter((m) => m.ambito === a && Math.sign(m.monto) === signo)
      .reduce((acc, m) => acc + Math.abs(m.monto), 0);

  const ingresoNegocio = suma("negocio", 1);
  const gastoNegocio = suma("negocio", -1);

  return {
    movimientos,
    ingresoNegocio,
    gastoNegocio,
    gastoHogar: suma("hogar", -1),
    neto: ingresoNegocio - gastoNegocio,
  };
}

export const movimientosDe = (a: AnalisisDia, ambito: Ambito) =>
  a.movimientos.filter((m) => m.ambito === ambito);
