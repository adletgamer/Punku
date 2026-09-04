"use client";

/**
 * Punku — Estado global del onboarding.
 *
 * Guarda lo que la usuaria nos contó de ella y el primer día que registró.
 * Vive en el layout raíz, así que sobrevive a cada navegación del App Router,
 * y se respalda en localStorage para que un refresco no borre su nombre.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  ONBOARDING_VACIO as VACIO,
  type DatosOnboarding,
  type DiaRegistrado,
  type DiasTrabajoId,
  type TipoNegocioId,
} from "./onboarding";

export type { DatosOnboarding, DiaRegistrado };

const LLAVE = "punku:onboarding";

interface Almacen {
  datos: DatosOnboarding;
  /** Falso hasta que leemos localStorage: evita descuadres de hidratación. */
  hidratado: boolean;
  /** Verdadero cuando ya sabemos quién es. */
  completado: boolean;
  setNombre: (nombre: string) => void;
  setTipoNegocio: (tipo: TipoNegocioId) => void;
  setDiasTrabajo: (dias: DiasTrabajoId) => void;
  guardarDia: (dia: DiaRegistrado) => void;
  reiniciar: () => void;
}

const Contexto = createContext<Almacen | null>(null);

function leerDelNavegador(): DatosOnboarding | null {
  try {
    const crudo = window.localStorage.getItem(LLAVE);
    if (!crudo) return null;
    const guardado = JSON.parse(crudo) as Partial<DatosOnboarding>;
    return { ...VACIO, ...guardado };
  } catch {
    // Modo incógnito, storage lleno o JSON viejo: seguimos sin respaldo.
    return null;
  }
}

/**
 * En el navegador corre antes de pintar, así el nombre no aparece y cambia.
 * En el servidor cae a useEffect, que allí nunca se ejecuta y no avisa nada.
 */
const useEfectoAntesDePintar =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [datos, setDatos] = useState<DatosOnboarding>(VACIO);
  const [hidratado, setHidratado] = useState(false);

  useEfectoAntesDePintar(() => {
    const guardado = leerDelNavegador();
    if (guardado) setDatos(guardado);
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(LLAVE, JSON.stringify(datos));
    } catch {
      // Si no se puede escribir, el estado en memoria basta para la sesión.
    }
  }, [datos, hidratado]);

  const parchar = useCallback(
    (cambio: Partial<DatosOnboarding>) => setDatos((previo) => ({ ...previo, ...cambio })),
    []
  );

  const valor = useMemo<Almacen>(
    () => ({
      datos,
      hidratado,
      completado: Boolean(datos.nombre && datos.tipoNegocio && datos.diasTrabajo),
      setNombre: (nombre) => parchar({ nombre }),
      setTipoNegocio: (tipoNegocio) => parchar({ tipoNegocio }),
      setDiasTrabajo: (diasTrabajo) => parchar({ diasTrabajo }),
      guardarDia: (dia) => parchar({ dia }),
      reiniciar: () => setDatos(VACIO),
    }),
    [datos, hidratado, parchar]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useOnboarding(): Almacen {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useOnboarding necesita estar dentro de <OnboardingProvider>");
  return ctx;
}
