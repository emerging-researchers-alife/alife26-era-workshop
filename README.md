# ERA @ ALIFE 2026

Static site for the **ERA (Emerging Researchers in Artificial Life)** Minicon and
Workshop at **ALIFE 2026**, Waterloo, Ontario — 16 & 18 August 2026, plus the
**Emerg-ant hackathon**.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no fonts or
scripts fetched from anywhere else. Open `index.html` and it works.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page. Contains the maple-leaf `<symbol>` and the ant emblem as inline SVG. |
| `styles.css` | Design tokens and layout. Light and dark themes come from one set of custom properties. |
| `main.js` | Renders the schedule, the talks and the board; draws the ornaments. |
| `data.js` | Generated content: the Minicon schedule and the nine lightning talks. |
| `assets/` | ERA, ALIFE 2026 and ISAL logos, the flag of Canada, the favicon. |

## Design

Colours come from the flag of Canada — red on white — warmed into paper and ink
so a full page of it is readable. Everything organic on the page is drawn at run
time rather than shipped as an image:

- **Cell tissue** (hero background) — a honeycomb whose vertices are jittered
  through a shared lookup table, so neighbouring cells keep their shared walls.
- **Braided rules** (section dividers) — two strands weaving; per half-period the
  strand on top is drawn with a background-coloured casing beneath it, which is
  what makes the crossing read as *over*.
- **Organelle watermarks** — a wobbly membrane, a nucleus, mitochondria with
  cristae, a scatter of vesicles.
- **Ant trail** (hackathon section) — a pheromone trail with traffic on it. Some
  of them are carrying.
- **Paper grain** — an `feTurbulence` overlay, fixed to the viewport.

All of it honours `prefers-reduced-motion` and `prefers-color-scheme`.

## Data sources

- **Minicon schedule** — the published ALIFE 2026 Minicon schedule sheet.
- **Lightning talks** — the ERA submission sheet. Only the name, affiliation,
  title, abstract, bio and public link are published; email addresses, consent
  answers and notes to the organisers are not in `data.js` and never reach the page.
- **Organisers** — the ERA board as listed on [alife.org](https://alife.org/emerging-researchers-in-alife/).

### Updating the content

`data.js` is generated, but it is ordinary readable JavaScript — for a title fix
or a new talk, edit it directly. Each talk is:

```js
{
  name: "…", url: "…" | null, urlLabel: "…" | null,
  affiliation: "…", title: "…",
  abstract: ["paragraph", "paragraph"],   // array of paragraphs
  bio: "…"
}
```

Schedule rows carry `edt`, `jst`, `cest`, `min`, `session`, `speaker`, `mode`
and `note`. A row whose `session` matches `break` or `lunch` is styled as a break
automatically. The organiser list lives in `BOARD` at the top of `main.js`.

### Still to add

The **Workshop Schedule** tab of the source spreadsheet is not published to the
web — only the Minicon tab is — so the Tuesday running order is not on the page
yet. Once those times exist, add a second table beside the Minicon one, or
publish that tab and regenerate.

## Deploying

Any static host. For GitHub Pages: Settings → Pages → *Deploy from a branch* →
`main` / `root`. The `.nojekyll` file keeps Pages from reinterpreting anything.

## Credits

Logos belong to ERA, ALIFE 2026 and ISAL. The flag of Canada is traced from the
public-domain vector. Abstracts and bios are published with the speakers' consent.
