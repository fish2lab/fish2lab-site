// 制品区的纸纹：三张 1024 px 见方的无缝 WebP（CSS 里按 512px 铺，视网膜屏一比一）。
// 做法照 sukima-book web/core/paper.js 的 grain()：逐像素的细颗粒（r·r 偏向亮端），加一层短棉纤维，
// 再叠一层很淡的云状起伏，像棉浆纸（Photo Rag）对着光看的样子。纤维按 1024 取模画，左右上下接缝对得上。
//   node scripts/sukima/make-paper.mjs
import sharp from 'sharp';

const N = 1024;
const OUT = new URL('../../src/components/sukima/woodcut/assets/', import.meta.url);

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** 周期为 N 的云：几组整数频率的正弦叠加，天然无缝 */
function cloud(r) {
  const waves = Array.from({ length: 14 }, () => ({ fx: 1 + Math.floor(r() * 6), fy: 1 + Math.floor(r() * 6), p: r() * 6.283, a: 0.3 + r() }));
  const sum = waves.reduce((t, w) => t + w.a, 0);
  return (x, y) => waves.reduce((t, w) => t + w.a * Math.sin(((w.fx * x + w.fy * y) / N) * 6.283 + w.p), 0) / sum;
}

/**
 * base：纸色 [r, g, b]；grain：颗粒深度（0..255）；fibre：纤维颜色和数量；light：反相（墨底上的纤维是亮的）
 */
function tile({ base, grain, mottle, fibres, fibreCol, fibreAlpha, seed, light = false }) {
  const r = rng(seed);
  const buf = new Float32Array(N * N * 3);
  const cl = cloud(r);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const i = (y * N + x) * 3;
      const g = r() * r() * grain;
      const m = cl(x, y) * mottle;
      const d = light ? g * 0.6 + m : -g + m;
      buf[i] = base[0] + d;
      buf[i + 1] = base[1] + d - (light ? 0 : g * 0.04);
      buf[i + 2] = base[2] + d - (light ? 0 : g * 0.12);
    }
  // 纤维：二次曲线，沿线按半像素步长双线性地点上去
  const splat = (x, y, a) => {
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    for (const [dx, dy, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
      const px = (((x0 + dx) % N) + N) % N, py = (((y0 + dy) % N) + N) % N, i = (py * N + px) * 3, k = a * w;
      for (let c = 0; c < 3; c++) buf[i + c] += (fibreCol[c] - buf[i + c]) * k;
    }
  };
  for (let f = 0; f < fibres; f++) {
    const x = r() * N, y = r() * N, ang = r() * 6.283, L = 8 + r() * 34, bend = (r() - 0.5) * 1.4;
    const mx = x + Math.cos(ang + bend) * L * 0.5, my = y + Math.sin(ang + bend) * L * 0.5;
    const ex = x + Math.cos(ang) * L, ey = y + Math.sin(ang) * L;
    const a = fibreAlpha * (0.4 + r() * 0.8);
    const steps = Math.ceil(L * 2);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps, u = 1 - t;
      splat(u * u * x + 2 * u * t * mx + t * t * ex, u * u * y + 2 * u * t * my + t * t * ey, a * Math.sin(Math.PI * t) ** 0.5);
    }
  }
  const out = Buffer.alloc(N * N * 3);
  for (let i = 0; i < buf.length; i++) out[i] = Math.max(0, Math.min(255, Math.round(buf[i])));
  return out;
}

const tiles = {
  // 画廊墙、页面底：偏白的暖灰纸
  'grain-wall.webp': { base: [246, 243, 236], grain: 16, mottle: 2.2, fibres: 5200, fibreCol: [168, 152, 128], fibreAlpha: 0.04, seed: 7 },
  // 卡片、展签：棉浆纸本色，比墙暖一档
  'grain-paper.webp': { base: [239, 234, 222], grain: 20, mottle: 2.8, fibres: 6400, fibreCol: [150, 132, 106], fibreAlpha: 0.05, seed: 11 },
  // 黑场：墨色，纤维是亮的
  'grain-ink.webp': { base: [26, 25, 23], grain: 14, mottle: 1.6, fibres: 3200, fibreCol: [92, 86, 76], fibreAlpha: 0.08, seed: 13, light: true },
};

for (const [name, opt] of Object.entries(tiles)) {
  const raw = tile(opt);
  await sharp(raw, { raw: { width: N, height: N, channels: 3 } }).webp({ quality: 82, effort: 6 }).toFile(new URL(name, OUT).pathname);
  console.log(name);
}
