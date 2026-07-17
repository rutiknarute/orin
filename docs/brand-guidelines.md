# Orin Brand Guidelines v2.0

> Last updated: July 16, 2026
> Status: Product source of truth

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #0A172D |
| Secondary Color | #33415C |
| Accent Color | #064AE4 |
| Editorial Font | Playfair Display |
| Product/UI Font | Inter |
| Voice | Clear, composed, evidence-led |

## 1. Brand Idea

Orin turns fragmented supply-chain evidence into one connected, reviewable product record. The brand should feel structured enough for compliance teams and clear enough for supplier collaboration.

**Primary message:** Every supplier answer. One trusted product record.

**Supporting messages:**

- See the complete evidence chain from raw material to finished product.
- Find missing or conflicting information before it becomes an audit problem.
- Turn documents into structured, reviewable product data.
- Move from origin to compliance with a visible trail of evidence.

## 2. Color Palette

The palette is sampled from the supplied Orin identity board and extended with accessible product states.

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Orin Navy | #0A172D | rgb(10,23,45) | Navigation, primary text, high-trust surfaces |
| Orin Navy Dark | #061126 | rgb(6,17,38) | Hover states, dark canvas |
| Orin Navy Light | #13233F | rgb(19,35,63) | Elevated dark surfaces |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Slate | #33415C | rgb(51,65,92) | Secondary controls and labels |
| Mist Blue | #DCE8FF | rgb(220,232,255) | Selected surfaces and highlights |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Orin Blue | #064AE4 | rgb(6,74,228) | Primary CTAs, links, focus, data flow |
| Orin Blue Light | #3E92F4 | rgb(62,146,244) | Dark-surface accents and progress |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Canvas | #F5F7FB | rgb(245,247,251) | App background |
| Surface | #FFFFFF | rgb(255,255,255) | Cards and sheets |
| Text | #111827 | rgb(17,24,39) | Primary content |
| Muted Text | #5B667A | rgb(91,102,122) | Supporting content |
| Border | #DDE4EE | rgb(221,228,238) | Dividers and component edges |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #14866D | Verified, complete, approved |
| Warning | #B86F00 | Review needed, expiring, incomplete |
| Error | #C83B4D | Conflict, failure, destructive action |
| Info | #2463EB | Informational status and processing |

### Accessibility

- Use Orin Navy for body text on white and Canvas surfaces.
- Use white text on Orin Navy and Orin Blue.
- Never rely on status color alone; pair color with an icon and label.
- Interactive focus rings use Orin Blue at a minimum 2px width.

## 3. Typography

```css
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: ui-monospace, 'SFMono-Regular', monospace;
```

| Element | Desktop | Mobile | Weight | Line Height |
|---------|---------|--------|--------|-------------|
| Display | 76px | 46px | 500 | 0.98 |
| H1 | 54px | 38px | 500 | 1.04 |
| H2 | 42px | 30px | 500 | 1.12 |
| H3 | 24px | 22px | 600 | 1.25 |
| Body | 16px | 16px | 400 | 1.55 |
| Small | 14px | 14px | 500 | 1.45 |
| Caption | 12px | 12px | 600 | 1.35 |

Use Playfair Display for marketing headlines and major editorial moments. Use Inter for product screens, data, labels, controls, and all reading. This division keeps the fashion expression distinctive without reducing operational clarity. Keep body copy under 72 characters per line.

## 4. Logo Usage

The dedicated transparent Orin wordmark and standalone mark are the approved product assets. Use the full wordmark in headers, footers, sign-in surfaces, and branded navigation. Use the standalone mark for favicons, app icons, and compact placements.

- Preserve the logo's original proportions and colors.
- Keep clear space equal to the height of the Orin mark.
- Use the supplied assets on white, Canvas, or a clean white surface tile.
- On Orin Navy, place the full-color logo on a white surface tile because a reversed variant has not been supplied.
- Minimum full-logo width: 120px.
- Minimum standalone-mark width: 32px.
- Approved files: `public/logo_orin_horizontal-wordmark_20260428_full-color.png` and `public/logo_orin_icon-mark_20260428_full-color.png`.

## 5. Voice and Tone

| Trait | We are | We are not |
|-------|--------|------------|
| Clear | Plain-language and specific | Regulatory jargon first |
| Composed | Calm about risk | Alarmist or dramatic |
| Evidence-led | Shows the source and next action | Makes unsupported claims |
| Collaborative | Helps teams and suppliers move forward | Blaming or punitive |

UI copy follows the pattern: **what happened → why it matters → what to do next**.

## 6. Product Components

- Buttons: 14px radius; primary blue; 48px default height and clear pressed state.
- Cards: 22px radius; visible hairline border; restrained layered shadow.
- Inputs: 14px radius; always-visible label; 50px minimum height.
- Status pills: icon plus label; never color-only.
- Icons: Phosphor outline set, 1.5-2px visual weight.
- Motion: 160-280ms for UI state changes; transform and opacity only.

## 7. Visual Language

Use an asymmetric editorial grid, connected nodes, evidence layers, scanning lines, quiet technical textures, and modular product data. Let typography, negative space, and one cobalt accent carry the composition. Avoid stock dashboard imagery, decorative blobs, excessive glassmorphism, generic equal-sized cards, and dense walls of metrics.

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | July 16, 2026 | Introduced the editorial-bento web system, Playfair Display + Inter typography, larger controls, and refined surface tokens |
| 1.2 | July 16, 2026 | Replaced RGB exports with lighter transparent PNG assets |
| 1.1 | July 16, 2026 | Replaced identity-board crops with the dedicated wordmark and standalone mark |
| 1.0 | July 16, 2026 | Initial product brand system derived from the supplied Orin identity |
