// AYLLU · Rutas por #hash ("#/situaciones/s-fiebre").
// Cada vista devuelve { titulo, seccion, contenido, alMontar? }.
// Al cambiar de pantalla: título de la página, sección activa (aria-current) y foco en el <h1>,
// para que el lector de pantalla anuncie dónde está la persona.

import { pintar } from './ui.js';

const rutas = [];
let vistaNoEncontrada = null;
let contenedor = null;
let actual = null;

/** definirRuta('/situaciones/:id', vista) */
export function definirRuta(patron, vista) {
  const nombres = [];
  const expresion = new RegExp('^' + patron.replace(/:(\w+)/g, (_, nombre) => {
    nombres.push(nombre);
    return '([^/]+)';
  }) + '/?$');
  rutas.push({ patron, expresion, nombres, vista });
}

export function definirNoEncontrada(vista) {
  vistaNoEncontrada = vista;
}

export function rutaActual() {
  return actual;
}

export function ir(ruta) {
  location.hash = ruta;
}

function leerHash() {
  const [camino, consulta = ''] = location.hash.slice(1).split('?');
  return { camino: decodeURIComponent(camino), query: new URLSearchParams(consulta) };
}

function buscar(camino) {
  for (const ruta of rutas) {
    const coincidencia = camino.match(ruta.expresion);
    if (coincidencia) {
      const params = Object.fromEntries(ruta.nombres.map((n, i) => [n, coincidencia[i + 1]]));
      return { ruta, params };
    }
  }
  return null;
}

/**
 * Pinta la pantalla de la ruta actual.
 * moverFoco: true al navegar; false al volver a pintar por un cambio de datos.
 */
function resolver({ moverFoco }) {
  const { camino, query } = leerHash();
  if (!camino.startsWith('/')) {
    if (!location.hash) location.replace('#/inicio');
    return;  // anclas internas (por ejemplo #contenido) no son rutas
  }

  const encontrada = buscar(camino);
  const vista = encontrada?.ruta.vista ?? vistaNoEncontrada;
  const params = encontrada?.params ?? {};
  const cambioDePantalla = actual?.camino !== camino;

  // Al volver a pintar la misma pantalla, se recuerda dónde estaba el foco
  const idFoco = !moverFoco && contenedor.contains(document.activeElement) ? document.activeElement.id : null;

  const resultado = vista({ params, query, camino });
  actual = { camino, params, query, seccion: resultado.seccion ?? null };

  pintar(contenedor, resultado.contenido);
  // Flujos (registrar, antes de entrar): la vista lo pide y el CSS reorganiza la barra
  if (resultado.flujo) document.body.dataset.flujo = resultado.flujo;
  else delete document.body.dataset.flujo;
  document.title = resultado.titulo ? `${resultado.titulo} · AYLLU` : 'AYLLU';

  for (const enlace of document.querySelectorAll('[data-seccion]')) {
    if (enlace.dataset.seccion === actual.seccion) enlace.setAttribute('aria-current', 'page');
    else enlace.removeAttribute('aria-current');
  }

  resultado.alMontar?.(contenedor);

  if (moverFoco && cambioDePantalla) {
    window.scrollTo({ top: 0 });
    const titulo = contenedor.querySelector('h1');
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
  } else if (idFoco) {
    document.getElementById(idFoco)?.focus({ preventScroll: true });
  }

  document.dispatchEvent(new CustomEvent('ayllu:pantalla', { detail: actual }));
}

/** Vuelve a pintar la pantalla actual sin mover el foco (por ejemplo, tras un cambio en otra pestaña). */
export function refrescar() {
  resolver({ moverFoco: false });
}

export function iniciarRouter(elemento) {
  contenedor = elemento;
  window.addEventListener('hashchange', () => resolver({ moverFoco: true }));
  resolver({ moverFoco: false });  // en la primera carga no se roba el foco
}
