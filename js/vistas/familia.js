// AYLLU · Familia (fase 4):
// - FAM-01 · Integrantes y roles, con las invitaciones pendientes (HU06).
// - FAM-02 · Perfil del menor (HU03).
// - FAM-03 · Invitar familiar: código y enlace sin contraseña (HU04, HU48).
// - Mi cuenta: perfil propio, restaurar la familia de ejemplo y salir.

import {
  leer, usuarioActivo, usuarioActivoId, integrante, puedeInvitar, invitarFamiliar, cancelarInvitacion,
  guardarMenor, restaurarEjemplo,
} from '../store.js';
import { refrescar } from '../router.js';
import {
  html, cabecera, icono, avatar, nombreRol, mostrarError, limpiarError, cajaError, confirmar, avisar, anunciar,
} from '../ui.js';
import { fechaHumana } from '../fechas.js';

const menor = () => leer().familia.menor.nombre;

/** Qué puede hacer cada rol, dicho en palabras (HU04, HU06). */
export const PERMISOS = {
  abuela: 'Registra lo que pasa con {menor}, decide en el día a día e invita a la familia.',
  abuelo: 'Registra lo que pasa con {menor}, decide en el día a día e invita a la familia.',
  padre: 'Ve todas las situaciones, responde y revisa los acuerdos con quien cuida.',
  madre: 'Ve todas las situaciones, responde y revisa los acuerdos con quien cuida.',
  apoyo: 'Registra situaciones, ve las que le envíen y puede responder. No cierra situaciones, no cambia acuerdos ni invita a otros.',
};

export function permisos(rol) {
  return (PERMISOS[rol] ?? '').replace('{menor}', menor());
}

/** Roles que se pueden invitar, como tarjetas (HU04). */
const ROLES_INVITAR = [
  { rol: 'padre', nombre: 'Papá', icono: 'user' },
  { rol: 'madre', nombre: 'Mamá', icono: 'user' },
  { rol: 'apoyo', nombre: 'Familiar de apoyo', icono: 'users' },
];

export function enlaceInvitacion(codigo) {
  return `${location.origin}${location.pathname}#/invitacion?codigo=${codigo}`;
}

/** "ABC123" → "ABC 123": más fácil de dictar por teléfono. */
export function codigoLegible(codigo) {
  return `${codigo.slice(0, 3)} ${codigo.slice(3)}`;
}

async function copiar(texto, campo) {
  try {
    await navigator.clipboard.writeText(texto);
    avisar('Enlace copiado. Ya puede pegarlo en un mensaje de WhatsApp.', { icono: 'copy' });
  } catch {
    // Sin permiso para copiar: se selecciona el enlace para copiarlo a mano
    campo?.focus();
    campo?.select();
    avisar('No pudimos copiarlo solo. El enlace quedó marcado: cópielo con Ctrl + C.', { icono: 'info-circle' });
  }
}

// ==========================================================================================
// FAM-01 · Integrantes y roles (HU06)
// ==========================================================================================

function estadoIntegrante(i) {
  return i.estado === 'invitado'
    ? html`<span class="etiqueta etiqueta--enviada">${icono('clock')}Invitación pendiente</span>`
    : html`<span class="etiqueta etiqueta--respondida">${icono('check')}Ya participa</span>`;
}

function tarjetaIntegrante(i, { yo, gestiona }) {
  const quienInvito = i.invitacion?.por && integrante(i.invitacion.por);
  return html`
    <li class="tarjeta integrante-ficha ${i.estado === 'invitado' ? 'integrante-ficha--pendiente' : ''}">
      <div class="integrante-ficha__cabecera">
        ${avatar(i, 'avatar--grande')}
        <div class="integrante-ficha__texto">
          <h3 class="integrante-ficha__nombre">${i.nombre}${i.id === yo ? html` <span class="texto-suave">(usted)</span>` : ''}</h3>
          <p class="integrante__rol">${nombreRol(i, menor())}</p>
        </div>
        ${estadoIntegrante(i)}
      </div>
      <p class="integrante-ficha__permisos"><strong>Puede:</strong> ${permisos(i.rol).replace(/\.$/, '').replace(/^./, (c) => c.toLowerCase())}.</p>
      ${i.estado === 'invitado' ? html`
        <p class="integrante-ficha__invitacion">
          ${quienInvito ? `${quienInvito.id === yo ? 'Usted la creó' : `${quienInvito.nombre} la creó`} ${fechaHumana(i.invitacion.fecha)}. ` : ''}
          Código: <strong class="codigo codigo--chico">${codigoLegible(i.invitacion.codigo)}</strong>
        </p>
        ${gestiona ? html`
          <div class="integrante-ficha__acciones">
            <button type="button" class="boton boton--secundario" data-copiar="${i.invitacion.codigo}">${icono('copy')}Copiar enlace<span class="visualmente-oculto"> de ${i.nombre}</span></button>
            <button type="button" class="boton boton--fantasma" data-cancelar="${i.id}">${icono('x')}Cancelar invitación<span class="visualmente-oculto"> de ${i.nombre}</span></button>
          </div>` : ''}` : ''}
    </li>`;
}

