// AsteroidRNG badge rules. Each rule is a deterministic predicate over known fields: a value the database lacks never matches.
// test(m, poolDate) and evidence(m, poolDate) read the prepared member from prep().

export const norm = (s) => s.normalize('NFKC').toLowerCase();

const pos = (x) => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : null); // zero or absent is unknown, never a real value
const num = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
const chars = (s) => Array.from(s);
const f = (n) => Number(n.toPrecision(4)).toLocaleString('en');

export function prep(raw) {
  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : null;
  return {
    ...raw,
    n: name ? norm(name) : null, number: /^[0-9]+$/.test(raw.id ?? '') ? +raw.id : null,
    diameter: pos(raw.diameter), albedo: pos(raw.albedo), spin: pos(raw.spin), a: pos(raw.a), e: num(raw.e) !== null && raw.e >= 0 ? raw.e : null, i: num(raw.i) !== null && raw.i >= 0 ? raw.i : null,
    cls: typeof raw.class === 'string' ? raw.class.toUpperCase() : null, neo: raw.neo === true, pha: raw.pha === true,
    seenYear: /^\d{4}-\d{2}-\d{2}$/.test(raw.seen ?? '') ? +raw.seen.slice(0, 4) : null,
  };
}

const label = (m) => `(${m.id}) ${m.name}`;
const dia = (m) => `${label(m)} is ${f(m.diameter)} km across`;
const orb = (m) => `${label(m)} orbits at ${f(m.a)} au`;
const num2 = (m) => `Asteroid number ${m.number}`;
const nm = (m) => `"${m.name}" has ${chars(m.name).length} characters`;
const kind = (m) => `${label(m)} is classed ${m.cls}`;

