"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import { soles } from "@/lib/demo-profile";
import { movimientosDe, type AnalisisDia } from "@/lib/analisis-dia";

const suave = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

const GRUPOS = [
  {
    clave: "negocio" as const,
    titulo: "Lo del negocio",
    emoji: "🏪",
    tono: "text-ocre-hondo",
  },
  {
    clave: "hogar" as const,
    titulo: "Lo de la casa",
    emoji: "🏠",
    tono: "text-tinta-tenue",
  },
];

export function BoletaDia({
  analisis,
  fecha,
}: {
  analisis: AnalisisDia;
  fecha: string;
}) {
  let indice = 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Resumen de tu día"
      className={cn(
        "relative rounded-tarjeta bg-papel px-5 pb-6 pt-6",
        // El corte de una boleta de verdad: punteado arriba y abajo.
        "border-y-2 border-dashed border-ocre/35",
        "shadow-[0_2px_12px_rgba(37,29,25,0.07)]"
      )}
    >
      <header className="border-b border-dashed border-hairline pb-4 text-center">
        <p className="font-display text-[0.95rem] font-semibold tracking-[0.18em] text-ink">
          PUNKU
        </p>
        <p className="mt-1 text-[0.7rem] uppercase tracking-[0.1em] text-tinta-tenue">
          Tu día · {fecha}
        </p>
      </header>

      {GRUPOS.map((grupo) => {
        const items = movimientosDe(analisis, grupo.clave);
        if (items.length === 0) return null;

        return (
          <section key={grupo.clave} className="pt-5">
            <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-tinta-tenue">
              <span aria-hidden className="text-sm">
                {grupo.emoji}
              </span>
              <span className={grupo.tono}>{grupo.titulo}</span>
              <span className="h-px flex-1 bg-hairline" />
            </h3>

            <ul className="mt-3 space-y-2.5">
              {items.map((m) => {
                const entra = m.monto > 0;
                const i = indice++;
                return (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...suave, delay: 0.18 + i * 0.12 }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink">{m.etiqueta}</span>
                      <span className="block text-[0.72rem] text-tinta-tenue">
                        {m.detalle}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="h-px min-w-4 flex-1 self-center border-b border-dotted border-hairline"
                    />
                    <span
                      className={cn(
                        "cifra shrink-0 text-sm font-semibold tabular-nums",
                        entra ? "text-verdigris" : "text-ink"
                      )}
                    >
                      {entra ? "+" : "−"}
                      {soles(m.monto)}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="relative my-5 border-t border-dashed border-hairline">
        <span
          aria-hidden
          className="absolute -left-[1.4rem] top-1/2 size-4 -translate-y-1/2 rounded-full bg-arena"
        />
        <span
          aria-hidden
          className="absolute -right-[1.4rem] top-1/2 size-4 -translate-y-1/2 rounded-full bg-arena"
        />
      </div>

      <motion.footer
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...suave, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue">
          Te quedó del negocio
        </p>
        <p className="cifra mt-2 font-display text-[3rem] font-semibold leading-none text-verdigris">
          <CountUp valor={analisis.neto} formato={soles} duracion={1} retraso={0.6} />
        </p>
        <p className="mx-auto mt-3 max-w-[17rem] text-[0.78rem] leading-snug text-tinta-suave">
          La luz de la casa no le resta a tu negocio. Por eso van separadas.
        </p>
      </motion.footer>
    </motion.article>
  );
}
