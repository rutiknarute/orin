# Orin

Orin is a dependency-free local full-stack product-compliance workspace. One Node.js process serves the interface and API, so there is no separate frontend, hosted database, UI CDN, or external runtime to configure.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo credentials:

- Email: `maya@orin.demo`
- Password: `orin-demo`

If port 3000 belongs to another application, use:

```bash
PORT=3001 npm run dev
```

Starting Orin twice on the same port is safe: the second command reports that Orin is already running instead of throwing an `EADDRINUSE` stack trace.

Editing `public/index.html`, `public/app.css`, or `public/app.js` takes effect on the next page reload — no restart needed. Set `NODE_ENV=production` to serve the copies held in memory from startup instead.

## Interface

The UI is plain HTML, CSS, and ES modules. There is no build step, framework, icon package, or web font: icons are inline SVG and type uses the system font stack, so the interface renders identically whether or not the machine is online.

`public/app.css` is organised as a design system. Colour, type scale, weight, spacing, radius, and elevation are declared once as custom properties at the top of the file, and every rule below draws from them — no literal colours or one-off font sizes appear outside `:root`.

The palette is a white page with near-black text and a single brand accent, `#ff5888` (`--pink-400`), reserved for buttons, the active nav item, and small accent marks. It is deliberately not used for body copy: `#ff5888` reaches only 3.0:1 against white, which is below the 4.5:1 needed for normal-size text.

The landing page illustration lives at `public/hero-supply-chain.jpg`. It is declared as an optional asset: if the file is missing the server logs a notice and serves 404 for that one path instead of failing to start.

Chrome that floats over scrolling content — the marketing and passport navbars, the workspace header, the mobile tab bar, and the toast — uses a translucent `backdrop-filter` surface driven by the `--glass-*` tokens. The translucency is held at 78% so those surfaces stay legible in browsers that do not support `backdrop-filter`.

## Verify

```bash
npm run check
npm test
```

The app includes local session authentication, product and evidence APIs, document analysis, product records, and public digital product passports. Saved evidence and queued reminders persist locally in the ignored `data/runtime.json` file; no hosted database is required.
