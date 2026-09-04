"use client";

/**
 * Punku — Dictado por voz.
 *
 * Usa la Web Speech API del navegador cuando existe (Chrome, Edge, Safari) y,
 * si no, cae en una simulación que se comporta igual de bien: la usuaria nunca
 * ve un error, solo ve que Punku la escuchó.
 *
 * Los tipos se declaran aquí en local, con nombres propios, para no chocar con
 * las definiciones que algunas versiones de lib.dom ya traen.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type EstadoVoz = "espera" | "escuchando" | "procesando" | "listo";

interface ResultadoVoz {
  readonly isFinal: boolean;
  readonly length: number;
  item(i: number): { transcript: string };
  [i: number]: { transcript: string };
}

interface EventoResultado {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    item(i: number): ResultadoVoz;
    [i: number]: ResultadoVoz;
  };
}

interface Reconocimiento {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: EventoResultado) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type ConstructorReconocimiento = new () => Reconocimiento;

function constructorDeVoz(): ConstructorReconocimiento | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstructorReconocimiento;
    webkitSpeechRecognition?: ConstructorReconocimiento;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Cuánto dura la escucha simulada, en milisegundos. */
const SIMULACION = 2000;
/** El respiro de "Procesando..." antes de mostrar el texto. */
const PROCESADO = 650;

export interface Voz {
  estado: EstadoVoz;
  /** Lo que se lleva escuchado, incluidas las palabras aún provisionales. */
  texto: string;
  /** Falso cuando el navegador no reconoce voz y estamos simulando. */
  soportaVoz: boolean;
  /** Verdadero si esta escucha terminó siendo una simulación. */
  fueSimulada: boolean;
  escuchar: () => void;
  detener: () => void;
  reiniciar: () => void;
  setTexto: (texto: string) => void;
}

export function useVoz(fraseDeRespaldo: string): Voz {
  const [estado, setEstado] = useState<EstadoVoz>("espera");
  const [texto, setTexto] = useState("");
  const [soportaVoz, setSoportaVoz] = useState(false);
  const [fueSimulada, setFueSimulada] = useState(false);

  const reconocimiento = useRef<Reconocimiento | null>(null);
  const finalRef = useRef("");
  const temporizadores = useRef<number[]>([]);

  useEffect(() => {
    setSoportaVoz(constructorDeVoz() !== null);
  }, []);

  const limpiarTiempos = useCallback(() => {
    temporizadores.current.forEach(window.clearTimeout);
    temporizadores.current = [];
  }, []);

  const esperar = useCallback((fn: () => void, ms: number) => {
    temporizadores.current.push(window.setTimeout(fn, ms));
  }, []);

  /** El plan B: pulsamos dos segundos y devolvemos una frase creíble. */
  const simular = useCallback(() => {
    setFueSimulada(true);
    setEstado("escuchando");
    esperar(() => {
      setEstado("procesando");
      esperar(() => {
        finalRef.current = fraseDeRespaldo;
        setTexto(fraseDeRespaldo);
        setEstado("listo");
      }, PROCESADO);
    }, SIMULACION);
  }, [esperar, fraseDeRespaldo]);

  const cerrar = useCallback(() => {
    const rec = reconocimiento.current;
    reconocimiento.current = null;
    if (!rec) return;
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    rec.onstart = null;
    try {
      rec.abort();
    } catch {
      // Ya estaba cerrado: nada que hacer.
    }
  }, []);

  const escuchar = useCallback(() => {
    limpiarTiempos();
    finalRef.current = "";
    setTexto("");
    setFueSimulada(false);

    const Ctor = constructorDeVoz();
    if (!Ctor) {
      simular();
      return;
    }

    let hablo = false;
    const rec = new Ctor();
    rec.lang = "es-PE";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setEstado("escuchando");

    rec.onresult = (e) => {
      let provisional = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const resultado = e.results[i];
        const frase = resultado[0]?.transcript ?? "";
        if (resultado.isFinal) finalRef.current += frase;
        else provisional += frase;
      }
      const completo = (finalRef.current + provisional).trimStart();
      if (completo) hablo = true;
      setTexto(completo);
    };

    rec.onerror = () => {
      // Permiso denegado, sin micrófono o sin red: no la dejamos colgada.
      cerrar();
      if (!hablo) simular();
      else setEstado("listo");
    };

    rec.onend = () => {
      cerrar();
      if (!hablo) {
        simular();
        return;
      }
      setEstado("procesando");
      esperar(() => {
        setTexto(finalRef.current.trim());
        setEstado("listo");
      }, PROCESADO);
    };

    reconocimiento.current = rec;
    try {
      rec.start();
      setEstado("escuchando");
    } catch {
      cerrar();
      simular();
    }
  }, [cerrar, esperar, limpiarTiempos, simular]);

  const detener = useCallback(() => {
    const rec = reconocimiento.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        cerrar();
        setEstado("listo");
      }
      return;
    }
    // Estábamos simulando: cortamos la espera y entregamos la frase igual.
    limpiarTiempos();
    setEstado("procesando");
    esperar(() => {
      finalRef.current = fraseDeRespaldo;
      setTexto(fraseDeRespaldo);
      setEstado("listo");
    }, PROCESADO);
  }, [cerrar, esperar, fraseDeRespaldo, limpiarTiempos]);

  const reiniciar = useCallback(() => {
    limpiarTiempos();
    cerrar();
    finalRef.current = "";
    setTexto("");
    setEstado("espera");
  }, [cerrar, limpiarTiempos]);

  useEffect(() => {
    return () => {
      limpiarTiempos();
      cerrar();
    };
  }, [cerrar, limpiarTiempos]);

  return { estado, texto, soportaVoz, fueSimulada, escuchar, detener, reiniciar, setTexto };
}
