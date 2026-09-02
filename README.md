# eric wu — personal site

Vite + React + TypeScript. Minimal, serif, deep olive.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Layout

The home page is a single hero, vertically centered at every viewport size.
On load the reveal runs one stage at a time, each waiting for the last to
settle: the name types itself out, the subtitle fades in, then the nav tabs
fade in. That reveal stands in for an "about" page, which is why there isn't
an about tab.

```
src/
  App.tsx                routes + the crossfade between them
  content.ts             all project/note copy lives here
  components/
    TextType.tsx         typewriter
    AnimatedContent.tsx  fade (or slide) reveal, gated by a `show` prop
    Nav.tsx              the four tabs
    SiteFooter.tsx       icons, tron webring, copyright
    Thumb.tsx            image slot, placeholder box until a file exists
    Embed.tsx            16:9 YouTube frame
  pages/
    Home.tsx
    Projects.tsx  ProjectDetail.tsx
    EntryList.tsx EntryDetail.tsx   shared by /notes and /work
    NotFound.tsx
  index.css              all styling
  intro.ts  useReducedMotion.ts
```

Routes: `/`, `/projects`, `/projects/:slug`, `/work`, `/work/:slug`, `/notes`,
`/notes/:slug`.

`work` and `notes` are the same shape — `{ slug, title, date, body }` — so both
routes share `EntryList` / `EntryDetail`, parameterised by `heading`, `basePath`
and `entries`. Projects keep their own richer type (images, video, links).

`SiteFooter` renders outside `.route`, so it stays put during the page crossfade
instead of flickering on every navigation. It is visible immediately and does not
join the home page's reveal.

### Notes on the moving parts

`TextType` renders the finished string invisibly underneath the one being
typed, stacked in the same grid cell, so the line never resizes or reflows
mid-animation.

`signature.ts` holds Eric's signature as 8 recorded pointer strokes (150
`{x, y, t}` points, 4887ms). It is a captured artifact — keep it verbatim.
`Signature.tsx` replays it by animating each path's `stroke-dashoffset`, each
stroke keeping its own slice of the original timing scaled to ~2.4s, so the
real pauses between letters survive; an even stagger reads as a machine. Two
traps worth knowing:

- The paths must **not** use `vector-effect="non-scaling-stroke"`. Chrome then
  lays the dash pattern out in screen space while `getTotalLength()` reports
  user space, so on a scaled viewBox the tail of each path overruns its gap and
  shows as a stray tick before the stroke has started.
- The dash gap is `len + 4`, not `len`. With an exact `len` the path's end sits
  on a dash boundary and the round linecap draws a visible dot there.
- The i-dot is ~2 units long; strokes under `MIN_DASH_LENGTH` get an opacity
  fade instead, since a dash animation on them is invisible.

`intro.ts` is module-level state, deliberately. It holds both the greeting
picked for this page load and whether the intro has played. Both survive
client-side navigation — returning from `/projects` neither replays the
typing nor swaps the greeting — and both reset on a real reload.

The greeting is drawn from `GREETINGS` in that file, excluding whichever one
this tab showed last, so you never see the same line twice running. They are
**prefixes** — the name itself is the drawn signature beneath — so a new
variant should lead into it (`hey! i’m`), not stand alone.

`App.tsx` holds the outgoing page on screen for one 220ms fade before
swapping in the new one. `FADE_MS` there must match the `.route` transition
duration in `index.css`.

The reveal's pacing lives in three constants at the top of `Home.tsx`, both
stages hanging off the typewriter's `onComplete`:

```
0ms        500ms              1200ms        1700ms         2400ms
|-----------|------------------|--------------|--------------|
typing ends [ subtext fades in ]              [ tabs fade in ]
```

`AnimatedContent` defaults to `direction="none"` — a plain fade, no transform
emitted at all. The subtitle uses that; the tabs pass `direction="down"` and
cascade at `stagger` 70ms per tab.

## Interactions

**Terminal** (`Terminal.tsx`): a faint `> try typing…` hint sits under the
tabs — clicking it swaps it for a blinking caret (`> |`), and typing anywhere
on the home page fills the prompt either way; Enter runs it, Escape hands the
hint back. Commands: the four tabs, the footer targets, `help`, `whoami`,
`hi`, `nihao`/`你好`, `clear`. The tabs remain the real navigation — this is a
layer for the curious, dormant on touch devices (`useFinePointer`). Both
prompt lines are height-reserved so the centered hero never shifts.

Tried and removed: a cursor-following project-image preview on the projects
tab (rolled back by request). Still on the shelf: drifting fireflies, and a
light-cycles easter egg behind the Tron sparkle.

## Colors

Deep olive ground (`#2d3a1f`) with cream text (`#f5f2ea`) and an olive accent
(`#98a85e`), sampled from ericwu.work. The site commits to this one look
rather than following the OS light/dark setting.

An inverted cream-paper scheme ships alongside it: add `data-theme="cream"`
to `<html>` in `index.html` to switch.

## Content

Projects in `src/content.ts` are real, carried over from ericwu.work. A
project takes an optional `image` (a path under `public/`), an optional
`video` (a YouTube *embed* URL, which replaces the image on the detail page),
and optional `links` for collaborators or write-ups.

Images live in `public/` rather than being hotlinked, so the site stands on
its own. They were downscaled to 1600px on the long edge going in — the
BoxBots photo arrived as a 3.4MB, 3024×4032 phone shot.

## Footer

Arrangement: email · linkedin · ‹ tron ring › · github · x on one row, with
`© Eric Wu, <year>` centred beneath it. The sparkle sits on the page's exact
centerline — which relies on the flanks staying equal-width, so
add future icons in pairs (see the `.footer-icons` note in `index.css`). Icons
are inline SVG that inherit `currentColor`, so they theme with the page and cost
no requests. X: `https://x.com/ericwu132`.

The webring is the **Tron Webring** (`tronring.vercel.app`), carried over from
ericwu.work along with its three white PNGs. The links anchor to `ericwu.work`
— the URL registered in the ring — so **if this site moves to another domain,
the ring registration has to move with it or prev/next will break**. The
artwork is white, so the cream theme inverts it.

Still unused, should they ever earn a place:

```
devpost    https://devpost.com/ericwu132
instagram  https://www.instagram.com/ericwu132/
```

## To fill in

- The home page subtitle is still lorem ipsum
- `work` and `notes` are all still lorem ipsum
- Star Wars Droid is a stub — `blurb` only, empty `body`
