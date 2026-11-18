---
name: AYLLU
description: Plataforma de acompañamiento en la crianza para abuelos que crían a sus nietos por la migración de los padres. Cálida, clara y de confianza, con raíz textil andina.
version: 1.0
theme: light (con modo de alto contraste)
colors:
  canvas: "#FBF5EC"        # Lienzo: fondo de página
  surface: "#FFFFFF"       # Tarjetas, modales, campos
  surface-alt: "#F3E8D8"   # Arena: bandas, áreas secundarias, chip neutro
  ink: "#2A211C"           # Texto principal e íconos
  ink-muted: "#5C4F45"     # Texto secundario
  border: "#E6D9C7"        # Divisores decorativos
  border-strong: "#8C7B6E" # Bordes de campos y controles (≥ 3:1)
  primary: "#B5462A"       # Arcilla: acción principal
  primary-hover: "#9A3A22"
  primary-tint: "#F8E1DA"
  on-primary: "#FFFFFF"
  highlight: "#E9B949"     # Maíz: importante / destacado (nunca texto)
  highlight-tint: "#FBEBC2"
  on-highlight: "#2A211C"
  secondary: "#2F6B4F"     # Molle: color secundario de marca (el 30 %)
  secondary-deep: "#1F4D37" # Bandas protagonistas con texto crema
  secondary-tint: "#E3EFE6" # Paneles laterales y bloques de apoyo
  on-secondary: "#FBF5EC"
  success: "#2F6B4F"       # Molle también marca lo resuelto (siempre con ícono ✓ y texto)
  success-tint: "#E3EFE6"
  info: "#2B5A87"          # Titicaca: enlaces, foco, información
  info-tint: "#E2ECF5"
  danger: "#A4161A"        # Errores y acciones destructivas
  danger-tint: "#F8E1DA"
  focus: "#2B5A87"
  category-salud: "#C2547A"
  category-salud-tint: "#F7E1E9"
  category-salud-ink: "#7A2645"
  category-colegio: "#2B5A87"
  category-colegio-tint: "#E2ECF5"
  category-colegio-ink: "#1E3F61"
  category-permiso: "#7A5BA6"
  category-permiso-tint: "#ECE5F5"
  category-permiso-ink: "#4E3577"
  category-otro: "#8C7B6E"
  category-otro-tint: "#EFE7DC"
  category-otro-ink: "#4A3F37"
typography:
  fontFamilies:
    display: "'Fraunces', Georgia, serif"
    body: "'Atkinson Hyperlegible', 'Segoe UI', system-ui, sans-serif"
  baseSize: 18px
  scale:
    display: { fontSize: 3rem, lineHeight: 1.1, fontWeight: 600, family: display }   # 54px landing hero (base 18)
    h1: { fontSize: 2.125rem, lineHeight: 1.2, fontWeight: 600, family: display }    # 38px
    h2: { fontSize: 1.625rem, lineHeight: 1.25, fontWeight: 600, family: display }   # 29px
    h3: { fontSize: 1.25rem, lineHeight: 1.3, fontWeight: 700, family: body }        # 22.5px
    lead: { fontSize: 1.125rem, lineHeight: 1.55, fontWeight: 400, family: body }    # 20px
    body: { fontSize: 1rem, lineHeight: 1.6, fontWeight: 400, family: body }         # 18px
    label: { fontSize: 1rem, lineHeight: 1.4, fontWeight: 700, family: body }        # 18px
    small: { fontSize: 0.889rem, lineHeight: 1.5, fontWeight: 400, family: body }    # 16px (mínimo)
  textSizes:            # HU41: tamaño de letra elegido por la persona
    normal: 112.5%      # 18px
    grande: 125%        # 20px
    muy-grande: 137.5%  # 22px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]
  page-gutter-mobile: 16px
  page-gutter-desktop: 32px
  content-max-width: 1120px
  reading-max-width: 680px
rounded:
  sm: 8px
  md: 14px
  lg: 20px
  xl: 28px
  pill: 999px
