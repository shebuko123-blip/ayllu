// AYLLU · Situaciones (fases 2 y 3):
// - SIT-01 · Lista e historial con filtros (HU17, HU42).
// - SIT-02 · Registrar en 3 pasos: qué pasó, cuéntelo, revisar y enviar (HU09, HU10, HU15, HU25).
// - SIT-03 · Detalle con el hilo, revisión, respuesta y cierre (fase 3: HU26, HU29, HU33, HU34).

import {
  leer, integrante, usuarioActivo, usuarioActivoId, situacion, situacionesOrdenadas, esperaRespuesta,
  destinatariosPosibles, destinatariosPorDefecto, registrarSituacion,
  respondio, debeMarcarRevisada, marcarRevisada, responder, cerrarSituacion, reabrirSituacion,
} from '../store.js';
import { refrescar } from '../router.js';
import {
  html, pintar, cabecera, icono, avatar, estadoVacio, etiquetaCategoria, etiquetaImportante, etiquetaEstado,
  CATEGORIAS, listaNombres, mostrarError, limpiarError, cajaError, confirmar, avisar, anunciar,
} from '../ui.js';
import { fechaHumana, iso } from '../fechas.js';

const menor = () => leer().familia.menor.nombre;
const nombre = (id) => integrante(id)?.nombre ?? 'Alguien';

// ==========================================================================================
// SIT-01 · Lista e historial (HU17)
// ==========================================================================================

const FILTROS = {
  todas: { nombre: 'Todas', cumple: () => true },
  importantes: { nombre: 'Importantes', cumple: (s) => s.importante, vacio: 'No hay situaciones marcadas como importantes.' },
  esperan: { nombre: 'Esperan respuesta', cumple: esperaRespuesta, vacio: 'Ninguna situación espera respuesta. Todo está al día.' },
  cerradas: { nombre: 'Cerradas', cumple: (s) => s.estado === 'cerrada', vacio: 'Todavía no hay situaciones resueltas.' },
};

// El filtro elegido se recuerda mientras la pestaña esté abierta (al volver del detalle sigue igual)
let filtroActual = 'todas';

const SIETE_DIAS = 7 * 24 * 60 * 60 * 1000;

/** Tarjeta de situación: toda la tarjeta lleva al detalle, pero el enlace es solo el título. */
export function tarjetaSituacion(s) {
  const autor = integrante(s.autor);
  return html`
    <li>
      <article class="tarjeta-situacion ${s.importante ? 'tarjeta-situacion--importante' : ''}" data-hu="HU17 HU33">
        <div class="tarjeta-situacion__etiquetas">
          ${etiquetaCategoria(s.categoria)}
          ${s.importante ? etiquetaImportante() : ''}
        </div>
        <h3 class="tarjeta-situacion__titulo">
          <a href="#/situaciones/${s.id}">${s.titulo}</a>
        </h3>
        ${s.descripcion ? html`<p class="tarjeta-situacion__resumen">${s.descripcion}</p>` : ''}
        <p class="tarjeta-situacion__meta">
          ${avatar(autor)}
          <span>${s.autor === usuarioActivoId() ? 'Usted' : autor?.nombre} · <time datetime="${iso(s.creadaEn)}">${fechaHumana(s.creadaEn)}</time></span>
        </p>
        <div>${etiquetaEstado(s)}</div>
      </article>
    </li>`;
}

function resultados(filtro) {
  const lista = situacionesOrdenadas().filter(FILTROS[filtro].cumple);

  if (!lista.length) {
    if (filtro === 'todas') {
      return estadoVacio({
        titulo: `Aquí verá lo que registre sobre ${menor()}`,
        texto: 'Empiece por lo que pasó hoy. Puede escribirlo o contarlo con su voz.',
        imagen: 'abuela-nieta-mesa.jpg',
        alt: 'Una abuela y su nieta conversan en la mesa de la casa',
        accion: { href: '#/situaciones/nueva', texto: 'Registrar situación' },
      });
    }
    return html`
      <div class="vacio vacio--simple">
        <p>${FILTROS[filtro].vacio}</p>
        <button type="button" class="boton boton--secundario" data-filtro="todas">${icono('list')}Ver todas</button>
      </div>`;
  }

  const limite = Date.now() - SIETE_DIAS;
  const grupos = [
    { titulo: 'Esta semana', items: lista.filter((s) => new Date(s.creadaEn) >= limite) },
    { titulo: 'Antes', items: lista.filter((s) => new Date(s.creadaEn) < limite) },
  ].filter((g) => g.items.length);

  return html`${grupos.map((g, i) => html`
    <section class="grupo-situaciones" aria-labelledby="grupo-${i}">
      <h2 id="grupo-${i}" class="grupo-situaciones__titulo">${g.titulo}</h2>
      <ul class="lista-situaciones">${g.items.map(tarjetaSituacion)}</ul>
    </section>`)}`;
}

