// AYLLU · Familia: integrantes y roles (FAM-01), perfil del menor (FAM-02),
// invitar familiar (FAM-03) y Mi cuenta. Fase 4 (HU03, HU04, HU06).

import { leer, usuarioActivo } from '../store.js';
import { html, cabecera, enConstruccion, nombreRol } from '../ui.js';

export function vistaFamilia() {
  const { familia } = leer();
  return {
    titulo: 'Familia',
    seccion: 'familia',
    contenido: html`
      <div class="pantalla" data-hu="HU06">
        ${cabecera(familia.nombre, `Quiénes acompañan a ${familia.menor.nombre} y qué puede hacer cada uno.`)}
        ${enConstruccion('Aquí estarán los integrantes, sus roles, las invitaciones pendientes y el perfil del menor.', 4)}
      </div>`,
  };
}

export function vistaCuenta() {
  const persona = usuarioActivo();
  return {
    titulo: 'Mi cuenta',
    seccion: null,
    contenido: html`
      <div class="pantalla">
        ${cabecera('Mi cuenta', `${persona.nombre} · ${nombreRol(persona, leer().familia.menor.nombre)}`)}
        ${enConstruccion('Aquí podrá ver sus datos y salir de la familia.', 4)}
      </div>`,
  };
}