elevation:
  flat: none
  raised: "0 1px 0 #E6D9C7"
  floating: "0 8px 24px rgba(42, 33, 28, 0.12)"
sizes:
  touch-min: 48px
  button-height: 52px
  input-height: 56px
  topbar-height: 72px
  bottomnav-height: 72px
components:
  button-primary: { background: primary, color: on-primary, radius: pill, height: button-height, paddingX: 28px, font: label }
  button-secondary: { background: surface, color: ink, border: "2px solid ink", radius: pill, height: button-height }
  button-ghost: { background: transparent, color: info, underline: true, height: touch-min }
  button-danger: { background: danger, color: "#FFFFFF", radius: pill }
  input: { background: surface, border: "2px solid border-strong", radius: md, height: input-height, focusRing: "3px solid focus" }
  card: { background: surface, border: "1px solid border", radius: lg, padding: 24px }
  card-feature: { background: surface, border: "2px solid ink", radius: xl, padding: 32px }
  badge: { radius: pill, paddingX: 12px, height: 32px, font: small-bold }
  modal: { background: surface, radius: xl, padding: 32px, shadow: floating, maxWidth: 520px }
  thread-line: { width: 3px, color: border-strong, nodeSize: 20px }
  woven-band: { height: 8px, colors: [primary, highlight, success, ink] }
---

# AYLLU · DESIGN.md

> Sistema visual de AYLLU para personas y para agentes de código. Los tokens de arriba dicen **qué** valores usar; las secciones de abajo dicen **por qué** y **cómo**. Si algo no está aquí, se decide siguiendo `02-identidad-visual.md`.

## Overview

AYLLU se siente como **una cocina cálida y ordenada**: fondo crema, una acción terracota bien visible por pantalla, texto grande y muy legible, y color solo donde significa algo. El usuario principal es una persona de **60 años o más con poca experiencia digital**, así que cada decisión prioriza **legibilidad, objetivos grandes y una sola tarea por pantalla** por encima de la densidad o la novedad.

El carácter viene de dos lugares: la tipografía **Fraunces** en los títulos y el **hilo** (la línea de tiempo de cada situación), que es el elemento firma del producto. La raíz andina se expresa con la paleta de tierra y tejido y con una **franja tejida** usada con moderación, nunca con decoración folclórica.

**Personalidad:** cálido · claro · de confianza.
**Referencias de estilo:** la calidez crema-naranja de Headspace, la serif expresiva y los botones píldora de HoneyBook, y la sobriedad y aire de Airbnb. Ninguna se copia; AYLLU las mezcla con su propia paleta andina.

## Colors

**Proporción 60-30-10** (cómo se reparte el color en cada pantalla):

| Proporción | Color | Dónde |
|---|---|---|
| **60 %** · base | Lienzo crema `#FBF5EC` + superficie blanca `#FFFFFF` | Fondo de página, tarjetas, campos, barra superior |
| **30 %** · secundario | Verde molle: `#1F4D37` (profundo), `#2F6B4F` y su tinte `#E3EFE6` | Banda de saludo con foto en Inicio, paneles laterales (familia, acuerdos, estado), pie de página, encabezado de la landing, indicador de pasos y la sección activa de la navegación |
| **10 %** · acento | Terracota `#B5462A` (acción principal) + maíz `#E9B949` (importante) | El botón principal (incluido "Registrar" en la barra inferior), la etiqueta "Importante" y la franja tejida |

Si en una pantalla el terracota o el maíz ocupan más que algunos puntos de atención, algo está mal: el acento solo funciona si es escaso. El verde da vida y estructura sin competir con la acción. Sobre `#1F4D37`, el texto va en crema `#FBF5EC` (8,9:1) y los destacados en maíz (5,3:1).

**Reglas de uso:**

