# AYLLU · Arquitectura de información (web y móvil)

> Cómo se organiza AYLLU: secciones, navegación, pantallas, rutas y qué HU cubre cada pantalla.
> Reemplaza la arquitectura anterior de 5 secciones en panel lateral. Los estilos de cada componente están en `DESIGN.md`.

---

## 1. Diagnóstico de la arquitectura anterior

La versión anterior tenía 5 secciones en un panel lateral fijo: Inicio, Situaciones, Acuerdos, Familia y Ayuda y accesibilidad, más utilidades globales (Buscar, Avisos, Registrar situación y Menú de usuario).

**Lo que se mantiene:** Inicio, Situaciones, Acuerdos y Familia son las secciones correctas. Responden a los cuatro módulos de las HU y a los hallazgos (Acuerdos nace de la necesidad de definir la autonomía del abuelo). También se mantienen las etiquetas con texto, el trato de "usted" y "Registrar situación" como acción global.

**Lo que se corrige:**

| Problema | Por qué es un problema | Cambio |
|---|---|---|
| "Ayuda y accesibilidad" es una sección al mismo nivel que Situaciones | La accesibilidad no es un destino: la persona necesita agrandar la letra **en la pantalla donde está** (HU41 CA02). Además resta foco a las 4 secciones de trabajo | Se disuelve: el tamaño de letra y el contraste pasan a un control **"Aa" siempre visible**; la lectura en voz alta va **dentro de cada situación** (HU43 CA02); la guía de uso va al menú "?" |
| El panel lateral ocupa unos 230 px y en móvil se convierte en menú hamburguesa | Las personas mayores no descubren menús ocultos. El ancho perdido obliga a apretar el contenido justo cuando la letra se agranda | **Web:** barra superior con 4 secciones. **Móvil:** barra inferior siempre visible |
| "Coordinación" y "Seguimiento" son subsecciones separadas de "Detalle de situación" | Partir una misma situación en 3 lugares obliga a saltar entre pantallas para saber qué pasó | Todo vive en **una sola pantalla de detalle**, organizada por el **hilo** (línea de tiempo) |
| "Orientación digital" (ayuda con apps y términos) | Es la función del asistente con IA, que **no se validó** en entrevistas | Fuera de esta fase. Se registra como hipótesis para una siguiente iteración |
| "Administración" de la familia como subsección | Desvincular o editar el perfil son acciones raras y delicadas | Pasan al menú de la persona ("Mi cuenta") |
| "Buscar" como utilidad global | Solo se busca entre situaciones (HU18); un buscador global en todas las pantallas suma ruido | El buscador vive en la lista de Situaciones |
| Inicio igual para todos | El abuelo y el padre llegan con preguntas distintas | **Inicio cambia según el rol** (ver sección 4) |

## 2. Arquitectura propuesta

```
AYLLU · Espacio familiar
│
├── Inicio                       (lo que necesita mi atención hoy; cambia según el rol)
│
├── Situaciones
│   ├── Lista e historial        (filtros: Todas · Importantes · Esperan respuesta · Cerradas; buscador)
│   ├── Registrar situación      (3 pasos: Qué pasó → Detalles o voz → Revisar y enviar)
│   └── Detalle de situación     (el hilo: estado, respuestas, decisión, cierre, escuchar, corregir)
│
├── Acuerdos
│   ├── Acuerdos vigentes        ("Puede resolver solo" / "Consultar antes")
│   └── Crear o modificar acuerdo (con historial de cambios: autor y fecha)
│
└── Familia
    ├── Integrantes y roles      (incluye invitaciones pendientes)
    ├── Perfil del menor
    └── Invitar familiar

Siempre disponible (no son secciones):
  • Registrar situación  → acción principal global
  • Aa                   → tamaño de letra, alto contraste y "Escuchar esta pantalla"
  • Avisos               → novedades y respuestas recibidas
  • ?  Ayuda             → guía de uso breve
  • Menú de la persona   → Mi cuenta, Ver como (solo en la demo) y Salir

Fuera del espacio familiar (antes de entrar):
  • Landing de presentación
  • Bienvenida y elección de rol
  • Configurar espacio familiar
  • Aceptar invitación
```

**Regla de profundidad:** cualquier pantalla está a **dos toques como máximo** desde Inicio.

## 3. Navegación