function textoResultado(filtro) {
  const n = situacionesOrdenadas().filter(FILTROS[filtro].cumple).length;
  const cuantas = n === 1 ? '1 situación' : `${n} situaciones`;
  return filtro === 'todas' ? `Se muestran todas: ${cuantas}.` : `${FILTROS[filtro].nombre}: ${cuantas}.`;
}

export function vistaSituaciones() {
  const todas = leer().situaciones;
  if (!FILTROS[filtroActual]) filtroActual = 'todas';

  return {
    titulo: 'Situaciones',
    seccion: 'situaciones',
    contenido: html`
      <div class="pantalla" data-hu="HU17">
        ${cabecera('Situaciones', `Todo lo que pasa con ${menor()}, guardado en un solo lugar.`)}

        <!-- HU18 (fase 7): aquí va el buscador por palabra -->

        <div class="filtros" role="group" aria-label="Mostrar">
          ${Object.entries(FILTROS).map(([clave, f]) => html`
            <button type="button" class="filtro" data-filtro="${clave}" aria-pressed="${clave === filtroActual}">
              ${f.nombre}
              <span class="filtro__numero">${todas.filter(f.cumple).length}</span>
            </button>`)}
        </div>

        <div class="resultados" id="resultados">${resultados(filtroActual)}</div>
      </div>`,
    alMontar(contenedor) {
      contenedor.querySelector('.pantalla').addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-filtro]');
        if (!boton) return;
        filtroActual = boton.dataset.filtro;
        for (const b of contenedor.querySelectorAll('.filtro')) {
          b.setAttribute('aria-pressed', String(b.dataset.filtro === filtroActual));
        }
        pintar(contenedor.querySelector('#resultados'), resultados(filtroActual));
        // "Ver todas" desaparece al pintar: el foco pasa al filtro "Todas"
        if (!boton.classList.contains('filtro')) contenedor.querySelector('.filtro[data-filtro="todas"]').focus();
        anunciar(textoResultado(filtroActual));
      });
    },
  };
}

// ==========================================================================================
// SIT-02 · Registrar situación en 3 pasos (HU09, HU10, HU15, HU25)
// ==========================================================================================

const PASOS = ['Qué pasó', 'Cuéntelo', 'Revisar y enviar'];

const DESCRIPCION_CATEGORIA = {
  salud: 'Fiebre, golpes, citas o medicinas',
  colegio: 'Tareas, reuniones, notas o útiles',
  permiso: 'Salidas, cumpleaños o paseos',
  otro: 'Cualquier otra cosa de la casa',
};

const MENSAJES = {
  categoria: 'Elija de qué trata para que la familia lo encuentre fácil.',
  titulo: 'Escriba qué pasó para que la familia lo entienda.',
  destinatarios: 'Elija al menos a una persona para que se entere.',
};

// El borrador vive en memoria mientras dura el flujo: volver atrás, cambiar de categoría o
// salir a otra sección no borra lo escrito (heurística 3). Se borra al enviar o al cancelar.
let borrador = null;

function nuevoBorrador() {
  return {
    paso: 1,
    categoria: null,
    titulo: '',
    descripcion: '',
    importante: false,
    enviadaA: destinatariosPorDefecto(),
    autor: usuarioActivoId(),
    tocados: new Set(),
  };
}

function hayAlgoEscrito() {
  return Boolean(borrador && (borrador.titulo.trim() || borrador.descripcion.trim()));
}

function indicadorPasos(paso) {
  return html`
    <div class="pasos" data-hu="HU46">
      <p class="pasos__texto"><strong>Paso ${paso} de 3</strong> · ${PASOS[paso - 1]}</p>
      <div class="pasos__barra" aria-hidden="true">
        ${PASOS.map((_, i) => html`<span class="pasos__segmento ${i < paso ? 'pasos__segmento--hecho' : ''}"></span>`)}
      </div>
    </div>`;
}

