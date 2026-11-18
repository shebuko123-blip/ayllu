// AYLLU · Situaciones: lista e historial (SIT-01), registrar en 3 pasos (SIT-02),
// detalle con el hilo (SIT-03) y corregir (SIT-04). Se construyen en la fase 2.

import { leer } from '../store.js';
import { html, cabecera, enConstruccion, icono, etiquetaCategoria, etiquetaImportante, etiquetaEstado } from '../ui.js';

export function vistaSituaciones() {
  return {
    titulo: 'Situaciones',
    seccion: 'situaciones',
    contenido: html`
      <div class="pantalla" data-hu="HU17">
        ${cabecera('Situaciones', `Todo lo que pasa con ${leer().familia.menor.nombre}, guardado en un solo lugar.`)}
        ${enConstruccion('Aquí estará la lista con filtros (Todas, Importantes, Esperan respuesta, Cerradas) y el buscador.', 2)}
      </div>`,
  };
}

export function vistaRegistrar() {
  return {
    titulo: 'Registrar situación',
    seccion: 'situaciones',
    contenido: html`
      <div class="pantalla" data-hu="HU09 HU10">
        ${cabecera('Registrar situación', 'Cuente qué pasó en tres pasos. Puede escribir o usar su voz.')}
        ${enConstruccion('Aquí estará el registro en 3 pasos: qué pasó, cuéntelo y revisar y enviar.', 2)}
      </div>`,
  };
}

export function vistaDetalle({ params }) {
  const situacion = leer().situaciones.find((s) => s.id === params.id);
  if (!situacion) {
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
  return {
    titulo: situacion.titulo,
    seccion: 'situaciones',
    contenido: html`
      <div class="pantalla">
        <p><a class="boton boton--fantasma" href="#/situaciones">${icono('arrow-left')}Situaciones</a></p>
        <div class="grupo-botones">
          ${etiquetaCategoria(situacion.categoria)}
          ${situacion.importante ? etiquetaImportante() : ''}
          ${etiquetaEstado(situacion)}
        </div>
        ${cabecera(situacion.titulo, situacion.descripcion)}
        ${enConstruccion('Aquí estará el hilo de la situación: quién la vio, qué respondió y qué se decidió.', 2)}
      </div>`,
  };
}
