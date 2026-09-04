"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Check, ArrowRight, Sparkles, Store, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { perfilDemo, soles } from "@/lib/demo-profile";

const PASOS = 3;

const suave = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

/* Lo que Rosa diría en su nota de voz, palabra por palabra. */
const FRASE =
  "Hoy vendí veinte menús a diez soles, gasté sesenta en pollo y pagué la luz de la casa.";

/* Lo que Punku entiende de esa frase. La matemática es determinista. */
const EXTRAIDO = [
  { etiqueta: "Venta de menús", monto: 200, ambito: "negocio" as const },
  { etiqueta: "Compra de pollo", monto: -60, ambito: "negocio" as const },
  { etiqueta: "Recibo de luz", monto: -48, ambito: "hogar" as const },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);

  // Precargamos el perfil para que el salto final se sienta instantáneo.
  useEffect(() => {
    router.prefetch("/perfil");
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-col bg-arena">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-6">
        {/* Progreso: tres tramos, nada de porcentajes */}
        <div className="flex items-center gap-2" aria-hidden>
          {Array.from({ length: PASOS }).map((_, i) => (
            <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/[0.08]">
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
        <p className="sr-only" aria-live="polite">
          Paso {paso + 1} de {PASOS}
        </p>

        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {paso === 0 && <PasoVoz key="voz" onListo={() => setPaso(1)} />}
            {paso === 1 && <PasoOrden key="orden" onListo={() => setPaso(2)} />}
            {paso === 2 && <PasoListo key="listo" />}
          </AnimatePresence>
        </div>

        {paso < 2 && (
          <Link
            href="/perfil"
            className="mt-4 self-center text-xs text-tinta-tenue transition-colors hover:text-tinta-suave"
          >
            Saltar e ir directo al perfil
          </Link>
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 1: ella cuenta su día                                          */
/* ------------------------------------------------------------------ */

function PasoVoz({ onListo }: { onListo: () => void }) {
  const [estado, setEstado] = useState<"espera" | "grabando" | "transcrito">("espera");
  const palabras = FRASE.split(" ");

  useEffect(() => {
    if (estado !== "grabando") return;
    const t = window.setTimeout(() => setEstado("transcrito"), 2400);
    return () => window.clearTimeout(t);
  }, [estado]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={suave}
      className="flex flex-1 flex-col pt-10"
    >
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Hola, {perfilDemo.nombreCorto}. Cuéntame tu día.
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-tinta-suave">
        Habla como le hablarías a una amiga. No hay respuestas malas y no tienes
        que llenar nada.
      </p>

      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <button
          type="button"
          onClick={() => estado === "espera" && setEstado("grabando")}
          disabled={estado !== "espera"}
          aria-label="Grabar una nota de voz de ejemplo"
          className={cn(
            "relative grid size-24 place-items-center rounded-full transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-4 focus-visible:ring-offset-arena",
            estado === "transcrito"
              ? "bg-verdigris text-arena"
              : "bg-cochinilla text-arena active:scale-[0.97]"
          )}
        >
          {/* Aro que respira solo mientras graba */}
          {estado === "grabando" && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-cochinilla"
              animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {estado === "transcrito" ? (
            <Check className="size-9" strokeWidth={2.25} aria-hidden />
          ) : (
            <Mic className="size-9" aria-hidden />
          )}
        </button>

        <p className="mt-5 h-5 text-sm text-tinta-suave">
          {estado === "espera" && "Toca para hablar"}
          {estado === "grabando" && "Te estoy escuchando..."}
          {estado === "transcrito" && "Entendido, gracias"}
        </p>

        {/* Ondas: nueve barras, suficientes para dar vida sin cargar el equipo */}
        <div className="mt-4 flex h-8 items-center gap-1" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-cochinilla/45"
              animate={
                estado === "grabando"
                  ? { height: [6, 22 - Math.abs(4 - i) * 2.5, 6] }
                  : { height: 6 }
              }
              transition={{
                duration: 0.85,
                repeat: estado === "grabando" ? Infinity : 0,
                delay: i * 0.07,
                ease: "easeInOut",
              }}
              style={{ height: 6 }}
            />
          ))}
        </div>

        {/* La frase aparece palabra por palabra, como si se fuera entendiendo */}
        <AnimatePresence>
          {estado === "transcrito" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 max-w-[19rem] text-center font-display text-[1.05rem] leading-snug text-ink"
            >
              {palabras.map((palabra, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.045, duration: 0.2 }}
                >
                  {palabra}{" "}
                </motion.span>
              ))}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {estado === "transcrito" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...suave, delay: 0.8 }}
          >
            <Button onClick={onListo} size="lg" className="w-full">
              Continuar
              <ArrowRight aria-hidden />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 2: Punku ordena y separa negocio de hogar                      */
/* ------------------------------------------------------------------ */

function PasoOrden({ onListo }: { onListo: () => void }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setListo(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={suave}
      className="flex flex-1 flex-col pt-10"
    >
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Ya separé lo tuyo de lo de la casa.
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-tinta-suave">
        Esto es lo que entendí. Si algo no cuadra, siempre lo puedes corregir.
      </p>

      <ul className="mt-8 space-y-2.5">
        {EXTRAIDO.map((item, i) => {
          const esNegocio = item.ambito === "negocio";
          const Icono = esNegocio ? Store : Home;
          return (
            <motion.li
              key={item.etiqueta}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...suave, delay: 0.15 + i * 0.18 }}
              className="flex items-center gap-3 rounded-tarjeta border border-hairline bg-papel px-4 py-3"
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  esNegocio ? "bg-ocre-tenue text-ocre-hondo" : "bg-ink/[0.055] text-tinta-suave"
                )}
              >
                <Icono className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">
                  {item.etiqueta}
                </span>
                <span className="block text-xs text-tinta-tenue">
                  {esNegocio ? "Negocio" : "Hogar"}
                </span>
              </span>
              <span
                className={cn(
                  "cifra shrink-0 text-sm font-semibold",
                  item.monto > 0 ? "text-verdigris" : "text-ink"
                )}
              >
                {item.monto > 0 ? "+" : "-"}
                {soles(item.monto)}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: listo ? 1 : 0 }}
        transition={suave}
        className="mt-6 rounded-tarjeta bg-ocre-tenue/60 px-4 py-3.5"
      >
        <p className="text-sm leading-snug text-ink">
          Tu negocio dejó{" "}
          <strong className="cifra font-semibold">{soles(140)}</strong> hoy. Eso es
          lo que de verdad te quedó, sin mezclar con la casa.
        </p>
      </motion.div>

      <div className="mt-auto pt-8">
        <AnimatePresence>
          {listo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={suave}
            >
              <Button onClick={onListo} size="lg" className="w-full">
                Continuar
                <ArrowRight aria-hidden />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 3: el perfil está listo                                        */
/* ------------------------------------------------------------------ */

function PasoListo() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={suave}
      className="flex flex-1 flex-col items-center justify-center py-10 text-center"
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="grid size-20 place-items-center rounded-full bg-ocre-tenue text-ocre-hondo ring-1 ring-ocre/40"
      >
        <Sparkles className="size-8" aria-hidden />
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.15 }}
        className="mt-7 font-display text-[1.9rem] leading-tight text-ink"
      >
        Tu perfil está listo.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.25 }}
        className="mt-3 max-w-[20rem] text-[0.98rem] leading-relaxed text-tinta-suave"
      >
        Con {perfilDemo.mesesDeHistorial} meses de historial, tus sellos de
        confianza y tus cifras ordenadas. Todo esto ya era tuyo, ahora se puede
        mostrar.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.35 }}
        className="mt-10 w-full"
      >
        <Button asChild size="lg" className="w-full">
          <Link href="/perfil">
            Ver mi perfil
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}
