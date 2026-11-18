// AYLLU · Estado de la demo.
// Vive en localStorage (clave "ayllu:v1", modelo en CLAUDE.md). La persona activa se guarda por
// pestaña en sessionStorage para poder tener a Rosa y a Jorge en dos pestañas a la vez (D7).
// El evento "storage" avisa a las demás pestañas: así el estado cambia sin recargar (HU29 CA03).

const CLAVE = 'ayllu:v1';
const CLAVE_USUARIO = 'ayllu:usuario';

let estado = null;
const suscriptores = new Set();

// --- Lectura y escritura ---------------------------------------------------

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);
  } catch { /* datos dañados o sin almacenamiento: se usan los de ejemplo */ }
  const nuevo = crearDatosEjemplo();
  persistir(nuevo);
  return nuevo;
}

function persistir(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.warn('AYLLU: no se pudo guardar en este navegador.', error);
    return false;
  }
}

/** Devuelve el estado actual (solo lectura: para cambiarlo use actualizar). */
export function leer() {
  if (!estado) estado = cargar();
  return estado;
}

/**
 * Cambia el estado con una función que recibe una copia y la modifica.
 * Devuelve false si el navegador no pudo guardar (por ejemplo, sin espacio).
 */
export function actualizar(cambio) {
  const copia = structuredClone(leer());
  cambio(copia);
  estado = copia;
  const guardado = persistir(copia);
  emitir('local');
  return guardado;
}

/** Llama a fn(estado, origen) cada vez que algo cambia, aquí o en otra pestaña. */
export function suscribir(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

function emitir(origen) {
  for (const fn of suscriptores) fn(estado, origen);
}

window.addEventListener('storage', (evento) => {
  if (evento.key !== CLAVE && evento.key !== null) return;
  estado = evento.newValue ? JSON.parse(evento.newValue) : cargar();
  emitir('otra-pestana');
});

// --- Persona activa (Ver como) ----------------------------------------------

export function usuarioActivoId() {
  try {
    const propio = sessionStorage.getItem(CLAVE_USUARIO);
    if (propio && leer().integrantes.some((i) => i.id === propio)) return propio;
  } catch { /* sin sessionStorage */ }
  return leer().usuarioActual;
}

export function usuarioActivo() {
  return integrante(usuarioActivoId());
}

export function verComo(id) {
  try { sessionStorage.setItem(CLAVE_USUARIO, id); } catch { /* sin sessionStorage */ }
  emitir('ver-como');
}

// --- Consultas --------------------------------------------------------------

export function integrante(id) {
  return leer().integrantes.find((i) => i.id === id) ?? null;
}

/** Integrantes con quienes se puede probar "Ver como": la cuidadora y los padres activos. */
export function personasDemo() {
  return leer().integrantes.filter((i) => i.estado === 'activo' && i.rol !== 'apoyo');
}

export function esCuidador(persona = usuarioActivo()) {
  return persona?.rol === 'abuela' || persona?.rol === 'abuelo';
}

// --- Preferencias (HU41, HU42, HU46) ----------------------------------------

export function preferencias() {
  return leer().preferencias;
}

export function guardarPreferencia(nombre, valor) {
  return actualizar((s) => { s.preferencias[nombre] = valor; });
}

// --- Restaurar ----------------------------------------------------------------

export function restaurarEjemplo() {
  const prefs = leer().preferencias;  // la letra y el contraste elegidos se mantienen
  estado = crearDatosEjemplo();
  estado.preferencias = prefs;
  persistir(estado);
  try { sessionStorage.removeItem(CLAVE_USUARIO); } catch { /* nada */ }
  emitir('local');
}

// --- Datos de ejemplo ------------------------------------------------------
// Fechas relativas al momento de cargar (D9): "hoy" y "ayer" siempre tienen sentido.

function haceTiempo({ dias = 0, horas = 0, minutos = 0 }, base = new Date()) {
  return new Date(base.getTime() - ((dias * 24 + horas) * 60 + minutos) * 60000).toISOString();
}

function despues(iso, minutos) {
  return new Date(new Date(iso).getTime() + minutos * 60000).toISOString();
}

/** A una hora fija de un día pasado, para que las fechas se lean naturales ("ayer, 7:30 p. m."). */
function diaHora(dias, hora, minuto = 0) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
}

