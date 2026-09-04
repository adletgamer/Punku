import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IdentityHeader } from "@/components/perfil/IdentityHeader";
import { CashflowCard } from "@/components/perfil/CashflowCard";
import { SugerenciaCard } from "@/components/perfil/SugerenciaCard";
import { TrustSealGrid } from "@/components/perfil/TrustSealGrid";
import { MilestoneTimeline } from "@/components/perfil/MilestoneTimeline";
import { ExportBar } from "@/components/perfil/ExportBar";
import { perfilDemo } from "@/lib/demo-profile";

export default function PerfilPage() {
  const perfil = perfilDemo;

  return (
    <div className="flex min-h-dvh flex-col bg-arena">
      <div className="mx-auto w-full max-w-md flex-1 px-5 pb-48 pt-5">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-tinta-suave transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Inicio
        </Link>

        <IdentityHeader perfil={perfil} />

        <div className="mt-7 space-y-8">
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
