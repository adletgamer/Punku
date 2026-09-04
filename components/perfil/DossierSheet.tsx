"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { X, BadgeCheck, Download, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  serieDeFlujo,
  promedioMensual,
  margenNegocio,
  soles,
  type PerfilDemo,
} from "@/lib/demo-profile";

/**
 * Vista previa del dossier: lo que de verdad ve el banco o el proveedor.
 *
 * Es el momento en que el trabajo invisible de Rosa se vuelve un documento
 * que alguien más puede leer y verificar.
 */
export function DossierSheet({
  perfil,
  abierto,
  onCerrar,
}: {
  perfil: PerfilDemo;
  abierto: boolean;
  onCerrar: () => void;
}) {
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    if (!abierto) return;
    setFecha(
      new Date().toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, [abierto]);

  // Cerrar con Escape y bloquear el scroll de atrás mientras esta abierto.
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alTeclear);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = previo;
    };
  }, [abierto, onCerrar]);

  const serie = serieDeFlujo(perfil);
  const conseguidos = perfil.sellos.filter((s) => s.desbloqueado);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCerrar}
            className="fixed inset-0 z-50 bg-ink/45"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa de tu dossier"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[92dvh] flex-col rounded-t-[1.75rem] bg-arena shadow-2xl"
          >
            {/* Asa y cabecera de la hoja */}
            <div className="shrink-0 px-5 pt-3">
              <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-ink/15" />
              <div className="mt-3 flex items-center justify-between gap-3 pb-3">
                <p className="text-sm font-medium text-tinta-suave">Así te van a ver</p>
                <button
                  type="button"
                  onClick={onCerrar}
                  aria-label="Cerrar la vista previa"
                  className="grid size-9 place-items-center rounded-full text-tinta-suave transition-colors hover:bg-ink/[0.06] hover:text-ink"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            {/* El documento */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
              <article className="rounded-tarjeta border border-hairline bg-papel p-5">
                <header className="border-b border-hairline pb-4">
                  <div className="flex items-center gap-1.5 text-cochinilla">
                    <DoorOpen className="size-3.5" aria-hidden />
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
                      Punku
                    </span>
                  </div>
                  <h2 className="mt-2.5 font-display text-2xl leading-tight text-ink">
                    Perfil de Crecimiento
                  </h2>
                  <p className="mt-1 text-sm text-tinta-suave">
                    {perfil.negocio} · {perfil.nombre}
                  </p>
                  <p className="mt-0.5 text-xs text-tinta-tenue">{perfil.zona}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-verdigris-tenue px-2.5 py-1 text-[0.7rem] font-medium text-verdigris">
                      <BadgeCheck className="size-3.5" aria-hidden />
                      Verificado por Punku
                    </span>
                    <span className="text-[0.7rem] text-tinta-tenue">
                      {perfil.desde} a hoy · {perfil.mesesDeHistorial} meses
                    </span>
                  </div>
                </header>

                <Bloque titulo="Movimiento del negocio">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-tinta-tenue">
                        <th scope="col" className="pb-2 font-medium">Mes</th>
                        <th scope="col" className="pb-2 text-right font-medium">Ingresos</th>
                        <th scope="col" className="pb-2 text-right font-medium">Gastos</th>
                        <th scope="col" className="pb-2 text-right font-medium">Neto</th>
                      </tr>
                    </thead>
                    <tbody className="cifra">
                      {perfil.registros.map((r) => (
                        <tr key={r.mes} className="border-t border-hairline">
                          <th scope="row" className="py-2 text-left font-normal text-tinta-suave">
                            {r.mesLargo}
                          </th>
                          <td className="py-2 text-right text-tinta-suave">
                            {soles(r.ingresoNegocio)}
                          </td>
                          <td className="py-2 text-right text-tinta-suave">
                            {soles(r.gastoNegocio)}
                          </td>
                          <td className="py-2 text-right font-semibold text-ink">
                            {soles(r.ingresoNegocio - r.gastoNegocio)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Bloque>

                <Bloque titulo="Indicadores">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <Dato
                      termino="Promedio mensual neto"
                      valor={soles(promedioMensual("negocio", perfil))}
                    />
                    <Dato termino="Margen del negocio" valor={`${margenNegocio(perfil)}%`} />
                    <Dato
                      termino="Clientes recurrentes"
                      valor={String(perfil.clientesRecurrentes)}
                    />
                    <Dato
                      termino="Días activos por semana"
                      valor={String(perfil.diasActivosPorSemana)}
                    />
                  </dl>
                </Bloque>

                <Bloque titulo="Sellos verificados">
                  <ul className="space-y-3">
                    {conseguidos.map((sello) => (
                      <li key={sello.id} className="flex gap-2.5">
                        <BadgeCheck
                          className="mt-0.5 size-4 shrink-0 text-verdigris"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink">{sello.nombre}</p>
                          <p className="mt-0.5 text-xs leading-snug text-tinta-suave">
                            {sello.evidencia}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Bloque>

                <Bloque titulo="Tendencia">
                  <p className="text-xs leading-relaxed text-tinta-suave">
                    El neto del negocio pasó de{" "}
                    <strong className="cifra font-semibold text-ink">
                      {soles(serie[0].negocio)}
                    </strong>{" "}
                    en {perfil.registros[0].mesLargo} a{" "}
                    <strong className="cifra font-semibold text-ink">
                      {soles(serie[serie.length - 1].negocio)}
                    </strong>{" "}
                    en {perfil.registros[perfil.registros.length - 1].mesLargo}, con
                    crecimiento en los {perfil.mesesDeHistorial} meses registrados.
                  </p>
                </Bloque>

                <footer className="mt-5 border-t border-hairline pt-4">
                  <p className="text-[0.7rem] leading-relaxed text-tinta-tenue">
                    Documento generado el {fecha} a pedido de {perfil.nombre}. Los datos
                    provienen de sus propios registros diarios. Ella decide con quién
                    compartirlo y puede revocar el acceso cuando quiera.
                  </p>
                </footer>
              </article>
            </div>

            {/* Acción final */}
            <div className="shrink-0 border-t border-hairline bg-arena px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  toast.success("Dossier guardado", {
                    description: "Lo puedes enviar por WhatsApp o imprimirlo.",
                    duration: 4000,
                  });
                  onCerrar();
                }}
              >
                <Download aria-hidden />
                Guardar en mi teléfono
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-tinta-tenue">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

function Dato({ termino, valor }: { termino: string; valor: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] text-tinta-tenue">{termino}</dt>
      <dd className="cifra mt-0.5 font-display text-base font-semibold text-ink">{valor}</dd>
    </div>
  );
}
