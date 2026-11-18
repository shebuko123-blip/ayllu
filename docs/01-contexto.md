# AYLLU · Contexto del proyecto

> Fuente de verdad sobre **qué problema resolvemos, para quién y con qué alcance**.
> Léelo antes de diseñar o programar cualquier pantalla. Para el *cómo se ve* ver `DESIGN.md`; para el *cómo se organiza* ver `03-arquitectura.md`.

---

## 1. En una frase

AYLLU es una plataforma de acompañamiento en la crianza para **abuelos y abuelas que crían a sus nietos porque los padres migraron a otra región del Perú**. Les permite registrar lo que pasa con el menor, que el padre o la madre participe en las decisiones **en su propio horario**, y que quede constancia de lo acordado.

El nombre viene del quechua *ayllu*: la familia extendida que cría y sostiene en conjunto a sus miembros.

## 2. El problema

En los hogares donde uno o ambos padres se fueron a trabajar lejos:

- las decisiones sobre el menor se toman **sin que el progenitor participe de verdad**;
- el abuelo **carga solo** con la crianza, sin apoyo ni registro;
- el adulto mayor **conoce poco el entorno digital** del nieto.

**Dos causas de fondo:**
1. **No existe un lugar donde quede guardado lo que se decide.** Llamadas y audios de WhatsApp se pierden entre cadenas, videos y noticias.
2. **Las herramientas actuales no están pensadas para personas mayores.**

**Consecuencias:** decisiones sin acuerdo, vínculo debilitado entre padre e hijo y sobrecarga del cuidador.

**Datos clave:**
- 6,6 millones de migrantes internos en el Perú; el 45,4 % reside en Lima (INEI, Censos 2025, preliminar).
- Solo el 47,5 % de las personas de 60 años o más usó internet en el primer trimestre de 2024, el porcentaje más bajo de todas las edades (INEI).
- En Lima Metropolitana, el 77,5 % de los hogares tiene internet (INEI).

## 3. Alcance

- **Migración interna** dentro del Perú (la internacional queda para una fase posterior).
- **Lima Metropolitana**, dos distritos.
- **Nietos de 8 a 16 años**, la etapa de permisos, colegio y uso de tecnología.
- Supuesto reconocido: la literatura revisada habla sobre todo de migración al extranjero; el equipo asume que el mecanismo es el mismo en la migración interna.

## 4. Usuarios (segmentos)

| Segmento | Quién es | Lo que necesita de AYLLU |
|---|---|---|
| **Abuelo o abuela cuidadora** (primario) | 60 años o más, cuida al nieto a diario, poca experiencia digital, prefiere los audios a escribir | Registrar lo que pasa sin escribir mucho, saber si el hijo **ya lo leyó**, tener la información del nieto separada del resto |
| **Padre o madre migrante** | 25 a 49 años, trabaja en otra región, horarios que no coinciden | Revisar y responder **cuando su jornada se lo permita**, ver qué espera su respuesta, dejar acordado qué puede decidir el abuelo solo |
| **Nieto en edad escolar** | 8 a 16 años, es el sujeto de las decisiones | No usa la plataforma como protagonista; su bienestar es el indicador de éxito |
| **Familiar de apoyo** | Tías, hermanos mayores o primos que ayudan con trámites, tareas y tecnología | Acceso limitado y controlado, sin que el abuelo pierda el control |

## 5. Lo que dijeron las entrevistas (resumen para diseñar)

- **Freddy** (abuelo) llevó a su nieto a la clínica y pagó con sus ahorros porque no logró comunicarse con su hijo. Perdió el aviso de una vacuna entre mensajes de WhatsApp. Necesita saber **si su hijo ya leyó** lo que le envió.
- Los abuelos **prefieren los audios** porque escribir les cuesta, pero los audios no se pueden buscar. Su respaldo real es **un cuaderno**.
- **Fernanda** (madre) dejó autorizado al abuelo a decidir en emergencias; **Jorge** (padre) se entera cuando la decisión ya fue tomada. Lo decisivo son los **acuerdos previos sobre quién puede decidir qué**.
- La migración no produce por sí sola una mala experiencia: la dinámica estable combina **comunicación frecuente, confianza en el cuidador, autoridad delegada y aprendizaje entre generaciones**.
- Los familiares jóvenes hacen de **soporte tecnológico** del abuelo; esa carga puede concentrarse en ellos.
- **No está validado** que el abuelo confiaría en un asistente con IA. → **No se construye** en esta fase.

> Por privacidad, en el producto y en los ejemplos se usan nombres ficticios (Rosa, Mía, Ana, Jorge…). Nunca nombres reales de participantes.

## 6. La solución (lo que sí construimos)

