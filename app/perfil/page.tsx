"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Mic } from "lucide-react";
import { IdentityHeader } from "@/components/perfil/IdentityHeader";
import { StatRow } from "@/components/perfil/StatRow";
import { CashflowCard } from "@/components/perfil/CashflowCard";
import { SugerenciaCard } from "@/components/perfil/SugerenciaCard";
import { TrustSealGrid } from "@/components/perfil/TrustSealGrid";
import { MilestoneTimeline } from "@/components/perfil/MilestoneTimeline";
import { ExportBar } from "@/components/perfil/ExportBar";
import { useOnboarding } from "@/lib/onboarding-context";
import { perfilPersonalizado } from "@/lib/demo-profile";

export default function PerfilPage() {
  const { datos } = useOnboarding();

  // El perfil de demostración, vestido con lo que ella nos contó.
  const perfil = useMemo(() => perfilPersonalizado(datos), [datos]);

  return (
    <div className="flex min-h-dvh flex-col bg-arena">
      <div className="mx-auto w-full max-w-md flex-1 px-5 pb-48 pt-5">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 py-1 text-sm text-tinta-suave transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Inicio
          </Link>

          <Link
            href="/dia"
            aria-label="Contar cómo me fue hoy"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-cochinilla-tenue px-3.5 text-xs font-medium text-cochinilla-hondo transition-colors hover:bg-cochinilla/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
          >
            <Mic className="size-3.5" aria-hidden />
            Contar mi día
          </Link>
        </div>

        <IdentityHeader perfil={perfil} />

        <div className="mt-7 space-y-8">
          <StatRow perfil={perfil} />
          <CashflowCard perfil={perfil} />
          <SugerenciaCard perfil={perfil} />
          <TrustSealGrid perfil={perfil} />
          <MilestoneTimeline perfil={perfil} />
        </div>
      </div>

      <ExportBar perfil={perfil} />
    </div>
  );
}
