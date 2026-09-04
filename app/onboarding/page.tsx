"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Mic,
  Check,
  ArrowRight,
  Store,
  Home,
  CalendarCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import { perfilDemo, soles } from "@/lib/demo-profile";

const PASOS = 3;
const suave = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

/** Cuánto dura la escucha simulada, en segundos. */
const ESCUCHA = 2.4;

/* Lo que Rosa diría en su nota de voz. */
const FRASE =
  "Hoy vendí veinte menús a diez soles, gasté sesenta en pollo y pagué la luz de la casa.";

/* Lo que Punku entiende de esa frase. La matemática es determinista. */
const EXTRAIDO = [
  { etiqueta: "Venta de menús", detalle: "20 platos a S/ 10", monto: 200, ambito: "negocio" as const },
  { etiqueta: "Compra de pollo", detalle: "Insumo del día", monto: -60, ambito: "negocio" as const },
  { etiqueta: "Recibo de luz", detalle: "Gasto de la casa", monto: -48, ambito: "hogar" as const },
];

const mesesDeHistorial = (n: number) => `${Math.round(n)} meses de historial`;

const NETO_NEGOCIO = EXTRAIDO.filter((e) => e.ambito === "negocio").reduce(
  (acc, e) => acc + e.monto,
  0
);

export default function OnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);

  // Precargamos el perfil para que el salto final se sienta instantáneo.
  useEffect(() => {
    router.prefetch("/perfil");
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-col overflow-hidden bg-arena">
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

/** Entrada y salida comunes: cada paso entra por la derecha y sale por la izquierda. */
const variantesPaso = {
  inicial: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
  salida: { opacity: 0, x: -24 },
};

/* ------------------------------------------------------------------ */
/* Paso 1: ella cuenta su día                                          */
/* ------------------------------------------------------------------ */

function PasoVoz({ onListo }: { onListo: () => void }) {
  const [estado, setEstado] = useState<"espera" | "grabando" | "transcrito">("espera");
  const reducido = useReducedMotion();
  const palabras = FRASE.split(" ");

  useEffect(() => {
    if (estado !== "grabando") return;
    const t = window.setTimeout(() => setEstado("transcrito"), ESCUCHA * 1000);
    return () => window.clearTimeout(t);
  }, [estado]);

  return (
    <motion.section
      variants={variantesPaso}
      initial="inicial"
      animate="visible"
      exit="salida"
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
        <div className="relative grid size-32 place-items-center">
          {/* Aro que se llena mientras te escucha: se ve cuánto falta */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="2.5"
              className="stroke-ink/[0.08]"
            />
            {estado !== "espera" && (
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="stroke-cochinilla"
                initial={{ pathLength: estado === "transcrito" ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reducido ? 0 : ESCUCHA, ease: "linear" }}
              />
            )}
          </svg>

          {/* Onda que respira solo mientras graba */}
          {estado === "grabando" && !reducido && (
            <motion.span
              aria-hidden
              className="absolute size-24 rounded-full bg-cochinilla/15"
              animate={{ scale: [1, 1.28], opacity: [0.7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <motion.button
            type="button"
            onClick={() => estado === "espera" && setEstado("grabando")}
            disabled={estado !== "espera"}
            whileTap={{ scale: 0.94 }}
            aria-label="Grabar una nota de voz de ejemplo"
            className={cn(
              "relative grid size-24 place-items-center rounded-full transition-colors duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-4 focus-visible:ring-offset-arena",
              estado === "transcrito" ? "bg-verdigris text-arena" : "bg-cochinilla text-arena"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {estado === "transcrito" ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Check className="size-9" strokeWidth={2.25} aria-hidden />
                </motion.span>
              ) : (
                <motion.span key="mic" exit={{ scale: 0.7, opacity: 0 }}>
                  <Mic className="size-9" aria-hidden />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

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
              className={cn(
                "w-1 rounded-full transition-colors duration-300",
                estado === "transcrito" ? "bg-verdigris/40" : "bg-cochinilla/45"
              )}
              animate={
                estado === "grabando" && !reducido
                  ? { height: [6, 24 - Math.abs(4 - i) * 3, 6] }
                  : { height: 6 }
              }
              transition={{
                duration: 0.8,
                repeat: estado === "grabando" && !reducido ? Infinity : 0,
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
                  className="inline-block"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
                >
                  {palabra}&nbsp;
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
            transition={{ ...suave, delay: 0.9 }}
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

  const grupos = [
    {
      clave: "negocio" as const,
      titulo: "Lo del negocio",
      icono: Store,
      items: EXTRAIDO.filter((e) => e.ambito === "negocio"),
    },
    {
      clave: "hogar" as const,
      titulo: "Lo de la casa",
      icono: Home,
      items: EXTRAIDO.filter((e) => e.ambito === "hogar"),
    },
  ];

  useEffect(() => {
    const t = window.setTimeout(() => setListo(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  let indiceGlobal = 0;

  return (
    <motion.section
      variants={variantesPaso}
      initial="inicial"
      animate="visible"
      exit="salida"
      transition={suave}
      className="flex flex-1 flex-col pt-10"
    >
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Ya separé lo tuyo de lo de la casa.
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-tinta-suave">
        Esto es lo que entendí. Si algo no cuadra, siempre lo puedes corregir.
      </p>

      <div className="mt-7 space-y-5">
        {grupos.map((grupo, g) => {
          const Icono = grupo.icono;
          return (
            <div key={grupo.clave}>
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...suave, delay: g * 0.5 }}
                className="mb-2 flex items-center gap-2"
              >
                <Icono
                  className={cn(
                    "size-3.5",
                    grupo.clave === "negocio" ? "text-ocre-hondo" : "text-tinta-tenue"
                  )}
                  aria-hidden
                />
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-tinta-tenue">
                  {grupo.titulo}
                </h2>
                <span className="h-px flex-1 bg-hairline" />
              </motion.div>

              <ul className="space-y-2">
                {grupo.items.map((item) => {
                  const i = indiceGlobal++;
                  const entra = item.monto > 0;
                  return (
                    <motion.li
                      key={item.etiqueta}
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.25 + i * 0.35,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex items-center gap-3 rounded-tarjeta border border-hairline bg-papel px-4 py-3"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">
                          {item.etiqueta}
                        </span>
                        <span className="block text-xs text-tinta-tenue">{item.detalle}</span>
                      </span>
                      <span
                        className={cn(
                          "cifra shrink-0 text-sm font-semibold",
                          entra ? "text-verdigris" : "text-ink"
                        )}
                      >
                        {entra ? "+" : "−"}
                        {soles(item.monto)}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={listo ? { opacity: 1, y: 0 } : {}}
        transition={suave}
        className="mt-6 rounded-tarjeta bg-ocre-tenue/70 px-4 py-4"
      >
        <p className="text-xs text-ocre-hondo">Tu negocio dejó hoy</p>
        <p className="cifra mt-1 font-display text-3xl font-semibold leading-none text-ink">
          {listo ? <CountUp valor={NETO_NEGOCIO} formato={soles} /> : soles(0)}
        </p>
        <p className="mt-2 text-xs leading-snug text-ink/75">
          Eso es lo que de verdad te quedó, sin mezclar con la casa.
        </p>
      </motion.div>

      <div className="mt-auto pt-8">
        <AnimatePresence>
          {listo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...suave, delay: 0.4 }}
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
  const reducido = useReducedMotion();
  const sellos = perfilDemo.sellos.filter((s) => s.desbloqueado);
  const iconos = { calendario: CalendarCheck, clientes: Users } as const;

  return (
    <motion.section
      variants={variantesPaso}
      initial="inicial"
      animate="visible"
      exit="salida"
      transition={suave}
      className="flex flex-1 flex-col items-center justify-center py-10 text-center"
    >
      <div className="relative grid size-24 place-items-center">
        {/* Un solo pulso al llegar, no un latido permanente */}
        {!reducido && (
          <motion.span
            aria-hidden
            className="absolute size-20 rounded-full bg-ocre/25"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
          />
        )}
        <motion.span
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="grid size-20 place-items-center rounded-full bg-ocre-tenue ring-1 ring-ocre/40"
        >
          <span className="font-display text-3xl font-semibold text-ocre-hondo">
            {perfilDemo.inicial}
          </span>
        </motion.span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.2 }}
        className="mt-7 font-display text-[1.9rem] leading-tight text-ink"
      >
        Tu perfil está listo.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.3 }}
        className="mt-3 max-w-[20rem] text-[0.98rem] leading-relaxed text-tinta-suave"
      >
        Todo esto ya era tuyo. Ahora se puede mostrar.
      </motion.p>

      {/* Los sellos ya ganados aterrizan uno por uno */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...suave, delay: 0.45 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.055] px-3 py-1.5 text-xs font-medium text-ink"
        >
          <CountUp
            valor={perfilDemo.mesesDeHistorial}
            formato={mesesDeHistorial}
            retraso={0.5}
            className="cifra"
          />
        </motion.span>

        {sellos.map((sello, i) => {
          const Icono = iconos[sello.icono as keyof typeof iconos] ?? CalendarCheck;
          return (
            <motion.span
              key={sello.id}
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...suave, delay: 0.55 + i * 0.12 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-ocre-tenue px-3 py-1.5 text-xs font-medium text-ocre-hondo"
            >
              <Icono className="size-3.5" aria-hidden />
              {sello.nombre}
            </motion.span>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.8 }}
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