### 3.1 Escritorio (≥ 1280 px): barra superior de una fila

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [◆ ayllu]  ⌂ Inicio  ☰ Situaciones  ✎ Acuerdos  ☺ Familia  (+ Registrar situación)   Aa    🔔     ?     (R)  │
│                                                                                 Letra Avisos Ayuda Rosa │
├▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ franja tejida de 8 px ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲┤
│                                                                                  │
│                    contenido centrado · máximo 1120 px                           │
```

- **Por qué arriba y no a la izquierda:** con solo 4 secciones, una barra horizontal muestra todo sin quitar ancho al contenido. Además es el patrón que la persona ya conoce de las webs informativas y se mantiene estable cuando la letra crece.
- Sección activa: subrayado verde molle de 3 px y `aria-current="page"`.
- Las herramientas (Letra, Avisos, Ayuda y la persona) llevan **el nombre debajo del ícono** en todos los anchos: nunca íconos solos y ocupan la mitad del espacio.
- **Por qué desde 1280 px:** con letra normal la barra completa necesita unos 1 280 px para caber en una fila. Más angosta, se usa la barra inferior (§3.2) en vez de partirla en dos filas, que se veía saturada.
- Si con letra "Grande" o "Muy grande" no caben los textos, las secciones pasan a una **segunda fila**; nunca se ocultan en un menú. Es el único caso con dos filas en escritorio.

### 3.2 Tablet, laptop pequeña y móvil (< 1280 px): barra superior simple + barra inferior

Un solo esquema para todas las pantallas táctiles y las ventanas angostas. **Ningún ancho usa dos filas en la barra superior con letra normal.**

```
┌─────────────────────────────┐
│ [◆ ayllu]   Aa   🔔   ?   (R) │  ← barra superior simple, una fila
│           Letra Avisos Ayuda Rosa │
├─────────────────────────────┤
│                             │
│          contenido          │
│                             │
├─────────────────────────────┤
│  ⌂      ☰      (+)     ✎      ☺   │  ← barra inferior fija, 72 px
│ Inicio Situac. Registrar Acuerdos Familia │
└─────────────────────────────┘
```

- **Cinco espacios:** las cuatro secciones y, al centro, el botón terracota "Registrar" de 64 px, la acción más importante al alcance del pulgar. En tablet la barra inferior se limita a 640 px de ancho, centrada.
- **Barra superior en una fila:** en menos de 432 px el logo muestra solo el símbolo ("ayllu" queda como nombre accesible). Con letra normal cabe desde 320 px, con "Grande" desde 360 px y con "Muy grande" desde 412 px; en pantallas más angostas las herramientas bajan a una segunda fila en vez de salirse de la pantalla.
- Etiquetas de texto **siempre visibles**. Sin menú hamburguesa para las secciones.
- Dentro de un flujo de pasos (Registrar), la barra inferior se oculta y aparecen "Atrás" y el botón del paso; así la persona no sale del flujo por accidente.

## 4. Inicio según el rol

Inicio responde a una sola pregunta: **¿qué necesita mi atención hoy?** El contenido cambia según quién entra; la estructura es la misma.

| Bloque | Abuelo o abuela (Rosa) | Padre o madre (Jorge) |
|---|---|---|
| Saludo | "Buenos días, Rosa" + una línea de estado ("Jorge vio lo del colegio") | "Hola, Jorge" + "Hay 2 situaciones que esperan su respuesta" |
| **Tarjeta protagonista** | **Sin respuesta todavía** (HU30): consultas enviadas que nadie respondió, con "Llamar a Jorge" como salida alternativa | **Esperan su respuesta** (HU38): situaciones abiertas ordenadas por importancia |
| Segundo bloque | Situaciones recientes (las 3 últimas) | **Novedades desde su última visita** (HU24) |
| Tercer bloque | Accesos rápidos: Registrar salud, Registrar colegio, Grabar nota de voz | Acuerdos vigentes (resumen) |
| Lateral (web) | Mía, 8 años · Integrantes | Mía, 8 años · Integrantes |

## 5. Inventario de pantallas y trazabilidad con las HU

| ID | Pantalla | Ruta | HU que cubre |
|---|---|---|---|
| L-01 | Landing de presentación | `pages/index.html` | Presentación del producto (no es HU) |
| ON-01 | Bienvenida y elección de rol | `app.html#/bienvenida` | HU01 |
| ON-02 | Configurar espacio familiar (grupo + menor) | `app.html#/configurar` | HU02, HU03, HU46 |
| ON-03 | Revisar y crear (paso 3 dentro de `#/configurar`, como en Registrar) | `app.html#/configurar` | HU02, HU48 |
| INV-01 | Aceptar invitación | `app.html#/invitacion` | HU05 |
| IN-01 | Inicio (variante abuelo) | `app.html#/inicio` | HU30, HU17 (recientes) |
| IN-02 | Inicio (variante padre o madre) | `app.html#/inicio` | HU38, HU24 |
| SIT-01 | Lista e historial de situaciones | `app.html#/situaciones` | HU17, HU18, HU42 |
| SIT-02 | Registrar situación (3 pasos) | `app.html#/situaciones/nueva` | HU09, HU10, HU12, HU13, HU15, HU46, HU25 |
| SIT-03 | Detalle de situación (el hilo) | `app.html#/situaciones/:id` | HU29, HU33, HU26, HU28, HU31, HU34, HU43, HU13 |
| SIT-04 | Corregir situación | `app.html#/situaciones/:id/editar` | HU16, HU13 (CA03) |
| AC-01 | Acuerdos vigentes | `app.html#/acuerdos` | HU27 |
| AC-02 | Crear o modificar acuerdo | `app.html#/acuerdos/editar` | HU27, HU48 |
| FAM-01 | Integrantes y roles | `app.html#/familia` | HU06 |
| FAM-02 | Perfil del menor | `app.html#/familia/menor` | HU03 |
| FAM-03 | Invitar familiar | `app.html#/familia/invitar` | HU04, HU48 |
| G-01 | Panel "Aa" (global) | componente | HU41, HU42, HU43 |
| G-02 | Modal de confirmación (global) | componente | HU48 |
| G-03 | Avisos (global) | componente | HU24, HU29 |
| G-04 | Ayuda (global) | componente | Apoyo a HU46 |

