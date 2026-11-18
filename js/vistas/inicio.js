// AYLLU · Inicio: ¿qué necesita mi atención hoy? Cambia según el rol (03-arquitectura.md §4).
// Fase 1: banda de saludo y lateral de la familia. Las tarjetas protagonistas llegan en las
// fases 3 (HU38, padre) y 5 (HU30, abuela); las novedades en la fase 7 (HU24).

import { leer, usuarioActivo, esCuidador, integrante } from '../store.js';
import { html, avatar, nombreRol, enConstruccion, icono } from '../ui.js';
import { saludo } from '../fechas.js';

function pendientesDe(personaId) {
  return leer().situaciones.filter((s) =>
    s.enviadaA.includes(personaId) && (s.estado === 'enviada' || s.estado === 'revisada'));
}

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
      : html`Cuando registre algo sobre Mía, aquí verá si su familia ya lo vio.`;
    return html`
      <section class="saludo" aria-labelledby="titulo-inicio">
        <div class="saludo__texto">
          <h1 id="titulo-inicio">${saludo()}, ${persona.nombre}</h1>
          <p>${linea}</p>
        </div>
        <div class="saludo__foto">
          <img src="../assets/images/hero-abuela-nieta.jpg" alt="Una abuela abraza a su nieta en casa" width="1600" height="1071" fetchpriority="high">
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
        <img src="../assets/images/jorge.jpg" alt="Un padre conversa por videollamada desde su casa" width="1600" height="900" fetchpriority="high">
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
          <div class="bloque">
            ${cuidador
              ? enConstruccion('Aquí verá las consultas que todavía no tienen respuesta, sus situaciones recientes y accesos rápidos para registrar.', '3 y 5')
              : enConstruccion('Aquí verá las situaciones que esperan su respuesta y lo nuevo desde su última visita.', '3 y 7')}
          </div>
          ${lateralFamilia()}
        </div>
      </div>`,
  };
}
