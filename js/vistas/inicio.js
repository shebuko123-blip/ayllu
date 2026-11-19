// AYLLU · Inicio: ¿qué necesita mi atención hoy? Cambia según el rol (03-arquitectura.md §4).
// Fase 3: padre o madre → "Esperan su respuesta" (HU38); abuela → recientes (HU17) y accesos rápidos.
// Pendiente: "Sin respuesta todavía" de la abuela (fase 5, HU30) y las novedades del padre (fase 7, HU24).

import { leer, usuarioActivo, esCuidador, integrante, pendientesDe, situacionesOrdenadas } from '../store.js';
import { html, avatar, nombreRol, icono, etiquetaCategoria, etiquetaImportante, CATEGORIAS } from '../ui.js';
import { saludo, fechaHumana } from '../fechas.js';
import { tarjetaSituacion } from './situaciones.js';

/** Última novedad de otra persona: "Jorge respondió sobre «Mía tiene fiebre…»". */
function ultimaNovedad(personaId) {
  const novedades = leer().situaciones.flatMap((s) =>
    s.eventos
      .filter((e) => e.autor !== personaId && (e.tipo === 'respuesta' || e.tipo === 'revisada'))
      .map((e) => ({ ...e, titulo: s.titulo })));
  novedades.sort((a, b) => b.fecha.localeCompare(a.fecha));
  return novedades[0] ?? null;
}

function bandaSaludo(persona) {
  if (esCuidador(persona)) {
    const novedad = ultimaNovedad(persona.id);
    const quien = novedad && integrante(novedad.autor)?.nombre;
    const linea = novedad
      ? html`${quien} ${novedad.tipo === 'respuesta' ? 'respondió' : 'vio'} <strong>«${novedad.titulo}»</strong>.`
      : html`Cuando registre algo sobre ${leer().familia.menor.nombre}, aquí verá si su familia ya lo vio.`;
    return html`
      <section class="saludo" aria-labelledby="titulo-inicio">
        <div class="saludo__texto">
          <h1 id="titulo-inicio">${saludo()}, ${persona.nombre}</h1>
          <p>${linea}</p>
        </div>
        <div class="saludo__foto">
          ${persona.rol === 'abuelo'
            ? html`<img src="../assets/images/abuelo-tareas.jpg" alt="Un abuelo ayuda a su nieto con las tareas" width="1600" height="900" fetchpriority="high">`
            : html`<img src="../assets/images/hero-abuela-nieta.jpg" alt="Una abuela abraza a su nieta en casa" width="1600" height="1071" fetchpriority="high">`}
        </div>
      </section>`;
  }

  const n = pendientesDe(persona.id).length;
  const linea = n === 0
    ? html`No hay situaciones esperando su respuesta. Todo está al día.`
    : html`Hay <strong>${n} ${n === 1 ? 'situación que espera' : 'situaciones que esperan'}</strong> su respuesta.`;
  return html`
    <section class="saludo" aria-labelledby="titulo-inicio">
      <div class="saludo__texto">
        <h1 id="titulo-inicio">Hola, ${persona.nombre}</h1>
        <p>${linea}</p>
      </div>
      <div class="saludo__foto">
        ${persona.rol === 'padre'
          ? html`<img src="../assets/images/jorge.jpg" alt="Un padre conversa por videollamada desde su casa" width="1600" height="900" fetchpriority="high">`
          : html`<img src="../assets/images/abuela-nieta-mesa.jpg" alt="Una abuela y su nieta conversan sentadas a la mesa" width="1600" height="1067" fetchpriority="high">`}
      </div>
    </section>`;
}

function lateralFamilia() {
  const { familia, integrantes } = leer();
  const activos = integrantes.filter((i) => i.estado === 'activo');
  return html`
    <aside class="lateral" aria-label="Familia">
      <section class="tarjeta tarjeta--apoyo bloque" aria-labelledby="titulo-menor" data-hu="HU03">
        <div class="menor">
          <span class="menor__inicial" aria-hidden="true">${familia.menor.nombre[0]}</span>
          <div>
            <h2 class="menor__nombre" id="titulo-menor">${familia.menor.nombre}</h2>
            <p class="menor__dato">${familia.menor.edad} años · ${familia.nombre}</p>
          </div>
        </div>
      </section>
      <section class="tarjeta bloque" aria-labelledby="titulo-integrantes" data-hu="HU06">
        <h2 id="titulo-integrantes" class="titulo-chico">Quiénes acompañan a ${familia.menor.nombre}</h2>
        <ul class="integrantes">
          ${activos.map((i) => html`
            <li class="integrante">
              ${avatar(i)}
              <span class="integrante__texto">
                <span><strong>${i.nombre}</strong></span>
                <span class="integrante__rol">${nombreRol(i, familia.menor.nombre)}</span>
              </span>
            </li>`)}
        </ul>
        <a class="boton boton--fantasma" href="#/familia">${icono('users')}Ver la familia</a>
      </section>
    </aside>`;
}

