# CLAUDE.md · AYLLU

Este repositorio es la landing page y demo funcional de **AYLLU**, una plataforma de acompañamiento en la crianza para abuelos que crían a sus nietos porque los padres migraron. Es el proyecto final del curso HCI for UX Design (UPC, 2026-20): se evalúa la **usabilidad, la accesibilidad y la trazabilidad con las historias de usuario (HU)**, no la complejidad técnica.

## Lee esto antes de trabajar

| Archivo | Cuándo leerlo |
|---|---|
| `docs/01-contexto.md` | Siempre, al empezar. Problema, usuarios, hallazgos y las 30 HU core |
| `docs/DESIGN.md` | Antes de escribir cualquier HTML o CSS. Tokens, componentes y reglas visuales |
| `docs/03-arquitectura.md` | Antes de crear una pantalla o ruta. Navegación, pantallas e HU que cubre cada una |
| `docs/02-identidad-visual.md` | Al escribir textos de interfaz, elegir ilustraciones o decidir algo visual que DESIGN.md no cubre |
| `docs/04-plan-construccion.md` | Antes de empezar una tarea. Fases, orden, reparto y criterios de salida de cada fase |

Si hay un conflicto: **DESIGN.md manda en lo visual, 03-arquitectura.md en la estructura y 01-contexto.md en el alcance.** Si algo no está definido, pregunta antes de inventarlo.

## Stack y restricciones (no negociables)

- **HTML, CSS y JavaScript vanilla.** Sin frameworks, sin TypeScript, sin paso de build y sin npm. Debe funcionar abriendo el sitio en GitHub Pages.
- **Sin backend.** Los datos viven en `localStorage` con una familia de ejemplo precargada. La "conexión" entre abuelo y padre se simula con el selector "Ver como" y el evento `storage` entre pestañas.
- **Una sola base responsive** (desktop, tablet y mobile). Nada desaparece al cambiar de dispositivo; solo se reorganiza.
- Fuentes desde Google Fonts: **Fraunces** (títulos) y **Atkinson Hyperlegible** (todo lo demás). Íconos: **Tabler Icons** o **Lucide** en SVG dentro de `assets/icons/`.
- Recursos externos permitidos: solo Google Fonts. Todo lo demás se incluye en el repositorio.

## Estructura de carpetas (obligatoria por el handbook, no renombrar)

```
/
├── assets/
│   ├── images/      ilustraciones y capturas
│   ├── icons/       íconos SVG
│   ├── fonts/       (si se alojan fuentes localmente)
│   └── videos/      (si aplica)
├── css/
│   └── styles.css   archivo principal de estilos (tokens de DESIGN.md arriba del todo)
├── js/
│   └── main.js      archivo principal: router por #hash, estado y componentes
├── pages/
│   ├── index.html   landing de presentación
│   └── app.html     demo funcional (rutas #/inicio, #/situaciones, #/acuerdos, #/familia…)
├── docs/            documentación (este contexto)
├── favicon.ico
├── .gitignore
└── README.md
```

Si `main.js` crece demasiado, se pueden agregar módulos en `js/` (por ejemplo `js/store.js` o `js/router.js`) cargados con `<script type="module">`, pero `main.js` sigue siendo la entrada.

## Modelo de datos (localStorage, clave `ayllu:v1`)

```js
{
  familia: { id, nombre: "Familia Collantes", menor: { nombre: "Mía", edad: 8 } },
  integrantes: [{ id, nombre, rol: "abuela" | "padre" | "madre" | "apoyo", color, estado: "activo" | "invitado" }],
  usuarioActual: "rosa",                                   // valor por defecto; "Ver como" lo guarda por pestaña en sessionStorage (ayllu:usuario) para poder tener a Rosa y a Jorge en dos pestañas a la vez
  situaciones: [{
    id, categoria: "salud" | "colegio" | "permiso" | "otro",
    titulo, descripcion, importante: false,
    audio: null | { url, duracion }, transcripcion: null | "texto",
    autor, creadaEn,                                        // ISO 8601
    enviadaA: ["jorge"], revisadaPor: { jorge: "2026-11-24T21:40:00" },
    eventos: [{ tipo: "registrada" | "enviada" | "revisada" | "respuesta" | "decision" | "cerrada" | "corregida", autor, fecha, texto }],
    estado: "registrada" | "enviada" | "revisada" | "respondida" | "cerrada"
  }],
  acuerdos: [{ id, tema, tipo: "puede-resolver" | "consultar", autor, fecha, historial: [] }],
  preferencias: { tamanoLetra: "normal" | "grande" | "muy-grande", altoContraste: false, ayudasPasos: true },
  ultimaVisita: { jorge: "…", rosa: "…" }
}
```

No cambies los nombres de los campos sin actualizar este archivo.

## Reglas de diseño (resumen de DESIGN.md)

