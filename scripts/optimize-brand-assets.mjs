/**
 * Rebuilds the shipped brand images from the master artwork in `assets/brand/`.
 *
 * The masters are 1254x1254 boards that carry a lot of empty space; the site
 * only ever shows one region of each. This crops to that region and writes a
 * palette PNG sized for a 3x display, which is what actually reaches a browser.
 *
 * Usage: node scripts/optimize-brand-assets.mjs
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "assets/brand");
const out = join(root, "public");

/**
 * Crop windows measured from the master boards. These match the offsets the
 * stylesheet used to apply at render time, so the visible artwork is identical.
 */
const targets = [
  {
    name: "logo_orin_horizontal-wordmark_20260428_full-color.png",
    crop: { left: 159, top: 405, width: 934, height: 429 },
    width: 468,
  },
  {
    name: "logo_orin_icon-mark_20260428_full-color.png",
    // Only drawn at 48px in-page, and used as the 180px app icon.
    crop: { left: 302, top: 251, width: 649, height: 663 },
    width: 192,
  },
];

await mkdir(out, { recursive: true });

for (const { name, crop, width } of targets) {
  const info = await sharp(join(source, name))
    .extract(crop)
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
    .toFile(join(out, name));

  console.log(
    `${name} -> ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} kB`,
  );
}
