// AYLLU · Voz.
// Fase 1: lectura en voz alta básica para "Escuchar esta pantalla" (D5).
// Fase 6: grabar nota de voz (HU12), transcripción (HU13) y controles de pausa y velocidad (HU43).

const sintesis = window.speechSynthesis;

export function puedeLeer() {
  return Boolean(sintesis && window.SpeechSynthesisUtterance);
}

function vozEspanol() {
  const voces = sintesis.getVoices();
  return voces.find((v) => v.lang === 'es-PE')
    ?? voces.find((v) => v.lang?.startsWith('es-4'))   // es-419 (Latinoamérica)
    ?? voces.find((v) => v.lang?.startsWith('es-US') || v.lang?.startsWith('es-MX'))
    ?? voces.find((v) => v.lang?.startsWith('es'))
    ?? null;
}

export function estaLeyendo() {
  return puedeLeer() && (sintesis.speaking || sintesis.pending);
}

/** Lee un texto en voz alta en español. Llama a alTerminar cuando acaba o se detiene. */
export function leerEnVozAlta(texto, { velocidad = 0.95, alTerminar } = {}) {
  if (!puedeLeer()) return false;
  sintesis.cancel();
  const frase = new SpeechSynthesisUtterance(texto);
  frase.lang = 'es-PE';
  const voz = vozEspanol();
  if (voz) frase.voice = voz;
  frase.rate = velocidad;
  frase.onend = () => alTerminar?.();
  frase.onerror = () => alTerminar?.();
  sintesis.speak(frase);
  return true;
}

export function detenerLectura() {
  if (puedeLeer()) sintesis.cancel();
}

// Algunas voces cargan tarde: pedirlas una vez para que estén listas al primer uso
if (puedeLeer()) sintesis.getVoices();