- **Lienzo crema (`canvas`)** es el fondo de toda página. Las tarjetas y los campos van en `surface` blanco para destacar sobre él.
- **Terracota (`primary`) es la acción principal y solo hay una por pantalla.** "Registrar situación", "Enviar", "Guardar". Texto blanco sobre terracota: 5,4:1 (AA).
- **Maíz (`highlight`) marca lo importante** (HU15): la etiqueta "Importante", el borde izquierdo de una situación prioritaria y los destacados. **Nunca como color de texto** sobre fondo claro (1,7:1). Sobre maíz, el texto siempre va en tinta (8,6:1).
- **Verde molle (`success`)** = resuelto: "Revisada", "Cerrada" y las confirmaciones.
- **Azul lago (`info`)** = enlaces, anillo de foco e información neutra.
- **Rojo (`danger`)** = solo errores y acciones destructivas (desvincular, descartar grabación). Siempre con ícono y texto.
- **Categorías:** cada situación muestra su categoría con **ícono + nombre + color**. El color nunca es la única pista (WCAG 1.4.1). Fondos `*-tint` con texto `*-ink`, todos ≥ 7:1.

**Estados de una situación** (HU29, HU33, HU34):

| Estado | Fondo | Texto | Ícono | Frase |
|---|---|---|---|---|
| Registrada | `surface-alt` | `ink` | lápiz | "Registrada por usted" |
| Enviada, sin revisar | `highlight-tint` | `#6B4A00` | reloj | "Jorge todavía no la ha visto" |
| Revisada | `info-tint` | `#1E3F61` | ojo | "Jorge la vio el martes, 9:40 p. m." |
| Respondida | `success-tint` | `#1F4D37` | mensaje | "Jorge respondió" |
| Cerrada | `success` | `#FFFFFF` | check | "Resuelta" |

**Contrastes verificados (WCAG 2.2):** `ink` sobre `canvas` 14,5:1 · `ink-muted` sobre `canvas` 7,3:1 · blanco sobre `primary` 5,4:1 · blanco sobre `primary-hover` 7,0:1 · `primary` sobre `canvas` 5,0:1 · blanco sobre `success` 6,3:1 · `info` sobre `canvas` 6,7:1 · `border-strong` sobre `surface` 4,1:1 (≥ 3:1 para controles).

**Alto contraste (HU42)**, activado con `[data-contrast="alto"]` en `<html>`: `canvas` y `surface` en `#FFFFFF`, `ink` en `#1A1410` (18,2:1), `ink-muted` en `#3D332C` (12,3:1), `primary` en `#8F3520` (7,8:1), todos los bordes de control en 2 px de color `ink` y subrayado obligatorio en todos los enlaces.

## Typography

- **Fraunces** (600, eje `SOFT` 50, `opsz` automático) solo para `display`, `h1` y `h2`. Le da a AYLLU su voz cálida.
- **Atkinson Hyperlegible** (400 y 700) para todo lo demás: texto, etiquetas, botones, campos y navegación. Diseñada por el Braille Institute para baja visión.
- **Tamaño base: 18 px** (`html { font-size: 112.5%; }`). **Mínimo absoluto: 16 px** (`small`), solo para metadatos como fechas.
- **Todo en `rem`.** Así el control de tamaño de letra (HU41) escala la interfaz completa: `[data-text-size="grande"]` → 125 % y `[data-text-size="muy-grande"]` → 137,5 % en `<html>`.
- **Altura de línea 1,6** para el texto. Ancho de lectura máximo de 680 px (unos 65 caracteres).
- **Frases en tipo oración.** Nada en MAYÚSCULAS sostenidas; cuesta leerlas.
- **Negrita 700** solo para etiquetas, botones y la palabra clave de un estado. Nunca párrafos completos en negrita.
- Fuentes con `font-display: swap` y alternativas del sistema para que el texto se vea desde el primer momento.

## Layout

- **Retícula base de 4 px.** Espaciados: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Escritorio (≥ 1024 px):** barra superior fija de 72 px, contenido centrado con un máximo de 1120 px y márgenes de 32 px. En Inicio, una columna principal (2/3) con lo urgente y una lateral (1/3) con la familia.
- **Tablet (640–1023 px):** barra superior compacta y una sola columna.
- **Móvil (< 640 px):** barra superior simple (logo, "Aa" y avisos), **barra inferior fija de 72 px** con 4 secciones y el botón central "Registrar", márgenes de 16 px y una sola columna.
- **Una tarea por pantalla.** Los formularios largos se dividen en pasos (HU46) con indicador "Paso 2 de 3".
- **La acción principal siempre a la vista:** al final del formulario en escritorio y fija sobre la barra inferior en móvil.
- **Espacio generoso:** 24 px entre elementos relacionados y 48 px entre secciones.
- **Objetivos táctiles de 48 × 48 px como mínimo**, con 8 px de separación entre ellos.

