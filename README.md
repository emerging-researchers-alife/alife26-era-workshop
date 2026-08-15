# ERA @ ALIFE 2026

Static site for the **ERA (Emerging Researchers in Artificial Life) Workshop** at
**ALIFE 2026** — Tuesday 18 August 2026, Room 5, Waterloo, Ontario. Timetable,
nine lightning talks, and the **Emerg-ant hackathon**.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no fonts or
scripts fetched from anywhere else. Open `index.html` and it works.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page. Holds the maple-leaf `<symbol>` used everywhere else. |
| `styles.css` | Design tokens and layout. Light and dark themes come from one set of custom properties. |
| `main.js` | Renders the timetable, the talks and the board; draws the ornaments. |
| `data.js` | Generated content: the workshop timetable and the nine lightning talks. |
| `assets/` | ERA, ALIFE 2026 and ISAL logos, the ant, the flag of Canada, the favicon. |

## Design

Colours come from the flag of Canada — red on white — warmed into paper and ink
so a full page of it is readable. The organic texture is drawn at run time rather
than shipped as images:

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

`assets/ant.svg` is the one drawing that is not generated: a lateral worker ant
traced from *Scheme ant worker anatomy* by Mariana Ruiz (LadyofHats) on Wikimedia
Commons, which is public domain. Labels, leader lines and colour bands were
stripped and the palette was fixed to the hackathon band's two colours, so it
renders correctly through an `<img>` tag with no CSS context. The maple leaf it
carries is a separate overlay, positioned so its stem meets the mandibles.

## Data sources

- **Timetable** — the Workshop Schedule tab of the ALIFE 2026 schedule sheet.
  That sheet carries EDT only, so CEST and JST are derived at render time
  (EDT + 6 and EDT + 13).
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

`WORKSHOP` is a list of sessions, each with a `label`, a `span` and `rows` of
`edt` / `session` / `speaker`. A row whose `session` matches `break` is styled as
a break automatically; a `speaker` that matches a talk in `TALKS` becomes a link
that opens that abstract; an empty `session` renders as a continuation of the row
above.

The order of `TALKS` is the running order shown on the page — reorder the array
to reorder the lineup. The organiser list lives in `BOARD` at the top of `main.js`.

## Deploying

Any static host. For GitHub Pages: Settings → Pages → *Deploy from a branch* →
`main` / `root`. The `.nojekyll` file keeps Pages from reinterpreting anything.

## Credits

Logos belong to ERA, ALIFE 2026 and ISAL. The flag of Canada and the worker-ant
drawing are public domain. Abstracts and bios are published with the speakers'
consent.