export const RULES = [
  { id: 'hefty', name: 'Hefty', family: 'Size', rule: 'Diameter of 50 km or more', test: (m) => m.diameter !== null && m.diameter >= 50, evidence: dia },
  { id: 'giant', name: 'Giant', family: 'Size', rule: 'Diameter of 200 km or more', test: (m) => m.diameter !== null && m.diameter >= 200, evidence: dia },
  { id: 'dwarf-scale', name: 'Dwarf-Planet Scale', family: 'Size', rule: 'Diameter of 500 km or more', test: (m) => m.diameter !== null && m.diameter >= 500, evidence: dia },
  { id: 'small-fry', name: 'Small Fry', family: 'Small', rule: 'Diameter under 2 km', test: (m) => m.diameter !== null && m.diameter < 2, evidence: dia },
  { id: 'pebble', name: 'Pebble', family: 'Small', rule: 'Diameter under 0.5 km', test: (m) => m.diameter !== null && m.diameter < 0.5, evidence: dia },
  { id: 'coal-dark', name: 'Coal Dark', family: 'Albedo', rule: 'Albedo (reflectivity) under 0.04', test: (m) => m.albedo !== null && m.albedo < 0.04, evidence: (m) => `${label(m)} reflects ${f(m.albedo * 100)}% of sunlight` },
  { id: 'shiny', name: 'Shiny', family: 'Albedo', rule: 'Albedo (reflectivity) of 0.35 or more', test: (m) => m.albedo !== null && m.albedo >= 0.35, evidence: (m) => `${label(m)} reflects ${f(m.albedo * 100)}% of sunlight` },
  { id: 'speed-spinner', name: 'Speed Spinner', family: 'Spin', rule: 'Rotation period under 2.2 hours', test: (m) => m.spin !== null && m.spin < 2.2, evidence: (m) => `${label(m)} turns once in ${f(m.spin)} hours` },
  { id: 'slow-spinner', name: 'Slow Spinner', family: 'Spin', rule: 'Rotation period of 100 hours or more', test: (m) => m.spin !== null && m.spin >= 100, evidence: (m) => `${label(m)} turns once in ${f(m.spin)} hours` },
  { id: 'inner-orbit', name: 'Inner Orbit', family: 'Orbit size', rule: 'Semi-major axis under 1.5 au', test: (m) => m.a !== null && m.a < 1.5, evidence: orb },
  { id: 'beyond-jupiter', name: 'Beyond Jupiter', family: 'Orbit size', rule: 'Semi-major axis of 5.5 au or more', test: (m) => m.a !== null && m.a >= 5.5, evidence: orb },
  { id: 'edge-of-the-system', name: 'Edge of the System', family: 'Orbit size', rule: 'Semi-major axis of 30 au or more', test: (m) => m.a !== null && m.a >= 30, evidence: orb },
  { id: 'elongated-orbit', name: 'Elongated Orbit', family: 'Eccentricity', rule: 'Orbital eccentricity of 0.4 or more', test: (m) => m.e !== null && m.e >= 0.4, evidence: (m) => `${label(m)} has eccentricity ${f(m.e)}` },
  { id: 'wild-orbit', name: 'Wild Orbit', family: 'Eccentricity', rule: 'Orbital eccentricity of 0.7 or more', test: (m) => m.e !== null && m.e >= 0.7, evidence: (m) => `${label(m)} has eccentricity ${f(m.e)}` },
  { id: 'tilted', name: 'Tilted', family: 'Tilt', rule: 'Orbital inclination of 25 degrees or more', test: (m) => m.i !== null && m.i >= 25, evidence: (m) => `${label(m)} is inclined ${f(m.i)}°` },
  { id: 'steep-tilt', name: 'Steep Tilt', family: 'Tilt', rule: 'Orbital inclination of 60 degrees or more', test: (m) => m.i !== null && m.i >= 60, evidence: (m) => `${label(m)} is inclined ${f(m.i)}°` },
  { id: 'near-earth', name: 'Near-Earth', family: 'Earth watch', rule: 'Flagged as a near-Earth object', test: (m) => m.neo, evidence: (m) => `${label(m)} is a near-Earth object` },
  { id: 'potentially-hazardous', name: 'Potentially Hazardous', family: 'Earth watch', rule: 'Flagged as a potentially hazardous asteroid (a size and close-approach category, not a prediction of impact)', test: (m) => m.pha, evidence: (m) => `${label(m)} is flagged potentially hazardous` },
  { id: 'jupiter-trojan', name: 'Jupiter Trojan', family: 'Class', rule: 'Dynamical class TJN', test: (m) => m.cls === 'TJN', evidence: kind },
  { id: 'centaur', name: 'Centaur', family: 'Class', rule: 'Dynamical class CEN', test: (m) => m.cls === 'CEN', evidence: kind },
  { id: 'trans-neptunian', name: 'Trans-Neptunian', family: 'Class', rule: 'Dynamical class TNO', test: (m) => m.cls === 'TNO', evidence: kind },
  { id: 'mars-crosser', name: 'Mars-Crosser', family: 'Class', rule: 'Dynamical class MCA', test: (m) => m.cls === 'MCA', evidence: kind },
  { id: 'apollo', name: 'Apollo', family: 'Near-Earth group', rule: 'Dynamical class APO', test: (m) => m.cls === 'APO', evidence: kind },
  { id: 'amor', name: 'Amor', family: 'Near-Earth group', rule: 'Dynamical class AMO', test: (m) => m.cls === 'AMO', evidence: kind },
  { id: 'aten', name: 'Aten', family: 'Near-Earth group', rule: 'Dynamical class ATE', test: (m) => m.cls === 'ATE', evidence: kind },
  { id: 'first-hundred', name: 'First Hundred', family: 'Number', rule: 'Asteroid number 100 or lower', test: (m) => m.number !== null && m.number <= 100, evidence: num2 },
  { id: 'round-number', name: 'Round Number', family: 'Number pattern', rule: 'Asteroid number is a whole multiple of 1,000', test: (m) => m.number !== null && m.number >= 1000 && m.number % 1000 === 0, evidence: num2 },
  { id: 'mirror-number', name: 'Mirror Number', family: 'Number pattern', rule: 'Asteroid number (3+ digits) reads the same backwards',
    test: (m) => m.number !== null && String(m.number).length >= 3 && String(m.number) === [...String(m.number)].reverse().join(''), evidence: num2 },
  { id: 'short-name', name: 'Short Name', family: 'Name length', rule: 'Name of 4 characters or fewer', test: (m) => m.n !== null && chars(m.n).length <= 4, evidence: nm },
  { id: 'long-name', name: 'Long Name', family: 'Name length', rule: 'Name of 14 characters or more', test: (m) => m.n !== null && chars(m.n).length >= 14, evidence: nm },
  { id: 'two-words', name: 'Two Words', family: 'Name form', rule: 'Name contains a space', test: (m) => m.n !== null && /\s/.test(m.n), evidence: (m) => `"${m.name}" is more than one word` },
  { id: 'ten-km-club', name: 'Ten-Kilometer Club', family: 'Size', rule: 'Diameter of 10 km or more', test: (m) => m.diameter !== null && m.diameter >= 10, evidence: dia },
  { id: 'dark-side', name: 'Dark Side', family: 'Albedo', rule: 'Albedo (reflectivity) under 0.1', test: (m) => m.albedo !== null && m.albedo < 0.1, evidence: (m) => `${label(m)} reflects ${f(m.albedo * 100)}% of sunlight` },
  { id: 'quick-turn', name: 'Quick Turn', family: 'Spin', rule: 'Rotation period under 8 hours', test: (m) => m.spin !== null && m.spin < 8, evidence: (m) => `${label(m)} turns once in ${f(m.spin)} hours` },
  { id: 'round-orbit', name: 'Round Orbit', family: 'Roundness', rule: 'Orbital eccentricity under 0.1', test: (m) => m.e !== null && m.e < 0.1, evidence: (m) => `${label(m)} has eccentricity ${f(m.e)}` },
  { id: 'flat-orbit', name: 'Flat Orbit', family: 'Flatness', rule: 'Orbital inclination under 5 degrees', test: (m) => m.i !== null && m.i < 5, evidence: (m) => `${label(m)} is inclined ${f(m.i)}°` },
  { id: 'main-belt-dweller', name: 'Main-Belt Dweller', family: 'Home turf', rule: 'Semi-major axis from 2.1 to 3.3 au', test: (m) => m.a !== null && m.a >= 2.1 && m.a <= 3.3, evidence: orb },
  { id: 'vowel-start', name: 'Vowel Start', family: 'Name start', rule: 'Name starts with A, E, I, O or U', test: (m) => m.n !== null && /^[aeiou]/.test(m.n), evidence: (m) => `"${m.name}" starts with a vowel` },
  { id: 'five-digit', name: 'Five-Digit Number', family: 'Number', rule: 'Asteroid number from 10,000 to 99,999', test: (m) => m.number !== null && m.number >= 10000 && m.number <= 99999, evidence: num2 },
  { id: 'twentieth-century', name: 'Twentieth Century', family: 'Era', rule: 'Earliest observation from 1900 to 1999', test: (m) => m.seenYear !== null && m.seenYear >= 1900 && m.seenYear <= 1999, evidence: (m) => `${label(m)} was first observed in ${m.seenYear}` },
  { id: 'historic-find', name: 'Historic Find', family: 'Era', rule: 'Earliest observation before 1900', test: (m) => m.seenYear !== null && m.seenYear < 1900, evidence: (m) => `${label(m)} was first observed in ${m.seenYear}` },
  { id: 'survey-era', name: 'Survey Era', family: 'Era', rule: 'Earliest observation in 2000 or later', test: (m) => m.seenYear !== null && m.seenYear >= 2000, evidence: (m) => `${label(m)} was first observed in ${m.seenYear}` },
];