- **Proporción 60-30-10:** 60 % crema y blanco (base), 30 % verde molle (bandas, paneles, pie), 10 % terracota y maíz (acción e importante).
- **Fotos reales** de `assets/images/` en Inicio, la landing, la bienvenida y los estados vacíos, con `alt` descriptivo y el texto siempre sobre una banda sólida.
- Usa **solo los tokens** (`var(--primary)`, `var(--space-4)`…), nunca hex sueltos en los componentes.
- **Todo en `rem`.** El tamaño de letra (HU41) se controla con `data-text-size` en `<html>`; el alto contraste (HU42), con `data-contrast="alto"`.
- **Una sola acción terracota (primaria) por pantalla.**
- **Ícono + texto** en navegación y botones. Nada de navegación solo con íconos ni menú hamburguesa para las secciones.
- Escritorio (≥ 1280 px): barra superior de una fila con 4 secciones. Tablet y móvil (< 1280 px): barra superior simple y barra inferior con 4 secciones y el botón central "Registrar".
- Cada detalle de situación muestra **el hilo** (línea de tiempo) como `<ol>`.
- Las acciones que cambian información pasan por el **modal de confirmación** (HU48) y terminan con un toast tranquilizador.

## Las 10 heurísticas de Nielsen aplicadas a AYLLU

Cada pantalla debe cumplirlas. Si una decisión choca con una heurística, gana la heurística, salvo que se trate de accesibilidad.

| # | Heurística | Cómo se cumple en AYLLU |
|---|---|---|
| 1 | **Visibilidad del estado del sistema** | Cada situación muestra su estado en palabras ("Jorge todavía no la ha visto", "Jorge la vio · 9:40 p. m."). El hilo muestra lo hecho y lo pendiente. Indicador "Paso X de 3" en los flujos. Toast después de cada acción. Estados de carga y grabación visibles (contador de tiempo en la nota de voz) |
| 2 | **Relación con el mundo real** | Palabras de la casa: "situación", "acuerdo", "familia", "revisada". Categorías conocidas (Salud, Colegio, Permiso). Fechas como se dicen: "hoy, 4:15 p. m.", "ayer", "martes". Íconos reconocibles (corazón = salud, libro = colegio) |
| 3 | **Control y libertad** | "Atrás" y "Cancelar" siempre visibles en los flujos. "Grabar de nuevo" y "Descartar". Corregir una situación (HU16). Volver a abrir una situación cerrada. Ningún paso borra lo ya escrito |
| 4 | **Consistencia y estándares** | Las mismas 4 secciones, en el mismo lugar, en todas las pantallas. Un solo botón terracota por pantalla, siempre para la acción principal. Mismos nombres de estado en tarjetas, hilo y avisos. Patrones conocidos de la web (barra superior, barra inferior en móvil) |
| 5 | **Prevención de errores** | Modal de confirmación antes de cerrar, desvincular o descartar (HU48). Escuchar la nota antes de guardarla. Revisar antes de enviar (paso 3). Validar los campos al salir de ellos, no mientras se escribe |
| 6 | **Reconocer antes que recordar** | Tarjetas de categoría con ícono en vez de listas desplegables. Etiquetas visibles encima de los campos (nunca solo texto de ejemplo). El acuerdo que aplica se muestra dentro de la situación. Inicio recuerda lo pendiente; la persona no tiene que acordarse |
| 7 | **Flexibilidad y eficiencia** | Accesos rápidos en Inicio ("Algo de salud", "Contarlo con mi voz"). Hablar o escribir, a elección. Opción "Ocultar ayudas" para quien ya conoce el flujo (HU46). Búsqueda por palabra (HU18) |
| 8 | **Diseño estético y minimalista** | Una tarea por pantalla. Una tarjeta protagonista. Color solo con significado (60-30-10). Nada de datos que no ayuden a decidir |
| 9 | **Ayudar a reconocer, diagnosticar y recuperarse de errores** | Mensajes que dicen qué pasó y cómo seguir, sin culpar: "Escriba el nombre para que la familia sepa de quién se trata." Si falla la transcripción: "No pudimos pasar su voz a texto. Su nota quedó guardada; puede escribirla si quiere." El error se marca con ícono, borde y texto, no solo con color |
| 10 | **Ayuda y documentación** | Botón "?" en el mismo lugar en todas las pantallas (WCAG 3.2.6). Instrucciones breves dentro de cada paso. Guía de uso corta, con pasos y capturas |

## Diseño para adultos mayores (inclusión)

El usuario principal tiene más de 60 años y poca experiencia digital. Además de WCAG, aplica:

