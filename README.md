# Punku 

**Tu negocio ya tiene historia. Nosotros te ayudamos a hacerla visible.**

[![Ver el prototipo en vivo](https://img.shields.io/badge/Ver%20el%20prototipo%20en%20vivo-punku--ideathon.vercel.app-b22c3f?style=for-the-badge)](https://punku-ideathon.vercel.app)

### 👉 [punku-ideathon.vercel.app](https://punku-ideathon.vercel.app)

Punku convierte la actividad diaria de una microempresaria informal en una **Identidad Económica Portable** que le abre puertas a crédito, proveedores y clientes. La IA es invisible: ella nunca "usa una IA", solo cuenta su día.

### Recorrido sugerido para el jurado

| Paso | Pantalla | Qué mirar |
| :--- | :--- | :--- |
| 1 | [Inicio](https://punku-ideathon.vercel.app) | La promesa en una sola frase y un único camino hacia adelante. |
| 2 | [Onboarding](https://punku-ideathon.vercel.app/onboarding) | Tres preguntas: su nombre, su rubro y cuántos días abre. Lo que responde queda guardado y viste todo lo que sigue. |
| 3 | [Cuéntame tu día](https://punku-ideathon.vercel.app/dia) | Toca el micrófono y habla. Se transcribe con la Web Speech API del navegador; si no la soporta, cae en un ejemplo real. Punku devuelve una boleta que separa el negocio del hogar. |
| 4 | [Perfil](https://punku-ideathon.vercel.app/perfil) | Su nombre y su rubro en la cabecera, flujo de caja, sellos de confianza con su evidencia e hitos. |
| 5 | Botón *Ver mi dossier* | El documento que de verdad ve un banco o un proveedor. Ese es el desbloqueo. |

Está pensado para un Android de gama baja: probado a 360 px de ancho, sin desbordes y con todas las animaciones sujetas a la preferencia de menos movimiento del sistema.

---

## 🚀 El Problema
En Lima, Perú, la mujer microemprendedora informal opera un negocio rentable y confiable en su barrio, pero es **económicamente invisible**. Sin RUC, sin facturación digital y sin tiempo para llevar registros, no puede demostrar su historial ni acceder a oportunidades de crecimiento. 

**El dolor no es falta de dinero; es falta de tiempo operativo y de un mecanismo que verifique su realidad.**

## 💡 La Solución (El "Bucle de Punku")
Punku no es una app de contabilidad, ni un chatbot, ni un marketplace. Es la capa que convierte la actividad invisible en una identidad económica que ella posee y controla.

1. **Captura Invisible:** Ella manda una nota de voz ("vendí 20 menús a 10, gasté 60 en pollo") o una foto de su cuaderno. Cero formularios, cero prompts. *(Simulado en MVP)*.
2. **Perfil de Crecimiento:** La IA ordena su flujo de caja, separa el negocio del hogar, y acumula **Sellos de Confianza** (evidencia real: meses registrados, clientes recurrentes).
3. **Recomendaciones con IA Personalizada:** La IA lee sus cifras y genera una "mejor próxima acción" concreta (ej: "Hoy es buen día para ofrecer 2x1 en menús, tu margen es alto").
4. **Portabilidad:** Con un toque, exporta un "Dossier" profesional para un banco o proveedor. El perfil es **de ella**, no un score encerrado en un prestamista.
5. **Conexión (Roadmap):** Se enchufa a socios externos para desbloquear crédito o mejores condiciones comerciales.

---

## 🧩 Público Objetivo (Buyer Persona)
- **Segmento:** Microemprendedora informal urbana (Lima Metropolitana).
- **Edad:** 28 a 45 años.
- **Dispositivo:** Android de gama media/baja, mobile-first.
- **Canales:** WhatsApp (dominante) y Yape/Plin (cobros diarios).
- **Realidad:** 60%+ opera en informalidad sin RUC. No tiene tiempo para aprender software complejo.

---

## 🛠️ Stack Tecnológico y Sistema de Diseño

### Tecnologías
- **Frontend:** Next.js 14+ (App Router), React, TypeScript.
- **Estilos:** Tailwind CSS v4.
- **UI Kit:** shadcn/ui.
- **Gráficos:** Recharts (ligero y limpio).
- **Animaciones:** Motion (`motion/react`) - Animaciones orquestadas y sutiles.
- **Estado/Data:** `lib/demo-profile.ts` (Mock data para el MVP).

### Sistema de Diseño 
Hemos definido una paleta cálida y terrosa para evitar el look genérico de "SaaS púrpura con gradientes". 

| Token | Color | Uso |
| :--- | :--- | :--- |
| `arena` | `oklch(0.97 0.010 80)` | Fondo de la aplicación (cálido). |
| `ink` | `oklch(0.24 0.015 50)` | Texto principal (casi negro, cálido). |
| `cochinilla` | `oklch(0.51 0.170 18)` | Color primario para CTAs (botón descargar). |
| `ocre` | `oklch(0.74 0.120 78)` | Sellos de confianza desbloqueados. |
| `verdigris` | `oklch(0.55 0.060 195)` | Verificación y checks. |

**Tipografías:**
- **Títulos:** `Fraunces` (Serif con carácter, cálida).
- **Cuerpo:** `Geist` (Sans-serif limpia y moderna).

---

## 🎨 El Prototipo 

**Enfoque:** El corazón del prototipo es la **Pantalla de Perfil de Crecimiento**, mostrada con data mockeada para que el jurado vea el desbloqueo real: el Dossier exportable.

**User Flow del MVP:**
1. **Inicio:** Landing minimalista con el logo "Punku" y el botón "Ver un ejemplo de mi perfil".
2. **Perfil:** (Componente principal). Una sola vista móvil con scroll.
   - **Header:** Identidad de la usuaria (foto/inicial) + Badge "Perfil Verificado · 4 meses de historial".
   - **Flujo de Caja:** Tarjeta grande con ingreso neto + Toggle "Negocio/Hogar" + Gráfico Recharts.
   - **Sellos de Confianza:** Grid de tarjetas (obtenidas en ocre, bloqueadas en gris). Tooltip con la evidencia.
   - **Hitos:** Timeline vertical (Progreso).
   - **CTA Sticky (Abajo):** Botón "Descargar Dossier para Banco" y "Compartir con Proveedor". Al hacer click, genera un documento visual (o toast) confirmando la acción.

**Instrucción para el Desarrollador/IA:**
No agregues animaciones excesivas. Solo una entrada orquestada al cargar el perfil y una micro-animación en el botón de descarga. Mantén la estética limpia con divisores hairline y mucho espacio en blanco.

---

## 🌍 Alineación con ODS (Para el Pitch)
- **ODS 5 (Igualdad de Género):** Metas 5.a y 5.b. Otorga derechos económicos y empoderamiento digital.
- **ODS 8 (Trabajo Decente y Crecimiento):** Metas 8.3 y 8.10. Impulsa la formalización de MYPEs y acceso a servicios financieros.
- **ODS 10 (Reducción de Desigualdades):** Meta 10.2. Mueve a la mujer de "invisible" a "verificable" en el sistema económico.

---

## ⚠️ Guardrails Éticos y Técnicos (Criterio 5 del Jurado)
- La IA **nunca** decide por ella; siempre sugiere.
- **No cruza** la línea de asesoría financiera regulada (no recomienda inversiones).
- **No pide** DNI, correo ni datos bancarios en el onboarding.
- La data es de ella; compartir con terceros es una acción explícita (Opt-in).
- La matemática del dinero se realiza con un motor determinista (reglas puras), el LLM solo extrae y categoriza texto.

---

## 📁 Estructura del Proyecto

```
app/
  page.tsx                  # Inicio
  onboarding/page.tsx       # Nombre, rubro y dias: maquina de estados de 3 pasos
  dia/page.tsx              # Cuentame tu dia: voz, transcripcion y boleta
  perfil/page.tsx           # Perfil de Crecimiento
  layout.tsx                # Fuentes, avisos y estado global del onboarding
  globals.css               # Tokens OKLCH del sistema de diseno
components/
  dia/
    Ecualizador.tsx         # Barras que respiran mientras escucha
    BoletaDia.tsx           # El resumen del dia con forma de boleta
  perfil/
    IdentityHeader.tsx      # Nombre, verificacion y meses de historial
    StatRow.tsx             # Clientes, ticket promedio y margen
    CashflowCard.tsx        # Flujo de caja con toggle y grafico
    SugerenciaCard.tsx      # La proxima accion sugerida
    TrustSealGrid.tsx       # Cuadricula de sellos
    SealCard.tsx            # Un sello, con su evidencia en tooltip
    MilestoneTimeline.tsx   # Hitos
    ExportBar.tsx           # Barra fija de exportacion
    DossierSheet.tsx        # El documento que ve el banco
  ui/                       # Primitivos al estilo shadcn/ui
lib/
  demo-profile.ts           # Data de Rosa Q., motor determinista y perfil personalizado
  onboarding.ts             # Catalogo de rubros y dias, y los tipos que comparte todo
  onboarding-context.tsx    # Estado global (React Context) + respaldo en localStorage
  analisis-dia.ts           # Separa el dia en movimientos de negocio y de hogar
  use-voz.ts                # Web Speech API con simulacion de respaldo
  utils.ts
```

---

## ▶️ Como correrlo

Necesitas Node 20 o superior y pnpm.

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`. Para revisar la version de produccion:

```bash
pnpm build
pnpm start
```

---

## 🚢 Despliegue

El prototipo vive en [punku-ideathon.vercel.app](https://punku-ideathon.vercel.app), desplegado en Vercel desde este repositorio. No requiere variables de entorno: toda la data del MVP es local y ficticia.
