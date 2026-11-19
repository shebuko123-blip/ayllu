// AYLLU · Antes de entrar (fase 4):
// - ON-01 · Bienvenida y elección de rol (HU01).
// - ON-02 y ON-03 · Configurar el espacio familiar en 3 pasos y crearlo (HU02, HU03, HU48).
// - INV-01 · Aceptar invitación con enlace o código, sin contraseña (HU05, WCAG 3.3.8).
// Estas pantallas usan flujo "antes": la barra solo muestra Letra y Ayuda (no hay familia todavía).

import {
  leer, integrante, verComo, crearFamilia, nombreFamilia, normalizarCodigo, aceptarInvitacion,
} from '../store.js';
import { refrescar } from '../router.js';
import {
  html, cabecera, icono, avatar, nombreRol, indicadorPasos, mostrarError, limpiarError, cajaError,
  confirmar, avisar, anunciar,
} from '../ui.js';
import { permisos, camposMenor, validarMenor, codigoLegible } from './familia.js';

// --- Roles de la bienvenida (HU01) -----------------------------------------------------------

const GRUPOS = {
  cuida: {
    nombre: 'Abuela o abuelo que cuida',
    descripcion: 'Vive con el niño o la niña y lo acompaña en el día a día.',
    icono: 'heart',
    roles: [{ rol: 'abuela', nombre: 'Abuela' }, { rol: 'abuelo', nombre: 'Abuelo' }],
  },
  padres: {
    nombre: 'Padre o madre',
    descripcion: 'Vive lejos y quiere saber y decidir a tiempo.',
    icono: 'user',
    roles: [{ rol: 'madre', nombre: 'Mamá' }, { rol: 'padre', nombre: 'Papá' }],
  },
  apoyo: {
    nombre: 'Familiar de apoyo',
    descripcion: 'Tía, tío, hermano o primo que ayuda con trámites, tareas o el celular.',
    icono: 'users',
    roles: [{ rol: 'apoyo', nombre: 'Familiar de apoyo' }],
  },
};

let borrador = null;

function nuevoBorrador() {
  return { paso: 1, grupo: null, rol: null, nombre: '', familia: '', menor: { nombre: '', edad: '' }, tocados: new Set() };
}

// ==========================================================================================
// ON-01 · Bienvenida y rol
// ==========================================================================================

export function vistaBienvenida() {
  if (!borrador) borrador = nuevoBorrador();

  return {
    titulo: 'Bienvenida',
    seccion: null,
    flujo: 'antes',
    contenido: html`
      <div class="pantalla" data-hu="HU01">
        <section class="saludo saludo--bienvenida" aria-labelledby="titulo-bienvenida">
          <div class="saludo__texto">
            <h1 id="titulo-bienvenida">Le damos la bienvenida a AYLLU</h1>
            <p>Un lugar para que la familia acompañe junta la crianza, aunque esté lejos.</p>
          </div>
          <div class="saludo__foto">
            <img src="../assets/images/abuela-nieta-mesa.jpg" alt="Una abuela y su nieta conversan sentadas a la mesa" width="1600" height="1067" fetchpriority="high">
          </div>
        </section>

        <form class="flujo pantalla--flujo" id="form-bienvenida" novalidate>
          <fieldset class="campo campo--grupo" id="grupo-rol">
            <legend class="paso__titulo">¿Quién es usted en la familia?</legend>
            <p class="campo__ayuda">Así le mostramos lo que necesita. Podrá invitar al resto de la familia después.</p>
            ${cajaError('grupo-rol')}
            <div class="categorias categorias--una">
              ${Object.entries(GRUPOS).map(([clave, g]) => html`
                <label class="opcion-categoria opcion-categoria--rol">
                  <input type="radio" name="grupo" value="${clave}" ${borrador.grupo === clave ? 'checked' : ''}>
                  <span class="opcion-categoria__caja">
                    <span class="opcion-categoria__icono">${icono(g.icono)}</span>
                    <span class="opcion-categoria__nombre">${g.nombre}</span>
                    <span class="opcion-categoria__descripcion">${g.descripcion}</span>
                  </span>
                </label>`)}
            </div>
          </fieldset>

          <p class="otra-opcion">
            ¿Alguien de su familia le envió un código?
            <a href="#/invitacion">${icono('key')}Entrar con un código de invitación</a>
          </p>

          <div class="flujo__acciones">
            <div class="flujo__secundarias">
              <a class="boton boton--fantasma" href="#/inicio">${icono('arrow-left')}Volver a la demostración</a>
            </div>
            <button type="submit" class="boton boton--primario">Continuar${icono('arrow-left', 'icono--girado')}</button>
          </div>
        </form>

      </div>`,

    alMontar(contenedor) {
      const form = contenedor.querySelector('#form-bienvenida');
      const grupo = form.querySelector('#grupo-rol');
      form.addEventListener('change', (evento) => {
        borrador.grupo = evento.target.value;
        const roles = GRUPOS[borrador.grupo].roles;
        // Si el grupo tiene un solo rol, ya está elegido; si no, se elige en el paso 1
        borrador.rol = roles.length === 1 ? roles[0].rol : (roles.some((r) => r.rol === borrador.rol) ? borrador.rol : null);
        limpiarError(grupo);
      });
      form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        if (!borrador.grupo) {
          mostrarError(grupo, 'Elija una opción para seguir.');
          grupo.querySelector('input').focus();
          return;
        }
        borrador.paso = 1;
        location.hash = '#/configurar';
      });
    },
  };
}