- **Visión:** texto base de 18 px, nunca menos de 16 px. Atkinson Hyperlegible. Contraste alto. Nada de texto gris claro. Tamaño de letra ajustable hasta 137,5 % sin romper la página (HU41). Modo de alto contraste (HU42).
- **Motricidad:** objetivos de 48 × 48 px como mínimo con 8 px de separación. Nada de gestos difíciles (arrastrar, deslizar, mantener presionado) como única forma de hacer algo (WCAG 2.5.7). Botones grandes en la parte baja de la pantalla en móvil.
- **Cognición y memoria:** una tarea por pantalla, máximo 3 pasos por flujo, lenguaje simple y frases cortas. No pedir dos veces el mismo dato (WCAG 3.3.7). Nada de tiempos límite. No esconder funciones en menús, gestos o íconos sin texto.
- **Confianza:** decir siempre qué pasará antes de una acción y qué pasó después. Tono cálido y paciente, con "usted". Ningún mensaje que culpe o asuste.
- **Audición:** todo lo que se escucha (notas de voz) tiene su versión escrita (HU13). Todo lo escrito se puede escuchar (HU43).
- **Acceso sin barreras:** ingreso sin contraseñas complicadas ni acertijos (WCAG 3.3.8); en la demo, con un enlace o un código de invitación.
- **Habilidad digital variable:** la interfaz no supone conocimientos previos (nada de "deslice para…", "toque dos veces"). Los íconos llevan siempre su nombre.

## Accesibilidad (WCAG 2.2 AA, verificable en la landing)

Antes de dar por terminada una pantalla, comprueba:

- [ ] HTML semántico: `<header>`, `<nav>`, `<main>`, `<section>`, encabezados en orden y `lang="es-PE"`.
- [ ] Enlace "Saltar al contenido" al inicio.
- [ ] Todo funciona con teclado; el foco se ve (anillo azul lago de 3 px) y nunca queda oculto bajo barras fijas.
- [ ] Objetivos táctiles de 48 × 48 px como mínimo.
- [ ] Cada campo tiene `<label>` visible; los errores se anuncian (`aria-describedby`, `aria-live`) y explican cómo corregir.
- [ ] El color nunca es la única pista: estados y categorías siempre con texto e ícono.
- [ ] Imágenes con `alt` útil; las decorativas con `alt=""`.
- [ ] Contraste según DESIGN.md (texto ≥ 4,5:1, controles ≥ 3:1).
- [ ] Se respetan `prefers-reduced-motion` y el tamaño de letra al 137,5 % sin cortes ni scroll horizontal.
- [ ] Los modales usan `<dialog>`, atrapan el foco y se cierran con Esc.
- [ ] La ayuda ("?") está en el mismo lugar en todas las pantallas (3.2.6).
- [ ] Ninguna acción depende de arrastrar o de gestos complejos (2.5.7).
- [ ] No se pide dos veces el mismo dato en un flujo (3.3.7).

Hay una skill local de buenas prácticas web en `.claude/skills/modern-web-guidance/` (accesibilidad, formularios, diálogos, navegación). Consúltala para patrones concretos.

## Textos de interfaz

- Trato de **"usted"**, frases cortas, verbo primero en los botones ("Registrar situación", "Enviar a Jorge").
- Glosario fijo: **situación**, **acuerdo**, **familia**, **integrante**, **revisada**, **importante**. No usar "usuario", "dashboard", "notificación push" ni "sincronizar".
- Nombres de ejemplo **ficticios** (Rosa, Mía, Jorge, Ana). Nunca nombres reales de los participantes de las entrevistas.

## Trazabilidad con las HU

- Marca cada bloque que implementa una HU con `data-hu="HU09"` (o varias: `data-hu="HU29 HU33"`). Así se arman las pruebas de aceptación del capítulo 6.
- Al terminar una HU, revisa sus criterios de aceptación (CA01…CA05) uno por uno.
- Orden de construcción recomendado: base (HU42, HU41, HU48) → situaciones (HU09, HU10, HU15, HU17) → coordinación (HU25, HU26, HU29, HU38, HU33, HU34) → configuración (HU01–HU06) → acuerdos y decisiones (HU27, HU31, HU28, HU30) → voz (HU12, HU13, HU43) → complementos (HU18, HU24, HU46, HU16).

## Fuera de alcance

- Asistente con IA u "orientación digital" (no validado con usuarios).
- Inicio de sesión real, servidor, base de datos o notificaciones push.
- Migración internacional.

## Voz (HU12, HU13, HU43)

- Grabación con `MediaRecorder`; transcripción con Web Speech API (`SpeechRecognition`, solo Chrome y Edge, `lang: "es-PE"`). Si no está disponible, se guarda el audio sin texto y se ofrece escribirlo (HU13 CA05).
- Lectura en voz alta con `speechSynthesis`, voz en español, con pausar, reanudar y velocidad (HU43).
- El micrófono requiere HTTPS o `localhost`: prueba con un servidor local, no abriendo el archivo con doble clic.

## Git

- Commits pequeños y en español, mencionando la HU: `HU29: estado de revisión en el hilo`.
- No subas archivos de prueba, capturas personales ni datos reales.
