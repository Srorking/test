# Thank you, Prime Tech family

A frontend-only farewell website: 3D scene (Three.js), motion, bilingual (English / العربية with RTL),
a draggable 3D sphere of names, and a special **Team AI** section.
No backend, no build step needed to run it — it is just static files.

## Preview locally

```bash
# option 1: just double-click index.html
# option 2: a tiny local server
python3 -m http.server 8080   # then open http://localhost:8080
```

## Make it yours — edit ONE file: `js/content.js`

| What                     | Where in `js/content.js`            |
| ------------------------ | ----------------------------------- |
| Your name / company      | `name`, `company`                   |
| Last-day date            | `lastDay` (`YYYY-MM-DD`)            |
| Company logo             | `logo` (see below)                  |
| Names on the 3D sphere   | `people`                            |
| Names in the Team AI row | `aiTeam`                            |
| GitHub / LinkedIn / etc. | `contacts` (empty = button hidden)  |
| Every text on the page   | `text.en` and `text.ar`             |

**Logo:** copy your logo into `assets/` (for example `assets/logo.png`) and set
`logo: 'assets/logo.png'`. The bundled `assets/logo.svg` is only a placeholder.

**Language links:** `.../?lang=ar` opens Arabic, `.../?lang=en` opens English.
Without the parameter, the site follows the visitor's browser language.

## Publish on GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**.
3. Pick the branch (and folder `/ (root)`), then **Save**.
4. After a minute the site is live at `https://<user>.github.io/<repo>/`.

> The link preview image (`og.jpg`) and the `og:url` / `canonical` tags in `index.html`
> point to `https://srorking.github.io/test/`. If you rename the repo or use another
> account, update those three URLs.

## Project structure

```
index.html          page skeleton (texts come from content.js)
css/style.css       design system, layout, animations
js/content.js       <- your content (edit this)
js/main.js          i18n, rendering, scroll motion, name sphere, neural canvas, confetti
js/scene.js         built 3D scene bundle (generated - do not edit by hand)
src/scene.js        3D scene source (Three.js + GLSL shaders)
assets/             logo + self-hosted fonts
```

Only if you change `src/scene.js`: `npm install && npm run build` regenerates `js/scene.js`.

## Notes

- Works without WebGL (the 3D layer is skipped and the page still looks good).
- Respects `prefers-reduced-motion`.
- Fonts (Space Grotesk, Inter, Cairo — SIL OFL) and Three.js (MIT) are bundled locally,
  so the page makes no third-party requests.