// --- Paso 1 · ¿Qué pasó? -------------------------------------------------------------------

function paso1() {
  return html`
    <fieldset class="campo campo--grupo" id="categoria" data-hu="HU09 HU10">
      <legend class="paso__titulo" id="paso-titulo" tabindex="-1">¿De qué trata?</legend>
      <p class="campo__ayuda ayuda-paso">Elija una opción. Podrá cambiarla después sin perder lo que escriba.</p>
      ${cajaError('categoria')}
      <div class="categorias">
        ${Object.entries(CATEGORIAS).map(([clave, c]) => html`
          <label class="opcion-categoria opcion-categoria--${clave}">
            <input type="radio" name="categoria" value="${clave}" ${borrador.categoria === clave ? 'checked' : ''}>
            <span class="opcion-categoria__caja">
              <span class="opcion-categoria__icono">${icono(c.icono)}</span>
              <span class="opcion-categoria__nombre">${c.nombre}</span>
              <span class="opcion-categoria__descripcion">${DESCRIPCION_CATEGORIA[clave]}</span>
            </span>
          </label>`)}
      </div>
    </fieldset>`;
}

// --- Paso 2 · Cuéntelo ---------------------------------------------------------------------

function paso2() {
  const destino = listaNombres(borrador.enviadaA.map(nombre)) || 'su familia';
  return html`
    <div class="paso__cuerpo">
      <h2 class="paso__titulo" id="paso-titulo" tabindex="-1">Cuéntelo</h2>

      <div class="caminos" role="group" aria-label="Cómo quiere contarlo">
        <button type="button" class="camino" aria-pressed="true">
          ${icono('pencil')}<span class="camino__nombre">Escribir</span>
        </button>
        <button type="button" class="camino" aria-disabled="true" aria-describedby="voz-pronto" data-hu="HU12">
          ${icono('microphone')}<span class="camino__nombre">Grabar nota de voz</span>
        </button>
      </div>
      <p class="campo__ayuda aviso-voz" id="voz-pronto">${icono('info-circle')} Muy pronto podrá contarlo con su voz. Por ahora, escríbalo.</p>

      <div class="campo">
        <label for="titulo">¿Qué pasó, en pocas palabras?</label>
        <p class="campo__ayuda ayuda-paso" id="titulo-ayuda">Por ejemplo: «${menor()} tiene fiebre desde la tarde».</p>
        <input type="text" id="titulo" name="titulo" class="entrada" maxlength="120" required
          autocomplete="off" aria-describedby="titulo-ayuda" aria-invalid="false" value="${borrador.titulo}">
        ${cajaError('titulo')}
      </div>

      <div class="campo">
        <label for="descripcion">Cuéntelo con más detalle <span class="campo__opcional">(si quiere)</span></label>
        <p class="campo__ayuda ayuda-paso" id="descripcion-ayuda">Qué hizo usted, qué necesita saber ${destino} o qué hay que decidir.</p>
        <textarea id="descripcion" name="descripcion" class="entrada entrada--larga" maxlength="1000" rows="5"
          aria-describedby="descripcion-ayuda">${borrador.descripcion}</textarea>
      </div>

      <div class="tarjeta tarjeta--apoyo campo-importante" data-hu="HU15">
        <label class="interruptor">
          <span>
            ${icono('star')} Es importante
            <span class="interruptor__estado" id="importante-ayuda">Márquelo si ${destino} debe enterarse pronto. Se verá con una estrella y primero en su lista.</span>
          </span>
          <input type="checkbox" role="switch" id="importante" name="importante" aria-describedby="importante-ayuda" ${borrador.importante ? 'checked' : ''}>
        </label>
      </div>
    </div>`;
}

// --- Paso 3 · Revisar y enviar ---------------------------------------------------------------

