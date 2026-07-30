/**
 * Build-time risograph halftone for a full-bleed cover plate.
 *
 * Currently unreferenced: the home page dropped its photographic cover for
 * the whale mark, so nothing imports `halftones.generated.ts` right now. The
 * pipeline and its output are kept for the next page that wants a screened
 * plate; delete both if that never comes.
 *
 * Runs once at build (npm run halftone) and writes flat PNGs to
 * public/images/halftone/. Nothing here happens in the browser or on the
 * Worker — the page just serves a static image.
 *
 * This is a real colour separation, not a greyscale screen: the source is
 * split into cyan, magenta and yellow, each gets its own dot lattice at its
 * own traditional angle, and the inks are composited by multiplying their
 * transmittances the way wet ink actually overprints. Where two screens
 * overlap you get the secondaries — cyan over yellow reads green, magenta
 * over yellow reads red — and the offset angles produce the rosette that
 * makes early colour printing recognisable.
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SRC_ROOT = "public/images/series";
const OUT_ROOT = "public/images/halftone";
const MANIFEST = "src/lib/halftones.generated.ts";

/**
 * Output widths, ascending; dots are sized in output pixels, so every width
 * is screened from the source again rather than resampled from a larger
 * render (resampling would smear the dot lattice).
 *
 * A halftone is irreducibly high-frequency, so lossy WebP blurs the dots and
 * lossless WebP barely beats PNG — measured 2.0 MB vs 0.9 MB at 1800px. The
 * palette PNG wins outright, and the hero caps at 1350w (≈1.5x its display
 * slot): a screen upscaled slightly just reads as a coarser print.
 */
const WIDTHS = [900, 1350];
/**
 * A 4×5 sheet held landscape is 5:4. The source frames are 4:3, so this
 * trims a little off the top and bottom rather than turning them upright.
 */
const RATIO = 5 / 4;
/** Distance between dot centres, in output px. Larger = coarser, cheaper print. */
const CELL = 7;
/**
 * Tone curve on ink coverage. Above 1 it holds the highlights open — without
 * it the sky fills in with dots and the picture turns into a test chart.
 */
const GAMMA = 1.05;
/**
 * Under-colour removal: pull some of the grey component out of C/M/Y and
 * print it as black instead. Without it, shadows go muddy brown; with too
 * much, the picture loses the colour that is the whole point here.
 */
const UCR = 0.35;

/** Paper is the site's own ground, so the sheet sits flat on the page. */
const PAPER = [250, 248, 244];

/**
 * Screen angle per ink, and how much of each RGB channel survives passing
 * through it. Yellow rides at 0°, the other screens are offset far enough
 * that their lattices never coincide.
 */
const INKS = [
  { name: "cyan", angle: 15, transmit: [0.11, 0.67, 0.92] },
  { name: "magenta", angle: 75, transmit: [0.93, 0.13, 0.56] },
  { name: "yellow", angle: 0, transmit: [1.0, 0.95, 0.11] },
  { name: "black", angle: 45, transmit: [0.16, 0.15, 0.15] },
].map((ink) => ({
  ...ink,
  cos: Math.cos((ink.angle * Math.PI) / 180),
  sin: Math.sin((ink.angle * Math.PI) / 180),
}));

/**
 * Dot area — not radius — is what the eye integrates, so the radius goes as
 * the square root of coverage. 0.62 lets a fully inked cell close up solid.
 */
const RADIUS_SCALE = CELL * 0.66;

