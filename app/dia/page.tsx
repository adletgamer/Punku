"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Mic, Square, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ecualizador } from "@/components/dia/Ecualizador";
import { BoletaDia } from "@/components/dia/BoletaDia";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/lib/onboarding-context";
import { primerNombre } from "@/lib/onboarding";
import { analizarDia, FRASE_EJEMPLO, type AnalisisDia } from "@/lib/analisis-dia";
import { useVoz, type Voz } from "@/lib/use-voz";

const suave = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };

/** Lo que tarda Punku en "pensar" antes de mostrar la boleta. */
const ANALISIS = 1000;

type Etapa = "contar" | "analizando" | "boleta";

export default function DiaPage() {
  const router = useRouter();
  const { datos, guardarDia } = useOnboarding();
  const voz = useVoz(FRASE_EJEMPLO);

  const [etapa, setEtapa] = useState<Etapa>("contar");
  const [analisis, setAnalisis] = useState<AnalisisDia | null>(null);

  const nombre = primerNombre(datos.nombre);
  const hayTexto = voz.texto.trim().length > 0;

  useEffect(() => {
    router.prefetch("/perfil");
  }, [router]);

  useEffect(() => {
    if (etapa !== "analizando") return;
    const t = window.setTimeout(() => {
      setAnalisis(analizarDia(voz.texto, datos.tipoNegocio));
      setEtapa("boleta");
    }, ANALISIS);
    return () => window.clearTimeout(t);
  }, [etapa, voz.texto, datos.tipoNegocio]);

  function guardarYSeguir() {
    if (analisis) {
      guardarDia({
        transcripcion: voz.texto.trim(),
        fechaISO: new Date().toISOString(),
        ingresoNegocio: analisis.ingresoNegocio,
        gastoNegocio: analisis.gastoNegocio,
        gastoHogar: analisis.gastoHogar,
        neto: analisis.neto,
      });
    }
    router.push("/perfil");
  }

  return (
    <main className="flex min-h-dvh flex-col bg-arena">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-8">
        <AnimatePresence mode="wait">
          {etapa === "contar" && (
            <PantallaContar
              key="contar"
              nombre={nombre}
              voz={voz}
              hayTexto={hayTexto}
              onAnalizar={() => setEtapa("analizando")}
            />
          )}

          {etapa === "analizando" && <PantallaAnalizando key="analizando" />}

          {etapa === "boleta" && analisis && (
            <PantallaBoleta
              key="boleta"
              analisis={analisis}
              onContinuar={guardarYSeguir}
              onCorregir={() => {
                setAnalisis(null);
                setEtapa("contar");
              }}
            />
          )}
        </AnimatePresence>

        <Link
          href="/perfil"
          className="mt-5 inline-flex min-h-12 items-center self-center px-4 text-xs text-tinta-tenue transition-colors hover:text-tinta-suave"
        >
          Saltar
        </Link>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Pantalla 1: la tarjeta hero con el micrófono                        */
/* ------------------------------------------------------------------ */

function PantallaContar({
  nombre,
  voz,
  hayTexto,
  onAnalizar,
}: {
  nombre: string;
  voz: Voz;
  hayTexto: boolean;
  onAnalizar: () => void;
}) {
  const reducido = useReducedMotion();
  const escuchando = voz.estado === "escuchando";
  const procesando = voz.estado === "procesando";
  const listo = voz.estado === "listo";

  const rotulo = escuchando
    ? "Punku te está escuchando..."
    : procesando
      ? "Procesando..."
      : listo
        ? "Esto entendí. Corrígelo si querías decir otra cosa."
        : "Toca y cuéntame en una frase.";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={suave}
      className="flex flex-1 flex-col"
    >
      <h1 className="font-display text-[2.1rem] leading-[1.12] text-ink">
        {nombre ? `Cuéntame, ${nombre}.` : "Cuéntame."}
        <span className="mt-1 block text-cochinilla">¿Cómo te fue hoy?</span>
      </h1>

      {/* Tarjeta hero: aquí pasa todo */}
      <div className="mt-7 rounded-tarjeta border border-hairline bg-papel px-6 py-8 shadow-[0_1px_2px_rgba(37,29,25,0.04)]">
        <div className="flex flex-col items-center">
          <div className="relative grid size-[8.5rem] place-items-center">
            {/* Ondas expansivas: solo mientras escucha */}
            {escuchando && !reducido && (
              <>
                {[0, 0.55, 1.1].map((retraso) => (
                  <motion.span
                    key={retraso}
                    aria-hidden
                    className="absolute size-[5.5rem] rounded-full bg-cochinilla/20"
                    initial={{ scale: 1, opacity: 0.55 }}
                    animate={{ scale: 1.55, opacity: 0 }}
                    transition={{
                      duration: 1.65,
                      repeat: Infinity,
                      delay: retraso,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}

            {/* Aro que gira mientras Punku procesa */}
            {procesando && !reducido && (
              <motion.span
                aria-hidden
                className="absolute size-[6.6rem] rounded-full border-2 border-dashed border-cochinilla/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}

            <motion.button
              type="button"
              onClick={escuchando ? voz.detener : voz.escuchar}
              disabled={procesando}
              whileTap={{ scale: 0.94 }}
              animate={
                escuchando && !reducido
                  ? { scale: [1, 1.045, 1] }
                  : { scale: 1 }
              }
              transition={
                escuchando && !reducido
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : suave
              }
              aria-label={
                escuchando
                  ? "Terminar de hablar"
                  : listo
                    ? "Volver a grabar tu día"
                    : "Grabar tu día con la voz"
              }
              aria-pressed={escuchando}
              className={cn(
                "relative grid size-[5.5rem] place-items-center rounded-full text-arena",
                "transition-colors duration-300 disabled:cursor-wait",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-4 focus-visible:ring-offset-papel",
                listo ? "bg-verdigris" : "bg-cochinilla hover:bg-cochinilla-hondo"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {listo ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  >
                    <Check className="size-9" strokeWidth={2.25} aria-hidden />
                  </motion.span>
                ) : escuchando ? (
                  <motion.span
                    key="stop"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                  >
                    <Square className="size-7 fill-current" aria-hidden />
                  </motion.span>
                ) : (
                  <motion.span
                    key="mic"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                  >
                    <Mic className="size-9" aria-hidden />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <Ecualizador
            activo={escuchando || procesando}
            tono={listo ? "verdigris" : "cochinilla"}
            className="mt-3"
          />

          <p
            aria-live="polite"
            className="mt-1 min-h-[2.5rem] max-w-[17rem] text-center text-sm leading-snug text-tinta-suave"
          >
            {rotulo}
          </p>
        </div>

        {/* Lo transcrito, siempre editable */}
        <AnimatePresence>
          {(listo || hayTexto) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={suave}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <label htmlFor="transcripcion" className="sr-only">
                  Lo que contaste, para corregir
                </label>
                <textarea
                  id="transcripcion"
                  value={voz.texto}
                  onChange={(e) => voz.setTexto(e.target.value)}
                  readOnly={!listo}
                  rows={3}
                  className={cn(
                    "w-full resize-none rounded-suave border border-hairline bg-arena/60 px-4 py-3",
                    "font-display text-[1.02rem] leading-snug text-ink",
                    "focus:border-cochinilla/40 focus:outline-none focus:ring-2 focus:ring-cochinilla/15"
                  )}
                />

                {listo && (
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-[0.7rem] leading-snug text-tinta-tenue">
                      {voz.fueSimulada
                        ? "Ejemplo de demostración. Puedes editarlo."
                        : "Puedes editarlo antes de analizar."}
                    </p>
                    <button
                      type="button"
                      onClick={voz.escuchar}
                      aria-label="Grabar el día otra vez"
                      className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.72rem] font-medium text-tinta-suave transition-colors hover:bg-ink/[0.05] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                    >
                      <RotateCcw className="size-3.5" aria-hidden />
                      Repetir
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!voz.soportaVoz && voz.estado === "espera" && (
        <p className="mt-3 text-center text-[0.7rem] leading-snug text-tinta-tenue">
          Tu navegador no reconoce voz: te mostramos un ejemplo real.
        </p>
      )}

      <div className="mt-auto pt-7">
        <Button
          onClick={onAnalizar}
          size="lg"
          className="w-full"
          disabled={!hayTexto || voz.estado !== "listo"}
          aria-label="Analizar mi día"
        >
          <Sparkles aria-hidden />
          Analizar mi día
        </Button>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Pantalla 2: Punku ordena                                            */
/* ------------------------------------------------------------------ */

function PantallaAnalizando() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-1 flex-col items-center justify-center gap-5 py-20 text-center"
      aria-live="polite"
    >
      <motion.span
        aria-hidden
        className="grid size-16 place-items-center rounded-full bg-ocre-tenue"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="size-7 text-ocre-hondo" aria-hidden />
      </motion.span>

      <p className="font-display text-xl text-ink">Separando lo tuyo de lo de la casa</p>
      <Ecualizador activo className="h-6" />
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Pantalla 3: la boleta                                               */
/* ------------------------------------------------------------------ */

function PantallaBoleta({
  analisis,
  onContinuar,
  onCorregir,
}: {
  analisis: AnalisisDia;
  onContinuar: () => void;
  onCorregir: () => void;
}) {
  const fecha = useMemo(
    () =>
      new Date().toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
      }),
    []
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={suave}
      className="flex flex-1 flex-col"
    >
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Esto dejó tu día.
      </h1>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-tinta-suave">
        Ya está ordenado. Si algo no cuadra, lo corriges.
      </p>

      <div className="mt-6">
        <BoletaDia analisis={analisis} fecha={fecha} />
      </div>

      <div className="mt-7 space-y-2.5">
        <Button
          onClick={onContinuar}
          size="lg"
          className="w-full"
          aria-label="Guardar este día y ver mi perfil"
        >
          Continuar
          <ArrowRight aria-hidden />
        </Button>

        <Button
          onClick={onCorregir}
          variant="fantasma"
          size="md"
          className="w-full"
          aria-label="Volver a contar el día"
        >
          <RotateCcw aria-hidden />
          Contarlo de nuevo
        </Button>
      </div>
    </motion.section>
  );
}