export function vistaFamilia() {
  const { familia, integrantes } = leer();
  const yo = usuarioActivo();
  const gestiona = puedeInvitar(yo);
  const cuidadora = integrantes.find((i) => i.rol === 'abuela' || i.rol === 'abuelo');
  // Primero quien usa la pantalla, luego los activos y al final las invitaciones
  const orden = [...integrantes].sort((a, b) =>
    (b.id === yo.id) - (a.id === yo.id) || (a.estado === 'invitado') - (b.estado === 'invitado'));
  const pendientes = integrantes.filter((i) => i.estado === 'invitado').length;

  return {
    titulo: 'Familia',
    seccion: 'familia',
    contenido: html`
      <div class="pantalla">
        <div class="pantalla__cabecera pantalla__cabecera--accion">
          <div>
            <h1>${familia.nombre}</h1>
            <p>Quiénes acompañan a ${familia.menor.nombre} y qué puede hacer cada uno.</p>
          </div>
          ${gestiona ? html`<a class="boton boton--primario" href="#/familia/invitar" data-hu="HU04">${icono('user-plus')}Invitar familiar</a>` : ''}
        </div>

        <div class="dos-columnas">
          <section class="bloque" aria-labelledby="titulo-integrantes" data-hu="HU06">
            <div class="bloque__cabecera">
              <h2 id="titulo-integrantes">Integrantes</h2>
              <p class="texto-suave">${integrantes.length - pendientes} ${integrantes.length - pendientes === 1 ? 'participa' : 'participan'}${pendientes ? ` · ${pendientes} ${pendientes === 1 ? 'invitación pendiente' : 'invitaciones pendientes'}` : ''}</p>
            </div>
            <ul class="integrantes-fichas" id="lista-integrantes">
              ${orden.map((i) => tarjetaIntegrante(i, { yo: yo.id, gestiona }))}
            </ul>
            ${gestiona ? '' : html`
              <p class="aviso aviso--info">${icono('info-circle')}<span>${cuidadora ? `${cuidadora.nombre} puede` : 'Quien cuida puede'} invitar a más familiares.</span></p>`}
          </section>

          <aside class="lateral" aria-label="Datos de ${familia.menor.nombre}">
            <section class="tarjeta tarjeta--apoyo bloque" aria-labelledby="titulo-menor" data-hu="HU03">
              <div class="menor">
                <span class="menor__inicial" aria-hidden="true">${familia.menor.nombre[0]}</span>
                <div>
                  <h2 class="menor__nombre" id="titulo-menor">${familia.menor.nombre}</h2>
                  <p class="menor__dato">${familia.menor.edad} ${familia.menor.edad === 1 ? 'año' : 'años'}</p>
                </div>
              </div>
              <a class="boton boton--secundario" href="#/familia/menor">${icono('pencil')}Cambiar datos de ${familia.menor.nombre}</a>
            </section>
          </aside>
        </div>
      </div>`,

    alMontar(contenedor) {
      contenedor.querySelector('#lista-integrantes').addEventListener('click', async (evento) => {
        const boton = evento.target.closest('button');
        if (!boton) return;
        if (boton.dataset.copiar) {
          copiar(enlaceInvitacion(boton.dataset.copiar));
        } else if (boton.dataset.cancelar) {
          const persona = integrante(boton.dataset.cancelar);
          const si = await confirmar({
            titulo: `¿Cancelar la invitación de ${persona.nombre}?`,
            texto: `El enlace y el código dejarán de funcionar. Si cambia de opinión, puede invitar a ${persona.nombre} otra vez.`,
            accion: 'Sí, cancelar invitación',
            peligro: true,
          });
          if (!si) return;
          cancelarInvitacion(persona.id);
          document.querySelector('h1')?.focus();
          avisar(`Listo. La invitación de ${persona.nombre} quedó cancelada.`);
        }
      });
    },
  };
}

