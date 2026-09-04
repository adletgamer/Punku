import { Lightbulb } from "lucide-react";
import type { PerfilDemo } from "@/lib/demo-profile";

export function SugerenciaCard({ perfil }: { perfil: PerfilDemo }) {
  return (
    <section
      aria-label="Una idea para tu próxima semana"
      className="rounded-tarjeta border border-ocre/35 bg-ocre-tenue/60 p-4"
    >
      <div className="flex gap-3">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-papel/80 text-ocre-hondo">
          <Lightbulb className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-[1.02rem] font-semibold leading-tight text-ink">
            Una idea, {perfil.nombreCorto}
          </h2>
          <p className="mt-1.5 text-sm leading-snug text-ink/80">{perfil.sugerencia}</p>
          <p className="mt-2 text-[0.7rem] text-tinta-tenue">
            Es solo una sugerencia. La decisión siempre es tuya.
          </p>
        </div>
      </div>
    </section>
  );
}