1. **Situaciones**: registro de lo que pasa con el menor (salud, colegio, permisos), por texto o **nota de voz**, con historial que no se pierde.
2. **Coordinación asincrónica**: el padre o la madre revisa y responde a su hora; el abuelo ve el estado ("Enviada → Revisada → Respondida → Cerrada").
3. **Acuerdos**: qué puede resolver el abuelo por su cuenta y qué requiere consulta, con autor y fecha de cada cambio.
4. **Familia con roles**: invitar familiares con permisos distintos.
5. **Accesibilidad de base**: letra ampliable, alto contraste, pocas acciones por pantalla, confirmación de acciones importantes, lectura en voz alta.

## 7. Las 30 HU core (las que implementa la landing)

| # | ID | Historia | Módulo | MoSCoW | SP |
|---|---|---|---|---|---|
| 1 | HU01 | Selección del rol familiar | Configuración familiar | Must | 2 |
| 2 | HU02 | Creación del grupo familiar | Configuración familiar | Must | 3 |
| 3 | HU03 | Registro de información básica del menor | Configuración familiar | Must | 2 |
| 4 | HU04 | Invitación de un familiar | Configuración familiar | Must | 5 |
| 5 | HU05 | Aceptación de una invitación familiar | Configuración familiar | Must | 3 |
| 6 | HU06 | Consulta de integrantes y roles | Configuración familiar | Must | 2 |
| 7 | HU09 | Registro de una situación de salud | Registro de situaciones | Must | 3 |
| 8 | HU10 | Registro de una situación escolar | Registro de situaciones | Must | 3 |
| 9 | HU12 | Registro de una situación mediante nota de voz | Registro de situaciones | Must | 5 |
| 10 | HU13 | Consulta escrita del contenido de una nota de voz | Registro de situaciones | Must | 5 |
| 11 | HU15 | Identificación de una situación importante | Registro de situaciones | Must | 2 |
| 12 | HU17 | Consulta del historial del menor | Consulta | Must | 3 |
| 13 | HU25 | Comunicación de una situación importante | Coordinación | Must | 3 |
| 14 | HU26 | Respuesta en el horario propio | Coordinación | Must | 5 |
| 15 | HU27 | Acuerdos sobre decisiones del cuidador | Coordinación | Must | 5 |
| 16 | HU29 | Consulta del estado de revisión | Coordinación | Must | 3 |
| 17 | HU33 | Seguimiento del estado de una situación | Seguimiento | Must | 3 |
| 18 | HU34 | Cierre de una situación atendida | Seguimiento | Must | 3 |
| 19 | HU38 | Consulta de situaciones pendientes de respuesta | Seguimiento | Must | 2 |
| 20 | HU41 | Ajuste del tamaño de la letra | Accesibilidad | Must | 2 |
| 21 | HU42 | Distinción visual de la información | Accesibilidad | Must | 3 |
| 22 | HU48 | Confirmación de acciones importantes | Accesibilidad | Must | 2 |
| 23 | HU31 | Registro de una decisión tomada | Coordinación | Should | 3 |
| 24 | HU28 | Respuesta a una decisión pendiente | Coordinación | Should | 3 |
| 25 | HU30 | Identificación de situaciones sin respuesta | Coordinación | Should | 3 |
| 26 | HU18 | Búsqueda de una situación por palabra | Consulta | Should | 3 |
| 27 | HU24 | Novedades desde la última visita | Seguimiento | Should | 3 |
| 28 | HU46 | Comprensión de los pasos de una tarea | Accesibilidad | Should | 3 |
| 29 | HU43 | Lectura en voz alta de una situación | Accesibilidad | Should | 5 |
| 30 | HU16 | Corrección de una situación registrada | Accesibilidad | Should | 3 |

Los criterios de aceptación y escenarios Gherkin completos están en el documento de HU del equipo. Cada pantalla de `03-arquitectura.md` indica qué HU cubre.

## 8. Restricciones del curso (Project Handbook HCI for UX Design 2026-20)

- La "landing page" debe implementar **30 HU core** con **HTML, CSS y JavaScript** (sin frameworks obligatorios), ser **una sola base responsive** (desktop, tablet, mobile) y cumplir **criterios de accesibilidad verificables**.
- Estructura de carpetas obligatoria: `assets/{images,icons,fonts,videos}`, `css/styles.css`, `js/main.js`, `pages/index.html`, `docs/`, `favicon.ico`, `.gitignore`.
- Despliegue en **GitHub Pages**. Las pruebas de aceptación y la validación con usuarios (tareas + SUS) se hacen **sobre la versión desplegada**.
- Normas de referencia: ISO 9241-210, ISO 9241-11, **WCAG 2.2**, heurísticas de Nielsen, Material Design / HIG, y la **Ley 29733** de protección de datos personales (hay datos de menores).
- Referencias del informe en **APA 7**.
- Equipo actual: **3 integrantes**. Plazo: menos de dos semanas.
