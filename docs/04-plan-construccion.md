# AYLLU · Plan de construcción

> Cómo se construye AYLLU, **fase por fase**: qué se hace, en qué orden, quién lo hace y cuándo una fase está terminada.
> Sigue el orden de construcción de `CLAUDE.md`. Lo visual lo decide `DESIGN.md`, la estructura `03-arquitectura.md` y el alcance `01-contexto.md`.

---

## 0. Decisiones tomadas antes de empezar

| # | Tema | Decisión |
|---|---|---|
| D1 | Grabador de voz | Solo "Tocar para grabar" y "Detener". Nunca mantener presionado (WCAG 2.5.7). Ya está en `DESIGN.md` |
| D2 | Etiquetas de la barra inferior | 16 px (`small`), no 14 px. Ya está en `DESIGN.md` |
| D3 | Acción primaria en el detalle | Un solo botón terracota: el siguiente paso del hilo para quien mira. El resto, secundarios. Ya está en `03-arquitectura.md` (SIT-03) |
| D4 | Arranque de la demo | `app.html` abre **directo en Inicio con la familia Collantes precargada**. La bienvenida y la configuración (HU01–HU03) se abren desde la landing ("Crear mi espacio familiar") y desde Mi cuenta. Mi cuenta tiene además "Restaurar familia de ejemplo" |
| D5 | Lectura en voz alta | Se construyen las dos, con **una sola utilidad** (`js/voz.js`): "Escuchar" dentro de cada situación (HU43, la obligatoria) y "Escuchar esta pantalla" en el panel Aa, que lee el `<main>` |
| D6 | Fotos, íconos y logo | Fotos de Unsplash (6 a 8), íconos de Tabler en un *sprite* SVG y logo dibujado en SVG. Se consiguen en la fase 0 |
| D7 | "Ver como" en dos pestañas | La persona activa se guarda **por pestaña** en `sessionStorage` (`ayllu:usuario`); `usuarioActual` de `localStorage` es el valor por defecto. Así una pestaña puede ser Rosa y otra Jorge, y el evento `storage` muestra los cambios en vivo. Ya está anotado en `CLAUDE.md` |
| D8 | "Sin respuesta todavía" (HU30) | Una situación enviada pasa a "sin respuesta" si nadie respondió en **24 horas**, o en **4 horas** si es importante |
| D9 | Fechas de ejemplo | Los datos de ejemplo se generan **relativos al momento de cargar** (hace 2 horas, ayer, hace 3 días) para que "hoy" y "ayer" siempre tengan sentido |
| D10 | Raíz en GitHub Pages | Como la landing vive en `pages/index.html`, se agrega un `index.html` mínimo en la raíz que redirige a `pages/index.html`. **Confirmar con el handbook** que este archivo extra está permitido |

---

## 1. Calendario y reparto

Supone **3 integrantes** y entrega el **lunes 30 de noviembre de 2026**. Las fechas se ajustan si cambia el plazo.

| Rol | Se encarga de |
|---|---|
| **Integrante A · Núcleo** | Router, store, situaciones, el hilo y la coordinación (F1b, F2, F3) |
| **Integrante B · Familia y acuerdos** | Componentes de la interfaz, familia, configuración, acuerdos y decisiones (F1a, F4, F5) |
| **Integrante C · Experiencia** | Recursos, landing, voz, accesibilidad, auditoría y despliegue (F0, F6, F8, F9) |

Los complementos de la fase 7 se reparten entre los tres según quién termine primero.

| Día | Fecha | A · Núcleo | B · Familia y acuerdos | C · Experiencia |
|---|---|---|---|---|
| 1 | jue 19 nov | F0 (todos) · empieza F1b | F0 · empieza F1a | F0: recursos, repositorio, Pages |
| 2 | vie 20 nov | F1b: store, router, datos de ejemplo | F1a: tokens, layout, navegación | F1a: panel Aa, modal, toast |
| 3 | sáb 21 nov | **Integración F1 · primer despliegue** | ← | ← |
| 4 | dom 22 nov | F2: lista e historial | F4: familia e integrantes | F8: landing |
| 5 | lun 23 nov | F2: registrar en 3 pasos | F4: invitar y aceptar | F8: landing · capturas |
| 6 | mar 24 nov | F2: detalle con el hilo | F4: bienvenida y configurar | F6: grabador |
| 7 | mié 25 nov | F3: revisión, respuesta, estados | F5: acuerdos | F6: transcripción |
| 8 | jue 26 nov | F3: Inicio por rol, cierre | F5: decisiones, sin respuesta | F6: lectura en voz alta |
| 9 | vie 27 nov | F7: HU16, HU24 | F7: HU18 | F7: HU46 |
| 10 | sáb 28 nov | **F9: auditoría y corrección (todos)** | ← | ← |
| 11 | dom 29 nov | F9: pruebas de aceptación por HU | F9: flujos de tarea | F9: despliegue final, README |
| 12 | lun 30 nov | Colchón · validación con usuarios (tareas + SUS) sobre la versión desplegada | ← | ← |

