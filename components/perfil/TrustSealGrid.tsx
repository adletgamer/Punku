import { SealCard } from "./SealCard";
import type { PerfilDemo } from "@/lib/demo-profile";

export function TrustSealGrid({ perfil }: { perfil: PerfilDemo }) {
  const conseguidos = perfil.sellos.filter((s) => s.desbloqueado).length;

  return (
    <section aria-labelledby="titulo-sellos">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="titulo-sellos" className="font-display text-xl text-ink">
          Sellos de confianza
        </h2>
        <span className="cifra shrink-0 text-xs text-tinta-tenue">
          {conseguidos} de {perfil.sellos.length}
        </span>
      </div>
      <p className="mt-1 text-sm text-tinta-suave">
        Cada sello se apoya en algo que ya hiciste. Toca uno para ver la prueba.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {perfil.sellos.map((sello, i) => (
          <SealCard key={sello.id} sello={sello} indice={i} />
        ))}
      </div>
    </section>
  );
}
