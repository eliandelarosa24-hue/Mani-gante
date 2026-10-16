// Atajos de edición humana compartidos por las semanas (planos, pantallas de impacto, stickers, cierres).
export const B = (at, clip, o = {}) => ({ at, clip, from: o.from ?? 0.5, speed: o.speed ?? 0.5, dim: o.dim, noCap: o.noCap, trans: o.trans ?? 'whip', cam: o.cam ?? [{ x: o.x ?? 540, y: o.y ?? 1000, z: o.z ?? 1.06 }], push: o.push ?? 0.1, times: o.times, to: o.to });
export const H = (at, clip, t, text, size) => ({ at, type: 'hook', bg: { clip, t }, text, size });
export const TYPE = (at, text, size = 84) => ({ at, sticker: { kind: 'type', text, x: 540, y: 800, size }, sfx: 'click', vol: 0.7 });
export const TAG = (at, text, o = {}) => ({ at, dt: o.dt, until: o.until, sticker: { text, x: o.x ?? 540, y: o.y ?? 1220, rot: o.rot ?? -3, tone: o.tone, size: o.size }, sfx: o.sfx ?? 'pop', vol: o.vol, flash: o.flash, shake: o.shake, rgb: o.rgb });
export const NUM = (at, n, label, until) => ({ at, until, sticker: { kind: 'num', text: String(n), label, x: 400, y: 300 }, rgb: true, sfx: 'pop' });
export const EMO = (at, text, o = {}) => ({ at, dt: o.dt, sticker: { kind: 'emoji', text, x: o.x ?? 830, y: o.y ?? 1250, size: o.size }, wiggle: true, sfx: o.sfx, vol: o.vol });
export const HIT = (at, o = {}) => ({ at, dt: o.dt, flash: o.flash ?? 0.5, shake: o.shake ?? 16, rgb: o.rgb ?? true, sfx: o.sfx ?? 'impact', vol: o.vol ?? 0.5 });
export const WHOOSH = (at) => ({ at, flash: 0.35, sfx: 'whoosh', vol: 0.4 });
export const END = (at) => [{ at, flash: 0.4, sfx: 'click', vol: 0.9 }];
export const NOTE = 'Primero ve su portada. Si no le convence, no paga.';
export const MUESTRA = 'Muestra de concepto · negocio ficticio diseñado por Red Vaeru';