**Regla:** desde el día 3, lo que llega a `main` se despliega solo. Así siempre hay una versión desplegada que se puede probar.

---

## 2. Arquitectura de archivos

```
/
├── index.html                 redirección a pages/index.html (D10)
├── assets/
│   ├── images/                fotos (.webp, ≤ 300 KB) + logo.svg + franja.svg
│   ├── icons/sprite.svg       íconos Tabler como <symbol>, trazo currentColor
│   └── videos/nota-ejemplo.m4a  nota de voz ficticia para los datos de ejemplo
├── css/styles.css             tokens → base → layout → componentes → pantallas → utilidades
├── js/
│   ├── main.js                entrada: aplica preferencias, monta el layout, arranca el router
│   ├── store.js               leer, guardar, emitir cambios, datos de ejemplo, evento storage
│   ├── router.js              rutas #/…, parámetros, foco y título al cambiar de pantalla
│   ├── ui.js                  modal de confirmación, toast, íconos, tarjetas de situación, etiquetas de estado
│   ├── fechas.js              "hoy, 4:15 p. m.", "ayer", "martes"
│   ├── voz.js                 grabar, transcribir, leer en voz alta
│   └── vistas/
│       ├── inicio.js
│       ├── situaciones.js     lista, registrar, detalle, corregir
│       ├── acuerdos.js
│       ├── familia.js
│       └── onboarding.js      bienvenida, configurar, aceptar invitación
├── pages/
│   ├── index.html             landing
│   └── app.html               demo
├── docs/
├── favicon.ico
├── .gitignore
└── README.md                  cómo probar, créditos de las fotos, equipo
```

Todos los scripts se cargan con `<script type="module" src="../js/main.js">`. Para probar en local hace falta un servidor (`python -m http.server` o Live Server de VS Code), nunca el doble clic: los módulos y el micrófono no funcionan con `file://`.

---

## 3. Fases

