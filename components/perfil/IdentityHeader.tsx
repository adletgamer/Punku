"use client";

import { motion } from "motion/react";
import { BadgeCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PerfilDemo } from "@/lib/demo-profile";

export function IdentityHeader({ perfil }: { perfil: PerfilDemo }) {
  return (
    <header className="flex items-start gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid size-14 shrink-0 place-items-center rounded-full bg-ocre-tenue ring-1 ring-ocre/40"
      >
        <span className="font-display text-2xl font-semibold text-ocre-hondo">
          {perfil.inicial}
        </span>
      </motion.div>

      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[1.6rem] leading-tight text-ink">
          {perfil.negocio}
        </h1>
        <p className="mt-0.5 text-sm text-tinta-suave">
          {perfil.nombre} · {perfil.rubro}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {perfil.verificado && (
            <Badge variant="verificado">
              <BadgeCheck className="size-3.5" aria-hidden />
              Perfil verificado
            </Badge>
          )}
          <Badge variant="ocre">{perfil.mesesDeHistorial} meses de historial</Badge>
        </div>

        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-tinta-tenue">
          <MapPin className="size-3.5" aria-hidden />
          {perfil.zona}
        </p>
      </div>
    </header>
  );
}