// ==========================================================================================
// FAM-02 · Perfil del menor (HU03)
// ==========================================================================================

const MENSAJES_MENOR = {
  nombre: 'Escriba el nombre para que la familia sepa de quién se trata.',
  edad: 'Escriba la edad en números. Por ejemplo: 8.',
  rango: 'Escriba una edad entre 0 y 17 años.',
};

/** Revisa nombre y edad de un niño o niña. Devuelve los campos con error, en orden. */
export function validarMenor(form, datos, { solo } = {}) {
  const errores = [];
  const revisar = (campo, mensaje) => {
    const control = form.querySelector(`#${campo}`);
    if (mensaje) { mostrarError(control, mensaje); errores.push(control); } else limpiarError(control);
  };
  if (!solo || solo === 'menor-nombre') revisar('menor-nombre', datos.nombre.trim() ? null : MENSAJES_MENOR.nombre);
  if (!solo || solo === 'menor-edad') {
    const edad = datos.edad.trim();
    revisar('menor-edad', !/^\d{1,2}$/.test(edad) ? MENSAJES_MENOR.edad : Number(edad) > 17 ? MENSAJES_MENOR.rango : null);
  }
  return errores;
}

/** Los dos campos del menor (se usan aquí y al crear el espacio familiar). */
export function camposMenor(datos) {
  return html`
    <div class="campo">
      <label for="menor-nombre">Nombre del niño o la niña</label>
      <p class="campo__ayuda" id="menor-nombre-ayuda">Como lo llaman en casa. Por ejemplo: Mía.</p>
      <input type="text" id="menor-nombre" name="nombre" class="entrada" maxlength="40" required autocomplete="off"
        aria-describedby="menor-nombre-ayuda" aria-invalid="false" value="${datos.nombre}">
      ${cajaError('menor-nombre')}
    </div>
    <div class="campo campo--corto">
      <label for="menor-edad">Edad</label>
      <p class="campo__ayuda" id="menor-edad-ayuda">En años cumplidos.</p>
      <div class="entrada-con-unidad">
        <input type="text" id="menor-edad" name="edad" class="entrada" inputmode="numeric" maxlength="2" required autocomplete="off"
          aria-describedby="menor-edad-ayuda" aria-invalid="false" value="${datos.edad}">
        <span aria-hidden="true">años</span>
      </div>
      ${cajaError('menor-edad')}
    </div>`;
}

let borradorMenor = null;

export function vistaMenor() {
  const actual = leer().familia.menor;
  if (!borradorMenor) borradorMenor = { nombre: actual.nombre, edad: String(actual.edad), tocados: new Set() };

  return {
    titulo: `Datos de ${actual.nombre}`,
    seccion: 'familia',
    contenido: html`
      <div class="pantalla pantalla--flujo" data-hu="HU03">
        <p><a class="boton boton--fantasma volver" href="#/familia">${icono('arrow-left')}Familia</a></p>
        ${cabecera(`Datos de ${actual.nombre}`, 'La familia verá estos datos en Inicio y en Familia.')}
        <form class="flujo" id="form-menor" novalidate>
          <div class="paso__cuerpo">${camposMenor(borradorMenor)}</div>
          <div class="flujo__acciones">
            <div class="flujo__secundarias">
              <a class="boton boton--fantasma" href="#/familia">${icono('x')}Cancelar</a>
            </div>
            <button type="submit" class="boton boton--primario">${icono('check')}Guardar cambios</button>
          </div>
        </form>
      </div>`,

    alMontar(contenedor) {
      const form = contenedor.querySelector('#form-menor');
      form.addEventListener('input', (evento) => {
        const campo = evento.target;
        borradorMenor[campo.name] = campo.value;
        borradorMenor.tocados.add(campo.id);
        if (campo.getAttribute('aria-invalid') === 'true') validarMenor(form, borradorMenor, { solo: campo.id });
      });
      form.addEventListener('focusout', (evento) => {
        const campo = evento.target;
        if (borradorMenor?.tocados.has(campo.id)) {
          const [error] = validarMenor(form, borradorMenor, { solo: campo.id });
          if (error) anunciar(document.getElementById(`${campo.id}-error`)?.textContent ?? '');
        }
      });
      form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const [error] = validarMenor(form, borradorMenor);
        if (error) { error.focus(); return; }
        const nombre = borradorMenor.nombre.trim();
        const edad = Number(borradorMenor.edad);
        if (nombre === actual.nombre && edad === actual.edad) {
          borradorMenor = null;
          location.hash = '#/familia';
          avisar('No hubo cambios. Los datos siguen igual.', { icono: 'info-circle' });
          return;
        }
        const si = await confirmar({
          titulo: `¿Guardar los datos de ${nombre}?`,
          texto: `Toda la familia verá: ${nombre}, ${edad} ${edad === 1 ? 'año' : 'años'}.`,
          accion: 'Sí, guardar',
        });
        if (!si) return;
        guardarMenor({ nombre, edad });
        borradorMenor = null;
        location.hash = '#/familia';
        avisar(`Listo. Los datos de ${nombre} quedaron guardados.`);
      });
      form.querySelector('a[href="#/familia"]')?.addEventListener('click', () => { borradorMenor = null; });
    },
  };
}

