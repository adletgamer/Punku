"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  type TooltipProps,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  serieDeFlujo,
  netoDelMes,
  variacionMensual,
  promedioMensual,
  soles,
  type Ambito,
  type PerfilDemo,
} from "@/lib/demo-profile";

/**
 * Colores de las series. El negocio es el sujeto del gráfico y va en ocre;
 * el hogar es el contexto y va en gris, por eso es deliberadamente discreto.
 * Ambos superan contraste 3:1 sobre el papel y se separan también por trazo
 * y por etiqueta, nunca solo por color.
 */
const COLOR_NEGOCIO = "oklch(0.655 0.142 76)";
const COLOR_HOGAR = "oklch(0.46 0.016 58)";

const ETIQUETA: Record<Ambito, string> = {
  negocio: "Negocio",
  hogar: "Hogar",
};

function TooltipFlujo({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-suave border border-hairline bg-papel px-3 py-2 shadow-md">
      <p className="text-[0.7rem] font-medium uppercase tracking-wide text-tinta-tenue">
        {label}
      </p>
      <ul className="mt-1.5 space-y-1">
        {payload.map((serie) => (
          <li key={serie.dataKey as string} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: serie.color }}
            />
            <span className="text-tinta-suave">{ETIQUETA[serie.dataKey as Ambito]}</span>
            <span className="cifra ml-auto font-medium text-ink">
              {soles(serie.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CashflowCard({ perfil }: { perfil: PerfilDemo }) {
  const [ambito, setAmbito] = useState<Ambito>("negocio");
  const datos = serieDeFlujo(perfil);
  const neto = netoDelMes(ambito, perfil);
  const variacion = variacionMensual(ambito, perfil);
  const promedio = promedioMensual(ambito, perfil);
  const subeAlgo = variacion >= 0;
  const ultimoMes = perfil.registros[perfil.registros.length - 1].mesLargo;

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5">
        <div
          role="tablist"
          aria-label="Elige qué quieres mirar"
          className="relative flex rounded-full bg-ink/[0.05] p-1"
        >
          {(["negocio", "hogar"] as const).map((opcion) => {
            const activo = ambito === opcion;
            return (
              <button
                key={opcion}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => setAmbito(opcion)}
                className={cn(
                  "relative z-10 flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-150",
                  activo ? "text-ink" : "text-tinta-suave"
                )}
              >
                {activo && (
                  <motion.span
                    layoutId="pastilla-ambito"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-papel shadow-[0_1px_3px_rgba(37,29,25,0.10)]"
                  />
                )}
                {ETIQUETA[opcion]}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="text-sm text-tinta-suave">Lo que te quedó en {ultimoMes}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={ambito}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="cifra mt-1 font-display text-[2.65rem] font-semibold leading-none text-ink"
            >
              {soles(neto)}
            </motion.p>
          </AnimatePresence>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                subeAlgo
                  ? "bg-verdigris-tenue text-verdigris"
                  : "bg-cochinilla-tenue text-cochinilla"
              )}
            >
              {subeAlgo ? (
                <TrendingUp className="size-3.5" aria-hidden />
              ) : (
                <TrendingDown className="size-3.5" aria-hidden />
              )}
              {subeAlgo ? "+" : "-"}
              {Math.abs(variacion)}% frente al mes pasado
            </span>
            <span className="cifra text-xs text-tinta-tenue">
              Promedio de {perfil.mesesDeHistorial} meses: {soles(promedio)}
            </span>
          </div>
        </div>

        <figure className="mt-6">
          <figcaption className="sr-only">
            Lo que quedó cada mes, separando negocio y hogar, de{" "}
            {perfil.registros[0].mesLargo} a {ultimoMes}.
          </figcaption>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datos} margin={{ top: 8, right: 10, bottom: 0, left: -18 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="oklch(0.89 0.012 75)"
                  strokeDasharray="2 4"
                />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.66 0.014 60)", fontSize: 12 }}
                  dy={6}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={54}
                  tick={{ fill: "oklch(0.66 0.014 60)", fontSize: 11 }}
                  tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}k`)}
                />
                <RechartsTooltip
                  content={<TooltipFlujo />}
                  cursor={{ stroke: "oklch(0.66 0.014 60)", strokeDasharray: "3 3" }}
                />
                <Line
                  type="monotone"
                  dataKey="hogar"
                  stroke={COLOR_HOGAR}
                  strokeWidth={ambito === "hogar" ? 2.5 : 1.5}
                  strokeDasharray="5 4"
                  strokeOpacity={ambito === "hogar" ? 1 : 0.6}
                  dot={false}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: "oklch(0.995 0.004 85)" }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="negocio"
                  stroke={COLOR_NEGOCIO}
                  strokeWidth={ambito === "negocio" ? 2.5 : 1.5}
                  strokeOpacity={ambito === "negocio" ? 1 : 0.6}
                  dot={false}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: "oklch(0.995 0.004 85)" }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-3">
            <li className="flex items-center gap-2 text-xs text-tinta-suave">
              <svg width="18" height="8" aria-hidden className="shrink-0">
                <line x1="0" y1="4" x2="18" y2="4" stroke={COLOR_NEGOCIO} strokeWidth="2.5" />
              </svg>
              Negocio
            </li>
            <li className="flex items-center gap-2 text-xs text-tinta-suave">
              <svg width="18" height="8" aria-hidden className="shrink-0">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke={COLOR_HOGAR}
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />
              </svg>
              Hogar
            </li>
          </ul>
        </figure>

        <details className="mt-4 border-t border-hairline pt-3">
          <summary className="cursor-pointer list-none text-xs font-medium text-tinta-suave hover:text-ink">
            Ver las cifras mes por mes
          </summary>
          <table className="mt-3 w-full text-xs">
            <thead>
              <tr className="text-left text-tinta-tenue">
                <th scope="col" className="pb-2 font-medium">
                  Mes
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Negocio
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Hogar
                </th>
              </tr>
            </thead>
            <tbody className="cifra">
              {datos.map((p) => (
                <tr key={p.mes} className="border-t border-hairline">
                  <th scope="row" className="py-2 text-left font-normal text-tinta-suave">
                    {p.mesLargo}
                  </th>
                  <td className="py-2 text-right text-ink">{soles(p.negocio)}</td>
                  <td className="py-2 text-right text-tinta-suave">{soles(p.hogar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </CardContent>
    </Card>
  );
}