## Elevation & Depth

AYLLU es **casi plano**. La profundidad viene del contraste entre crema y blanco y de los bordes, no de las sombras.

- `flat`: la mayoría de los elementos.
- `raised` (una línea de 1 px): tarjetas sobre el lienzo.
- `floating` (sombra cálida suave): **solo** modales, el menú de "Aa", los toasts y la acción fija en móvil.
- Nunca más de dos capas flotantes a la vez. Nada de brillos, desenfoques ni sombras de varias capas.

## Shapes

- **Botones, chips y etiquetas: píldora** (`pill`). Es la forma firma de las acciones.
- **Tarjetas: 20 px** (`lg`). **Tarjeta protagonista y modales: 28 px** (`xl`).
- **Campos de texto: 14 px** (`md`). **Elementos pequeños: 8 px** (`sm`).
- **Avatares:** círculos con las iniciales, cada integrante con su color de hebra.
- **El rombo** (del logo y la franja tejida) es la única forma decorativa. No se agregan otras formas sueltas.

## Components

**Botones**
- *Primario:* terracota, texto blanco, píldora, 52 px de alto. Uno por pantalla.
- *Secundario:* blanco con borde de 2 px en tinta. Para "Cancelar" y "Volver".
- *Fantasma:* texto azul lago subrayado, 48 px de área. Para acciones terciarias como "Ver todas".
- *Peligro:* rojo, siempre pasa por el modal de confirmación (HU48).
- Siempre **ícono + texto**. Estado de foco: anillo de 3 px en `focus` con 2 px de separación.

**Campos de formulario**
- Etiqueta visible **encima** del campo (nunca solo el texto de ejemplo), 56 px de alto, borde de 2 px en `border-strong`.
- Texto de ayuda debajo, en `ink-muted`. Error: borde y mensaje en `danger`, con ícono, que explica cómo corregirlo.
- **Selección de categoría** como tarjetas grandes con ícono (Salud, Colegio, Permiso, Otro), no como lista desplegable.

**Tarjeta de situación**
- Fila superior: etiqueta de categoría + etiqueta "Importante" (si aplica).
- Título en `h3`, una línea de resumen y luego autor, fecha y **estado** como etiqueta de color.
- Las situaciones importantes llevan un borde izquierdo de 6 px en maíz.
- Toda la tarjeta es clicable, con un área mínima de 48 px.

**El hilo (línea de tiempo de la situación)**
- Línea vertical de 3 px. Un nodo de 20 px por evento: registrada, enviada, revisada, respondida, decisión registrada, cerrada.
- Nodo lleno con el color del integrante que actuó; nodo vacío con borde punteado para lo que falta.
- Cada nodo tiene texto: quién, qué y cuándo ("Jorge la vio · martes 9:40 p. m.").
- Se marca como lista ordenada (`<ol>`) para lectores de pantalla.

**Barra superior (web)**
- Logo a la izquierda; cuatro secciones con ícono y texto al centro (Inicio, Situaciones, Acuerdos, Familia), con la sección activa subrayada en verde molle de 3 px y `aria-current="page"`.
- A la derecha: botón primario "Registrar situación", botón "Aa" (tamaño de letra y contraste), avisos y menú de la persona.
- Franja tejida de 8 px en su borde inferior.

**Barra inferior (móvil)**
- Cinco espacios: Inicio, Situaciones, **Registrar** (botón central terracota de 64 px), Acuerdos y Familia. Ícono de 24 px y etiqueta de 16 px (`small`, el mínimo absoluto) siempre visibles.