async function halftone(inputPath, outputPath, width) {
  const height = Math.round(width / RATIO);

  const { data: rgb } = await sharp(inputPath)
    .rotate()
    .resize(width, height, { fit: "cover", position: "attention" })
    // A touch more contrast and saturation before separating, so the inks
    // have something to bite on once the screen throws most of the tone away.
    .linear(1.1, -12)
    .modulate({ saturation: 1.2 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Per-ink coverage maps, sampled once per pixel from the source.
  const coverage = INKS.map(() => new Float32Array(width * height));

  for (let i = 0, p = 0; p < width * height; p++, i += 3) {
    let c = 1 - rgb[i] / 255;
    let m = 1 - rgb[i + 1] / 255;
    let y = 1 - rgb[i + 2] / 255;

    const k = Math.min(c, m, y) * UCR;
    c -= k;
    m -= k;
    y -= k;

    coverage[0][p] = Math.pow(Math.max(0, c), GAMMA);
    coverage[1][p] = Math.pow(Math.max(0, m), GAMMA);
    coverage[2][p] = Math.pow(Math.max(0, y), GAMMA);
    coverage[3][p] = Math.pow(Math.max(0, k), GAMMA);
  }

  const out = Buffer.alloc(width * height * 3);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = PAPER[0];
      let g = PAPER[1];
      let b = PAPER[2];

      for (let n = 0; n < INKS.length; n++) {
        const { cos, sin, transmit } = INKS[n];

        // Into this ink's screen space, snap to its nearest lattice node.
        const rx = x * cos + y * sin;
        const ry = -x * sin + y * cos;
        const nx = Math.round(rx / CELL) * CELL;
        const ny = Math.round(ry / CELL) * CELL;

        // Back to image space to read that node's coverage.
        const sx = Math.min(width - 1, Math.max(0, Math.round(nx * cos - ny * sin)));
        const sy = Math.min(height - 1, Math.max(0, Math.round(nx * sin + ny * cos)));

        const radius = Math.sqrt(coverage[n][sy * width + sx]) * RADIUS_SCALE;
        const dx = rx - nx;
        const dy = ry - ny;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // One pixel of feathering at the dot edge keeps it from aliasing.
        const ink = Math.min(1, Math.max(0, radius - dist));
        if (ink <= 0) continue;

        // Ink laid down: interpolate toward this ink's transmittance.
        r *= 1 - ink * (1 - transmit[0]);
        g *= 1 - ink * (1 - transmit[1]);
        b *= 1 - ink * (1 - transmit[2]);
      }

      const o = (y * width + x) * 3;
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = b;
    }
  }

  await sharp(out, { raw: { width, height, channels: 3 } })
    .png({ compressionLevel: 9, palette: true, colours: 128, dither: 0 })
    .toFile(outputPath);

  const { size } = fs.statSync(outputPath);
  console.log(
    `  ${path.basename(outputPath)}  ${width}×${height}  ${(size / 1024).toFixed(0)} KB`,
  );
}

/** First frame of a series stands in for it. */
function pickFrame(dir) {
  const files = fs
    .readdirSync(dir)
    .filter(
      (f) =>
        f.endsWith(".webp") && !/_(800|1600)\.webp$/.test(f) && !f.startsWith("cover"),
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files[0] ? path.join(dir, files[0]) : null;
}

fs.mkdirSync(OUT_ROOT, { recursive: true });
console.log(
  "CMYK screen: %dpx cell, angles %s",
  CELL,
  INKS.map((i) => `${i.name[0].toUpperCase()}${i.angle}°`).join(" "),
);

// OUT_ROOT holds only generated sheets — wipe it so renamed or removed
// series never leave orphans behind.
for (const stale of fs.readdirSync(OUT_ROOT)) {
  fs.rmSync(path.join(OUT_ROOT, stale));
}

const manifest = {};

for (const id of fs.readdirSync(SRC_ROOT).sort()) {
  const dir = path.join(SRC_ROOT, id);
  if (!fs.statSync(dir).isDirectory()) continue;

  const frame = pickFrame(dir);
  if (!frame) continue;

  for (const width of WIDTHS) {
    await halftone(frame, path.join(OUT_ROOT, `${id}_${width}.png`), width);
  }

  const widest = WIDTHS[WIDTHS.length - 1];
  manifest[id] = {
    src: `/images/halftone/${id}_${widest}.png`,
    srcSet: WIDTHS.map((w) => `/images/halftone/${id}_${w}.png ${w}w`).join(
      ", ",
    ),
    width: widest,
    height: Math.round(widest / RATIO),
  };
}

const lines = [
  "/**",
  " * Generated from public/images/halftone by scripts/build-halftone.mjs.",
  " * Do not edit by hand — re-run `npm run halftone` instead.",
  " */",
  "",
  "export type Halftone = {",
  "  src: string;",
  "  srcSet: string;",
  "  width: number;",
  "  height: number;",
  "};",
  "",
  "export const HALFTONES: Record<string, Halftone> = {",
];

for (const [id, sheet] of Object.entries(manifest)) {
  lines.push(
    `  ${JSON.stringify(id)}: { src: "${sheet.src}", srcSet: ${JSON.stringify(sheet.srcSet)}, width: ${sheet.width}, height: ${sheet.height} },`,
  );
}

lines.push("};", "");

fs.writeFileSync(MANIFEST, lines.join("\n"));
console.log(`wrote ${MANIFEST} — ${Object.keys(manifest).length} sheets`);