function paso3() {
  const c = CATEGORIAS[borrador.categoria];
  return html`
    <div class="paso__cuerpo">
      <h2 class="paso__titulo" id="paso-titulo" tabindex="-1">Revise antes de enviar</h2>
      <p class="campo__ayuda ayuda-paso">Si algo no está bien, toque «Cambiar». No se borra nada de lo que escribió.</p>

      <dl class="resumen">
        <div class="resumen__fila">
          <dt>De qué trata</dt>
          <dd>${etiquetaCategoria(borrador.categoria)}</dd>
          <dd class="resumen__accion"><button type="button" class="boton boton--fantasma" data-ir-paso="1">${icono('pencil')}Cambiar<span class="visualmente-oculto"> de qué trata (${c.nombre})</span></button></dd>
        </div>
        <div class="resumen__fila">
          <dt>Qué pasó</dt>
          <dd>
            <p class="resumen__titulo">${borrador.titulo}</p>
            ${borrador.descripcion ? html`<p class="resumen__texto">${borrador.descripcion}</p>` : ''}
          </dd>
          <dd class="resumen__accion"><button type="button" class="boton boton--fantasma" data-ir-paso="2" data-enfocar="titulo">${icono('pencil')}Cambiar<span class="visualmente-oculto"> qué pasó</span></button></dd>
        </div>
        <div class="resumen__fila">
          <dt>Importante</dt>
          <dd>${borrador.importante ? etiquetaImportante() : 'No'}</dd>
          <dd class="resumen__accion"><button type="button" class="boton boton--fantasma" data-ir-paso="2" data-enfocar="importante">${icono('pencil')}Cambiar<span class="visualmente-oculto"> si es importante</span></button></dd>
        </div>
      </dl>

      <fieldset class="campo campo--grupo" id="destinatarios" data-hu="HU25">
        <legend>¿Quién debe enterarse?</legend>
        <p class="campo__ayuda ayuda-paso">Le llegará en AYLLU y usted verá cuando la revise.</p>
        ${cajaError('destinatarios')}
        <div class="opciones-persona__lista">
          ${destinatariosPosibles(borrador.autor).map((p) => html`
            <label class="opcion-persona">
              <input type="checkbox" name="destinatario" value="${p.id}" ${borrador.enviadaA.includes(p.id) ? 'checked' : ''}>
              ${avatar(p)}
              <span class="opcion-persona__texto">
                <strong>${p.nombre}</strong>
                <span class="opcion-persona__rol">${rolCorto(p)}</span>
              </span>
            </label>`)}
        </div>
      </fieldset>
    </div>`;
}

function rolCorto(p) {
  return { abuela: 'Abuela', abuelo: 'Abuelo', padre: 'Papá', madre: 'Mamá', apoyo: 'Familiar de apoyo' }[p.rol] ?? '';
}

function textoEnviar() {
  const nombres = borrador.enviadaA.map(nombre);
  return nombres.length ? `Enviar a ${listaNombres(nombres)}` : 'Enviar';
}

// --- Validación por paso --------------------------------------------------------------------

/** Devuelve el primer control con error (o null). Muestra todos los errores del paso. */
function validarPaso(form) {
  const errores = [];
  if (borrador.paso === 1 && !borrador.categoria) {
    errores.push(form.querySelector('#categoria'));
    mostrarError(errores.at(-1), MENSAJES.categoria);
  }
  if (borrador.paso === 2 && !borrador.titulo.trim()) {
    errores.push(form.querySelector('#titulo'));
    mostrarError(errores.at(-1), MENSAJES.titulo);
  }
  if (borrador.paso === 3 && !borrador.enviadaA.length) {
    errores.push(form.querySelector('#destinatarios'));
    mostrarError(errores.at(-1), MENSAJES.destinatarios);
  }
  return errores[0] ?? null;
}

function enfocarError(control) {
  // En un grupo de opciones, el foco va a la primera opción; el lector lee la leyenda y el error
  const destino = control.matches('fieldset') ? control.querySelector('input') : control;
  destino.focus();
}

// --- Navegación entre pasos -----------------------------------------------------------------

function irAPaso(paso, { enfocar } = {}) {
  borrador.paso = paso;
  refrescar();
  window.scrollTo({ top: 0 });
  const destino = (enfocar && document.getElementById(enfocar)) || document.getElementById('paso-titulo');
  destino?.focus();
  if (!enfocar) anunciar(`Paso ${paso} de 3: ${PASOS[paso - 1]}.`);
}

async function cancelar() {
  if (hayAlgoEscrito()) {
    const salir = await confirmar({
      titulo: '¿Salir sin enviar?',
      texto: 'Lo que escribió no se guardará y su familia no recibirá esta situación.',
      accion: 'Sí, salir sin enviar',
      peligro: true,
    });
    if (!salir) return;
  }
  borrador = null;
  location.hash = '#/situaciones';
}