// ==========================================================================================
// FAM-03 · Invitar familiar (HU04, HU48)
// ==========================================================================================

let borradorInvitar = null;   // { nombre, rol, tocados }
let invitacionHecha = null;   // id de la persona recién invitada: muestra el código y el enlace

function formularioInvitar() {
  return html`
    <form class="flujo" id="form-invitar" novalidate>
      <div class="paso__cuerpo">
        <div class="campo">
          <label for="invitado-nombre">¿Cómo se llama?</label>
          <p class="campo__ayuda" id="invitado-nombre-ayuda">El nombre con el que la familia lo conoce. Por ejemplo: Carmen.</p>
          <input type="text" id="invitado-nombre" name="nombre" class="entrada" maxlength="40" required autocomplete="off"
            aria-describedby="invitado-nombre-ayuda" aria-invalid="false" value="${borradorInvitar.nombre}">
          ${cajaError('invitado-nombre')}
        </div>

        <fieldset class="campo campo--grupo" id="invitado-rol">
          <legend>¿Quién es para ${menor()}?</legend>
          <p class="campo__ayuda">Cada rol puede hacer cosas distintas.</p>
          ${cajaError('invitado-rol')}
          <div class="categorias categorias--una">
            ${ROLES_INVITAR.map((r) => html`
              <label class="opcion-categoria opcion-categoria--rol">
                <input type="radio" name="rol" value="${r.rol}" ${borradorInvitar.rol === r.rol ? 'checked' : ''}>
                <span class="opcion-categoria__caja">
                  <span class="opcion-categoria__icono">${icono(r.icono)}</span>
                  <span class="opcion-categoria__nombre">${r.nombre}</span>
                  <span class="opcion-categoria__descripcion">${permisos(r.rol)}</span>
                </span>
              </label>`)}
          </div>
        </fieldset>
      </div>

      <div class="flujo__acciones">
        <div class="flujo__secundarias">
          <a class="boton boton--fantasma" href="#/familia" data-salir>${icono('x')}Cancelar</a>
        </div>
        <button type="submit" class="boton boton--primario">${icono('user-plus')}Crear invitación</button>
      </div>
    </form>`;
}

function invitacionLista(persona) {
  const enlace = enlaceInvitacion(persona.invitacion.codigo);
  return html`
    <div class="paso__cuerpo invitacion-lista">
      <p class="aviso aviso--info">${icono('circle-check')}<span>${persona.nombre} aparece en la familia con <strong>invitación pendiente</strong> hasta que entre.</span></p>

      <section class="tarjeta tarjeta--protagonista bloque" aria-labelledby="titulo-codigo">
        <h2 id="titulo-codigo">Envíele el enlace a ${persona.nombre}</h2>
        <p>Puede mandarlo por WhatsApp o dictarle el código por teléfono. No necesita contraseña.</p>
        <div class="campo">
          <label for="enlace-invitacion">Enlace de invitación</label>
          <input type="text" id="enlace-invitacion" class="entrada entrada--enlace" readonly value="${enlace}">
        </div>
        <button type="button" class="boton boton--primario" id="boton-copiar">${icono('copy')}Copiar enlace</button>
        <p class="codigo-caja">
          <span>O el código:</span>
          <strong class="codigo" aria-label="${persona.invitacion.codigo.split('').join(' ')}">${codigoLegible(persona.invitacion.codigo)}</strong>
        </p>
      </section>

      <p class="aviso etiqueta--demo nota-demo">${icono('info-circle')}<span><strong>Para probar la demostración:</strong> abra el enlace en otra pestaña y acepte como ${persona.nombre}. Esta pestaña mostrará el cambio.</span></p>

      <div class="flujo__acciones">
        <a class="boton boton--secundario" href="#/familia">${icono('users')}Volver a la familia</a>
        <a class="boton boton--fantasma" href="${enlace}" target="_blank" rel="noopener">${icono('user')}Abrir el enlace en otra pestaña</a>
      </div>
    </div>`;
}

