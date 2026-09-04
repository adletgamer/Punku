"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/lib/onboarding-context";
import {
  DIAS_TRABAJO,
  TIPOS_NEGOCIO,
  primerNombre,
  type DiasTrabajoId,
  type TipoNegocioId,
} from "@/lib/onboarding";

const PASOS = 3;
const suave = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

/** El respiro entre que toca una opción y la pantalla avanza. */
const LATENCIA = 320;

const variantesPaso = {
  inicial: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0 },
  salida: { opacity: 0, x: -28 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { datos, hidratado, setNombre, setTipoNegocio, setDiasTrabajo } = useOnboarding();
  const [paso, setPaso] = useState(0);
  const relojes = useRef<number[]>([]);

  useEffect(() => {
    router.prefetch("/dia");
    router.prefetch("/perfil");
  }, [router]);

  // Si sale a medio camino, no dejamos avances programados sueltos.
  useEffect(() => {
    const propios = relojes.current;
    return () => propios.forEach(window.clearTimeout);
  }, []);

  const luego = (fn: () => void, ms = LATENCIA) => {
    relojes.current.push(window.setTimeout(fn, ms));
  };

  const elegirNegocio = (id: TipoNegocioId) => {
    setTipoNegocio(id);
    luego(() => setPaso(2));
  };

  const elegirDias = (id: DiasTrabajoId) => {
    setDiasTrabajo(id);
    luego(() => router.push("/dia"), 460);
  };

  return (
    <main className="flex min-h-dvh flex-col overflow-hidden bg-arena">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (paso === 0 ? router.push("/") : setPaso((p) => p - 1))}
            aria-label={paso === 0 ? "Volver al inicio" : "Volver al paso anterior"}
            className="-ml-2 grid size-12 shrink-0 place-items-center rounded-full text-tinta-suave transition-colors hover:bg-ink/[0.05] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>

          <div className="flex flex-1 items-center gap-2" aria-hidden>
            {Array.from({ length: PASOS }).map((_, i) => (
              <span
                key={i}
                className="h-1 flex-1 overflow-hidden rounded-full bg-ink/[0.08]"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleX: i <= paso ? 1 : 0 }}
                  transition={suave}
                  style={{ transformOrigin: "left" }}
                  className="block h-full w-full rounded-full bg-cochinilla"
                />
              </span>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Paso {paso + 1} de {PASOS}
        </p>

        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait" initial={false}>
            {paso === 0 && (
              <PasoNombre
                key="nombre"
                nombre={datos.nombre}
                hidratado={hidratado}
                onCambiar={setNombre}
                onContinuar={() => setPaso(1)}
              />
            )}
            {paso === 1 && (
              <PasoNegocio
                key="negocio"
                nombre={datos.nombre}
                elegido={datos.tipoNegocio}
                onElegir={elegirNegocio}
              />
            )}
            {paso === 2 && (
              <PasoDias key="dias" elegido={datos.diasTrabajo} onElegir={elegirDias} />
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/perfil"
          className="mt-4 inline-flex min-h-12 items-center self-center px-4 text-xs text-tinta-tenue transition-colors hover:text-tinta-suave"
        >
          Saltar e ir directo al perfil
        </Link>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 1: cómo te llamas                                              */
/* ------------------------------------------------------------------ */

function PasoNombre({
  nombre,
  hidratado,
  onCambiar,
  onContinuar,
}: {
  nombre: string;
  hidratado: boolean;
  onCambiar: (n: string) => void;
  onContinuar: () => void;
}) {
  const campo = useRef<HTMLInputElement>(null);
  const listo = nombre.trim().length > 0;

  // El teclado aparece solo: una fricción menos.
  useEffect(() => {
    if (!hidratado) return;
    const t = window.setTimeout(() => campo.current?.focus(), 380);
    return () => window.clearTimeout(t);
  }, [hidratado]);

  return (
    <motion.section
      variants={variantesPaso}
      initial="inicial"
      animate="visible"
      exit="salida"
      transition={suave}
      className="flex flex-1 flex-col pt-12"
    >
      <h1 className="font-display text-[2.1rem] leading-[1.12] text-ink">
        Hola.
        <span className="mt-1 block text-cochinilla">¿Cómo te llamas?</span>
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-tinta-suave">
        Así te llamo yo. No se lo cuento a nadie.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (listo) onContinuar();
        }}
        className="mt-8"
      >
        <label htmlFor="nombre" className="sr-only">
          Tu nombre
        </label>
        <input
          ref={campo}
          id="nombre"
          name="nombre"
          type="text"
          value={nombre}
          onChange={(e) => onCambiar(e.target.value)}
          placeholder="Rosa"
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="next"
          maxLength={40}
          className="h-14 w-full rounded-suave border border-hairline bg-papel px-4 font-display text-2xl text-ink placeholder:text-tinta-tenue/60 focus:border-cochinilla/50 focus:outline-none focus:ring-2 focus:ring-cochinilla/20"
        />

        <div className="mt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!listo}
            aria-label="Continuar al siguiente paso"
          >
            Continuar
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </form>

      <div className="flex-1" />
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 2: a qué te dedicas                                            */
/* ------------------------------------------------------------------ */

function PasoNegocio({
  nombre,
  elegido,
  onElegir,
}: {
  nombre: string;
  elegido: TipoNegocioId | null;
  onElegir: (id: TipoNegocioId) => void;
}) {
  return (
    <motion.section
      variants={variantesPaso}
      initial="inicial"
      animate="visible"
      exit="salida"
      transition={suave}
      className="flex flex-1 flex-col pt-12"
    >
      <h1 className="font-display text-[2.1rem] leading-[1.12] text-ink">
        Mucho gusto, {primerNombre(nombre) || "amiga"}.
        <span className="mt-1 block text-cochinilla">¿A qué te dedicas?</span>
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-tinta-suave">
        Elige lo más parecido. Después lo afinamos.
      </p>

      <ul className="mt-7 space-y-2.5">
        {TIPOS_NEGOCIO.map((tipo, i) => (
          <motion.li
            key={tipo.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...suave, delay: 0.05 + i * 0.05 }}
          >
            <OpcionGrande
              activo={elegido === tipo.id}
              emoji={tipo.emoji}
              titulo={tipo.etiqueta}
              detalle={tipo.rubro}
              etiquetaAria={`${tipo.etiqueta}: ${tipo.rubro}`}
              onClick={() => onElegir(tipo.id)}
            />
          </motion.li>
        ))}
      </ul>

      <div className="flex-1" />
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 3: cuántos días abres                                          */
/* ------------------------------------------------------------------ */

function PasoDias({
  elegido,
  onElegir,
}: {
  elegido: DiasTrabajoId | null;
  onElegir: (id: DiasTrabajoId) => void;
}) {
  return (
    <motion.section
      variants={variantesPaso}
      initial="inicial"
      animate="visible"
      exit="salida"
      transition={suave}
      className="flex flex-1 flex-col pt-12"
    >
      <h1 className="font-display text-[2.1rem] leading-[1.12] text-ink">
        Última.
        <span className="mt-1 block text-cochinilla">¿Cuántos días abres?</span>
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-tinta-suave">
        Con esto sé cuándo preguntarte y cuándo dejarte descansar.
      </p>

      <ul className="mt-7 space-y-2.5">
        {DIAS_TRABAJO.map((dia, i) => (
          <motion.li
            key={dia.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...suave, delay: 0.05 + i * 0.05 }}
          >
            <OpcionGrande
              activo={elegido === dia.id}
              titulo={dia.etiqueta}
              detalle={dia.detalle}
              etiquetaAria={`${dia.etiqueta}, ${dia.detalle}`}
              onClick={() => onElegir(dia.id)}
            />
          </motion.li>
        ))}
      </ul>

      <div className="flex-1" />
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */

function OpcionGrande({
  activo,
  emoji,
  titulo,
  detalle,
  etiquetaAria,
  onClick,
}: {
  activo: boolean;
  emoji?: string;
  titulo: string;
  detalle: string;
  etiquetaAria: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      aria-label={etiquetaAria}
      aria-pressed={activo}
      className={cn(
        "flex min-h-[3.75rem] w-full items-center gap-3.5 rounded-tarjeta border px-4 py-3 text-left",
        "transition-[background-color,border-color] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-arena",
        activo
          ? "border-cochinilla/45 bg-cochinilla-tenue"
          : "border-hairline bg-papel hover:border-ink/20"
      )}
    >
      {emoji && (
        <span
          aria-hidden
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full text-[1.35rem] transition-colors duration-200",
            activo ? "bg-papel" : "bg-arena-hondo"
          )}
        >
          {emoji}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block text-[1.02rem] font-medium leading-tight text-ink">
          {titulo}
        </span>
        <span className="mt-0.5 block truncate text-xs text-tinta-suave">{detalle}</span>
      </span>

      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-200",
          activo ? "border-cochinilla bg-cochinilla" : "border-ink/15"
        )}
      >
        <AnimatePresence>
          {activo && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="size-2 rounded-full bg-arena"
            />
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
