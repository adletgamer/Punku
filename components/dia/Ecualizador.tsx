"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Barras que respiran mientras Punku escucha.
 *
 * Las alturas están escritas a mano para que el centro suba más que los
 * extremos: así parece una voz y no un cargador genérico.
 */
const ALTURAS = [10, 18, 28, 38, 30, 40, 26, 16, 9];

export function Ecualizador({
  activo,
  className,
  tono = "cochinilla",
}: {
  activo: boolean;
  className?: string;
  tono?: "cochinilla" | "verdigris";
}) {
  const reducido = useReducedMotion();
  const anima = activo && !reducido;

  return (
    <div
      aria-hidden
      className={cn("flex h-10 items-center justify-center gap-[3px]", className)}
    >
      {ALTURAS.map((alto, i) => (
        <motion.span
          key={i}
          className={cn(
            "w-[3px] rounded-full transition-colors duration-300",
            tono === "verdigris" ? "bg-verdigris/60" : "bg-cochinilla/60"
          )}
          initial={{ height: 6 }}
          animate={anima ? { height: [6, alto, 12, alto * 0.7, 6] } : { height: 6 }}
          transition={{
            duration: 1.1,
            repeat: anima ? Infinity : 0,
            delay: i * 0.06,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
