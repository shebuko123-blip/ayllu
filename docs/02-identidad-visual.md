# AYLLU · Identidad visual

> El *por qué* de cómo se ve y cómo habla AYLLU. Los valores exactos (hex, tamaños, radios) viven en `DESIGN.md`; este documento explica la intención para que las decisiones nuevas sigan el mismo espíritu.

---

## 1. Concepto: "La familia teje junta"

Un *ayllu* es una familia extendida que se sostiene en conjunto. En los Andes, ese sostén tiene una imagen muy concreta: **el tejido**. Muchos hilos distintos, cada uno con su color, que solos son frágiles y juntos forman una tela resistente.

AYLLU traduce esa idea a la interfaz:

- **Cada situación es un hilo.** Empieza cuando la abuela registra algo y crece con cada paso: enviada, revisada, respondida, cerrada. En la pantalla de detalle se ve literalmente como un hilo vertical que une los momentos.
- **Cada integrante es un color.** La abuela, el padre, la tía: cada uno aporta su hebra y se reconoce por ella.
- **El resultado es una tela cálida y ordenada**, no un tablero corporativo.

**Tres palabras que guían cada decisión:** *cálido · claro · de confianza*.

| Somos | No somos |
|---|---|
| Cálidos, como la cocina de la abuela | Infantiles ni condescendientes |
| Claros, una cosa a la vez | Un panel de control lleno de datos |
| Andinos en espíritu, peruanos y urbanos | Folclóricos ni "de souvenir" |
| De confianza, todo queda guardado | Fríos, clínicos o burocráticos |

## 2. Qué cambia respecto a los mockups anteriores

| Antes | Ahora | Por qué |
|---|---|---|
| Azul marino + naranja, sensación corporativa | Crema, terracota, maíz y verde andino | Calidez y una identidad propia ligada al nombre |
| Todas las tarjetas con el mismo borde y el mismo peso | Jerarquía: una tarjeta protagonista por pantalla, color solo donde hay significado | Que la persona sepa dónde mirar primero |
| Cajas punteadas para los estados vacíos | Estados vacíos con ilustración y una sola acción | Invitar en vez de mostrar un hueco |
| Títulos y texto en la misma familia sans | Serif cálida para títulos, Atkinson Hyperlegible para leer | Personalidad en los títulos, legibilidad máxima en el texto |
| Panel lateral con 5 secciones (incluida "Ayuda y accesibilidad") | Barra superior con 4 secciones en web y barra inferior en móvil | Ver `03-arquitectura.md` |
| Estados del flujo poco visibles | El "hilo" de la situación como elemento firma | Responde a "¿ya lo leyó?", la necesidad n.º 1 de las entrevistas |

## 3. Logo

**Dirección propuesta** (reemplaza la "A" en círculo azul):

- **Símbolo:** cuatro hebras que se cruzan y forman un **rombo tejido**, la unidad básica de muchos textiles andinos. Cada hebra en un color de la paleta (terracota, maíz, verde andino y tinta), en referencia a los integrantes de la familia. El rombo deja un pequeño espacio central: el menor, cuidado por todos.
- **Logotipo:** "ayllu" en **minúsculas**, en Fraunces 600, con espaciado ligeramente abierto. Las minúsculas se sienten cercanas; las mayúsculas, institucionales.
- **Versiones:** horizontal (símbolo + palabra) para la barra superior; solo símbolo para el favicon y el ícono de la app; monocromo en tinta para impresión.
- **Tamaño mínimo:** 24 px de alto para el símbolo y 88 px de ancho para la versión horizontal.

**Uso respetuoso de lo andino:** la geometría se inspira en patrones textiles genéricos (rombos, escalonados, zigzag). **No usamos símbolos sagrados de forma literal** (por ejemplo, la chakana) ni vestimenta tradicional como disfraz.

## 4. Color con significado

La paleta sale de la tierra y los tejidos andinos. Cada color tiene **un trabajo**:

| Color | Nombre | Su trabajo |
|---|---|---|
| Crema `#FBF5EC` | Lienzo | El fondo de todo. Cálido, nunca blanco puro como lienzo principal |
| Terracota `#B5462A` | Arcilla | **La acción principal**: "Registrar situación", "Enviar", "Guardar". Solo un botón terracota por pantalla |
| Maíz `#E9B949` | Maíz | **Lo importante**: marca de situación prioritaria y destacados. Nunca como color de texto sobre fondo claro |
| Verde andino `#2F6B4F` | Molle | **Lo resuelto**: "Revisada", "Cerrada", confirmaciones |
| Azul lago `#2B5A87` | Titicaca | Enlaces, foco del teclado e información |
| Tinta `#2A211C` | Tinta | Texto, íconos y la hebra neutra |

