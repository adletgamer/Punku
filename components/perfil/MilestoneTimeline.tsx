"use client";

import { motion } from "motion/react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PerfilDemo } from "@/lib/demo-profile";

export function MilestoneTimeline({ perfil }: { perfil: PerfilDemo }) {
  return (
    <section aria-labelledby="titulo-hitos">
      <h2 id="titulo-hitos" className="font-display text-xl text-ink">
        Tu camino hasta hoy
      </h2>
      <p className="mt-1 text-sm text-tinta-suave">
        Todo esto ya lo lograste. Nadie te lo puede quitar.
      </p>

      <ol className="mt-5 space-y-0">
        {perfil.hitos.map((hito, i) => {
          const ultimo = i === perfil.hitos.length - 1;
          return (
            <motion.li
              key={hito.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Riel vertical */}
              {!ultimo && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[0.6875rem] top-6 bottom-0 w-px",
                    hito.cumplido ? "bg-ocre/40" : "bg-hairline"
                  )}
                />
              )}

              <span
                aria-hidden
                className={cn(
                  "relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                  hito.cumplido
                    ? "bg-ocre text-ink"
                    : "border border-dashed border-ink/25 bg-arena text-tinta-tenue"
                )}
              >
                {hito.cumplido ? (
                  <Check className="size-3.5" strokeWidth={2.75} />
                ) : (
                  <Circle className="size-2 fill-current" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3
                    className={cn(
                      "font-display text-[1.02rem] font-semibold leading-tight",
                      hito.cumplido ? "text-ink" : "text-tinta-suave"
                    )}
                  >
                    {hito.titulo}
                  </h3>
                  <span className="shrink-0 text-[0.72rem] text-tinta-tenue">
                    {hito.fecha}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-tinta-suave">{hito.detalle}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
