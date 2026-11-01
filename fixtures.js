// AsteroidRNG fixtures for check.html: one row per case, [rule id, field overrides, expected match].
export const V = '2026-11-01';
export const base = { id: '1234', name: 'Sample Rock', diameter: 10, H: 12, albedo: 0.1, spin: 6, period: 1500, a: 2.7, e: 0.1, i: 10, class: 'MBA', neo: false, pha: false, seen: '1950-05-05' };

export const cases = [
  ['hefty', { diameter: 50 }, true], ['hefty', { diameter: 49.9 }, false], ['hefty', { diameter: null }, false], ['hefty', { diameter: 0 }, false],
  ['giant', { diameter: 200 }, true], ['giant', { diameter: 199 }, false],
  ['dwarf-scale', { diameter: 500 }, true], ['dwarf-scale', { diameter: 499 }, false],
  ['small-fry', { diameter: 1.99 }, true], ['small-fry', { diameter: 2 }, false], ['small-fry', { diameter: null }, false],
  ['pebble', { diameter: 0.49 }, true], ['pebble', { diameter: 0.5 }, false],
  ['coal-dark', { albedo: 0.039 }, true], ['coal-dark', { albedo: 0.04 }, false], ['coal-dark', { albedo: null }, false], ['coal-dark', { albedo: 0 }, false],
  ['shiny', { albedo: 0.35 }, true], ['shiny', { albedo: 0.349 }, false],
  ['speed-spinner', { spin: 2.19 }, true], ['speed-spinner', { spin: 2.2 }, false], ['speed-spinner', { spin: null }, false], ['speed-spinner', { spin: 0 }, false],
  ['slow-spinner', { spin: 100 }, true], ['slow-spinner', { spin: 99.9 }, false],
  ['inner-orbit', { a: 1.49 }, true], ['inner-orbit', { a: 1.5 }, false], ['inner-orbit', { a: null }, false],
  ['beyond-jupiter', { a: 5.5 }, true], ['beyond-jupiter', { a: 5.4 }, false],
  ['edge-of-the-system', { a: 30 }, true], ['edge-of-the-system', { a: 29.9 }, false],
  ['elongated-orbit', { e: 0.4 }, true], ['elongated-orbit', { e: 0.39 }, false], ['elongated-orbit', { e: null }, false], ['elongated-orbit', { e: 0 }, false],
  ['wild-orbit', { e: 0.7 }, true], ['wild-orbit', { e: 0.69 }, false],
  ['tilted', { i: 25 }, true], ['tilted', { i: 24.9 }, false], ['tilted', { i: null }, false],
  ['steep-tilt', { i: 60 }, true], ['steep-tilt', { i: 59.9 }, false],
  ['near-earth', { neo: true }, true], ['near-earth', { neo: false }, false], ['near-earth', { neo: 'Y' }, false],
  ['potentially-hazardous', { pha: true }, true], ['potentially-hazardous', { pha: false }, false],
  ['jupiter-trojan', { class: 'TJN' }, true], ['jupiter-trojan', { class: 'tjn' }, true], ['jupiter-trojan', { class: 'MBA' }, false], ['jupiter-trojan', { class: null }, false],
  ['centaur', { class: 'CEN' }, true], ['centaur', { class: 'TNO' }, false],
  ['trans-neptunian', { class: 'TNO' }, true], ['trans-neptunian', { class: 'CEN' }, false],
  ['mars-crosser', { class: 'MCA' }, true], ['mars-crosser', { class: 'MBA' }, false],
  ['apollo', { class: 'APO' }, true], ['apollo', { class: 'AMO' }, false],
  ['amor', { class: 'AMO' }, true], ['amor', { class: 'ATE' }, false],
  ['aten', { class: 'ATE' }, true], ['aten', { class: 'APO' }, false],
  ['first-hundred', { id: '100' }, true], ['first-hundred', { id: '101' }, false], ['first-hundred', { id: 'abc' }, false], ['first-hundred', { id: undefined }, false],
  ['round-number', { id: '5000' }, true], ['round-number', { id: '1000' }, true], ['round-number', { id: '5001' }, false], ['round-number', { id: '0' }, false],
  ['mirror-number', { id: '12321' }, true], ['mirror-number', { id: '101' }, true], ['mirror-number', { id: '12331' }, false], ['mirror-number', { id: '99' }, false],
  ['short-name', { name: 'Eros' }, true], ['short-name', { name: 'Ceres' }, false], ['short-name', { name: '' }, false], ['short-name', { name: undefined }, false],
  ['long-name', { name: 'a'.repeat(14) }, true], ['long-name', { name: 'a'.repeat(13) }, false],
  ['two-words', { name: 'Don Quixote' }, true], ['two-words', { name: 'Ceres' }, false], ['two-words', { name: '  ' }, false],
  ['historic-find', { seen: '1899-12-31' }, true], ['historic-find', { seen: '1900-01-01' }, false], ['historic-find', { seen: 'garbage' }, false], ['historic-find', { seen: null }, false],
  ['survey-era', { seen: '2000-01-01' }, true], ['survey-era', { seen: '1999-12-31' }, false],
  ['ten-km-club', { diameter: 10 }, true], ['ten-km-club', { diameter: 9.99 }, false], ['ten-km-club', { diameter: null }, false],
  ['dark-side', { albedo: 0.099 }, true], ['dark-side', { albedo: 0.1 }, false], ['dark-side', { albedo: null }, false], ['dark-side', { albedo: 0 }, false],
  ['quick-turn', { spin: 7.99 }, true], ['quick-turn', { spin: 8 }, false], ['quick-turn', { spin: null }, false],
  ['round-orbit', { e: 0.099 }, true], ['round-orbit', { e: 0.1 }, false], ['round-orbit', { e: 0 }, true], ['round-orbit', { e: null }, false], ['round-orbit', { e: -0.1 }, false],
  ['flat-orbit', { i: 4.99 }, true], ['flat-orbit', { i: 5 }, false], ['flat-orbit', { i: 0 }, true], ['flat-orbit', { i: null }, false],
  ['main-belt-dweller', { a: 2.1 }, true], ['main-belt-dweller', { a: 3.3 }, true], ['main-belt-dweller', { a: 2.09 }, false], ['main-belt-dweller', { a: 3.31 }, false], ['main-belt-dweller', { a: null }, false],
  ['vowel-start', { name: 'Eros' }, true], ['vowel-start', { name: 'Ceres' }, false], ['vowel-start', { name: '' }, false], ['vowel-start', { name: undefined }, false],
  ['five-digit', { id: '10000' }, true], ['five-digit', { id: '99999' }, true], ['five-digit', { id: '9999' }, false], ['five-digit', { id: '100000' }, false],
  ['twentieth-century', { seen: '1900-01-01' }, true], ['twentieth-century', { seen: '1999-12-31' }, true], ['twentieth-century', { seen: '1899-12-31' }, false], ['twentieth-century', { seen: '2000-01-01' }, false],
];

export function poolChecks(raw, pool, ok) {
  const ms = raw.members;
  ok('asteroid numbers are unique digit strings in ascending order', ms.every((m, i) => /^[1-9][0-9]*$/.test(m.id) && (i === 0 || +m.id > +ms[i - 1].id)));
  ok('every asteroid has a name, a positive diameter, a class and a valid first-observation date', ms.every((m) => m.name && m.diameter > 0 && m.class && /^\d{4}-\d{2}-\d{2}$/.test(m.seen)));
  ok('measurements are positive or unknown', ms.every((m) => ['albedo', 'spin', 'period', 'a'].every((k) => m[k] === null || m[k] > 0) && (m.e === null || m.e >= 0) && (m.i === null || (m.i >= 0 && m.i <= 180))));
  ok('no asteroid is bigger than Ceres (940 km)', ms.every((m) => m.diameter <= 940));
  ok('flags are booleans and every hazardous asteroid is a near-Earth one', ms.every((m) => typeof m.neo === 'boolean' && typeof m.pha === 'boolean' && (!m.pha || m.neo)));
  ok('the pool is large enough to be a game (>= 1000)', pool.n >= 1000);
}
