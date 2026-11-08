"""Validate a JSON-LD block against the official schema.org vocabulary.

Checks, for every node: the @type exists; every property exists; the node's
type (or an ancestor) is in the property's domainIncludes; every value matches
the property's rangeIncludes (Text/URL/etc. for strings, a compatible type for
objects). Also flags pending / superseded terms.

Usage: python3 tools/validate_ld.py [page.html] [schema.jsonld]
  page.html     default: index.html in the repo root
  schema.jsonld default: downloaded from schema.org (latest release)
Exits non-zero if any problem is found.
"""
import json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
page = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "index.html")
if len(sys.argv) > 2:
    vocab = json.load(open(sys.argv[2]))["@graph"]
else:
    url = "https://schema.org/version/latest/schemaorg-current-https.jsonld"
    with urllib.request.urlopen(url, timeout=60) as resp:
        vocab = json.load(resp)["@graph"]
html = open(page, encoding="utf-8").read()
block = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S).group(1))

def ids(v):
    if v is None: return []
    v = v if isinstance(v, list) else [v]
    return [x["@id"].removeprefix("schema:") for x in v]

classes, props = {}, {}
for n in vocab:
    t = n.get("@type"); t = t if isinstance(t, list) else [t]
    name = n["@id"].removeprefix("schema:")
    info = {"pending": ids(n.get("schema:isPartOf")) == ["https://pending.schema.org"] or "pending" in str(n.get("schema:isPartOf", "")),
            "superseded": ids(n.get("schema:supersededBy"))}
    if "rdfs:Class" in t or any(x.startswith("schema:") for x in t if x != "rdf:Property"):
        info["parents"] = ids(n.get("rdfs:subClassOf")); classes[name] = info
    if "rdf:Property" in t:
        info["domain"] = ids(n.get("schema:domainIncludes")); info["range"] = ids(n.get("schema:rangeIncludes"))
        props[name] = info

def ancestors(c, seen=None):
    seen = seen or set()
    if c in seen or c not in classes: return seen
    seen.add(c)
    for p in classes[c].get("parents", []): ancestors(p, seen)
    return seen

TEXTLIKE = {"Text", "URL", "DataType"}
problems, notes = [], []

def check(node, path):
    t = node.get("@type")
    if t not in classes:
        problems.append(f"{path}: unknown @type {t!r}"); return
    if classes[t]["pending"]: notes.append(f"{path}: @type {t} is a pending (not yet core) term")
    anc = ancestors(t)
    for k, v in node.items():
        if k.startswith("@"): continue
        p = props.get(k)
        if not p:
            problems.append(f"{path}.{k}: not a schema.org property"); continue
        if p["superseded"]: problems.append(f"{path}.{k}: superseded by {p['superseded']}")
        if p["pending"]: notes.append(f"{path}.{k}: pending (not yet core) property")
        if not anc & set(p["domain"]):
            problems.append(f"{path}.{k}: not valid on {t} (domain: {', '.join(p['domain'])})")
        rng = set(p["range"])
        for i, val in enumerate(v if isinstance(v, list) else [v]):
            vp = f"{path}.{k}" + (f"[{i}]" if isinstance(v, list) else "")
            if isinstance(val, dict):
                vt = val.get("@type")
                if not (ancestors(vt) & rng):
                    problems.append(f"{vp}: {vt} is not an expected type (expects {', '.join(sorted(rng))})")
                check(val, vp)
            else:
                text_ok = bool(rng & TEXTLIKE) or any(r in ("URL",) or "URL" in ancestors(r) for r in rng)
                if not text_ok:
                    notes.append(f"{vp}: plain string where {', '.join(sorted(rng))} is expected "
                                 "(schema.org permits this as a fallback; a typed object is more precise)")
                if "URL" in rng and not (rng & {"Text"}) and not str(val).startswith("http"):
                    problems.append(f"{vp}: expects a URL, got {val!r}")

check(block, block.get("@type", "root"))
print("PROBLEMS:" if problems else "PROBLEMS: none")
for p in problems: print("  ✗", p)
print("NOTES:" if notes else "NOTES: none")
for n in notes: print("  •", n)
for k in ("hasCredential", "credentialCategory", "educationalLevel", "recognizedBy", "about", "alumniOf", "jobTitle", "knowsAbout", "mainEntity"):
    if k in props: print(f"  [{k}] domain={props[k]['domain']} range={props[k]['range']} pending={props[k]['pending']}")

sys.exit(1 if problems else 0)
