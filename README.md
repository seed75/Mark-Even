# Even & Mark

Redesign concept site for [evenandmark.com.au](https://evenandmark.com.au/) — an association PCO (professional conference organiser) and marketing agency based in Melbourne, working across Australia & Aotearoa New Zealand.

## Concept

The whole page is staged as one conference day, 08:00 to 17:30. The hero spells the brand name out of its own offer — **EVEN**T & **MARK**ETING — and every section carries a run-sheet timecode instead of a generic label. Services are shown as a two-track program (event delivery vs. marketing) running in parallel phases from six months out to the post-event wrap.

Motion reinforces the same idea:

- A split-flap header clock ticks from 08:00 to 17:30 as you scroll.
- The background light shifts from morning to golden hour to night, in sync with the clock.
- Hovering the hero wordmark cuts the lights — the venue goes dark and the sign glows.
- Two duotone photo bands (cobalt morning / signal-orange evening) with film grain mark the "plenary" and "closing drinks" moments.

All motion respects `prefers-reduced-motion`.

## Stack

Single static file, no build step or dependencies.

- `index.html` — markup, styles, and script in one file
- Fonts: Archivo (display/body) and Spline Sans Mono (run-sheet timecodes), loaded from Google Fonts

## Running locally

```
python3 -m http.server 4173
```

Then open `http://localhost:4173`. (`.claude/launch.json` defines the same command for the Claude Code preview tool.)

## Deploying

Static HTML — drop `index.html` on any static host (Vercel, Netlify, GitHub Pages, etc.) with no build step required.