function crearDatosEjemplo() {
  const ahora = new Date();

  // 1. Fiebre: importante, con nota de voz, Jorge ya respondió (flujos 1 y 3)
  const fiebreCreada = haceTiempo({ horas: 5, minutos: 10 }, ahora);
  const fiebreRevisada = haceTiempo({ horas: 1, minutos: 20 }, ahora);
  const fiebreRespuesta = despues(fiebreRevisada, 4);

  // 2. Permiso para el cumpleaños: enviada hace 2 días y nadie la vio (HU30)
  const permisoCreada = diaHora(2, 18, 20);

  // 3. Reunión de padres: Jorge la vio pero no respondió (HU38)
  const reunionCreada = diaHora(1, 8, 5);
  const reunionRevisada = diaHora(1, 21, 40);

  // 4. Útiles de arte: recién enviada (HU38, HU24)
  const utilesCreada = haceTiempo({ horas: 2, minutos: 45 }, ahora);

  // 5. Vacuna: cerrada (historial)
  const vacunaCreada = diaHora(9, 10, 15);

  // 6. Caída en el recreo: Rosa decidió antes de que Jorge respondiera (HU26 CA04, HU31)
  const caidaCreada = diaHora(4, 13, 30);

  const evento = (tipo, autor, fecha, texto = '') => ({ tipo, autor, fecha, texto });

  return {
    familia: {
      id: 'collantes',
      nombre: 'Familia Collantes',
      menor: { nombre: 'Mía', edad: 8 },
    },
    integrantes: [
      { id: 'rosa', nombre: 'Rosa', rol: 'abuela', color: 'primary', estado: 'activo' },
      { id: 'jorge', nombre: 'Jorge', rol: 'padre', color: 'info', estado: 'activo' },
      { id: 'ana', nombre: 'Ana', rol: 'apoyo', color: 'cat-permiso', estado: 'activo' },
    ],
    usuarioActual: 'rosa',
    situaciones: [
      {
        id: 's-fiebre',
        categoria: 'salud',
        titulo: 'Mía tiene fiebre desde la tarde',
        descripcion: 'Le di paracetamol como dijo la doctora y le estoy poniendo paños. Si en la noche sigue, le aviso.',
        importante: true,
        // La nota de voz de ejemplo se agrega en la fase 6 (assets/videos/nota-ejemplo.m4a)
        audio: { url: '../assets/videos/nota-ejemplo.m4a', duracion: 20 },
        transcripcion: 'Mía tiene fiebre desde la tarde. Le di paracetamol como dijo la doctora y le estoy poniendo paños. Si en la noche sigue, te aviso.',
        autor: 'rosa',
        creadaEn: fiebreCreada,
        enviadaA: ['jorge'],
        revisadaPor: { jorge: fiebreRevisada },
        eventos: [
          evento('registrada', 'rosa', fiebreCreada),
          evento('enviada', 'rosa', despues(fiebreCreada, 1)),
          evento('revisada', 'jorge', fiebreRevisada),
          evento('respuesta', 'jorge', fiebreRespuesta, 'Si mañana sigue, llévela a la posta. Yo pago.'),
        ],
        estado: 'respondida',
      },
      {
        id: 's-permiso',
        categoria: 'permiso',
        titulo: 'Permiso para el cumpleaños de Lucía',
        descripcion: 'La mamá de Lucía invitó a Mía a su cumpleaños el sábado de 3 a 7 p. m. en su casa de Surquillo. ¿Le doy permiso?',
        importante: false,
        audio: null,
        transcripcion: null,
        autor: 'rosa',
        creadaEn: permisoCreada,
        enviadaA: ['jorge'],
        revisadaPor: {},
        eventos: [
          evento('registrada', 'rosa', permisoCreada),
          evento('enviada', 'rosa', despues(permisoCreada, 1)),
        ],
        estado: 'enviada',
      },
      {
        id: 's-reunion',
        categoria: 'colegio',
        titulo: 'Reunión de padres el viernes',
        descripcion: 'La profesora citó a los padres el viernes a las 6 p. m. para hablar de las notas del bimestre. ¿Puede conectarse o voy yo?',
        importante: false,
        audio: null,
        transcripcion: null,
        autor: 'rosa',
        creadaEn: reunionCreada,
        enviadaA: ['jorge'],
        revisadaPor: { jorge: reunionRevisada },
        eventos: [
          evento('registrada', 'rosa', reunionCreada),
          evento('enviada', 'rosa', despues(reunionCreada, 2)),
          evento('revisada', 'jorge', reunionRevisada),
        ],
        estado: 'revisada',
      },
      {
        id: 's-utiles',
        categoria: 'colegio',
        titulo: 'Le faltan los útiles de arte',
        descripcion: 'Piden témperas, pinceles y un block para el lunes. En la librería me dijeron que cuesta unos 35 soles.',
        importante: false,
        audio: null,
        transcripcion: null,
        autor: 'rosa',
        creadaEn: utilesCreada,
        enviadaA: ['jorge'],
        revisadaPor: {},
        eventos: [
          evento('registrada', 'rosa', utilesCreada),
          evento('enviada', 'rosa', despues(utilesCreada, 1)),
        ],
        estado: 'enviada',
      },
      {
        id: 's-vacuna',
        categoria: 'salud',
        titulo: 'Vacuna de los 8 años',
        descripcion: 'En la posta le toca la vacuna esta semana. Hay que llevar la tarjeta de vacunación.',
        importante: false,
        audio: null,
        transcripcion: null,
        autor: 'rosa',
        creadaEn: vacunaCreada,
        enviadaA: ['jorge'],
        revisadaPor: { jorge: diaHora(9, 20, 10) },
        eventos: [
          evento('registrada', 'rosa', vacunaCreada),
          evento('enviada', 'rosa', despues(vacunaCreada, 1)),
          evento('revisada', 'jorge', diaHora(9, 20, 10)),
          evento('respuesta', 'jorge', diaHora(9, 20, 14), 'Gracias, mamá. La tarjeta está en el cajón del ropero.'),
          evento('decision', 'rosa', diaHora(8, 9, 30), 'La llevé a la posta en la mañana. Ya está vacunada.'),
          evento('cerrada', 'rosa', diaHora(8, 9, 32)),
        ],
        estado: 'cerrada',
      },
      {
        id: 's-caida',
        categoria: 'salud',
        titulo: 'Se cayó en el recreo',
        descripcion: 'Llamaron del colegio: Mía se raspó la rodilla en el recreo. La recogí y la curé en casa.',
        importante: true,
        audio: null,
        transcripcion: null,
        autor: 'rosa',
        creadaEn: caidaCreada,
        enviadaA: ['jorge'],
        revisadaPor: { jorge: diaHora(4, 22, 5) },
        eventos: [
          evento('registrada', 'rosa', caidaCreada),
          evento('enviada', 'rosa', despues(caidaCreada, 1)),
          evento('decision', 'rosa', despues(caidaCreada, 40), 'La curé con agua oxigenada y una gasa. No fue necesario ir a la posta.'),
          evento('revisada', 'jorge', diaHora(4, 22, 5)),
          evento('respuesta', 'jorge', diaHora(4, 22, 9), 'Bien hecho, mamá. Si se le hincha, avíseme.'),
          evento('cerrada', 'rosa', diaHora(3, 10, 0)),
        ],
        estado: 'cerrada',
      },
    ],
    acuerdos: [
      {
        id: 'a-fiebre',
        tema: 'Fiebre leve',
        tipo: 'puede-resolver',
        autor: 'jorge',
        fecha: diaHora(20, 21, 0),
        historial: [
          { autor: 'jorge', fecha: diaHora(20, 21, 0), texto: 'Lo pasó a «Puede resolver sola».' },
          { autor: 'rosa', fecha: diaHora(30, 10, 0), texto: 'Lo creó en «Consultar antes».' },
        ],
      },
      {
        id: 'a-tareas',
        tema: 'Permisos para tareas en grupo',
        tipo: 'puede-resolver',
        autor: 'rosa',
        fecha: diaHora(30, 10, 5),
        historial: [{ autor: 'rosa', fecha: diaHora(30, 10, 5), texto: 'Lo creó en «Puede resolver sola».' }],
      },
      {
        id: 'a-viajes',
        tema: 'Viajes fuera de Lima',
        tipo: 'consultar',
        autor: 'jorge',
        fecha: diaHora(30, 20, 0),
        historial: [{ autor: 'jorge', fecha: diaHora(30, 20, 0), texto: 'Lo creó en «Consultar antes».' }],
      },
      {
        id: 'a-gastos',
        tema: 'Gastos mayores a S/ 100',
        tipo: 'consultar',
        autor: 'jorge',
        fecha: diaHora(30, 20, 2),
        historial: [{ autor: 'jorge', fecha: diaHora(30, 20, 2), texto: 'Lo creó en «Consultar antes».' }],
      },
    ],
    preferencias: {
      tamanoLetra: 'normal',
      altoContraste: matchMedia('(prefers-contrast: more)').matches,
      ayudasPasos: true,
    },
    ultimaVisita: {
      rosa: haceTiempo({ horas: 2 }, ahora),
      jorge: diaHora(1, 22, 0),
    },
  };
}
