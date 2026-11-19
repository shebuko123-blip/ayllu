// AYLLU · Entrada de la demo (pages/app.html).
// Aplica las preferencias de lectura, monta la barra y sus paneles y arranca el router.

import {
  leer, suscribir, usuarioActivo, usuarioActivoId, verComo, personasDemo,
  preferencias, guardarPreferencia, integrante,
  avisosPara, avisosNuevos, marcarAvisosVistos, eventosRecientes,
} from './store.js';
import { definirRuta, definirNoEncontrada, iniciarRouter, refrescar } from './router.js';
import {
  html, pintar, avatar, iniciales, nombreRol, avisar, anunciar, cabecera, icono, textoAviso, ICONO_AVISO,
} from './ui.js';
import { fechaHumana, hora } from './fechas.js';
import { puedeLeer, leerEnVozAlta, detenerLectura } from './voz.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaSituaciones, vistaRegistrar, vistaDetalle } from './vistas/situaciones.js';
import { vistaAcuerdos } from './vistas/acuerdos.js';
import { vistaFamilia, vistaMenor, vistaInvitar, vistaCuenta, restaurarConConfirmacion } from './vistas/familia.js';
import { vistaBienvenida, vistaConfigurar, vistaInvitacion } from './vistas/onboarding.js';

const $ = (id) => document.getElementById(id);
const raiz = document.documentElement;

// --- Rutas -------------------------------------------------------------------------

definirRuta('/inicio', vistaInicio);
definirRuta('/situaciones', vistaSituaciones);
definirRuta('/situaciones/nueva', vistaRegistrar);
definirRuta('/situaciones/:id', vistaDetalle);
definirRuta('/acuerdos', vistaAcuerdos);
definirRuta('/familia', vistaFamilia);
definirRuta('/familia/menor', vistaMenor);
definirRuta('/familia/invitar', vistaInvitar);
definirRuta('/cuenta', vistaCuenta);
definirRuta('/bienvenida', vistaBienvenida);
definirRuta('/configurar', vistaConfigurar);
definirRuta('/invitacion', vistaInvitacion);
definirNoEncontrada(() => ({
  titulo: 'Página no encontrada',
  seccion: null,
  contenido: html`
    <div class="pantalla">
      ${cabecera('No encontramos esta página', 'Puede que el enlace esté incompleto. Vuelva a Inicio para seguir.')}
      <p><a class="boton boton--primario" href="#/inicio">${icono('home')}Ir a Inicio</a></p>
    </div>`,
}));

// --- Preferencias de lectura (HU41, HU42) ----------------------------------------------

const NOMBRE_TAMANO = { normal: 'normal', grande: 'grande', 'muy-grande': 'muy grande' };

function aplicarPreferencias() {
  const { tamanoLetra, altoContraste } = preferencias();

  if (tamanoLetra && tamanoLetra !== 'normal') raiz.dataset.textSize = tamanoLetra;
  else delete raiz.dataset.textSize;

  if (altoContraste) raiz.dataset.contrast = 'alto';
  else delete raiz.dataset.contrast;

  for (const opcion of document.querySelectorAll('input[name="tamano-letra"]')) {
    opcion.checked = opcion.value === (tamanoLetra ?? 'normal');
  }
  $('interruptor-contraste').checked = Boolean(altoContraste);
  $('estado-contraste').textContent = altoContraste ? 'Activado' : 'Desactivado';

  medirBarra();
}

$('opciones-letra').addEventListener('change', (evento) => {
  const valor = evento.target.value;
  guardarPreferencia('tamanoLetra', valor);
  anunciar(`Letra ${NOMBRE_TAMANO[valor]}.`);
});

$('interruptor-contraste').addEventListener('change', (evento) => {
  guardarPreferencia('altoContraste', evento.target.checked);
  anunciar(evento.target.checked ? 'Alto contraste activado.' : 'Alto contraste desactivado.');
});

// --- Escuchar esta pantalla (D5; versión completa en la fase 6) ---------------------------

const botonEscuchar = $('boton-escuchar-pantalla');

function mostrarEscuchando(leyendo) {
  pintar(botonEscuchar, leyendo
    ? html`${icono('player-stop')}<span>Detener la lectura</span>`
    : html`${icono('volume')}<span>Escuchar esta pantalla</span>`);
}

