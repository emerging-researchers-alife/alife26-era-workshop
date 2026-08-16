# ERA @ ALIFE 2026

Site for the **ERA (Emerging Researchers in Artificial Life) workshop** at
**ALIFE 2026** — Tuesday 18 August 2026, Room 5, Waterloo, Ontario. Nine
lightning talks and the **Emerg-ant hackathon**.

Plain HTML, CSS and JavaScript. No build step, no dependencies, nothing fetched
from another host. Open `index.html` and it works.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page. Holds the maple-leaf `<symbol>` that everything else reuses. |
| `styles.css` | Tokens and layout. Light and dark themes come from one set of custom properties. |
| `main.js` | Builds the programme and draws every pattern on the page. |
| `data.js` | Generated content: the timetable and the nine talks. |
| `assets/` | ERA, ALIFE 2026 and ISAL logos, the flag of Canada, the favicon. |

## Design

A letterpress poster, essentially: cream paper, Canada red, ink black, heavy
condensed capitals for anything that shouts, and a grain over the whole thing.
The header is one solid red block, and the hackathon band runs straight into the footer.

Everything organic is drawn at run time rather than shipped as an image:

- **Cell tissue**, behind every band — a honeycomb whose vertices are jittered
  through a shared lookup table, so neighbouring cells keep their shared walls.
  The hero flips `--tissue-line` to white and gets the same pattern in reverse.
- **A helix rule** under the header — two strands crossing, no over-and-under.
- **Organelle watermarks** — a wobbly membrane, a nucleus, mitochondria with
  cristae, a scatter of vesicles, half off the edge of the page.
- **Paper grain** — an `feTurbulence` overlay fixed to the viewport.

All of it honours `prefers-reduced-motion` and `prefers-color-scheme`.

The one drawing that is not a pattern is the ant in the hackathon band: flat
shapes, round head, no mandibles and no spines, carrying a maple leaf over its
shoulder. It is inline SVG in `index.html` so it takes its colours from the band
it sits on.

## The programme

The timetable and the talk list are the same thing — one rail of slots, each
talk opening its abstract in place. Times come from the workshop schedule sheet,
which carries EDT only, so CEST and JST are derived at render time (EDT + 6 and
EDT + 13).

## Data

- **Timetable** — the Workshop Schedule tab of the ALIFE 2026 schedule sheet.
- **Talks** — the ERA submission sheet. Only the name, affiliation, title,
  abstract, bio and public link are published. Email addresses, consent answers
  and notes to the organisers are not in `data.js` and never reach the page.

### Editing

`data.js` is generated but it is ordinary readable JavaScript, so a title fix or
a new talk can go in directly. Each talk is:

```js
{
  name: "…", url: "…" | null, urlLabel: "…" | null,
  affiliation: "…", title: "…",
  abstract: ["paragraph", "paragraph"],
  bio: "…"
}
```

`WORKSHOP` is a list of sessions, each with a `label`, a `span` and `rows` of
`edt` / `session` / `speaker`. A `speaker` matching a talk in `TALKS` turns that
slot into a button which opens the abstract; anything else renders as a plain
row, and a row whose session mentions the hackathon links to its section.

A scheduled speaker with no entry in `TALKS` shows as the name alone. Give that
row an optional `title` and it reads like the others — title on top, speaker
underneath — still without a panel, since there is no abstract to open.

## Deploying

Any static host. For GitHub Pages: Settings → Pages → *Deploy from a branch* →
`main` / `root`. The `.nojekyll` file keeps Pages from reinterpreting anything.

## Credits

Logos belong to ERA, ALIFE 2026 and ISAL. The maple leaf is traced from the
public-domain flag of Canada. Abstracts and bios are published with the
speakers' consent.
