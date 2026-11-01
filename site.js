// Everything specific to AsteroidRNG: names, copy, card art, and which facts the result card shows. app.js is generic.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fmt = (n) => n.toLocaleString('en');
const sig = (n) => fmt(Number(n.toPrecision(4)));
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
const band = (x, cuts) => cuts.find(([max]) => x < max)[1];
const unknown = 'not in the database';
const KIND = { MBA: 'Main-belt asteroid', OMB: 'Outer main-belt asteroid', IMB: 'Inner main-belt asteroid', MCA: 'Mars-crosser', APO: 'Apollo (near-Earth)', AMO: 'Amor (near-Earth)',
  ATE: 'Aten (near-Earth)', IEO: 'Atira (inside Earth\'s orbit)', TJN: 'Jupiter trojan', CEN: 'Centaur', TNO: 'Trans-Neptunian object', PAA: 'Parabolic asteroid', HYA: 'Hyperbolic asteroid', AST: 'Asteroid' };
const kind = (m) => KIND[m.cls] || m.class || 'Asteroid';

export default {
  key: 'asteroidrng',
  name: 'AsteroidRNG',
  pageTitle: 'AsteroidRNG: a daily asteroid discovery game',
  noun: 'asteroid', nouns: 'asteroids', thing: 'Asteroid',
  worldNote: 'every rock in the solar system',
  repo: 'https://github.com/sharkjujg/asteroidrng',
  headline: 'Discover an asteroid. Once a day.',
  intro: (n) => `Roll once to draw one named asteroid from a pool of <b>${fmt(n)}</b>. Every asteroid has the same 1-in-${fmt(n)} chance, famous or obscure. Badges explain what is unusual about it, and rarer badges earn more rarity points (RP). The daily limit resets at 00:00 UTC.`,
  notice: 'Prototype: the asteroids and measurements are real (NASA/JPL Small-Body Database), but there are no accounts yet and your results are saved only in this browser. <a href="#/about">What that means</a>',
  header: (m) => ({ title: `(${m.id}) ${m.name}`, sub: `${kind(m)} · ${sig(m.diameter)} km across` }),
  label: (m) => `(${m.id}) ${m.name}`,
  shelves: (m) => [
    ['Class', kind(m)],
    ['Size', band(m.diameter, [[0.5, 'Under 0.5 km'], [2, '0.5 to 2 km'], [10, '2 to 10 km'], [50, '10 to 50 km'], [200, '50 to 200 km'], [Infinity, '200 km or more']])],
    ...(m.a ? [['Orbit', band(m.a, [[1.5, 'Inside 1.5 au'], [2.5, '1.5 to 2.5 au'], [3.2, '2.5 to 3.2 au (the main belt)'], [5.5, '3.2 to 5.5 au'], [Infinity, 'Beyond 5.5 au']])]] : []),
    ...(m.i !== null ? [['Tilt', band(m.i, [[5, 'Under 5°'], [15, '5° to 15°'], [30, '15° to 30°'], [Infinity, '30° or more']])]] : []),
    ...(m.spin ? [['Spin', band(m.spin, [[4, 'Under 4 hours'], [8, '4 to 8 hours'], [24, '8 to 24 hours'], [Infinity, 'Over 24 hours']])]] : []),
    ...(m.albedo ? [['Reflectivity', band(m.albedo, [[0.06, 'Dark (under 0.06)'], [0.15, 'Medium (0.06 to 0.15)'], [Infinity, 'Bright (0.15 or more)']])]] : []),
    ['Name starts with', m.name.trim()[0].toUpperCase()],
    ['Number range', band(+m.id, [[1000, '1 to 999'], [10000, '1,000 to 9,999'], [100000, '10,000 to 99,999'], [Infinity, '100,000 and up']])],
    ...(m.seen ? [['First observed', `${m.seen.slice(0, 3)}0s`]] : []),
  ],
  facts: (m) => [
    ['Class', kind(m)], ['Diameter', `${sig(m.diameter)} km (${sig(m.diameter * 0.621371)} miles)`],
    ['Absolute magnitude (H)', m.H !== null ? String(m.H) : unknown], ['Reflectivity (albedo)', m.albedo !== null ? String(m.albedo) : unknown],
    ['Rotation period', m.spin ? `${sig(m.spin)} hours` : unknown],
    ['Orbital period', m.period ? `${sig(m.period)} days (${sig(m.period / 365.25)} years)` : unknown],
    ['Distance from the Sun (semi-major axis)', m.a ? `${sig(m.a)} au` : unknown],
    ['Eccentricity and tilt', m.e !== null && m.i !== null ? `${sig(m.e)} and ${sig(m.i)}°` : unknown],
    ['Near-Earth / potentially hazardous', `${m.neo ? 'Yes' : 'No'} / ${m.pha ? 'Yes' : 'No'}`],
    ['First observation on record', m.seen],
    ['Source', 'NASA/JPL Small-Body Database', `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(m.id)}`],
  ],
  art(m) { // original asteroid: lumpy outline, color from reflectivity, size from diameter; it never affects scoring and is not a photograph
    let h = hash(m.id);
    const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296);
    const r = 14 + 22 * Math.min(1, Math.log10(1 + m.diameter) / Math.log10(941)), bright = m.albedo ? Math.min(0.5, m.albedo) / 0.5 : 0.25;
    const pts = Array.from({ length: 18 }, (_, k) => { const a = (k / 18) * Math.PI * 2, rr = r * (0.82 + rnd() * 0.3); return `${(50 + rr * Math.cos(a)).toFixed(1)},${(50 + rr * Math.sin(a)).toFixed(1)}`; }).join(' ');
    const light = Math.round(26 + bright * 48), craters = Array.from({ length: 5 }, () => `<circle cx="${(50 + (rnd() - 0.5) * r * 1.1).toFixed(1)}" cy="${(50 + (rnd() - 0.5) * r * 1.1).toFixed(1)}" r="${(1.5 + rnd() * r * 0.16).toFixed(1)}" fill="hsl(28 15% ${light - 10}%)"/>`).join('');
    const stars = Array.from({ length: 24 }, () => `<circle cx="${(rnd() * 100).toFixed(1)}" cy="${(rnd() * 100).toFixed(1)}" r="${(0.3 + rnd() * 0.5).toFixed(2)}"/>`).join('');
    return `<svg class="avatar" viewBox="0 0 100 100" role="img" aria-label="Generated picture of an asteroid. Not a photograph.">
      <rect width="100" height="100" rx="8" fill="#0a0d1a"/><g fill="#fff" opacity=".7">${stars}</g>
      <polygon points="${pts}" fill="hsl(28 18% ${light}%)" stroke="hsl(28 15% ${light + 14}%)" stroke-width=".8" stroke-linejoin="round"/>${craters}
      <text x="50" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="6" letter-spacing=".6" fill="#8791b8">GENERATED IMAGE</text></svg>`;
  },
  poolNotice: 'Every asteroid and measurement comes from NASA/JPL\'s <a href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html">Small-Body Database</a> (public NASA data), as a snapshot of numbered asteroids that have a name, a measured diameter and a first-observation date. A value the database lacks is shown as unknown and never earns a badge. Odds describe this pool of well-measured named asteroids, which leans toward big, bright and nearby ones: it says nothing about the millions of unnamed small bodies.',
  poolExtra(pool) {
    const tally = (get) => { const c = new Map(); for (const m of pool.members) for (const v of get(m)) c.set(v, (c.get(v) || 0) + 1); return [...c]; };
    const table = (title, rows) => `<table><thead><tr><th>${title}</th><th class="n">Asteroids</th></tr></thead><tbody>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="n">${fmt(v)}</td></tr>`).join('')}</tbody></table>`;
    const sizes = tally((m) => [m.diameter < 2 ? 'Under 2 km' : m.diameter < 10 ? '2 to 10 km' : m.diameter < 50 ? '10 to 50 km' : '50 km or more']);
    return `<h2>What is in the pool</h2><p class="small muted">Disclosed because a badge is only rare relative to this mix.</p>
      ${table('Class', tally((m) => [kind(m)]).sort((a, b) => b[1] - a[1]))}${table('Size', sizes.sort((a, b) => b[1] - a[1]))}`;
  },
  aboutData: `<h2>Where the data comes from</h2>
    <p>Name, number, diameter, absolute magnitude, albedo, rotation period, orbital elements (period, semi-major axis, eccentricity, inclination), dynamical class, near-Earth and potentially-hazardous flags, and the date of the earliest observation come from the NASA/JPL Small-Body Database, fetched once as a snapshot. A value the database lacks is unknown, never zero. "Potentially hazardous" is a size and close-approach category, not a prediction that anything will hit Earth. "First observation on record" is the earliest observation in the orbit record, which can be a later re-identification of an older discovery, so it is not always the discovery date. The artwork is a generated drawing, not a photograph.</p>`,
  terms: 'It is not affiliated with, sponsored or endorsed by NASA, JPL or Caltech. Data courtesy of NASA/JPL-Caltech; any errors in the snapshot or in the badges are this prototype\'s. Badges describe catalog measurements, not scientific importance.',
};