// ==========================================================================================
// ON-02 y ON-03 · Configurar el espacio familiar
// ==========================================================================================

const PASOS = ['Usted y su familia', 'El niño o la niña', 'Revisar y crear'];

const MENSAJES = {
  rol: 'Elija cómo le dice el niño o la niña.',
  nombre: 'Escriba su nombre para que la familia sepa quién es.',
  familia: 'Escriba el apellido de la familia. Por ejemplo: Quispe.',
};

function paso1() {
  const g = GRUPOS[borrador.grupo];
  return html`
    <div class="paso__cuerpo">
      <h2 class="paso__titulo" id="paso-titulo" tabindex="-1">Usted y su familia</h2>

      ${g.roles.length > 1 ? html`
        <fieldset class="campo campo--grupo" id="rol-exacto">
          <legend>Usted es…</legend>
          ${cajaError('rol-exacto')}
          <div class="opciones-dos">
            ${g.roles.map((r) => html`
              <label class="opcion-persona">
                <input type="radio" name="rol" value="${r.rol}" ${borrador.rol === r.rol ? 'checked' : ''}>
                <span class="opcion-persona__texto"><strong>${r.nombre}</strong></span>
              </label>`)}
          </div>
        </fieldset>` : ''}

      <div class="campo">
        <label for="su-nombre">Su nombre</label>
        <p class="campo__ayuda ayuda-paso" id="su-nombre-ayuda">Como le dice la familia. Por ejemplo: Rosa.</p>
        <input type="text" id="su-nombre" name="nombre" class="entrada" maxlength="40" required autocomplete="given-name"
          aria-describedby="su-nombre-ayuda" aria-invalid="false" value="${borrador.nombre}">
        ${cajaError('su-nombre')}
      </div>

      <div class="campo">
        <label for="nombre-familia">Apellido de la familia</label>
        <p class="campo__ayuda ayuda-paso" id="nombre-familia-ayuda">Se verá así: <strong id="vista-familia">${borrador.familia.trim() ? nombreFamilia(borrador.familia) : 'Familia Quispe'}</strong>.</p>
        <input type="text" id="nombre-familia" name="familia" class="entrada" maxlength="40" required autocomplete="family-name"
          aria-describedby="nombre-familia-ayuda" aria-invalid="false" value="${borrador.familia}">
        ${cajaError('nombre-familia')}
      </div>
    </div>`;
}

function paso2() {
  return html`
    <div class="paso__cuerpo">
      <h2 class="paso__titulo" id="paso-titulo" tabindex="-1">¿A quién acompañan?</h2>
      <p class="campo__ayuda ayuda-paso">Si hay más de un niño o niña, empiece por uno. Podrá cambiar estos datos después.</p>
      ${camposMenor(borrador.menor)}
    </div>`;
}

function rolElegido() {
  return GRUPOS[borrador.grupo].roles.find((r) => r.rol === borrador.rol);
}