export function vistaInvitar() {
  const yo = usuarioActivo();
  if (!puedeInvitar(yo)) {
    const cuidadora = leer().integrantes.find((i) => i.rol === 'abuela' || i.rol === 'abuelo');
    return {
      titulo: 'Invitar familiar',
      seccion: 'familia',
      contenido: html`
        <div class="pantalla pantalla--flujo">
          ${cabecera('Invitar familiar', `Solo ${cuidadora?.nombre ?? 'quien cuida'} puede invitar a más familiares. Así sabe siempre quién ve lo que pasa con ${menor()}.`)}
          <p><a class="boton boton--secundario" href="#/familia">${icono('arrow-left')}Volver a la familia</a></p>
        </div>`,
    };
  }

  const persona = invitacionHecha && integrante(invitacionHecha);
  if (persona) {
    return {
      titulo: `Invitación para ${persona.nombre}`,
      seccion: 'familia',
      contenido: html`
        <div class="pantalla pantalla--flujo" data-hu="HU04">
          ${cabecera(persona.estado === 'activo' ? `${persona.nombre} ya entró a la familia` : `La invitación de ${persona.nombre} está lista`,
            persona.estado === 'activo' ? 'Aceptó la invitación y ya puede ver lo que se le envíe.' : null)}
          ${persona.estado === 'activo'
            ? html`<p><a class="boton boton--secundario" href="#/familia">${icono('users')}Ver la familia</a></p>`
            : invitacionLista(persona)}
        </div>`,
      alMontar(contenedor) {
        contenedor.querySelector('#boton-copiar')?.addEventListener('click', () =>
          copiar(enlaceInvitacion(persona.invitacion.codigo), contenedor.querySelector('#enlace-invitacion')));
      },
    };
  }

  if (!borradorInvitar) borradorInvitar = { nombre: '', rol: null, tocado: false };

  return {
    titulo: 'Invitar familiar',
    seccion: 'familia',
    contenido: html`
      <div class="pantalla pantalla--flujo" data-hu="HU04 HU48">
        <p><a class="boton boton--fantasma volver" href="#/familia" data-salir>${icono('arrow-left')}Familia</a></p>
        ${cabecera('Invitar familiar', `Le daremos un código y un enlace para que entre a la familia de ${menor()}.`)}
        ${formularioInvitar()}
      </div>`,

    alMontar(contenedor) {
      const form = contenedor.querySelector('#form-invitar');
      const campoNombre = form.querySelector('#invitado-nombre');
      const grupoRol = form.querySelector('#invitado-rol');

      for (const enlace of contenedor.querySelectorAll('[data-salir]')) {
        enlace.addEventListener('click', () => { borradorInvitar = null; });
      }
      form.addEventListener('input', (evento) => {
        if (evento.target !== campoNombre) return;
        borradorInvitar.nombre = campoNombre.value;
        borradorInvitar.tocado = true;
        if (campoNombre.value.trim()) limpiarError(campoNombre);
      });
      campoNombre.addEventListener('blur', () => {
        if (borradorInvitar?.tocado && !campoNombre.value.trim()) {
          mostrarError(campoNombre, 'Escriba el nombre de la persona que quiere invitar.', { anunciarlo: true });
        }
      });
      form.addEventListener('change', (evento) => {
        if (evento.target.name !== 'rol') return;
        borradorInvitar.rol = evento.target.value;
        limpiarError(grupoRol);
      });

      form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const errores = [];
        if (!borradorInvitar.nombre.trim()) {
          mostrarError(campoNombre, 'Escriba el nombre de la persona que quiere invitar.');
          errores.push(campoNombre);
        }
        if (!borradorInvitar.rol) {
          mostrarError(grupoRol, 'Elija quién es para que sepa qué podrá hacer.');
          errores.push(grupoRol.querySelector('input'));
        }
        if (errores.length) { errores[0].focus(); return; }

        const nombre = borradorInvitar.nombre.trim();
        const rol = ROLES_INVITAR.find((r) => r.rol === borradorInvitar.rol);
        const si = await confirmar({
          titulo: `¿Invitar a ${nombre}?`,
          texto: `Entrará como ${rol.nombre.toLowerCase()}. ${permisos(rol.rol)} Podrá cancelar la invitación mientras no la acepte.`,
          accion: 'Sí, crear invitación',
          iconoAccion: 'user-plus',
        });
        if (!si) return;

        const { id, guardado } = invitarFamiliar({ nombre, rol: rol.rol }, usuarioActivoId());
        borradorInvitar = null;
        invitacionHecha = id;
        refrescar();
        document.querySelector('h1')?.focus();
        if (guardado) avisar(`Listo. La invitación de ${nombre} está lista para enviar.`);
        else avisar('La invitación se creó, pero este navegador no pudo guardarla.', { icono: 'alert-circle' });
      });
    },
  };
}

