// AYLLU · Acuerdos vigentes (AC-01) y crear o modificar acuerdo (AC-02). Fase 5 (HU27).

import { leer } from '../store.js';
import { html, cabecera, enConstruccion } from '../ui.js';

export function vistaAcuerdos() {
  const cuidadora = leer().integrantes.find((i) => i.rol === 'abuela' || i.rol === 'abuelo');
  return {
    titulo: 'Acuerdos',
    seccion: 'acuerdos',
    contenido: html`
      <div class="pantalla" data-hu="HU27">
        ${cabecera('Acuerdos', `Lo que ${cuidadora?.nombre ?? 'quien cuida'} puede resolver por su cuenta y lo que conviene consultar antes.`)}
        ${enConstruccion('Aquí estarán los acuerdos de la familia, con quién los cambió y cuándo.', 5)}
      </div>`,
  };
}