function paso3() {
  const edad = Number(borrador.menor.edad);
  const cambiar = (paso, enfocar, que) => html`
    <dd class="resumen__accion"><button type="button" class="boton boton--fantasma" data-ir-paso="${paso}" data-enfocar="${enfocar}">${icono('pencil')}Cambiar<span class="visualmente-oculto"> ${que}</span></button></dd>`;
  return html`
    <div class="paso__cuerpo">
      <h2 class="paso__titulo" id="paso-titulo" tabindex="-1">Revise antes de crear</h2>
      <p class="campo__ayuda ayuda-paso">Si algo no está bien, toque «Cambiar». No se borra nada de lo que escribió.</p>
      <dl class="resumen">
        <div class="resumen__fila">
          <dt>Usted</dt>
          <dd>${borrador.nombre.trim()} · ${rolElegido()?.nombre}</dd>
          ${cambiar(1, 'su-nombre', 'sus datos')}
        </div>
        <div class="resumen__fila">
          <dt>Familia</dt>
          <dd>${nombreFamilia(borrador.familia)}</dd>
          ${cambiar(1, 'nombre-familia', 'el nombre de la familia')}
        </div>
        <div class="resumen__fila">
          <dt>Acompañan a</dt>
          <dd>${borrador.menor.nombre.trim()}, ${edad} ${edad === 1 ? 'año' : 'años'}</dd>
          ${cambiar(2, 'menor-nombre', 'los datos del niño o la niña')}
        </div>
      </dl>
      <p class="aviso aviso--info">${icono('info-circle')}<span>Después podrá invitar a la familia: le daremos un enlace para cada persona.</span></p>
    </div>`;
}

function validarPaso(form) {
  const errores = [];
  if (borrador.paso === 1) {
    const grupoRol = form.querySelector('#rol-exacto');
    if (grupoRol && !borrador.rol) { mostrarError(grupoRol, MENSAJES.rol); errores.push(grupoRol.querySelector('input')); }
    const nombre = form.querySelector('#su-nombre');
    if (!borrador.nombre.trim()) { mostrarError(nombre, MENSAJES.nombre); errores.push(nombre); }
    const familia = form.querySelector('#nombre-familia');
    if (!borrador.familia.trim()) { mostrarError(familia, MENSAJES.familia); errores.push(familia); }
  }
  if (borrador.paso === 2) errores.push(...validarMenor(form, borrador.menor));
  return errores[0] ?? null;
}

function irAPaso(paso, { enfocar } = {}) {
  borrador.paso = paso;
  refrescar();
  window.scrollTo({ top: 0 });
  const destino = (enfocar && document.getElementById(enfocar)) || document.getElementById('paso-titulo');
  destino?.focus();
  if (!enfocar) anunciar(`Paso ${paso} de 3: ${PASOS[paso - 1]}.`);
}

function hayAlgoEscrito() {
  return Boolean(borrador && (borrador.nombre.trim() || borrador.familia.trim() || borrador.menor.nombre.trim()));
}

async function cancelar() {
  if (hayAlgoEscrito()) {
    const salir = await confirmar({
      titulo: '¿Salir sin crear el espacio?',
      texto: 'Lo que escribió no se guardará. La familia de ejemplo sigue igual.',
      accion: 'Sí, salir sin crear',
      peligro: true,
    });
    if (!salir) return;
  }
  borrador = null;
  location.hash = '#/inicio';
}

async function crear() {
  const familia = nombreFamilia(borrador.familia);
  const si = await confirmar({
    titulo: `¿Crear el espacio de la ${familia}?`,
    texto: 'Esto reemplaza la familia de ejemplo de esta demostración. Podrá recuperarla desde «Mi cuenta».',
    accion: 'Sí, crear espacio',
    iconoTitulo: 'alert-circle',
  });
  if (!si) return;
  const guardado = crearFamilia({
    familia: borrador.familia,
    menor: borrador.menor,
    persona: { nombre: borrador.nombre, rol: borrador.rol },
  });
  borrador = null;
  location.hash = '#/familia';
  if (guardado) avisar(`Listo. Ya existe el espacio de la ${familia}. Ahora invite a su familia.`);
  else avisar('El espacio se creó, pero este navegador no pudo guardarlo.', { icono: 'alert-circle' });
}

