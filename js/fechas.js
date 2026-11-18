// AYLLU · Fechas como se dicen en casa (heurística 2 de Nielsen):
// "hoy, 4:15 p. m.", "ayer, 9:00 a. m.", "martes, 9:40 p. m.", "12 de noviembre".

const LOCALE = 'es-PE';

const formatoHora = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit', hour12: true });
const formatoDia = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });
const formatoFecha = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long' });
const formatoFechaAnio = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' });
const formatoRelativo = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

function inicioDelDia(fecha) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diasEntre(fecha, ahora) {
  return Math.round((inicioDelDia(ahora) - inicioDelDia(fecha)) / 86400000);
}

/** "4:15 p. m." (con espacio normal, para que lea bien cualquier lector de pantalla). */
export function hora(iso) {
  return formatoHora.format(new Date(iso)).replace(/ | /g, ' ');
}

/** Fecha corta y natural: "hoy, 4:15 p. m.", "ayer, 9:00 a. m.", "martes, 9:40 p. m.", "12 de noviembre". */
export function fechaHumana(iso, ahora = new Date()) {
  const fecha = new Date(iso);
  const dias = diasEntre(fecha, ahora);
  if (dias === 0) return `hoy, ${hora(iso)}`;
  if (dias === 1) return `ayer, ${hora(iso)}`;
  if (dias > 1 && dias < 7) return `${formatoDia.format(fecha)}, ${hora(iso)}`;
  const mismoAnio = fecha.getFullYear() === ahora.getFullYear();
  return (mismoAnio ? formatoFecha : formatoFechaAnio).format(fecha);
}

/** Cuánto tiempo pasó: "hace 3 horas", "hace 2 días", "hace un momento". */
export function hace(iso, ahora = new Date()) {
  const minutos = Math.round((ahora - new Date(iso)) / 60000);
  if (minutos < 1) return 'hace un momento';
  if (minutos < 60) return formatoRelativo.format(-minutos, 'minute');
  const horas = Math.round(minutos / 60);
  if (horas < 24) return formatoRelativo.format(-horas, 'hour');
  return formatoRelativo.format(-Math.round(horas / 24), 'day');
}

/** Saludo según la hora del día. */
export function saludo(ahora = new Date()) {
  const h = ahora.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Para el atributo datetime de <time>. */
export function iso(fecha) {
  return new Date(fecha).toISOString();
}