function enviar() {
  const { id, guardado } = registrarSituacion({
    categoria: borrador.categoria,
    titulo: borrador.titulo,
    descripcion: borrador.descripcion,
    importante: borrador.importante,
    enviadaA: borrador.enviadaA,
  });
  const nombres = listaNombres(borrador.enviadaA.map(nombre));
  const varios = borrador.enviadaA.length > 1;
  borrador = null;
  location.hash = `#/situaciones/${id}`;
  if (guardado) {
    avisar(`Listo. ${nombres} recibirá${varios ? 'n' : ''} la situación y usted verá cuando la ${varios ? 'revisen' : 'revise'}.`);
  } else {
    avisar('La situación se envió, pero este navegador no pudo guardarla. Si cierra la página, puede perderse.', { icono: 'alert-circle' });
  }
}

// --- Vista -----------------------------------------------------------------------------------

export function vistaRegistrar({ query }) {
  // Si la persona cambió con "Ver como", el borrador anterior no es suyo: empieza de nuevo
  if (!borrador || borrador.autor !== usuarioActivoId()) borrador = nuevoBorrador();

  // Acceso directo desde Inicio: #/situaciones/nueva?categoria=salud → directo a "Cuéntelo"
  // Se aplica una sola vez por enlace (al volver a pintar no debe regresar al paso 2)
  // y nunca pisa una categoría elegida si ya hay algo escrito.
  const categoriaPedida = query.get('categoria');
  if (CATEGORIAS[categoriaPedida] && borrador.categoriaAplicada !== categoriaPedida
      && (!borrador.categoria || !hayAlgoEscrito())) {
    borrador.categoria = categoriaPedida;
    borrador.categoriaAplicada = categoriaPedida;
    borrador.paso = 2;
  }

  const paso = borrador.paso;
  const cuerpo = [paso1, paso2, paso3][paso - 1]();

  return {
    titulo: `Registrar situación · Paso ${paso} de 3`,
    seccion: 'situaciones',
    contenido: html`
      <div class="pantalla pantalla--flujo" data-hu="HU09 HU10 HU15 HU25">
        <div class="pantalla__cabecera">
          <h1>Registrar situación</h1>
          ${indicadorPasos(paso)}
        </div>

        <form class="flujo" id="flujo-registrar" novalidate>
          ${cuerpo}

          <div class="flujo__acciones">
            <div class="flujo__secundarias">
              ${paso > 1
                ? html`<button type="button" class="boton boton--secundario" data-accion="atras">${icono('arrow-left')}Atrás</button>`
                : ''}
              <button type="button" class="boton boton--fantasma" data-accion="cancelar">${icono('x')}Cancelar</button>
            </div>
            <button type="submit" class="boton boton--primario" id="boton-paso">
              ${paso < 3 ? html`Siguiente${icono('arrow-left', 'icono--girado')}` : html`${icono('send')}<span id="texto-enviar">${textoEnviar()}</span>`}
            </button>
          </div>
        </form>
      </div>`,

    alMontar(contenedor) {
      document.body.dataset.flujo = 'registrar';
      const form = contenedor.querySelector('#flujo-registrar');

      form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const conError = validarPaso(form);
        if (conError) {
          enfocarError(conError);
          return;
        }
        if (borrador.paso < 3) irAPaso(borrador.paso + 1);
        else enviar();
      });

      form.addEventListener('click', (evento) => {
        const boton = evento.target.closest('button');
        if (!boton) return;
        if (boton.dataset.accion === 'atras') irAPaso(borrador.paso - 1);
        else if (boton.dataset.accion === 'cancelar') cancelar();
        else if (boton.dataset.irPaso) irAPaso(Number(boton.dataset.irPaso), { enfocar: boton.dataset.enfocar });
        else if (boton.getAttribute('aria-disabled') === 'true') evento.preventDefault();
      });

      // Lo escrito se guarda en el borrador en cada tecla (nada se pierde al cambiar de paso)
      form.addEventListener('input', (evento) => {
        const campo = evento.target;
        if (campo.name === 'titulo' || campo.name === 'descripcion') {
          borrador[campo.name] = campo.value;
          borrador.tocados.add(campo.name);
          // Mientras escribe no aparecen errores nuevos, pero uno ya mostrado se quita al corregirlo
          if (campo.name === 'titulo' && campo.value.trim() && campo.getAttribute('aria-invalid') === 'true') limpiarError(campo);
        }
      });

      form.addEventListener('change', (evento) => {
        const campo = evento.target;
        if (campo.name === 'categoria') {
          borrador.categoria = campo.value;
          limpiarError(form.querySelector('#categoria'));
        } else if (campo.name === 'importante') {
          borrador.importante = campo.checked;
        } else if (campo.name === 'destinatario') {
          borrador.enviadaA = [...form.querySelectorAll('input[name="destinatario"]:checked')].map((i) => i.value);
          if (borrador.enviadaA.length) limpiarError(form.querySelector('#destinatarios'));
          const texto = form.querySelector('#texto-enviar');
          if (texto) texto.textContent = textoEnviar();
        }
      });

      // Validar al salir del campo, no mientras se escribe (heurística 5)
      form.querySelector('#titulo')?.addEventListener('blur', (evento) => {
        if (borrador.tocados.has('titulo') && !evento.target.value.trim()) {
          mostrarError(evento.target, MENSAJES.titulo, { anunciarlo: true });
        }
      });
    },
  };
}