**Control "Aa" (HU41, HU42)**
- Panel flotante con tres tamaños de letra (Normal, Grande, Muy grande) mostrados como botones con una vista previa del texto, un interruptor de alto contraste y el botón "Escuchar esta pantalla".
- La elección se guarda en `localStorage` y se aplica en todas las pantallas.

**Modal de confirmación (HU48)**
- Título en pregunta: "¿Cerrar esta situación?". Una frase sobre qué pasará. Dos botones: la acción (primaria o peligro) y "No, volver" (secundario).
- Después, un toast de confirmación: "Listo. La familia verá que quedó resuelta."
- No se pide confirmación para acciones que no modifican información.

**Grabador de nota de voz (HU12)**
- Botón circular terracota de 96 px con micrófono y el texto "Tocar para grabar". Un toque empieza y otro toque ("Detener") termina; nunca se pide mantener presionado (WCAG 2.5.7).
- Mientras graba: contador de tiempo, onda simple y "Detener". Después: "Escuchar", "Grabar de nuevo" y "Usar esta nota".
- La transcripción (HU13) aparece debajo, editable, con el aviso "Revise que el texto diga lo que usted dijo".

**Indicador de pasos (HU46)**
- "Paso 1 de 3 · Qué pasó", con barra segmentada en verde molle. Botón "Atrás" siempre visible y opción "Ocultar ayudas".

**Estado vacío**
- Ilustración pequeña, un título que invita ("Aquí verá lo que registre sobre Mía"), una frase y un solo botón.

**Toast**
- Abajo al centro, fondo tinta y texto crema, con ícono. Se queda 6 segundos o hasta cerrarlo; se anuncia con `role="status"`.

**Fotografía**
- Fotos reales de alta calidad (Unsplash, licencia libre), guardadas en `assets/images/` en `.jpg` o `.webp`, de 1600 px de ancho como máximo y menos de 300 KB.
- **Qué mostrar:** abuelos y nietos en escenas cotidianas y cálidas (tareas, cocina, abrazos, el camino al colegio); padres trabajando o en videollamada. Luz natural y tonos cálidos que combinen con la paleta. Abuelos activos y capaces, nunca frágiles o tristes.
- **Dónde:** banda de saludo de Inicio, la landing, la bienvenida, los estados vacíos y los avatares de ejemplo. **No** en formularios ni dentro de la lista de situaciones.
- **Forma:** esquinas de 20–28 px. Sobre una foto, el texto siempre va sobre una banda sólida o un velo sólido, nunca directamente sobre la imagen.
- **Texto alternativo** que describa la escena ("Abuela y nieta abrazadas en la sala"). Si la foto es decorativa, `alt=""`.
- Créditos del fotógrafo en el `README.md` del repositorio.

## Do's and Don'ts

**Hacer**
- Respetar la proporción 60-30-10: crema y blanco de base, verde molle como secundario y terracota y maíz como acento.
- Una sola acción terracota por pantalla.
- Usar fotos reales y cálidas en Inicio, la landing y los estados vacíos.
- Ícono + texto en toda navegación y en todo botón.
- Texto base de 18 px y todo en `rem`.
- Decir siempre el estado en palabras ("Jorge todavía no la ha visto"), no solo con color.
- Confirmar las acciones que cambian información y tranquilizar después.
- Usar "usted" y frases cortas.
- Mostrar el hilo en todo detalle de situación.
- Respetar `prefers-reduced-motion` y `prefers-contrast`.

**No hacer**
- No usar navegación solo con íconos ni menú hamburguesa para las secciones principales.
- No usar maíz como color de texto ni terracota sobre arena (4,5:1 no alcanza).
- No poner texto en MAYÚSCULAS sostenidas ni en tamaños menores a 16 px.
- No usar sombras como decoración, degradados ni fondos con textura detrás del texto.
- No repetir la franja tejida más de una vez por pantalla.
- No usar símbolos andinos sagrados de forma literal ni estereotipos folclóricos.
- No agregar un asistente con IA: no está validado con usuarios.
- No mostrar nombres reales de los participantes de las entrevistas.

