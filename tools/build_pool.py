#!/usr/bin/env python3
"""Build data/pool-v1.json from NASA/JPL's Small-Body Database (public NASA data): numbered asteroids that have a name,
a measured diameter and a first-observation date. One request. A value the database lacks stays null and never satisfies a
badge. A rerun gives a newer snapshot (orbits and diameters are refined over time).

Usage: python tools/build_pool.py
"""
import datetime as dt
import json
import pathlib
import urllib.parse
import urllib.request

UA = "AsteroidRNG-fan-prototype/0.1 (https://github.com/sharkjujg/asteroidrng)"
FIELDS = "name,pdes,H,diameter,albedo,rot_per,per,a,e,i,class,neo,pha,first_obs"
URL = "https://ssd-api.jpl.nasa.gov/sbdb_query.api?" + urllib.parse.urlencode({
    "fields": FIELDS, "sb-kind": "a", "sb-ns": "n", "sb-cdata": json.dumps({"AND": ["diameter|DF", "name|DF", "first_obs|DF"]})})
with urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": UA}), timeout=170) as r:
    payload = json.load(r)
cols = payload["fields"]
rows = [dict(zip(cols, row)) for row in payload["data"]]
print(len(rows), "rows from JPL", flush=True)


def num(x, digits=4):
    try:
        v = float(x)
    except (TypeError, ValueError):
        return None
    return round(v, digits) if v == v else None


members, seen = [], set()
for r in rows:
    d, number, year = num(r["diameter"]), (r["pdes"] or "").strip(), (r["first_obs"] or "")[:4]
    if not (r["name"] and number.isdigit() and d and d > 0 and year.isdigit()) or number in seen:
        continue
    seen.add(number)
    members.append({"id": number, "name": r["name"].strip(), "diameter": d, "H": num(r["H"], 2), "albedo": num(r["albedo"], 3),
                    "spin": num(r["rot_per"], 3), "period": num(r["per"], 2), "a": num(r["a"], 3), "e": num(r["e"], 4), "i": num(r["i"], 2),
                    "class": r["class"], "neo": r["neo"] == "Y", "pha": r["pha"] == "Y", "seen": r["first_obs"]})
members.sort(key=lambda m: int(m["id"]))
n = len(members)
today = dt.datetime.now(dt.timezone.utc).date().isoformat()
cov = lambda f: f"known for {sum(m[f] is not None for m in members):,} of {n:,}; unknown never satisfies a badge"
meta = {"version": "v1", "publishedAt": today, "capturedAt": today,
        "source": "NASA/JPL Small-Body Database query API (https://ssd-api.jpl.nasa.gov)",
        "provenance": f"Snapshot taken {today} by tools/build_pool.py. Data courtesy of NASA/JPL-Caltech.",
        "selection": "Numbered asteroids that have a name, a measured diameter and a first-observation date.",
        "fieldStatus": {"id": "known", "name": "known", "diameter": "known (km)", "seen": "known (earliest observation in the orbit record)", "class": "known",
                        "neo": "known", "pha": "known", **{f: cov(f) for f in ("H", "albedo", "spin", "period", "a", "e", "i")}}}
lines = ",\n".join("  " + json.dumps(m, ensure_ascii=False, separators=(",", ":")) for m in members)
out = '{"meta":' + json.dumps(meta, ensure_ascii=False) + ',\n"members":[\n' + lines + "\n]}\n"
path = pathlib.Path(__file__).resolve().parent.parent / "data" / "pool-v1.json"
path.parent.mkdir(exist_ok=True)
path.write_bytes(out.encode("utf-8"))
print(f"wrote {path}: {n} asteroids", flush=True)