export function vistaConfigurar() {
  // Sin rol elegido no se puede configurar: primero la bienvenida
  if (!borrador?.grupo) {
    queueMicrotask(() => location.replace('#/bienvenida'));
    return { titulo: 'Bienvenida', seccion: null, flujo: 'antes', contenido: html`<div class="pantalla"></div>` };
  }

  const paso = borrador.paso;
  const cuerpo = [paso1, paso2, paso3][paso - 1]();

  return {
    titulo: `Crear espacio familiar · Paso ${paso} de 3`,
    seccion: null,
    flujo: 'antes',
    contenido: html`
      <div class="pantalla pantalla--flujo" data-hu="HU02 HU03 HU48">
        <div class="pantalla__cabecera">
          <h1>Crear espacio familiar</h1>
          ${indicadorPasos(paso, PASOS)}
        </div>

        <form class="flujo" id="flujo-configurar" novalidate>
          ${cuerpo}
          <div class="flujo__acciones">
            <div class="flujo__secundarias">
              <button type="button" class="boton boton--secundario" data-accion="atras">${icono('arrow-left')}Atrás</button>
              <button type="button" class="boton boton--fantasma" data-accion="cancelar">${icono('x')}Cancelar</button>
            </div>
            <button type="submit" class="boton boton--primario">
              ${paso < 3 ? html`Siguiente${icono('arrow-left', 'icono--girado')}` : html`${icono('check')}Crear espacio familiar`}
            </button>
          </div>
        </form>
      </div>`,

    alMontar(contenedor) {
      const form = contenedor.querySelector('#flujo-configurar');

      form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const error = validarPaso(form);
        if (error) { error.focus(); return; }
        if (borrador.paso < 3) irAPaso(borrador.paso + 1);
        else crear();
      });

      form.addEventListener('click', (evento) => {
        const boton = evento.target.closest('button');
        if (!boton) return;
        if (boton.dataset.accion === 'atras') {
          if (borrador.paso === 1) location.hash = '#/bienvenida';
          else irAPaso(borrador.paso - 1);
        } else if (boton.dataset.accion === 'cancelar') cancelar();
        else if (boton.dataset.irPaso) irAPaso(Number(boton.dataset.irPaso), { enfocar: boton.dataset.enfocar });
      });

      form.addEventListener('input', (evento) => {
        const campo = evento.target;
        if (campo.id === 'su-nombre') borrador.nombre = campo.value;
        else if (campo.id === 'nombre-familia') {
          borrador.familia = campo.value;
          form.querySelector('#vista-familia').textContent = campo.value.trim() ? nombreFamilia(campo.value) : 'Familia Quispe';
        } else if (campo.id === 'menor-nombre') borrador.menor.nombre = campo.value;
        else if (campo.id === 'menor-edad') borrador.menor.edad = campo.value;
        else return;
        borrador.tocados.add(campo.id);
        if (campo.getAttribute('aria-invalid') === 'true' && campo.value.trim()) {
          if (campo.id.startsWith('menor-')) validarMenor(form, borrador.menor, { solo: campo.id });
          else limpiarError(campo);
        }
      });

      form.addEventListener('change', (evento) => {
        if (evento.target.name !== 'rol') return;
        borrador.rol = evento.target.value;
        limpiarError(form.querySelector('#rol-exacto'));
      });

      // Validar al salir del campo (heurística 5)
      form.addEventListener('focusout', (evento) => {
        const campo = evento.target;
        if (!borrador?.tocados.has(campo.id)) return;
        if (campo.id.startsWith('menor-')) {
          const [error] = validarMenor(form, borrador.menor, { solo: campo.id });
          if (error) anunciar(document.getElementById(`${campo.id}-error`)?.textContent ?? '');
        } else if (campo.id === 'su-nombre' && !campo.value.trim()) {
          mostrarError(campo, MENSAJES.nombre, { anunciarlo: true });
        } else if (campo.id === 'nombre-familia' && !campo.value.trim()) {
          mostrarError(campo, MENSAJES.familia, { anunciarlo: true });
        }
      });
    },
  };
}

// ==========================================================================================
// INV-01 · Aceptar invitación (HU05)
// ==========================================================================================

let codigoEscrito = '';

function porCodigo(codigo) {
  const limpio = normalizarCodigo(codigo);
  return limpio ? leer().integrantes.find((i) => i.invitacion?.codigo === limpio) ?? null : null;
}

function formularioCodigo({ error } = {}) {
  return html`
    <form class="flujo" id="form-codigo" novalidate>
      <div class="campo">
        <label for="codigo">Código de invitación</label>
        <p class="campo__ayuda" id="codigo-ayuda">Son 6 letras y números. Lo encuentra en el mensaje que le enviaron.</p>
        <input type="text" id="codigo" name="codigo" class="entrada entrada--codigo" maxlength="9" autocomplete="off"
          autocapitalize="characters" spellcheck="false" aria-describedby="codigo-ayuda" aria-invalid="false" value="${codigoEscrito}">
        ${cajaError('codigo')}
      </div>
      <div class="flujo__acciones">
        <div class="flujo__secundarias">
          <a class="boton boton--fantasma" href="#/inicio">${icono('arrow-left')}Volver a la demostración</a>
        </div>
        <button type="submit" class="boton boton--primario">${icono('search')}Buscar invitación</button>
      </div>
      ${error ? html`<template data-error="${error}"></template>` : ''}
    </form>`;
}

const ERROR_CODIGO = 'No encontramos una invitación con ese código. Revise las letras o pida un código nuevo a quien le invitó.';