// Al salir de "Invitar" se olvida la invitación recién creada (la próxima vez empieza en blanco)
document.addEventListener('ayllu:pantalla', (evento) => {
  if (evento.detail.camino !== '/familia/invitar') invitacionHecha = null;
  if (evento.detail.camino !== '/familia/menor') borradorMenor = null;
});

// ==========================================================================================
// Mi cuenta
// ==========================================================================================

/** Restaurar la familia de ejemplo, siempre con confirmación (se usa aquí y en el menú de la persona). */
export async function restaurarConConfirmacion() {
  const confirmado = await confirmar({
    titulo: '¿Restaurar la familia de ejemplo?',
    texto: 'Se borrará lo que registró en esta demostración y volverán los datos de la familia Collantes. Su tamaño de letra se mantiene.',
    accion: 'Sí, restaurar',
    peligro: true,
  });
  if (!confirmado) return;
  restaurarEjemplo();
  location.hash = '#/inicio';
  avisar('Listo. Volvió la familia de ejemplo.');
}

export function vistaCuenta() {
  const persona = usuarioActivo();
  const { familia } = leer();
  return {
    titulo: 'Mi cuenta',
    seccion: null,
    contenido: html`
      <div class="pantalla pantalla--flujo">
        ${cabecera('Mi cuenta', 'Sus datos en la familia y las opciones de esta demostración.')}

        <section class="tarjeta bloque" aria-labelledby="titulo-perfil">
          <div class="persona-actual">
            ${avatar(persona, 'avatar--grande')}
            <div class="persona-actual__texto">
              <h2 id="titulo-perfil" class="titulo-chico">${persona.nombre}</h2>
              <span class="persona-actual__rol">${nombreRol(persona, familia.menor.nombre)} · ${familia.nombre}</span>
            </div>
          </div>
          <p><strong>Puede:</strong> ${permisos(persona.rol).replace(/^./, (c) => c.toLowerCase())}</p>
        </section>

        <section class="bloque" aria-labelledby="titulo-demo">
          <h2 id="titulo-demo">Esta demostración</h2>
          <ul class="lista-opciones">
            <li>
              <a class="opcion-enlace" href="#/bienvenida">
                ${icono('plus')}
                <span><strong>Crear un espacio familiar nuevo</strong><span class="opcion-enlace__texto">Pruebe cómo empieza una familia desde cero.</span></span>
              </a>
            </li>
            <li>
              <a class="opcion-enlace" href="#/invitacion">
                ${icono('key')}
                <span><strong>Entrar con un código de invitación</strong><span class="opcion-enlace__texto">Si alguien de la familia le envió un código.</span></span>
              </a>
            </li>
            <li>
              <button type="button" class="opcion-enlace" id="cuenta-restaurar">
                ${icono('refresh')}
                <span><strong>Restaurar familia de ejemplo</strong><span class="opcion-enlace__texto">Vuelve la familia Collantes y se borra lo que registró.</span></span>
              </button>
            </li>
          </ul>
        </section>

        <p><a class="boton boton--secundario" href="index.html">${icono('logout')}Salir</a></p>
      </div>`,
    alMontar(contenedor) {
      contenedor.querySelector('#cuenta-restaurar').addEventListener('click', restaurarConConfirmacion);
    },
  };
}