Cada fase indica su objetivo, las HU que cubre, las tareas, los archivos que toca y su **criterio de salida**. Una fase no se da por terminada hasta cumplir su criterio de salida y la [lista general](#4-definición-de-terminado-para-cualquier-pantalla).

### Fase 0 · Preparación (día 1, todos)

**Objetivo:** que todos puedan trabajar en paralelo desde el día 2.

- [ ] `git init`, repositorio en GitHub, rama `main` protegida. Una rama por tarea (`hu09-registro-salud`), PR corto y revisión de otro integrante.
- [ ] Crear la estructura de carpetas completa con archivos vacíos, `.gitignore` y `README.md` básico.
- [ ] Activar GitHub Pages desde `main` y comprobar que la URL responde.
- [ ] **Recursos (C):**
  - Fotos de Unsplash: abuela y nieta haciendo tareas, abuelo y nieto en el camino al colegio, cocina familiar, padre en videollamada, padre trabajando, abrazo familiar, más 2 para los estados vacíos. Se pasan a `.webp`, de 1600 px como máximo y menos de 300 KB, y se anota el crédito en el README.
  - *Sprite* de íconos Tabler: home, list, writing (acuerdos), users, plus, heart (salud), book (colegio), key (permiso), dots (otro), star (importante), microphone, player-play, player-pause, volume, pencil, clock, eye, message, check, bell, help, text-size, contrast, phone, search, arrow-left, x, alert-circle, info-circle, user-plus, send, refresh.
  - Logo en SVG (rombo de 4 hebras + "ayllu"), favicon y franja tejida en SVG.
  - Nota de voz ficticia de unos 20 segundos, grabada por el equipo, en `assets/videos/`.
- [ ] Repartir los textos de interfaz: una tabla compartida con cada mensaje, confirmación y error escrito según la voz de `02-identidad-visual.md`.

**Criterio de salida:** repositorio con la estructura del handbook, Pages respondiendo y recursos en `assets/`.

---

### Fase 1 · Base y sistema (días 1–3) · HU41, HU42, HU48

**Objetivo:** la cáscara de la app funcionando en los tres tamaños, con accesibilidad de base y los datos de ejemplo. Todo lo demás se construye encima.

#### 1a · Sistema visual y componentes (B y C)

- [ ] `styles.css`: tokens del *Quick Start* de `DESIGN.md`, tipos, base (`body`, encabezados, foco, `prefers-reduced-motion`), alto contraste.
- [ ] `app.html`: `lang="es-PE"`, enlace "Saltar al contenido", `<header>`, `<nav>`, `<main id="contenido" tabindex="-1">`.
- [ ] **Navegación responsive** con los mismos 4 enlaces reubicados por CSS:
  - ≥ 1280 px: barra superior completa de una fila con franja tejida.
  - < 1280 px (tablet, laptop pequeña y móvil): barra superior simple de una fila y barra inferior de 72 px con "Registrar" central de 64 px. `padding-bottom` en `<main>` para que nada quede debajo y `scroll-padding` para que el foco nunca quede tapado (WCAG 2.4.11).
  - Con letra "Muy grande", las secciones bajan a una segunda fila en vez de ocultarse.
- [ ] Botones (primario, secundario, fantasma, peligro), campos, tarjetas, etiquetas de categoría y de estado y estado vacío, en `ui.js` y `styles.css`.
- [ ] **HU41 · Panel Aa:** botón "Aa" que abre un panel (popover) con Normal, Grande y Muy grande, cada uno con vista previa. Escribe `data-text-size` en `<html>` y guarda en `preferencias.tamanoLetra`. Un *script* pequeño en `<head>` aplica la preferencia antes de pintar la página, para que no parpadee. Se nota el cambio en la misma pantalla (CA02).
- [ ] **HU42 · Alto contraste:** interruptor en el panel Aa que escribe `data-contrast="alto"`. Revisar que estados y categorías tengan siempre ícono y texto.
- [ ] **HU48 · Modal de confirmación:** `confirmar({ titulo, texto, accion, peligro })` devuelve una promesa. Usa `<dialog>` con `showModal()`, Esc cierra, el foco va a "No, volver" y vuelve al botón que lo abrió.
- [ ] **Toast:** `avisar(texto)` con `role="status"`, 6 segundos o hasta cerrarlo, con ícono.
- [ ] Botón "?" (Ayuda) en el mismo lugar en todas las pantallas. Por ahora abre un `<dialog>` con la guía; el contenido se completa en la fase 7.

#### 1b · Núcleo de datos y rutas (A)

- [ ] `store.js`:
  - `leer()`, `guardar(estado)`, `actualizar(fn)` y `suscribir(fn)`, con clave `ayllu:v1`.
  - `usuarioActivo()` lee `sessionStorage` y, si no hay, `usuarioActual` (D7).
  - Escucha `window.addEventListener('storage')` y avisa a los suscriptores para volver a pintar sin recargar.
  - Datos de ejemplo (D9): familia Collantes; Mía, 8 años; Rosa (abuela, activa), Jorge (padre, activo), Ana (tía, apoyo, activa); 6 situaciones que cubren todos los estados:

    | Situación | Categoría | Estado | Sirve para |
    |---|---|---|---|
    | Mía tiene fiebre desde la tarde | Salud · importante | respondida | Flujos 1 y 3, el hilo completo, nota de voz con transcripción |
    | Permiso para el cumpleaños de Lucía | Permiso | enviada, sin ver, hace 2 días | HU30 sin respuesta |
    | Reunión de padres el viernes | Colegio | revisada, sin responder | HU38 de Jorge |
    | Le faltan los útiles de arte | Colegio | enviada, sin ver | HU38, HU24 |
    | Vacuna de los 8 años | Salud | cerrada | Historial, filtro Cerradas |
    | Se cayó en el recreo | Salud | cerrada, decisión de Rosa antes de responder Jorge | HU26 CA04, HU31 |

  - 4 acuerdos: "Fiebre leve" y "Permisos para tareas en grupo" (puede resolver sola); "Viajes" y "Gastos mayores a S/ 100" (consultar antes), con historial.
- [ ] `router.js`: rutas por `#hash` con parámetros (`#/situaciones/:id`), la sección activa con `aria-current="page"`, `document.title` por pantalla ("Situaciones · AYLLU"), el foco al `<h1>` al cambiar de pantalla y una pantalla "No encontramos esta página" con enlace a Inicio.
- [ ] `fechas.js`: `fechaHumana(iso)` con `Intl.DateTimeFormat('es-PE')` → "hoy, 4:15 p. m.", "ayer, 9:00 a. m.", "martes, 9:40 p. m.", "12 de noviembre".
- [ ] **"Ver como"** en el menú de la persona: Rosa o Jorge, con la etiqueta "Modo demostración". Cambiar de persona vuelve a pintar la pantalla y anuncia "Ahora ve AYLLU como Jorge".
- [ ] Pantallas de las 4 secciones como esqueletos (título + estado vacío) para probar la navegación.

**Criterio de salida:** en la URL de Pages se navega entre las 4 secciones con teclado y con toque en 375, 768 y 1280 px. Aa y contraste se mantienen al recargar. El modal y el toast funcionan. Dos pestañas (Rosa y Jorge) muestran personas distintas a la vez.

---

### Fase 2 · Situaciones (días 4–6, A) · HU09, HU10, HU15, HU17, HU25

**Objetivo:** registrar una situación, verla en la lista y abrir su detalle con el hilo.

- [ ] **SIT-01 · Lista e historial (HU17):**
  - Filtros como botones de alternancia (`aria-pressed`): Todas · Importantes · Esperan respuesta · Cerradas, con el número de cada una.
  - Tarjeta de situación según `DESIGN.md`: categoría (ícono + nombre + color), "Importante" con borde maíz de 6 px, título en `h3`, resumen, autor, fecha y estado en palabras. Toda la tarjeta es un enlace.
  - Ordenada de la más reciente a la más antigua, agrupada por "Esta semana", "Antes".
  - Estado vacío con foto: "Aquí verá lo que registre sobre Mía."
  - Espacio reservado para el buscador (HU18, fase 7).
- [ ] **SIT-02 · Registrar en 3 pasos (HU09, HU10, HU15, HU25):**
  - Indicador "Paso X de 3 · Qué pasó" con barra en verde molle. "Atrás" y "Cancelar" siempre visibles. En móvil se oculta la barra inferior y la acción del paso queda fija abajo.
  - **Paso 1 · ¿Qué pasó?:** 4 tarjetas grandes de categoría como `radio` con estilo de tarjeta. Accesos directos `#/situaciones/nueva?categoria=salud` desde Inicio.
  - **Paso 2 · Cuéntelo:** título y descripción con `<label>` visible. Dos caminos del mismo tamaño: "Escribir" (ahora) y "Grabar nota de voz" (deshabilitado con el aviso "Disponible pronto" hasta la fase 6). Interruptor "Es importante" con su explicación (HU15).
  - **Paso 3 · Revisar y enviar:** resumen con "Cambiar" en cada dato (vuelve al paso sin borrar nada), destinatarios marcados (por defecto el padre) y botón "Enviar a Jorge" (HU25).
  - El borrador vive en memoria mientras dura el flujo: cambiar de categoría o volver atrás no borra lo escrito. "Cancelar" con texto escrito pide confirmación (HU48).
  - Validación al salir del campo y al intentar avanzar, con mensajes como "Escriba qué pasó para que la familia lo entienda." (`aria-describedby`, `aria-invalid` y el foco al primer error).
  - Al enviar: eventos `registrada` y `enviada`, estado `enviada`, toast "Listo. Jorge recibirá la situación y usted verá cuando la revise." y paso al detalle.
- [ ] **SIT-03 · Detalle (versión base):** volver a Situaciones, etiquetas, `h1`, autor y fecha, y **el hilo** como `<ol>`: nodos llenos con el color de quien actuó y nodos punteados para lo pendiente, cada uno con quién, qué y cuándo. El hilo se dibuja una vez, salvo con `prefers-reduced-motion`.

**Criterio de salida:** el flujo 1 sin la voz funciona de punta a punta: Inicio → Registrar → Salud → escribir → Importante → Enviar → el detalle muestra "Jorge todavía no la ha visto". Revisar los CA de HU09, HU10, HU15, HU17 y HU25.

---

### Fase 3 · Coordinación y seguimiento (días 7–8, A) · HU26, HU29, HU33, HU34, HU38

**Objetivo:** que el padre revise y responda a su hora y que la abuela lo vea sin preguntar.

- [ ] **Máquina de estados** en `store.js`, que agrega un evento al hilo en cada transición:
  `registrada → enviada → revisada → respondida → cerrada`, y `cerrada → enviada/respondida` al volver a abrir.
- [ ] **HU29 · Estado de revisión:** cuando un destinatario abre el detalle por primera vez, se guarda `revisadaPor[id]` y el evento `revisada`. La otra pestaña lo muestra sin recargar (CA03) y lo anuncia con `aria-live="polite"`: "Jorge la vio · 9:40 p. m.".
- [ ] **HU33 · Seguimiento:** etiqueta de estado con las frases de la tabla de `DESIGN.md`, la misma en la tarjeta, el hilo y los avisos.
- [ ] **HU26 · Responder a su hora:** campo "Su respuesta" con su `<label>` y "Enviar respuesta" (primario para Jorge, D3). Si Rosa ya registró una decisión, Jorge ve primero el aviso "Rosa ya la atendió" y el campo se llama "Dejar una observación" (CA04).
- [ ] **HU34 · Cerrar:** "Cerrar situación" pasa por el modal ("¿Cerrar esta situación? La familia verá que ya quedó resuelta.") y termina con el toast "Listo. La familia verá que quedó resuelta.". "Volver a abrir" como secundario.
- [ ] **HU38 · Pendientes de respuesta:** consulta `pendientesDe(usuario)` que devuelve las situaciones enviadas a esa persona y sin su respuesta, con las importantes primero.
- [ ] **Inicio (IN-01 e IN-02, primera versión):**
  - Jorge: "Hola, Jorge" + "Hay 2 situaciones que esperan su respuesta" + tarjeta protagonista "Esperan su respuesta" (HU38).
  - Rosa: banda de saludo verde con foto + "Situaciones recientes" (las 3 últimas) + accesos rápidos.
  - Lateral en web: Mía, 8 años, e integrantes.
- [ ] Avisos (G-03, primera versión): botón con el número de eventos nuevos de otras personas y un panel con la lista.

**Criterio de salida:** los flujos 2 y 3 (sin la decisión) funcionan en dos pestañas en paralelo. Revisar los CA de HU26, HU29, HU33, HU34 y HU38.

---

### Fase 4 · Familia y configuración (días 4–6, B) · HU01–HU06

**Objetivo:** que se vea quién está en la familia, se pueda invitar a alguien y crear un espacio nuevo.

- [ ] **FAM-01 · Integrantes y roles (HU06):** lista con avatar (iniciales y color de hebra), nombre, rol en palabras y estado ("Activa", "Invitación pendiente"). Para Rosa, botón primario "Invitar familiar".
- [ ] **FAM-02 · Perfil del menor (HU03):** ver y editar nombre y edad de Mía. Guardar pasa por la confirmación.
- [ ] **FAM-03 · Invitar familiar (HU04):** nombre, rol con tarjetas (Padre, Madre, Familiar de apoyo) y lo que podrá hacer cada rol, dicho en palabras. Al confirmar, se genera un código de 6 caracteres sin letras confusas y el enlace `app.html#/invitacion?codigo=…`, con "Copiar enlace" y la invitación queda pendiente.
- [ ] **INV-01 · Aceptar invitación (HU05):** se abre con el enlace o escribiendo el código, sin contraseña (WCAG 3.3.8). Muestra quién invita y a qué familia. "Aceptar y entrar" deja al integrante activo y lo pone como persona activa en esa pestaña.
- [ ] **ON-01 · Bienvenida y rol (HU01):** foto, una frase y tarjetas de rol (Abuela o abuelo que cuida, Padre o madre, Familiar de apoyo).
- [ ] **ON-02 y ON-03 · Configurar y revisar (HU02, HU03):** paso 1, nombre de la familia; paso 2, el menor; paso 3, revisar y "Crear espacio familiar", que pide confirmación ("Esto reemplaza la familia de ejemplo de esta demostración"). Reutiliza el indicador de pasos de la fase 2. El nombre de la persona se pide una sola vez (WCAG 3.3.7).
- [ ] **Mi cuenta:** ver el propio perfil, "Restaurar familia de ejemplo" (con confirmación) y "Salir" (vuelve a la landing).

**Criterio de salida:** el flujo 5 funciona: invitar a una tía, abrir el enlace en otra pestaña, aceptar y verla activa en la lista de la primera pestaña. Revisar los CA de HU01 a HU06.

---

### Fase 5 · Acuerdos y decisiones (días 7–8, B) · HU27, HU28, HU30, HU31

**Objetivo:** dejar claro qué puede decidir Rosa sola y registrar lo que se decidió.

- [ ] **AC-01 · Acuerdos vigentes (HU27):** dos columnas en web y una debajo de la otra en móvil: "Rosa puede resolver sola" y "Consultar antes". Cada acuerdo muestra quién lo cambió por última vez y cuándo (CA03), con su historial en un `<details>` debajo.
- [ ] **AC-02 · Crear o modificar acuerdo:** tema y tipo como dos tarjetas de opción, sin arrastrar (WCAG 2.5.7). Para pasar "Fiebre leve" a la otra columna hay un botón "Mover a «Puede resolver sola»". Guardar pasa por la confirmación y agrega una entrada al historial con autor y fecha.
- [ ] **Acuerdo que aplica dentro de la situación:** si la categoría o el título coincide con un acuerdo, el detalle muestra "Según lo acordado, Rosa puede resolver esto sola".
- [ ] **HU31 · Registrar una decisión:** campo "¿Qué decidió?" en el detalle (primario para Rosa, D3), con el evento `decision` en el hilo.
- [ ] **HU28 · Responder a una decisión pendiente:** Jorge ve "Rosa espera su opinión sobre esta decisión" y puede responder: "Estoy de acuerdo" o escribir su comentario.
- [ ] **HU30 · Sin respuesta todavía:** `sinRespuesta()` según la regla D8. Tarjeta protagonista en el Inicio de Rosa, con el tiempo de espera en palabras ("Enviada hace 2 días") y la salida "Llamar a Jorge" (`tel:`, número ficticio).

**Criterio de salida:** los flujos 3 y 4 completos. Revisar los CA de HU27, HU28, HU30 y HU31.

---

### Fase 6 · Voz (días 6–8, C) · HU12, HU13, HU43

**Objetivo:** que Rosa pueda contar la situación con su voz y que todo lo escrito se pueda escuchar.

- [ ] **HU12 · Grabar nota de voz** (`voz.js`, en el paso 2):
  - Al tocar "Grabar", se pide el micrófono con una explicación antes del permiso del navegador.
  - `MediaRecorder`: botón circular de 96 px "Tocar para grabar" → contador de tiempo y onda simple (una barra de nivel, sin animación con movimiento reducido) → "Detener".
  - Después: "Escuchar", "Grabar de nuevo" y "Usar esta nota". "Descartar" pasa por la confirmación.
  - Se guarda como *data URL* en `audio`, con un máximo de 2 minutos para no llenar `localStorage`. Si no cabe: "La nota es muy larga para esta demostración. Pruebe con una más corta."
  - Sin micrófono o sin permiso: "No pudimos usar el micrófono. Puede escribir lo que pasó." y el foco pasa a "Escribir".
- [ ] **HU13 · Versión escrita:**
  - `SpeechRecognition` con `lang: "es-PE"` en paralelo a la grabación (solo Chrome y Edge).
  - Transcripción editable debajo del grabador, con el aviso "Revise que el texto diga lo que usted dijo".
  - Si no está disponible o falla (CA05): "No pudimos pasar su voz a texto. Su nota quedó guardada; puede escribirla si quiere."
  - En el detalle: reproductor nativo con controles + la transcripción siempre visible. En "Corregir" se puede editar la transcripción (CA03, junto con la fase 7).
- [ ] **HU43 · Lectura en voz alta:**
  - Botón "Escuchar" en el detalle (CA02) que lee categoría, título, descripción y el hilo con `speechSynthesis` en una voz `es-*`.
  - Controles "Pausar", "Seguir" y velocidad (Lenta, Normal) en el mismo lugar.
  - "Escuchar esta pantalla" en el panel Aa, que usa la misma función con el texto del `<main>` (D5).
  - Si no hay voz en español: ocultar el botón no; mostrar "Su navegador no puede leer en voz alta. Pruebe con Chrome o Edge."

**Criterio de salida:** el flujo 1 completo con la voz en Chrome y la versión sin transcripción en Firefox. Revisar los CA de HU12, HU13 y HU43. Probar en un celular real con HTTPS (Pages).

---

### Fase 7 · Complementos (día 9, todos) · HU16, HU18, HU24, HU46

- [ ] **HU18 · Búsqueda por palabra (B):** campo "Buscar una situación" con su `<label>` encima de la lista. Busca en el título, la descripción y la transcripción, sin distinguir tildes ni mayúsculas (`normalize('NFD')`), y se combina con los filtros. Anuncia "Encontramos 3 situaciones" con `aria-live`. Sin resultados: "No encontramos «vacuna». Pruebe con otra palabra." y "Ver todas".
- [ ] **HU24 · Novedades desde la última visita (A):** bloque en el Inicio de Jorge con los eventos de otras personas posteriores a `ultimaVisita[jorge]`. `ultimaVisita` se actualiza al salir de Inicio, no al entrar, para que las novedades no desaparezcan mientras se leen. Lo mismo alimenta el número de Avisos.
- [ ] **HU16 · Corregir una situación (A):** SIT-04 con el formulario precargado. Al guardar, evento `corregida` en el hilo ("Rosa corrigió la descripción · 5:02 p. m.") y aviso a los destinatarios. No se borra la versión anterior: se ve en el hilo.
- [ ] **HU46 · Comprender los pasos (C):** ayuda breve dentro de cada paso (qué hacer y qué pasa después), "Ocultar ayudas" guardado en `preferencias.ayudasPasos`, y la guía de "?" completa: 5 tareas con pasos numerados y capturas.

**Criterio de salida:** los CA de las 4 HU revisados, sin romper los flujos anteriores.

---

### Fase 8 · Landing (días 4–5, C)

`pages/index.html`, presentación del producto (no es HU, pero es lo primero que ve el evaluador):

- [ ] Encabezado verde molle con logo, franja tejida y el botón "Probar AYLLU".
- [ ] Hero con foto (texto sobre banda sólida), título en Fraunces `display`, una frase y "Probar AYLLU" como única acción terracota.
- [ ] El problema en 3 datos (INEI), con fuente.
- [ ] "Cómo funciona" en 3 pasos: Registre lo que pasa → Su familia lo revisa a su hora → Queda guardado lo que deciden.
- [ ] Beneficios por segmento: abuela o abuelo, padre o madre migrante, familiar de apoyo.
- [ ] Vista de la app con capturas reales (se actualizan en la fase 9).
- [ ] Accesibilidad: letra ampliable, alto contraste, voz y por qué Atkinson Hyperlegible.
- [ ] "Crear mi espacio familiar" (lleva a ON-01) como enlace secundario.
- [ ] Pie verde con el equipo, el curso y la nota "Los nombres son ficticios".
- [ ] **Revisar en el handbook** si la landing debe tener secciones obligatorias (equipo, video, etc.) y agregarlas.

**Criterio de salida:** la landing pasa la lista de la sección 4 y lleva a la demo.

---

### Fase 9 · Auditoría, pruebas y despliegue (días 10–12, todos)

- [ ] **Accesibilidad (WCAG 2.2 AA):**
  - Lighthouse y axe DevTools en cada ruta, sin errores.
  - Recorrido completo solo con teclado: orden lógico, foco visible y nunca tapado por las barras fijas.
  - Letra al 137,5 % y ancho de 320 px: sin cortes ni scroll horizontal.
  - Alto contraste en cada pantalla.
  - Lector de pantalla (NVDA con Chrome y VoiceOver en el celular): el hilo como lista, los avisos `aria-live`, los modales.
  - Objetivos de 48 × 48 px como mínimo (revisar con las DevTools).
- [ ] **Trazabilidad:** fragmento de consola que lista los `data-hu` de cada ruta y comprueba que aparecen las 30 HU (ver la tabla de la sección 5).
- [ ] **Pruebas de aceptación:** una por HU, criterio por criterio (CA01…CA05), con captura, en la versión desplegada. Es la base del capítulo 6.
- [ ] **Flujos de tarea:** los 6 flujos de `03-arquitectura.md` cronometrados, en Chrome de escritorio, Edge, Firefox, Safari de iPhone y Chrome de Android.
- [ ] **Textos:** revisar que todo use "usted", el glosario fijo y ningún término prohibido ("usuario", "dashboard", "sincronizar"…), con `grep`.
- [ ] **Rendimiento:** fotos optimizadas, `loading="lazy"` debajo del pliegue y `fetchpriority="high"` en la foto del hero.
- [ ] **Despliegue final:** README (qué es, cómo probar "Ver como" en dos pestañas, navegadores con voz, créditos de las fotos, equipo), favicon y URL final.
- [ ] **Validación con usuarios** (día 12): tareas + cuestionario SUS sobre la versión desplegada.

---

## 4. Definición de terminado (para cualquier pantalla)

Una pantalla está terminada cuando cumple **todo** esto:

- [ ] Usa solo tokens de `DESIGN.md` y todo en `rem`. Una sola acción terracota.
- [ ] HTML semántico, un solo `<h1>` y encabezados en orden.
- [ ] Funciona con teclado y el foco se ve.
- [ ] Se ve bien en 375, 768 y 1280 px, con letra al 137,5 % y en alto contraste.
- [ ] Ícono + texto en botones y navegación. Estados con ícono y texto, no solo color.
- [ ] Toda acción que cambia información pasa por el modal y termina con un toast.
- [ ] Mensajes de error que explican cómo seguir, sin culpar.
- [ ] Bloques marcados con `data-hu`.
- [ ] Los CA de sus HU revisados uno por uno.
- [ ] Commit en español con la HU (`HU29: estado de revisión en el hilo`) y PR revisado por otro integrante.

---

## 5. Cobertura de las 30 HU

| HU | Historia | Fase | Pantalla |
|---|---|---|---|
| HU01 | Selección del rol familiar | 4 | ON-01 |
| HU02 | Creación del grupo familiar | 4 | ON-02, ON-03 |
| HU03 | Información básica del menor | 4 | ON-02, FAM-02 |
| HU04 | Invitación de un familiar | 4 | FAM-03 |
| HU05 | Aceptación de una invitación | 4 | INV-01 |
| HU06 | Integrantes y roles | 4 | FAM-01 |
| HU09 | Situación de salud | 2 | SIT-02 |
| HU10 | Situación escolar | 2 | SIT-02 |
| HU12 | Nota de voz | 6 | SIT-02 |
| HU13 | Versión escrita de la nota | 6 | SIT-02, SIT-03, SIT-04 |
| HU15 | Situación importante | 2 | SIT-02, tarjetas |
| HU16 | Corrección de una situación | 7 | SIT-04 |
| HU17 | Historial del menor | 2 | SIT-01, IN-01 |
| HU18 | Búsqueda por palabra | 7 | SIT-01 |
| HU24 | Novedades desde la última visita | 7 | IN-02, Avisos |
| HU25 | Comunicación de una situación importante | 2 | SIT-02 paso 3 |
| HU26 | Respuesta en el horario propio | 3 | SIT-03 |
| HU27 | Acuerdos sobre decisiones | 5 | AC-01, AC-02 |
| HU28 | Respuesta a una decisión pendiente | 5 | SIT-03 |
| HU29 | Estado de revisión | 3 | SIT-03, Avisos |
| HU30 | Situaciones sin respuesta | 5 | IN-01 |
| HU31 | Registro de una decisión | 5 | SIT-03 |
| HU33 | Seguimiento del estado | 3 | SIT-01, SIT-03 |
| HU34 | Cierre de una situación | 3 | SIT-03 |
| HU38 | Pendientes de respuesta | 3 | IN-02 |
| HU41 | Tamaño de la letra | 1 | Panel Aa |
| HU42 | Distinción visual | 1 | Panel Aa, estados, categorías |
| HU43 | Lectura en voz alta | 6 | SIT-03, Panel Aa |
| HU46 | Comprensión de los pasos | 7 | SIT-02, ON-02, Ayuda |
| HU48 | Confirmación de acciones | 1 | Modal global |

---

## 6. Riesgos y cómo se manejan

| Riesgo | Plan |
|---|---|
| La transcripción solo funciona en Chrome y Edge | Diseñada como mejora: sin ella se guarda el audio y se ofrece escribir (HU13 CA05). Las pruebas de voz se hacen en Chrome |
| `localStorage` se llena con audios | Límite de 2 minutos por nota y aviso claro si no cabe |
| El micrófono no funciona en local | Probar con `localhost` o directamente en Pages (HTTPS) |
| Conflictos al trabajar los tres en `main.js` y `styles.css` | Un módulo por vista en `js/vistas/` y secciones comentadas en `styles.css` por componente. PR pequeños e integración diaria |
| La fase 1 se atrasa y bloquea a todos | Es la fase más importante: si el día 3 no está, el resto empieza sobre los esqueletos y se integra después |
| Falta de tiempo al final | Recortar en este orden: "Escuchar esta pantalla" (D5) → animación del hilo → agrupación por semanas en la lista. Las 30 HU no se recortan |