if (!puedeLeer()) {
  botonEscuchar.closest('.panel__seccion').innerHTML =
    '<p class="campo__ayuda">Su navegador no puede leer en voz alta. Pruebe con Chrome o Edge.</p>';
} else {
  let leyendo = false;
  botonEscuchar.addEventListener('click', () => {
    if (leyendo) {
      detenerLectura();
      return;
    }
    const texto = $('contenido').innerText.replace(/\s+\n/g, '\n').trim();
    leyendo = leerEnVozAlta(texto, {
      alTerminar: () => { leyendo = false; mostrarEscuchando(false); },
    });
    mostrarEscuchando(leyendo);
  });
  window.addEventListener('hashchange', detenerLectura);
}

// --- Barra: persona activa, Ver como y avisos -----------------------------------------------

function pintarPersona() {
  const persona = usuarioActivo();
  const { familia } = leer();

  pintar($('avatar-persona'), html`${iniciales(persona.nombre)}`);
  $('avatar-persona').style.setProperty('--hebra', `var(--${persona.color})`);
  $('nombre-persona').textContent = persona.nombre;

  pintar($('avatar-persona-panel'), html`${iniciales(persona.nombre)}`);
  $('avatar-persona-panel').style.setProperty('--hebra', `var(--${persona.color})`);
  $('panel-persona-titulo').textContent = persona.nombre;
  $('rol-persona-panel').textContent = nombreRol(persona, familia.menor.nombre);

  pintar($('lista-personas'), html`${personasDemo().map((p) => html`
    <label class="opcion-persona">
      <input type="radio" name="ver-como" value="${p.id}" ${p.id === persona.id ? 'checked' : ''}>
      ${avatar(p)}
      <span class="opcion-persona__texto">
        <strong>${p.nombre}</strong>
        <span class="opcion-persona__rol">${nombreRol(p, familia.menor.nombre)}</span>
      </span>
    </label>`)}`);
}

$('opciones-persona').addEventListener('change', (evento) => {
  if (evento.target.name !== 'ver-como') return;
  verComo(evento.target.value);
  const persona = usuarioActivo();
  $('panel-persona').hidePopover();
  avisar(`Ahora ve AYLLU como ${persona.nombre}.`, { icono: 'user' });
});

// --- Avisos (G-03): lo que hizo la familia, con los nuevos marcados (HU29) ----------------------

const MAX_AVISOS = 8;

function pintarAvisos() {
  const yo = usuarioActivoId();
  const todos = avisosPara(yo).slice(0, MAX_AVISOS);
  const nuevos = new Set(avisosNuevos(yo).map((a) => a.evento));
  const n = avisosNuevos(yo).length;

  pintar($('contador-avisos'), n ? html`${n}<span class="visualmente-oculto"> ${n === 1 ? 'nuevo' : 'nuevos'}</span>` : html``);

  if (!todos.length) {
    pintar($('lista-avisos'), html`
      <p class="texto-suave">Aquí verá las respuestas y novedades de su familia en cuanto lleguen.</p>`);
    return;
  }

  pintar($('lista-avisos'), html`
    <p class="texto-suave">${n ? `Tiene ${n} ${n === 1 ? 'aviso nuevo' : 'avisos nuevos'}.` : 'Está al día. Estos son los últimos avisos.'}</p>
    <ul class="lista-avisos">
      ${todos.map((a) => html`
        <li>
          <a class="aviso-item ${nuevos.has(a.evento) ? 'aviso-item--nuevo' : ''}" href="#/situaciones/${a.situacion.id}">
            ${avatar(integrante(a.evento.autor))}
            <span class="aviso-item__texto">
              <span>${textoAviso(a, yo)}</span>
              <span class="aviso-item__fecha">
                ${icono(ICONO_AVISO[a.evento.tipo] ?? 'bell')}
                <time datetime="${a.evento.fecha}">${fechaHumana(a.evento.fecha)}</time>
                ${nuevos.has(a.evento) ? html`<span class="etiqueta etiqueta--nuevo">Nuevo</span>` : ''}
              </span>
            </span>
          </a>
        </li>`)}
    </ul>`);
}

