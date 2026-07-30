/**
 * Scans public/images/series and writes src/lib/series-frames.generated.ts.
 *
 * The diary export already ships responsive variants (`_800`, `_1600`), so the
 * gallery uses a plain srcset instead of next/image — no runtime image
 * optimisation is needed on the Worker at all.
 *
 * Frames that arrive as full-resolution medium-format originals (wider than
 * any slot the layout can offer them) get their missing variants generated
 * here, and the original itself is left out of the srcset — otherwise a
 * retina browser would happily pull a multi-megabyte 11k file for a 62rem
 * column.
 *
 * Run after adding or replacing frames:  npm run series:manifest
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const ROOT = "public/images/series";
const OUT = "src/lib/series-frames.generated.ts";

/** Variants the srcset is built from, ascending. */
const STEPS = [800, 1600, 2560];
/** Widest original offered as-is; anything larger is served by its steps. */
const MAX_ORIGINAL = STEPS[STEPS.length - 1];

const isVariant = (file) => /_(800|1600|2560)\.webp$/.test(file);
const byNatural = (a, b) => a.localeCompare(b, undefined, { numeric: true });

const series = {};

for (const id of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, id);
  if (!fs.statSync(dir).isDirectory()) continue;

  const frames = fs
    .readdirSync(dir)
    .filter(
      (file) =>
        file.endsWith(".webp") && !isVariant(file) && !file.startsWith("cover"),
    )
    .sort(byNatural);

  series[id] = [];

  for (const file of frames) {
    const stem = file.replace(/\.webp$/, "");
    const base = `/images/series/${id}/${stem}`;
    const filePath = path.join(dir, file);
    const { width, height } = await sharp(filePath).metadata();

    // Fill in any missing steps smaller than the original.
    for (const step of STEPS) {
      if (step >= width) continue;
      const variant = path.join(dir, `${stem}_${step}.webp`);
      if (fs.existsSync(variant)) continue;

      await sharp(filePath)
        .resize(step, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(variant);
      console.log(`  + ${id}/${stem}_${step}.webp`);
    }

    // Re-scan now that steps may have been created above.
    const present = new Set(fs.readdirSync(dir));

    const candidates = STEPS.filter((step) => step < width).map((step) =>
      present.has(`${stem}_${step}.webp`)
        ? `${base}_${step}.webp ${step}w`
        : null,
    );
    // Oversized originals stay on disk but out of the srcset; the steps
    // above already top out at MAX_ORIGINAL.
    if (width <= MAX_ORIGINAL) candidates.push(`${base}.webp ${width}w`);

    series[id].push({
      src: `${base}.webp`,
      srcSet: candidates.filter(Boolean).join(", "),
      width,
      height,
      portrait: height > width,
    });
  }
}

const lines = [
  "/**",
  " * Generated from public/images/series by scripts/build-series-manifest.mjs.",
  " * Widths come from the actual files so galleries reserve the right space.",
  " * Do not edit by hand — re-run `npm run series:manifest` instead.",
  " */",
  "",
  "export type Frame = {",
  "  src: string;",
  "  srcSet: string;",
  "  width: number;",
  "  height: number;",
  "  portrait: boolean;",
  "};",
  "",
  "export const SERIES_FRAMES: Record<string, Frame[]> = {",
];

for (const [id, frames] of Object.entries(series)) {
  lines.push(`  ${JSON.stringify(id)}: [`);
  for (const f of frames) {
    lines.push(
      `    { src: "${f.src}", srcSet: ${JSON.stringify(f.srcSet)}, width: ${f.width}, height: ${f.height}, portrait: ${f.portrait} },`,
    );
  }
  lines.push("  ],");
}

lines.push("};", "");

fs.writeFileSync(OUT, lines.join("\n"));
console.log(
  `wrote ${OUT} — ${Object.keys(series).length} series, ${Object.values(series).flat().length} frames`,
);