**Proporción 60-30-10:** el **60 %** de cada pantalla es crema y blanco (la base tranquila), el **30 %** es verde molle (bandas, paneles y el pie, que dan vida y estructura) y el **10 %** es terracota y maíz (la acción y lo importante). Así el color guía la mirada en vez de competir.

Las categorías de situación también tienen color, siempre acompañado de un ícono y su nombre (el color nunca va solo): **Salud** en rosado quinua, **Colegio** en azul lago, **Permiso** en morado papa nativa y **Otro** en arena.

## 5. Tipografía

- **Títulos: Fraunces** (Google Fonts). Una serif con curvas suaves que transmite calidez y oficio, como un cuaderno bien llevado. Se usa con el eje de suavidad alto (`SOFT` 50) para que no se vea rígida. Solo para títulos de 24 px en adelante.
- **Texto e interfaz: Atkinson Hyperlegible** (Google Fonts). La diseñó el Braille Institute para personas con baja visión: cada letra se distingue de las parecidas (l, I, 1; O, 0). Es la decisión tipográfica más importante del proyecto y la que se cita en la sección 7.2 del informe.
- **Tamaño base: 18 px.** Más grande que el estándar web de 16 px, porque el usuario principal tiene más de 60 años.

## 6. Elemento firma: el hilo y la franja tejida

1. **El hilo de la situación.** En el detalle de cada situación, una línea vertical de 3 px une los momentos (registrada, enviada, revisada, respondida, cerrada). Cada nodo lleva el color de quien actuó. Los nodos completados se ven llenos; los pendientes, como un círculo vacío. Es la respuesta visual a "¿ya lo leyó?".
2. **La franja tejida.** Una banda delgada (8 px) de rombos y escalonados en los colores de la paleta. Se usa con moderación: borde inferior de la barra superior, encabezado de la landing y estados vacíos. **Nunca** como fondo de texto ni en más de un lugar por pantalla.

## 7. Ilustración e imágenes

- **Estilo:** ilustración plana, con formas redondeadas, figuras sin rasgos detallados y la paleta de AYLLU. Calidez sin infantilismo.
- **Personas:** familias peruanas urbanas de Lima, diversas, en escenas cotidianas (la abuela que acompaña las tareas, una videollamada, el camino al colegio). Abuelos activos y capaces, no frágiles.
- **Dónde:** bienvenida, estados vacíos, confirmaciones importantes y la landing. **No** en pantallas de trabajo como formularios o listas.
- **Fotografía:** se usan **fotos reales de alta calidad** (Unsplash, licencia libre) para que la interfaz se sienta viva y cercana: en la banda de saludo de Inicio, la landing, la bienvenida y los avatares de ejemplo. Escenas cálidas y cotidianas, luz natural, abuelos activos. Siempre con texto alternativo y con el texto sobre bandas sólidas, nunca encima de la foto. En el producto real, cada integrante sube su propia foto; las de banco son solo para la demo.

## 8. Íconos

- Set de trazo redondeado y grosor 2 px (por ejemplo, **Tabler Icons** o **Lucide**, ambos libres).
- **Siempre con texto al lado** en navegación y botones. Un ícono solo es aceptable únicamente si tiene una etiqueta accesible y su significado es universal (cerrar ✕).
- Tamaño 24 px en navegación y 20 px dentro de botones.

## 9. Voz y tono

AYLLU habla como **una vecina de confianza que sabe de tecnología**: cálida, paciente y directa.

**Reglas:**
- **Trato de "usted"** en toda la interfaz. Es el registro que esperan las personas mayores en el Perú y el que ya usaban los mockups.
- **Frases cortas**, una idea por frase. El verbo primero en los botones: "Registrar situación", "Enviar a Jorge".
- **Palabras de la casa, no de la oficina:** "situación", "acuerdo", "familia", "revisado". Evitar: "dashboard", "notificación push", "sincronizar", "usuario", "perfil de configuración".
- **Tranquilizar después de cada acción:** decir qué pasó y qué sigue.
- **Nunca culpar:** los errores explican qué hacer, no lo que la persona hizo mal.

| En vez de | Decir |
|---|---|
| "Operación realizada con éxito" | "Listo. Jorge recibirá la situación y usted verá cuando la revise." |
| "Error: campo obligatorio" | "Escriba qué pasó para que la familia lo entienda." |
| "No hay datos" | "Aquí verá lo que registre sobre Mía. Empiece por lo que pasó hoy." |
| "¿Desea confirmar la acción?" | "¿Cerrar esta situación? La familia verá que ya quedó resuelta." |
| "Pendiente de lectura" | "Jorge todavía no la ha visto" |

## 10. Movimiento

- Transiciones suaves y cortas (150–250 ms), sin rebotes.
- El hilo se "dibuja" al abrir una situación (una sola vez).
- Todo movimiento se desactiva con `prefers-reduced-motion`.
