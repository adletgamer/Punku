import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/lib/onboarding-context";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Punku · Tu negocio ya tiene historia",
  description:
    "Punku convierte la actividad diaria de tu negocio en una identidad económica que te pertenece y te abre puertas.",
};

export const viewport: Viewport = {
  themeColor: "#f9f4ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${GeistSans.variable}`}>
      <body className="min-h-dvh antialiased">
        <OnboardingProvider>
          <TooltipProvider delayDuration={120} skipDelayDuration={300}>
            {children}
          </TooltipProvider>
        </OnboardingProvider>
        <Toaster
          position="top-center"
          offset={16}
          toastOptions={{
            style: {
              background: "oklch(0.24 0.015 50)",
              color: "oklch(0.97 0.010 80)",
              border: "none",
              borderRadius: "0.875rem",
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}