// Al salir del flujo vuelve la barra inferior
document.addEventListener('ayllu:pantalla', (evento) => {
  if (evento.detail.camino !== '/situaciones/nueva') delete document.body.dataset.flujo;
});

// ==========================================================================================
// SIT-03 · Detalle de situación con el hilo (versión base)
// ==========================================================================================

/** Qué dice cada evento del hilo: quién, qué y (aparte) cuándo. */
function textoEvento(e, s) {
  const quien = nombre(e.autor);
  switch (e.tipo) {
    case 'registrada': return `Registrada por ${quien}`;
    case 'enviada': return `Enviada a ${listaNombres(s.enviadaA.map(nombre))}`;
    case 'revisada': return `${quien} la vio`;
    case 'respuesta': return `${quien} respondió`;
    case 'decision': return `${quien} registró una decisión`;
    case 'cerrada': return `${quien} la cerró`;
    case 'corregida': return `${quien} la corrigió`;
    case 'reabierta': return `${quien} la volvió a abrir`;
    default: return quien;
  }
}

/**
 * Lo que falta, como nodos punteados al final del hilo (heurística 1).
 * Por cada destinatario: si todavía no la vio, o si la vio y falta su respuesta.
 */
function pendientes(s, yoId) {
  if (s.estado === 'cerrada') return [];
  const lista = [];
  if (!s.enviadaA.length) lista.push('Enviar a la familia');
  for (const id of s.enviadaA) {
    if (respondio(s, id)) continue;
    if (id === yoId) lista.push('Su respuesta');
    else if (!s.revisadaPor?.[id]) lista.push(`${nombre(id)} todavía no la ha visto`);
    else lista.push(`Respuesta de ${nombre(id)}`);
  }
  lista.push('Cerrar la situación cuando quede resuelta');
  return lista;
}

// El hilo se "dibuja" solo la primera vez que se abre cada situación en esta pestaña
const hilosDibujados = new Set();

function hilo(s, yoId) {
  const dibujar = !hilosDibujados.has(s.id);
  hilosDibujados.add(s.id);
  const eventos = [...s.eventos].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return html`
    <ol class="hilo ${dibujar ? 'hilo--dibujar' : ''}" aria-label="Lo que pasó con esta situación" data-hu="HU29 HU33">
      ${eventos.map((e, i) => html`
        <li class="hilo__paso" style="--hebra: var(--${integrante(e.autor)?.color ?? 'ink'}); --orden: ${i}"
          ${i === eventos.length - 1 ? html`id="ultimo-evento" tabindex="-1"` : ''}>
          <span class="hilo__nodo" aria-hidden="true"></span>
          <p class="hilo__que"><strong>${textoEvento(e, s)}</strong> · <time datetime="${iso(e.fecha)}">${fechaHumana(e.fecha)}</time></p>
          ${e.texto ? html`<blockquote class="hilo__texto">${e.texto}</blockquote>` : ''}
        </li>`)}
      ${pendientes(s, yoId).map((texto, i) => html`
        <li class="hilo__paso hilo__paso--pendiente" style="--orden: ${eventos.length + i}">
          <span class="hilo__nodo" aria-hidden="true"></span>
          <p class="hilo__que">${texto}<span class="visualmente-oculto"> (pendiente)</span></p>
        </li>`)}
    </ol>`;
}