// --- Padre o madre: Esperan su respuesta (HU38) ------------------------------------------------

function quienYCuando(s) {
  const autor = integrante(s.autor);
  return html`${autor?.nombre ?? 'Alguien'} la envió · <time datetime="${s.creadaEn}">${fechaHumana(s.creadaEn)}</time>`;
}

function esperanSuRespuesta(persona) {
  const lista = pendientesDe(persona.id);
  return html`
    <section class="tarjeta tarjeta--protagonista bloque" aria-labelledby="titulo-esperan" data-hu="HU38">
      <div class="bloque__cabecera">
        <h2 id="titulo-esperan">Esperan su respuesta</h2>
        ${lista.length ? html`<span class="etiqueta etiqueta--enviada">${icono('clock')}${lista.length} ${lista.length === 1 ? 'situación' : 'situaciones'}</span>` : ''}
      </div>
      ${lista.length ? html`
        <p class="texto-suave">Las importantes van primero. Respóndalas cuando su jornada se lo permita.</p>
        <ul class="lista-pendientes">
          ${lista.map((s) => html`
            <li class="pendiente ${s.importante ? 'pendiente--importante' : ''}">
              <div class="grupo-etiquetas">
                ${etiquetaCategoria(s.categoria)}
                ${s.importante ? etiquetaImportante() : ''}
              </div>
              <h3 class="pendiente__titulo"><a href="#/situaciones/${s.id}">${s.titulo}</a></h3>
              <p class="pendiente__meta">${quienYCuando(s)}${s.revisadaPor?.[persona.id] ? ' · usted ya la vio' : ''}</p>
            </li>`)}
        </ul>` : html`
        <div class="al-dia">
          ${icono('circle-check')}
          <p>No hay nada esperando su respuesta. Todo está al día.</p>
        </div>`}
      <a class="boton boton--fantasma" href="#/situaciones">${icono('list')}Ver todas las situaciones</a>
    </section>`;
}

// --- Abuela o abuelo: recientes y accesos rápidos -----------------------------------------------

function situacionesRecientes() {
  const recientes = situacionesOrdenadas().slice(0, 3);
  if (!recientes.length) return '';
  return html`
    <section class="bloque" aria-labelledby="titulo-recientes" data-hu="HU17">
      <div class="bloque__cabecera">
        <h2 id="titulo-recientes">Situaciones recientes</h2>
        <a class="boton boton--fantasma" href="#/situaciones">${icono('list')}Ver todas</a>
      </div>
      <ul class="lista-situaciones lista-situaciones--una">${recientes.map(tarjetaSituacion)}</ul>
    </section>`;
}

const ACCESOS = [
  { categoria: 'salud', texto: 'Algo de salud' },
  { categoria: 'colegio', texto: 'Algo del colegio' },
  { categoria: 'permiso', texto: 'Un permiso' },
];

function accesosRapidos() {
  return html`
    <section class="bloque" aria-labelledby="titulo-accesos">
      <h2 id="titulo-accesos">¿Qué quiere contar?</h2>
      <ul class="accesos">
        ${ACCESOS.map((a) => html`
          <li>
            <a class="acceso opcion-categoria--${a.categoria}" href="#/situaciones/nueva?categoria=${a.categoria}">
              <span class="opcion-categoria__icono">${icono(CATEGORIAS[a.categoria].icono)}</span>
              <span>${a.texto}</span>
            </a>
          </li>`)}
      </ul>
    </section>`;
}

export function vistaInicio() {
  const persona = usuarioActivo();
  const cuidador = esCuidador(persona);
  return {
    titulo: 'Inicio',
    seccion: 'inicio',
    contenido: html`
      <div class="pantalla">
        ${bandaSaludo(persona)}
        <div class="dos-columnas">
          <div class="bloque bloque--espacioso">
            ${cuidador
              ? html`${situacionesRecientes()}${accesosRapidos()}`
              : esperanSuRespuesta(persona)}
          </div>
          ${lateralFamilia()}
        </div>
      </div>`,
  };
}
