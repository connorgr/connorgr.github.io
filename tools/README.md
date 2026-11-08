# tools

Small generators/checkers for the site. Plain Python 3, no dependencies.

| Script | What it does |
|---|---|
| `ridges.py` | Regenerates the header waves (`<svg class="wave">` in `index.html` + the `/* W6: ridgeline swells */ … /* /W6 wave */` block in `style.css`). |
| `footer_ridges.py` | Regenerates the footer waves (`<svg class="wave-foot">` + the `/* footer waves */ … /* /footer waves */` block). |
| `validate_ld.py` | Checks the JSON-LD in `index.html` against the official schema.org vocabulary (types, properties, domains, ranges, pending/superseded terms). |

```sh
python3 tools/ridges.py
python3 tools/footer_ridges.py
python3 tools/validate_ld.py
```

Shape knobs (ridge count, heights, wavelengths, seed) are constants at the top of each ridges script; colors and line weights are generated as CSS rules using the site's variables.
