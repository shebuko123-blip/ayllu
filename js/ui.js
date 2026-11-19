// AYLLU · Componentes compartidos.
// - html``: plantillas que escapan todo lo que se interpola (nada de HTML sin querer).
// - icono(), avatar(), etiquetas de categoría y estado, estado vacío.
// - confirmar(): modal de confirmación con <dialog> (HU48).
// - avisar(): mensaje breve (toast) después de cada acción.
// - anunciar(): texto para lectores de pantalla.

import { integrante, usuarioActivoId } from './store.js';
import { fechaHumana } from './fechas.js';

// --- Plantillas seguras ---------------------------------------------------------

class HtmlSeguro {
  constructor(texto) { this.texto = texto; }
  toString() { return this.texto; }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapar = (texto) => String(texto).replace(/[&<>"']/g, (c) => ESCAPES[c]);

function valor(v) {
  if (v === null || v === undefined || v === false) return '';
  if (v instanceof HtmlSeguro) return v.texto;
  if (Array.isArray(v)) return v.map(valor).join('');
  return escapar(v);
}

/** Plantilla: html`<p>${texto}</p>` escapa "texto"; anidar otra html`` la deja tal cual. */
export function html(partes, ...valores) {
  let salida = partes[0];
  valores.forEach((v, i) => { salida += valor(v) + partes[i + 1]; });
  return new HtmlSeguro(salida);
}

/** Inserta una plantilla en un elemento. */
export function pintar(elemento, plantilla) {
  elemento.innerHTML = String(plantilla);
}

// --- Íconos y avatares ------------------------------------------------------------

const SPRITE = '../assets/icons/sprite.svg';

/** Ícono decorativo: el texto del botón o enlace es el que da el nombre. */
export function icono(nombre, clase = '') {
  return html`<svg class="icono ${clase}" aria-hidden="true" focusable="false"><use href="${SPRITE}#i-${nombre}"></use></svg>`;
}

export function iniciales(nombre = '') {
  return nombre.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function avatar(persona, clase = '') {
  if (!persona) return '';
  return html`<span class="avatar ${clase}" style="--hebra: var(--${persona.color})" aria-hidden="true">${iniciales(persona.nombre)}</span>`;
}

export const NOMBRE_ROL = {
  abuela: 'Abuela, cuida a Mía',
  abuelo: 'Abuelo, cuida a Mía',
  padre: 'Papá de Mía',
  madre: 'Mamá de Mía',
  apoyo: 'Familiar de apoyo',
};

export function nombreRol(persona, menor = 'Mía') {
  return (NOMBRE_ROL[persona?.rol] ?? '').replace('Mía', menor);
}

// --- Etiquetas -------------------------------------------------------------------

export const CATEGORIAS = {
  salud: { nombre: 'Salud', icono: 'heart' },
  colegio: { nombre: 'Colegio', icono: 'book' },
  permiso: { nombre: 'Permiso', icono: 'key' },
  otro: { nombre: 'Otro', icono: 'dots' },
};

/** Categoría: ícono + nombre + color (el color nunca va solo, WCAG 1.4.1). */
export function etiquetaCategoria(categoria) {
  const c = CATEGORIAS[categoria] ?? CATEGORIAS.otro;
  return html`<span class="etiqueta etiqueta--${categoria}">${icono(c.icono)}${c.nombre}</span>`;
}

export function etiquetaImportante() {
  return html`<span class="etiqueta etiqueta--importante" data-hu="HU15">${icono('star')}Importante</span>`;
}

const ICONO_ESTADO = { registrada: 'pencil', enviada: 'clock', revisada: 'eye', respondida: 'message', cerrada: 'check' };

/**
 * Estado de una situación en palabras, desde el punto de vista de quien mira (HU29, HU33).
 * "Jorge todavía no la ha visto", "Jorge la vio · ayer, 9:40 p. m.", "Jorge respondió", "Resuelta".
 */
export function textoEstado(situacion, verPor = usuarioActivoId()) {
  const destino = integrante(situacion.enviadaA?.[0]);
  const autor = integrante(situacion.autor);
  const soyDestino = destino?.id === verPor;
  switch (situacion.estado) {
    case 'registrada':
      return situacion.autor === verPor ? 'Registrada por usted' : `Registrada por ${autor?.nombre ?? 'la familia'}`;
    case 'enviada':
      return soyDestino ? 'Espera su respuesta' : `${destino?.nombre ?? 'Su familia'} todavía no la ha visto`;
    case 'revisada': {
      if (soyDestino) return 'Espera su respuesta';
      const vista = situacion.revisadaPor?.[destino?.id];
      return `${destino?.nombre ?? 'Su familia'} la vio${vista ? ` · ${fechaHumana(vista)}` : ''}`;
    }
    case 'respondida':
      return soyDestino ? 'Usted respondió' : `${destino?.nombre ?? 'Su familia'} respondió`;
    case 'cerrada':
      return 'Resuelta';
    default:
      return '';
  }
}

/**
 * Un aviso en palabras (G-03, HU29): "Jorge vio «Mía tiene fiebre…»", "Rosa le envió «…»".
 * Se usa igual en el panel de Avisos y en el mensaje que aparece al llegar algo nuevo.
 */
export function textoAviso({ evento, situacion }, verPor = usuarioActivoId()) {
  const quien = integrante(evento.autor)?.nombre ?? 'Alguien';
  const titulo = `«${situacion.titulo}»`;
  switch (evento.tipo) {
    case 'enviada': return situacion.enviadaA.includes(verPor) ? `${quien} le envió ${titulo}` : `${quien} envió ${titulo}`;
    case 'revisada': return `${quien} vio ${titulo}`;
    case 'respuesta': return `${quien} respondió sobre ${titulo}`;
    case 'decision': return `${quien} registró una decisión sobre ${titulo}`;
    case 'cerrada': return `${quien} cerró ${titulo}`;
    case 'reabierta': return `${quien} volvió a abrir ${titulo}`;
    case 'corregida': return `${quien} corrigió ${titulo}`;
    default: return `${quien} actualizó ${titulo}`;
  }
}

export const ICONO_AVISO = {
  enviada: 'send', revisada: 'eye', respuesta: 'message', decision: 'check',
  cerrada: 'circle-check', reabierta: 'refresh', corregida: 'pencil',
};

export function etiquetaEstado(situacion, verPor) {
  const estado = situacion.estado;
  return html`<span class="etiqueta etiqueta--${estado}" data-hu="HU29 HU33">${icono(ICONO_ESTADO[estado] ?? 'info-circle')}${textoEstado(situacion, verPor)}</span>`;
}

// --- Estado vacío -----------------------------------------------------------------

export function estadoVacio({ titulo, texto, imagen, alt = '', accion }) {
  return html`
    <div class="vacio">
      ${imagen ? html`<img src="../assets/images/${imagen}" alt="${alt}" loading="lazy" width="400" height="300">` : ''}
      <h2>${titulo}</h2>
      ${texto ? html`<p>${texto}</p>` : ''}
      ${accion ? html`<a class="boton boton--primario" href="${accion.href}">${icono(accion.icono ?? 'plus')}${accion.texto}</a>` : ''}
    </div>`;
}

/** Aviso temporal mientras una pantalla se construye (se borra al terminar su fase). */
export function enConstruccion(texto, fase) {
  return html`
    <div class="en-construccion" role="note">
      ${icono('info-circle')}
      <div>
        <p><strong>Esta parte se está construyendo.</strong></p>
        <p>${texto}${fase ? ` (${String(fase).includes("y") ? "fases" : "fase"} ${fase} del plan)` : ''}</p>
      </div>
    </div>`;
}

/** Cabecera de pantalla: título y una frase que explica para qué sirve. */
export function cabecera(titulo, texto) {
  return html`
    <div class="pantalla__cabecera">
      <h1>${titulo}</h1>
      ${texto ? html`<p>${texto}</p>` : ''}
    </div>`;
}

/** "Jorge", "Jorge y Ana", "Jorge, Ana y Luis". */
const formatoLista = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
export function listaNombres(nombres) {
  return formatoLista.format(nombres);
}

// --- Errores en los campos ------------------------------------------------------------
// El error se muestra solo después de que la persona tocó el campo o intentó avanzar:
// nada de errores al abrir la pantalla ni mientras escribe (heurística 5).
// Marcado esperado: el campo tiene id="x" y, junto a él, <p class="campo__error" id="x-error" hidden>.
// El mensaje se enlaza con aria-describedby solo mientras se ve (si no, se leería aunque esté oculto).

function enlazarError(control, idError, visible) {
  const ids = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== idError);
  if (visible) ids.push(idError);
  if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
  else control.removeAttribute('aria-describedby');
}

/**
 * Muestra el error de un campo: borde, ícono y texto (nunca solo color).
 * control puede ser un <input>/<textarea> o un <fieldset> (grupo de opciones).
 * Con anunciarlo, el lector de pantalla lo lee un momento después (al salir del campo).
 */
export function mostrarError(control, mensaje, { anunciarlo = false } = {}) {
  const idError = `${control.id}-error`;
  const caja = document.getElementById(idError);
  if (!caja) return;
  pintar(caja, html`${icono('alert-circle')}<span><span class="visualmente-oculto">Falta un dato: </span>${mensaje}</span>`);
  caja.hidden = false;
  control.closest('.campo')?.classList.add('campo--error');
  if (control.matches('input, textarea, select')) control.setAttribute('aria-invalid', 'true');
  enlazarError(control, idError, true);
  if (anunciarlo) setTimeout(() => anunciar(mensaje), 500);
}

export function limpiarError(control) {
  const idError = `${control.id}-error`;
  const caja = document.getElementById(idError);
  if (caja) caja.hidden = true;
  control.closest('.campo')?.classList.remove('campo--error');
  if (control.matches('input, textarea, select')) control.setAttribute('aria-invalid', 'false');
  enlazarError(control, idError, false);
}

/** Caja vacía donde aparece el error de un campo. */
export function cajaError(idCampo) {
  return html`<p class="campo__error" id="${idCampo}-error" hidden></p>`;
}

// --- Anuncios para lectores de pantalla ------------------------------------------------

/** Texto que el lector de pantalla lee sin mover el foco. */
export function anunciar(texto) {
  if (typeof document.ariaNotify === 'function') {
    document.ariaNotify(texto);
    return;
  }
  const region = document.getElementById('anuncios');
  if (!region) return;
  region.textContent = '';
  // Un pequeño retraso para que el lector detecte el cambio aunque el texto se repita
  setTimeout(() => { region.textContent = texto; }, 60);
}

// --- Modal de confirmación (HU48) -------------------------------------------------------

/**
 * Pregunta antes de una acción que cambia información.
 * Devuelve una promesa con true si la persona confirma y false si vuelve o cierra con Esc.
 *
 *   if (await confirmar({ titulo: '¿Cerrar esta situación?', texto: 'La familia verá…', accion: 'Sí, cerrar' })) { … }
 */
export function confirmar({ titulo, texto, accion, iconoAccion = 'check', peligro = false, iconoTitulo }) {
  const dialogo = document.getElementById('dialogo-confirmar');
  document.getElementById('confirmar-titulo').textContent = titulo;
  document.getElementById('confirmar-texto').textContent = texto;
  document.getElementById('confirmar-icono')
    .setAttribute('href', `${SPRITE}#i-${iconoTitulo ?? (peligro ? 'alert-circle' : 'info-circle')}`);

  const si = document.getElementById('confirmar-si');
  pintar(si, html`${icono(peligro ? 'trash' : iconoAccion)}${accion}`);
  si.className = `boton ${peligro ? 'boton--peligro' : 'boton--primario'}`;
  dialogo.classList.toggle('dialogo--peligro', peligro);

  dialogo.returnValue = '';
  dialogo.showModal();

  return new Promise((resolver) => {
    dialogo.addEventListener('close', () => {
      const confirmado = dialogo.returnValue === 'si';
      dialogo.returnValue = '';  // Esc no deja valor: se trata como "volver"
      resolver(confirmado);
    }, { once: true });
  });
}

// --- Toast ------------------------------------------------------------------------------

const DURACION_TOAST = 6000;

function abrirContenedor(contenedor) {
  if (!contenedor.matches(':popover-open')) contenedor.showPopover();
}

/**
 * Mensaje tranquilizador después de una acción: "Listo. Jorge recibirá la situación…".
 * Se queda 6 segundos (se pausa mientras el puntero o el foco están encima) o hasta cerrarlo.
 */
export function avisar(texto, { icono: nombreIcono = 'circle-check' } = {}) {
  const contenedor = document.getElementById('toasts');
  if (!contenedor) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  pintar(toast, html`
    ${icono(nombreIcono)}
    <p class="toast__texto">${texto}</p>
    <button type="button" class="toast__cerrar">${icono('x')}<span class="visualmente-oculto">Cerrar mensaje</span></button>`);

  let restante = DURACION_TOAST;
  let inicio = Date.now();
  let pausado = false;
  let temporizador = setTimeout(cerrar, restante);

  function pausar() {
    if (pausado) return;
    pausado = true;
    clearTimeout(temporizador);
    restante -= Date.now() - inicio;
  }
  function seguir() {
    if (!pausado || toast.matches(':hover') || toast.contains(document.activeElement)) return;
    pausado = false;
    inicio = Date.now();
    clearTimeout(temporizador);
    temporizador = setTimeout(cerrar, Math.max(restante, 1500));
  }
  function cerrar() {
    clearTimeout(temporizador);
    const teniaFoco = toast.contains(document.activeElement);
    toast.remove();
    if (teniaFoco) {
      const siguiente = contenedor.querySelector('.toast__cerrar');
      (siguiente ?? document.getElementById('contenido'))?.focus();
    }
    if (!contenedor.children.length && contenedor.matches(':popover-open')) contenedor.hidePopover();
  }

  toast.addEventListener('pointerenter', pausar);
  toast.addEventListener('pointerleave', seguir);
  toast.addEventListener('focusin', pausar);
  toast.addEventListener('focusout', () => setTimeout(seguir, 0));
  toast.querySelector('.toast__cerrar').addEventListener('click', cerrar);

  contenedor.append(toast);
  abrirContenedor(contenedor);
  anunciar(texto);
}
