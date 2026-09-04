"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * Cuenta desde cero hasta la cifra final.
 *
 * El valor final ya viene escrito en el HTML, asi que si el equipo es lento
 * o el navegador no ejecuta la animacion, la cifra igual se lee correcta.
 * Si la usuaria pidio menos movimiento, ni siquiera se anima.
 */
export function CountUp({
  valor,
  formato,
  duracion = 0.9,
  retraso = 0,
  className,
}: {
  valor: number;
  formato: (n: number) => string;
  duracion?: number;
  retraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducido = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducido) {
      el.textContent = formato(valor);
      return;
    }

    const control = animate(0, valor, {
      duration: duracion,
      delay: retraso,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        el.textContent = formato(n);
      },
    });

    return () => control.stop();
  }, [valor, formato, duracion, retraso, reducido]);

  return (
    <span ref={ref} className={className}>
      {formato(valor)}
    </span>
  );
}
