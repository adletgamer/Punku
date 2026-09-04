"use client";

import { motion } from "motion/react";
import { Users, Receipt, Percent } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import { margenNegocio, type PerfilDemo } from "@/lib/demo-profile";

const entero = (n: number) => String(Math.round(n));
const porSoles = (n: number) => `S/ ${Math.round(n)}`;

export function StatRow({ perfil }: { perfil: PerfilDemo }) {
  const margen = margenNegocio(perfil);

  const cifras = [
    {
      icono: Users,
      valor: perfil.clientesRecurrentes,
      formato: entero,
      etiqueta: "clientes que vuelven",
    },
    {
      icono: Receipt,
      valor: perfil.ticketPromedio,
      formato: porSoles,
      etiqueta: perfil.unidadVenta,
    },
    {
      icono: Percent,
      valor: margen,
      formato: (n: number) => `${Math.round(n)}%`,
      etiqueta: "te queda de cada venta",
    },
  ];

  return (
    <section aria-label="Tus cifras de un vistazo" className="grid grid-cols-3 gap-2.5">
      {cifras.map(({ icono: Icono, valor, formato, etiqueta }, i) => (
        <motion.div
          key={etiqueta}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-suave border border-hairline bg-papel px-3 py-3"
        >
          <Icono className="size-4 text-tinta-tenue" aria-hidden />
          <p className="cifra mt-2 font-display text-xl font-semibold leading-none text-ink">
            <CountUp valor={valor} formato={formato} retraso={0.25 + i * 0.07} />
          </p>
          <p className="mt-1.5 text-[0.68rem] leading-tight text-tinta-suave">{etiqueta}</p>
        </motion.div>
      ))}
    </section>
  );
}