## Agent Prompt Guide

**Referencia rápida:** fondo `#FBF5EC`, tarjeta `#FFFFFF`, texto `#2A211C`, secundario `#5C4F45`, acción `#B5462A`, importante `#E9B949`, resuelto `#2F6B4F`, enlace y foco `#2B5A87`. Títulos en Fraunces 600; texto en Atkinson Hyperlegible 18 px.

**Prompts de ejemplo:**
1. "Construye la tarjeta de situación de AYLLU según DESIGN.md: categoría Salud con ícono, etiqueta Importante en maíz con borde izquierdo de 6 px, título h3, autor y fecha, y estado 'Jorge todavía no la ha visto'. Toda la tarjeta es un enlace accesible."
2. "Construye el detalle de situación con el hilo: lista ordenada de eventos con nodos de 20 px, línea de 3 px y nodos vacíos punteados para lo pendiente. Debajo, el campo de respuesta y el botón primario."
3. "Construye la barra superior web con cuatro secciones (ícono y texto), el botón primario 'Registrar situación', el control Aa y la franja tejida inferior. En menos de 640 px, cambia a la barra inferior de cinco espacios."
4. "Construye el flujo Registrar situación en 3 pasos con indicador de pasos, tarjetas de categoría, grabador de voz y transcripción editable, y modal de confirmación al final."

## Quick Start (CSS)

```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fraunces:opsz,wght,SOFT@9..144,600,50&display=swap');

:root {
  --canvas: #FBF5EC; --surface: #FFFFFF; --surface-alt: #F3E8D8;
  --ink: #2A211C; --ink-muted: #5C4F45;
  --border: #E6D9C7; --border-strong: #8C7B6E;
  --primary: #B5462A; --primary-hover: #9A3A22; --primary-tint: #F8E1DA; --on-primary: #FFFFFF;
  --highlight: #E9B949; --highlight-tint: #FBEBC2;
  --secondary: #2F6B4F; --secondary-deep: #1F4D37; --secondary-tint: #E3EFE6; --on-secondary: #FBF5EC;
  --success: #2F6B4F; --success-tint: #E3EFE6;
  --info: #2B5A87; --info-tint: #E2ECF5;
  --danger: #A4161A; --danger-tint: #F8E1DA;
  --focus: #2B5A87;
  --cat-salud: #C2547A; --cat-salud-tint: #F7E1E9; --cat-salud-ink: #7A2645;
  --cat-colegio: #2B5A87; --cat-colegio-tint: #E2ECF5; --cat-colegio-ink: #1E3F61;
  --cat-permiso: #7A5BA6; --cat-permiso-tint: #ECE5F5; --cat-permiso-ink: #4E3577;
  --cat-otro: #8C7B6E; --cat-otro-tint: #EFE7DC; --cat-otro-ink: #4A3F37;

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Atkinson Hyperlegible', 'Segoe UI', system-ui, sans-serif;

  --space-1: .25rem; --space-2: .5rem; --space-3: .75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem; --space-16: 4rem;

  --radius-sm: 8px; --radius-md: 14px; --radius-lg: 20px; --radius-xl: 28px; --radius-pill: 999px;
  --shadow-floating: 0 8px 24px rgba(42, 33, 28, .12);
  --touch-min: 3rem; --button-h: 3.25rem; --input-h: 3.5rem;
  --content-max: 70rem; --reading-max: 42.5rem;
}

html { font-size: 112.5%; }
html[data-text-size="grande"] { font-size: 125%; }
html[data-text-size="muy-grande"] { font-size: 137.5%; }

html[data-contrast="alto"] {
  --canvas: #FFFFFF; --surface: #FFFFFF; --ink: #1A1410; --ink-muted: #3D332C;
  --primary: #8F3520; --primary-hover: #7A2D1B; --border: #1A1410; --border-strong: #1A1410;
}

body { background: var(--canvas); color: var(--ink); font: 400 1rem/1.6 var(--font-body); }
h1, h2, .display { font-family: var(--font-display); font-weight: 600; font-variation-settings: 'SOFT' 50; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```