**Comprobación:** las 30 HU core aparecen al menos una vez (HU01, 02, 03, 04, 05, 06, 09, 10, 12, 13, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 38, 41, 42, 43, 46 y 48).

## 6. Pantallas clave

### SIT-02 · Registrar situación (3 pasos)

1. **¿Qué pasó?** Tarjetas grandes de categoría: Salud, Colegio, Permiso y Otro (HU09, HU10). Cambiar de categoría no borra lo escrito.
2. **Cuéntelo.** Dos caminos del mismo tamaño: **"Grabar nota de voz"** (HU12, con transcripción editable de HU13) o **"Escribir"**. Interruptor "Es importante" (HU15) con su explicación.
3. **Revisar y enviar.** Resumen, a quién se enviará (por defecto, al padre o la madre) y el botón "Enviar a Jorge" (HU25). Confirmación y toast al terminar.

Indicador "Paso X de 3", botón "Atrás" siempre visible y opción "Ocultar ayudas" (HU46).

### SIT-03 · Detalle de situación (el hilo)

```
← Situaciones
[Salud] [★ Importante]                         [🔊 Escuchar]  [✎ Corregir]
Mía tiene fiebre desde la tarde                (h1)
Registrada por Rosa · hoy 4:15 p. m.

  ● Registrada por Rosa · 4:15 p. m.
  │   "Le di paracetamol como dijo la doctora…"  [▶ nota de voz 0:42]
  ● Enviada a Jorge · 4:16 p. m.
  │
  ● Jorge la vio · 9:40 p. m.                     ← HU29: estado de revisión
  │
  ● Jorge respondió · 9:44 p. m.                  ← HU26 / HU28
  │   "Si mañana sigue, llévela a la posta. Yo pago."
  ○ Decisión de Rosa (pendiente)                  ← HU31
  ○ Cerrar situación                              ← HU34

[ Responder o registrar decisión … ]       (Registrar decisión)  (Cerrar situación)
```

- **Una sola acción primaria según el estado y quién mira:** el botón terracota es siempre el siguiente paso natural del hilo y las demás acciones van como secundarias. Rosa: sin respuesta o respondida → "Registrar decisión"; con decisión → "Cerrar situación"; cerrada → "Volver a abrir" (secundario). Jorge: sin responder → "Enviar respuesta"; ya respondió → sin botón primario.
- El estado se actualiza solo, sin recargar (HU29 CA03): en la demo, con el evento `storage` entre pestañas.
- Si el abuelo ya actuó por urgencia, el padre ve el aviso "Rosa ya la atendió" y un espacio para dejar observaciones (HU26 CA04).

### AC-01 · Acuerdos

Dos columnas en escritorio (una debajo de la otra en móvil): **"Rosa puede resolver sola"** (con chips como "Fiebre leve", "Permisos para tareas en grupo") y **"Consultar antes"** ("Viajes", "Gastos mayores a S/ 100"). Cada acuerdo muestra quién lo cambió por última vez y cuándo (HU27 CA03), y el historial se despliega debajo.

## 7. Flujos principales (para user flows y pruebas de tareas)

1. **Registrar y enviar** (abuelo): Inicio → Registrar → Salud → Grabar nota → Importante → Enviar a Jorge → toast → el detalle muestra "Jorge todavía no la ha visto".
2. **Responder a su hora** (padre): Inicio → "Esperan su respuesta" → detalle → Responder → el hilo agrega "Jorge respondió".
3. **¿Ya lo leyó?** (abuelo): Inicio → "Sin respuesta todavía" → detalle → ve "Jorge la vio · 9:40 p. m." → registra su decisión → Cerrar situación → confirmar.
4. **Acordar autonomía** (padre): Acuerdos → Modificar → mover "Fiebre leve" a "Puede resolver sola" → confirmar → queda con autor y fecha.
5. **Sumar a la tía** (abuelo): Familia → Invitar → rol "Familiar de apoyo" → confirmar → invitación pendiente → la tía acepta (INV-01).
6. **Leer mejor** (cualquiera): Aa → Muy grande → toda la interfaz crece y se mantiene al volver a entrar.

## 8. Implementación (para la landing del handbook)

- **`pages/index.html`:** landing de presentación con hero, "Cómo funciona" en 3 pasos, beneficios por segmento, una vista de la app y el botón "Probar AYLLU".
- **`pages/app.html`:** la demo funcional, una página con rutas por `#hash` (router en `js/main.js`). Los datos se guardan en `localStorage`, con una familia de ejemplo precargada.
- **"Ver como"** en el menú de la persona permite cambiar entre Rosa (abuela) y Jorge (padre) para recorrer los flujos de ida y vuelta. Lleva la etiqueta "Modo demostración".
- La estructura de carpetas obligatoria del handbook se respeta (ver `CLAUDE.md`).
