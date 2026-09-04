"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Download, Share2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DossierSheet } from "./DossierSheet";
import type { PerfilDemo } from "@/lib/demo-profile";

type Estado = "quieto" | "preparando" | "listo";

export function ExportBar({ perfil }: { perfil: PerfilDemo }) {
  const [estado, setEstado] = useState<Estado>("quieto");
  const [dossierAbierto, setDossierAbierto] = useState(false);

  function armarDossier() {
    if (estado !== "quieto") return;
    setEstado("preparando");

    window.setTimeout(() => {
      setEstado("listo");
      setDossierAbierto(true);
      window.setTimeout(() => setEstado("quieto"), 1400);
    }, 1000);
  }

  function compartirConProveedor() {
    toast.success("Enlace copiado", {
      description: "Vence en 7 días y puedes cortarlo cuando quieras. Tú decides quién lo ve.",
      duration: 4000,
    });
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-arena/92 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex flex-col gap-2">
            <Button
              onClick={armarDossier}
              size="lg"
              className="w-full"
              disabled={estado === "preparando"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {estado === "preparando" ? (
                  <motion.span
                    key="preparando"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="size-[1.15em] animate-spin" aria-hidden />
                    Armando tu dossier
                  </motion.span>
                ) : estado === "listo" ? (
                  <motion.span
                    key="listo"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-[1.15em]" aria-hidden />
                    Listo
                  </motion.span>
                ) : (
                  <motion.span
                    key="quieto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Download className="size-[1.15em]" aria-hidden />
                    Ver mi dossier
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <Button
              onClick={compartirConProveedor}
              variant="contorno"
              size="md"
              className="w-full"
            >
              <Share2 aria-hidden />
              Compartir con proveedor
            </Button>
          </div>

          <p className="mt-2.5 text-center text-[0.7rem] leading-snug text-tinta-tenue">
            Tu perfil es tuyo. Nada sale de aquí si tú no lo mandas.
          </p>
        </div>
      </div>

      <DossierSheet
        perfil={perfil}
        abierto={dossierAbierto}
        onCerrar={() => setDossierAbierto(false)}
      />
    </>
  );
}