export function vistaInvitacion({ query }) {
  const codigo = query.get('codigo');
  const persona = codigo ? porCodigo(codigo) : null;
  const { familia } = leer();

  // 1. Sin código, o con uno que no existe: se pide escribirlo
  if (!persona) {
    if (codigo) codigoEscrito = codigo;
    return {
      titulo: 'Entrar con una invitación',
      seccion: null,
      flujo: 'antes',
      contenido: html`
        <div class="pantalla pantalla--flujo" data-hu="HU05">
          ${cabecera('Entrar con una invitación', 'Escriba el código que le enviaron. No necesita contraseña.')}
          ${formularioCodigo({ error: codigo ? ERROR_CODIGO : null })}
        </div>`,
      alMontar(contenedor) {
        const form = contenedor.querySelector('#form-codigo');
        const campo = form.querySelector('#codigo');
        const previo = form.querySelector('template[data-error]');
        if (previo) mostrarError(campo, previo.dataset.error);
        campo.addEventListener('input', () => {
          codigoEscrito = campo.value;
          if (campo.getAttribute('aria-invalid') === 'true') limpiarError(campo);
        });
        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const limpio = normalizarCodigo(campo.value);
          if (!limpio) {
            mostrarError(campo, 'Escriba el código de 6 letras y números que le enviaron.');
            campo.focus();
            return;
          }
          if (!porCodigo(limpio)) {
            mostrarError(campo, ERROR_CODIGO, { anunciarlo: true });
            campo.focus();
            return;
          }
          codigoEscrito = '';
          location.hash = `#/invitacion?codigo=${limpio}`;
        });
      },
    };
  }

  const quienInvita = integrante(persona.invitacion.por);

  // 2. La invitación ya se usó: se puede entrar directamente como esa persona
  if (persona.estado === 'activo') {
    return {
      titulo: 'Invitación ya aceptada',
      seccion: null,
      flujo: 'antes',
      contenido: html`
        <div class="pantalla pantalla--flujo" data-hu="HU05">
          ${cabecera(`${persona.nombre} ya es parte de la ${familia.nombre}`, 'Esta invitación ya se aceptó. Puede entrar sin hacer nada más.')}
          <div class="flujo__acciones">
            <a class="boton boton--fantasma" href="#/inicio">${icono('arrow-left')}Volver a la demostración</a>
            <button type="button" class="boton boton--primario" id="entrar-como">${icono('user')}Entrar como ${persona.nombre}</button>
          </div>
        </div>`,
      alMontar(contenedor) {
        contenedor.querySelector('#entrar-como').addEventListener('click', () => {
          verComo(persona.id);
          location.hash = '#/inicio';
        });
      },
    };
  }

  // 3. Invitación pendiente: quién invita, a qué familia y con qué rol
  return {
    titulo: `Invitación a la ${familia.nombre}`,
    seccion: null,
    flujo: 'antes',
    contenido: html`
      <div class="pantalla pantalla--flujo" data-hu="HU05">
        <div class="pantalla__cabecera">
          <h1>${quienInvita ? `${quienInvita.nombre} le invita` : 'Le invitan'} a la ${familia.nombre}</h1>
          <p>Para acompañar a ${familia.menor.nombre} desde AYLLU.</p>
        </div>

        <section class="tarjeta tarjeta--protagonista bloque invitacion" aria-labelledby="titulo-invitado">
          <div class="persona-actual">
            ${avatar(persona, 'avatar--grande')}
            <div class="persona-actual__texto">
              <h2 id="titulo-invitado" class="titulo-chico">Entrará como ${persona.nombre}</h2>
              <span class="persona-actual__rol">${nombreRol(persona, familia.menor.nombre)}</span>
            </div>
          </div>
          <p><strong>Podrá:</strong> ${permisos(persona.rol).replace(/^./, (c) => c.toLowerCase())}</p>
          <p class="texto-suave">Código ${codigoLegible(persona.invitacion.codigo)} · sin contraseña.</p>
        </section>

        <div class="flujo__acciones">
          <div class="flujo__secundarias">
            <a class="boton boton--fantasma" href="#/invitacion">${icono('x')}No soy ${persona.nombre}</a>
          </div>
          <button type="button" class="boton boton--primario" id="aceptar">${icono('check')}Aceptar y entrar</button>
        </div>
      </div>`,
    alMontar(contenedor) {
      contenedor.querySelector('#aceptar').addEventListener('click', () => {
        aceptarInvitacion(persona.id);
        location.hash = '#/inicio';
        avisar(`Listo, ${persona.nombre}. Ya es parte de la ${familia.nombre}.`);
      });
    },
  };
}