// --- Acciones del detalle: una sola primaria, la que sigue en el hilo para quien mira (D3) ---

// Lo que se escribe en la respuesta sobrevive si la pantalla se vuelve a pintar (otra pestaña)
const borradoresRespuesta = {};

function formularioRespuesta(s, yo, { primaria }) {
  const autor = nombre(s.autor);
  const decision = [...s.eventos].reverse().find((e) => e.tipo === 'decision' && e.autor !== yo.id);
  const yaRespondi = respondio(s, yo.id);
  const etiqueta = decision ? 'Dejar una observación' : yaRespondi ? 'Agregar algo a su respuesta' : 'Su respuesta';
  const textoBoton = decision ? 'Enviar observación' : 'Enviar respuesta';
  const titulo = decision ? `${nombre(decision.autor)} ya la atendió` : yaRespondi ? 'Usted ya respondió' : 'Responder';

  return html`
    <section class="tarjeta responder" aria-labelledby="titulo-responder" data-hu="HU26">
      <h2 id="titulo-responder" class="titulo-chico">${titulo}</h2>
      ${decision ? html`
        <div class="aviso aviso--info" role="note">
          ${icono('info-circle')}
          <div>
            <p><strong>${nombre(decision.autor)} decidió · ${fechaHumana(decision.fecha)}</strong></p>
            <p>«${decision.texto}»</p>
            <p class="texto-suave">Puede dejarle una observación para la próxima vez.</p>
          </div>
        </div>` : html`
        <p class="texto-suave">${yaRespondi
          ? `${autor} ya ve su respuesta en el hilo. Si quiere, puede agregar algo más.`
          : `Responda cuando pueda. ${autor} verá su respuesta en el hilo.`}</p>`}
      <form class="campo" id="form-responder" novalidate>
        <label for="respuesta">${etiqueta}</label>
        <textarea id="respuesta" name="respuesta" class="entrada entrada--larga" rows="4" maxlength="1000"
          aria-invalid="false">${borradoresRespuesta[s.id] ?? ''}</textarea>
        ${cajaError('respuesta')}
        <div class="grupo-botones">
          <button type="submit" class="boton ${primaria ? 'boton--primario' : 'boton--secundario'}">${icono('send')}${textoBoton}</button>
        </div>
      </form>
    </section>`;
}

function acciones(s, yo) {
  if (s.estado === 'cerrada') {
    return html`
      <section class="tarjeta tarjeta--apoyo cierre" aria-labelledby="titulo-cierre" data-hu="HU34">
        <h2 id="titulo-cierre" class="titulo-chico" tabindex="-1">${icono('circle-check')} Esta situación quedó resuelta</h2>
        <p>Si vuelve a pasar algo, puede abrirla otra vez. Todo lo anterior se mantiene en el hilo.</p>
        <div class="grupo-botones">
          <button type="button" class="boton boton--secundario" data-accion="reabrir">${icono('refresh')}Volver a abrir</button>
        </div>
      </section>`;
  }

  const soyDestino = s.enviadaA.includes(yo.id);
  const debeResponder = soyDestino && !respondio(s, yo.id);
  // Para quien registró, cerrar es el paso natural cuando ya le respondieron
  const cerrarEsPrincipal = !soyDestino && s.estado === 'respondida';

  return html`
    ${soyDestino ? formularioRespuesta(s, yo, { primaria: debeResponder }) : ''}
    <section class="acciones-detalle" aria-label="Otras acciones" data-hu="HU34">
      <button type="button" class="boton ${cerrarEsPrincipal ? 'boton--primario' : 'boton--secundario'}" data-accion="cerrar">
        ${icono('circle-check')}Cerrar situación
      </button>
      ${!cerrarEsPrincipal && !soyDestino ? html`<p class="texto-suave">Ciérrela cuando ya esté resuelta, aunque no le hayan respondido.</p>` : ''}
    </section>`;
}