// Al cerrar Avisos, lo nuevo pasa a visto (el número se borra)
$('panel-avisos').addEventListener('toggle', (evento) => {
  if (evento.newState === 'closed' && avisosNuevos().length) marcarAvisosVistos();
});
// Al elegir un aviso se cierra el panel
$('lista-avisos').addEventListener('click', (evento) => {
  if (evento.target.closest('a')) $('panel-avisos').hidePopover();
});

/**
 * HU29 CA03: lo que la familia hace en otra pestaña aparece al instante, sin recargar:
 * se vuelve a pintar la pantalla y un mensaje dice qué pasó ("Jorge vio «…» · 9:40 p. m.").
 */
function avisarCambiosDeOtraPestana(anterior) {
  // HU05: alguien aceptó su invitación en otra pestaña
  const antes = new Map((anterior?.integrantes ?? []).map((i) => [i.id, i.estado]));
  for (const i of leer().integrantes) {
    if (i.estado === 'activo' && antes.get(i.id) === 'invitado') {
      avisar(`${i.nombre} aceptó la invitación. Ya es parte de la familia.`, { icono: 'user-plus' });
    }
  }
  if (anterior && anterior.familia?.id !== leer().familia.id) return;  // otra familia: no hay nada que comparar
  const recientes = eventosRecientes(anterior);
  for (const a of recientes.slice(0, 3).reverse()) {
    const cuando = a.evento.tipo === 'revisada' ? ` · ${hora(a.evento.fecha)}` : '';
    const frase = `${textoAviso(a)}${cuando}`;
    avisar(frase.endsWith('.') ? frase : `${frase}.`, { icono: ICONO_AVISO[a.evento.tipo] ?? 'bell' });
  }
}

// aria-expanded acompaña al estado de cada panel
for (const panel of document.querySelectorAll('.panel[popover]')) {
  panel.addEventListener('toggle', (evento) => {
    const boton = document.querySelector(`[popovertarget="${panel.id}"][aria-expanded]`);
    boton?.setAttribute('aria-expanded', String(evento.newState === 'open'));
  });
}

// --- Ayuda (G-04) --------------------------------------------------------------------------

$('boton-ayuda').addEventListener('click', () => $('dialogo-ayuda').showModal());

// --- Restaurar la familia de ejemplo --------------------------------------------------------

$('boton-restaurar').addEventListener('click', () => {
  $('panel-persona').hidePopover();
  restaurarConConfirmacion();
});

// --- Enlace "Saltar al contenido" ----------------------------------------------------------
// Se maneja aquí para que el router no lo confunda con una ruta.

document.querySelector('.saltar').addEventListener('click', (evento) => {
  evento.preventDefault();
  $('contenido').focus();
});

// --- Barra en dos filas si no cabe (letra grande en escritorio) -------------------------------

const barra = $('barra');
const fila = barra.querySelector('.barra__fila');
const escritorio = matchMedia('(min-width: 80em)');
let anchoMedido = 0;

function medirBarra() {
  barra.classList.remove('barra--dos-filas');
  if (escritorio.matches && fila.scrollWidth > fila.clientWidth + 1) barra.classList.add('barra--dos-filas');
  // Los paneles y el scroll-padding usan la altura real de la barra (cambia con la letra)
  raiz.style.setProperty('--alto-barra', `${barra.offsetHeight}px`);
}

new ResizeObserver(([entrada]) => {
  const ancho = Math.round(entrada.contentRect.width);
  if (ancho !== anchoMedido) {
    anchoMedido = ancho;
    medirBarra();
  } else {
    raiz.style.setProperty('--alto-barra', `${barra.offsetHeight}px`);
  }
}).observe(barra);
document.fonts?.ready.then(medirBarra);

// --- Arranque -------------------------------------------------------------------------------

function pintarTodo() {
  aplicarPreferencias();
  pintarPersona();
  pintarAvisos();
}

suscribir((_, origen, anterior) => {
  pintarTodo();
  refrescar();
  if (origen === 'otra-pestana') avisarCambiosDeOtraPestana(anterior);
});

pintarTodo();
iniciarRouter($('contenido'));

// Para depurar desde la consola durante el desarrollo
window.ayllu = { leer, usuarioActivoId };
