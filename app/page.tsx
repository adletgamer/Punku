"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Mic, ShieldCheck, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const entrada = {
  oculto: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const transicion = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-arena">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-12">
        {/* Marca */}
        <motion.div
          initial="oculto"
          animate="visible"
          variants={entrada}
          transition={transicion}
          className="flex items-center gap-2"
        >
          <span className="grid size-8 place-items-center rounded-full bg-cochinilla text-arena">
            <DoorOpen className="size-4" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Punku
          </span>
        </motion.div>

        {/* Titular */}
        <div className="flex flex-1 flex-col justify-center py-14">
          <motion.h1
            initial="oculto"
            animate="visible"
            variants={entrada}
            transition={{ ...transicion, delay: 0.08 }}
            className="font-display text-[2.35rem] leading-[1.1] text-ink"
          >
            Tu negocio ya tiene historia.
            <span className="mt-1 block text-cochinilla">
              Vamos a hacerla visible.
            </span>
          </motion.h1>

          <motion.p
            initial="oculto"
            animate="visible"
            variants={entrada}
            transition={{ ...transicion, delay: 0.16 }}
            className="mt-5 text-[1.02rem] leading-relaxed text-tinta-suave"
          >
            Cuéntanos tu día en una nota de voz. Nosotros ordenamos tus números y
            armamos el perfil que abre puertas con bancos, proveedores y clientes.
          </motion.p>

          {/* Tres señales de confianza, sin tecnicismos */}
          <motion.ul
            initial="oculto"
            animate="visible"
            variants={entrada}
            transition={{ ...transicion, delay: 0.24 }}
            className="mt-8 space-y-3"
          >
            {[
              { icono: Mic, texto: "Sin formularios. Solo cuentas tu día." },
              { icono: ShieldCheck, texto: "Sin DNI ni datos del banco." },
              { icono: DoorOpen, texto: "El perfil es tuyo, no de un prestamista." },
            ].map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-3 text-sm text-ink/85">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ocre-tenue text-ocre-hondo">
                  <Icono className="size-4" aria-hidden />
                </span>
                {texto}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Un solo camino hacia adelante */}
        <motion.div
          initial="oculto"
          animate="visible"
          variants={entrada}
          transition={{ ...transicion, delay: 0.32 }}
        >
          <Button asChild size="lg" className="w-full">
            <Link href="/onboarding">
              Ver mi perfil de crecimiento
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-tinta-tenue">
            Toma menos de un minuto. Es un ejemplo con datos de demostración.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