async function alAccionar(evento, s) {
  const boton = evento.target.closest('[data-accion]');
  if (!boton) return;

  if (boton.dataset.accion === 'cerrar') {
    const si = await confirmar({
      titulo: '¿Cerrar esta situación?',
      texto: 'La familia verá que ya quedó resuelta. Si hace falta, podrá volver a abrirla.',
      accion: 'Sí, cerrar',
      iconoAccion: 'circle-check',
    });
    if (!si) return;
    cerrarSituacion(s.id);
    document.getElementById('titulo-cierre')?.focus();
    avisar('Listo. La familia verá que quedó resuelta.');
  }

  if (boton.dataset.accion === 'reabrir') {
    const si = await confirmar({
      titulo: '¿Volver a abrir esta situación?',
      texto: 'La familia verá que todavía falta resolverla. Todo lo anterior se mantiene en el hilo.',
      accion: 'Sí, volver a abrir',
      iconoAccion: 'refresh',
    });
    if (!si) return;
    reabrirSituacion(s.id);
    document.getElementById('ultimo-evento')?.focus();
    avisar('Listo. La situación está abierta otra vez.', { icono: 'refresh' });
  }
}

export function vistaDetalle({ params }) {
  const s = situacion(params.id);
  if (!s) {
    return {
      titulo: 'Situación no encontrada',
      seccion: 'situaciones',
      contenido: html`
        <div class="pantalla">
          ${cabecera('No encontramos esta situación', 'Puede que se haya restaurado la familia de ejemplo.')}
          <p><a class="boton boton--secundario" href="#/situaciones">${icono('arrow-left')}Ver todas las situaciones</a></p>
        </div>`,
    };
  }

  const autor = integrante(s.autor);
  const yo = usuarioActivo();

  return {
    titulo: s.titulo,
    seccion: 'situaciones',
    contenido: html`
      <article class="pantalla detalle" data-hu="HU17 HU33">
        <p><a class="boton boton--fantasma volver" href="#/situaciones">${icono('arrow-left')}Situaciones</a></p>

        <header class="detalle__cabecera">
          <div class="grupo-etiquetas">
            ${etiquetaCategoria(s.categoria)}
            ${s.importante ? etiquetaImportante() : ''}
          </div>
          <h1 id="titulo-detalle" tabindex="-1">${s.titulo}</h1>
          <p class="detalle__meta">
            ${avatar(autor)}
            <span>Registrada por ${s.autor === yo.id ? 'usted' : autor?.nombre} · <time datetime="${iso(s.creadaEn)}">${fechaHumana(s.creadaEn)}</time></span>
          </p>
          <div>${etiquetaEstado(s)}</div>
        </header>

        ${s.descripcion ? html`
          <section class="detalle__contenido" aria-label="Lo que contó ${autor?.nombre}">
            <p>${s.descripcion}</p>
          </section>` : ''}

        <section class="detalle__hilo" aria-labelledby="titulo-hilo">
          <h2 id="titulo-hilo">El hilo</h2>
          <p class="texto-suave">Quién la vio, qué respondió y qué falta.</p>
          ${hilo(s, yo.id)}
        </section>

        ${acciones(s, yo)}
      </article>`,

    alMontar(contenedor) {
      // HU29: al abrirla por primera vez, quien la escribió verá "Jorge la vio" (en vivo, en su pestaña)
      if (debeMarcarRevisada(s, yo.id)) setTimeout(() => marcarRevisada(s.id, yo.id), 0);

      contenedor.querySelector('.detalle').addEventListener('click', (evento) => alAccionar(evento, s));

      const form = contenedor.querySelector('#form-responder');
      if (!form) return;
      const campo = form.querySelector('#respuesta');
      const mensaje = `Escriba su respuesta para que ${nombre(s.autor)} sepa qué hacer.`;

      campo.addEventListener('input', () => {
        borradoresRespuesta[s.id] = campo.value;
        if (campo.value.trim() && campo.getAttribute('aria-invalid') === 'true') limpiarError(campo);
      });
      form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        if (!campo.value.trim()) {
          mostrarError(campo, mensaje);
          campo.focus();
          return;
        }
        const observacion = s.eventos.some((e) => e.tipo === 'decision' && e.autor !== yo.id);
        // El borrador se borra antes de guardar: guardar vuelve a pintar la pantalla
        const texto = campo.value;
        delete borradoresRespuesta[s.id];
        responder(s.id, texto);
        document.getElementById('ultimo-evento')?.focus();
        avisar(`Listo. ${nombre(s.autor)} verá su ${observacion ? 'observación' : 'respuesta'} en el hilo.`);
      });
    },
  };
}
