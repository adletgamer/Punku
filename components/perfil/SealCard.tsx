"use client";

import { motion } from "motion/react";
import { CalendarCheck, Users, PiggyBank, Handshake, Check, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Sello } from "@/lib/demo-profile";

const ICONOS = {
  calendario: CalendarCheck,
  clientes: Users,
  ahorro: PiggyBank,
  proveedor: Handshake,
} as const;

export function SealCard({ sello, indice }: { sello: Sello; indice: number }) {
  const Icono = ICONOS[sello.icono];
  const logrado = sello.desbloqueado;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 + indice * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "group relative flex w-full flex-col items-start gap-2 rounded-tarjeta border p-4 text-left transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-arena",
            logrado
              ? "border-ocre/45 bg-ocre-tenue hover:border-ocre/70"
              : "border-hairline bg-candado/40 hover:border-ink/20"
          )}
          aria-label={
            logrado
              ? `Sello conseguido: ${sello.nombre}. ${sello.evidencia}`
              : `Sello por conseguir: ${sello.nombre}. ${sello.requisito}`
          }
        >
          <span
            className={cn(
              "grid size-9 place-items-center rounded-full",
              logrado ? "bg-papel/80 text-ocre-hondo" : "bg-papel/70 text-tinta-tenue"
            )}
          >
            <Icono className="size-[1.15rem]" aria-hidden />
          </span>

          <span
            className={cn(
              "font-display text-[0.98rem] font-semibold leading-tight",
              logrado ? "text-ink" : "text-tinta-suave"
            )}
          >
            {sello.nombre}
          </span>

          <span
            className={cn(
              "text-[0.75rem] leading-snug",
              logrado ? "text-ocre-hondo" : "text-tinta-tenue"
            )}
          >
            {logrado ? sello.fechaLogro : "Te falta poco"}
          </span>

          {/* Barra de avance solo cuando el sello aún no está conseguido */}
          {!logrado && typeof sello.avance === "number" && (
            <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-ink/[0.08]">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: sello.avance }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
                className="block h-full w-full rounded-full bg-ocre"
              />
            </span>
          )}

          {/* Marca de estado: check verdigris o candado */}
          <span
            className={cn(
              "absolute right-3 top-3 grid size-6 place-items-center rounded-full",
              logrado ? "bg-verdigris text-arena" : "bg-ink/[0.07] text-tinta-tenue"
            )}
            aria-hidden
          >
            {logrado ? <Check className="size-3.5" /> : <Lock className="size-3" />}
          </span>
        </motion.button>
      </TooltipTrigger>

      <TooltipContent side="top">
        <p className="font-medium">{sello.descripcion}</p>
        <p className="mt-1.5 text-arena/75">
          {logrado ? sello.evidencia : sello.requisito}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
