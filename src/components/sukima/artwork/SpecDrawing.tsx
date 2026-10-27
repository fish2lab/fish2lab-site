'use client';

import React, { useId, type ReactNode } from 'react';
import type { OfferImage, OfferSpec } from '@/lib/sukima/offers';
import styles from './SpecDrawing.module.css';

export interface SpecDrawingProps {
  spec: OfferSpec;
  /** 画芯：当前款式的东方版，分解图里印在画芯那一层上 */
  image: OfferImage;
}

/** 框条正面宽（cm），社团用的黑色铝合金框（sukima-book works.js FRAMING.rail） */
const RAIL = 1;

type Size = readonly [number, number];

/** 从「30 × 40 cm」「40x45cm Frame」「35x40cm 专业装裱」里取出尺寸，统一成竖幅（短边在前） */
function dims(s?: string): Size | null {
  const m = s?.match(/(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return a <= b ? [a, b] : [b, a];
}

const cm = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1).replace(/\.0$/, '')}`;
const pair = (s: Size) => `${cm(s[0])} × ${cm(s[1])}`;

interface Plan {
  kind: 'framed' | 'sheet' | 'digital';
  /** 外形：装框是框的外尺寸，只要画芯是纸张尺寸，数字版是像素 */
  outer: Size | null;
  /** 画面 */
  art: Size | null;
  /** 外形写不成数字时（「16寸画框」）原样标出来 */
  outerText?: string;
}

/**
 * 价目表的数据写法不统一（「画框尺寸: 40 × 50 cm」「16寸画框」「[14寸] 30.5 x 35.6 cm + 35x40cm 专业装裱」……），
 * 这里尽量从各个字段里认出外形和画面；认不出数字的地方只标代号，不编数字。
 */
function planOf(s: OfferSpec): Plan {
  if (s.digital) return { kind: 'digital', outer: dims(s.spec), art: dims(s.spec) };
  const framed = /framed|plan/.test(s.id);
  const [head, tail] = s.name.split('+');
  if (framed) {
    const outer = dims(s.type) ?? dims(s.spec) ?? dims(tail);
    const art = dims(s.imageSize) ?? dims(head);
    const outerText = outer ? undefined : (s.type?.replace(/^画框尺寸[:：]\s*/, '') ?? s.spec);
    return { kind: 'framed', outer, art, outerText };
  }
  const sheet = dims(s.spec) ?? dims(s.name);
  const art = dims(s.imageSize) ?? sheet;
  return { kind: 'sheet', outer: sheet ?? art, art };
}

/** 尺寸线：两头箭头，中间白底标字 */
function Dim({ x1, y1, x2, y2, label, side = 'top' }: { x1: number; y1: number; x2: number; y2: number; label: string; side?: 'top' | 'right' | 'left' }): ReactNode {
  const horiz = y1 === y2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const a = 4;
  const heads = horiz
    ? `M${x1 + a} ${y1 - a * 0.6}L${x1} ${y1}L${x1 + a} ${y1 + a * 0.6}M${x2 - a} ${y2 - a * 0.6}L${x2} ${y2}L${x2 - a} ${y2 + a * 0.6}`
    : `M${x1 - a * 0.6} ${y1 + a}L${x1} ${y1}L${x1 + a * 0.6} ${y1 + a}M${x2 - a * 0.6} ${y2 - a}L${x2} ${y2}L${x2 + a * 0.6} ${y2 - a}`;
  return (
    <g className={styles.dim}>
      <path d={`M${x1} ${y1}L${x2} ${y2}${heads}`} />
      {horiz ? (
        <text x={mx} y={my - 4} textAnchor="middle">
          {label}
        </text>
      ) : (
        <text x={side === 'left' ? mx - 5 : mx + 5} y={my} textAnchor={side === 'left' ? 'end' : 'start'} dominantBaseline="central">
          {label}
        </text>
      )}
    </g>
  );
}

/** 俯视的尺寸图（dimensional-drawing 的规矩：图上标代号，数字写在图下） */
function PlanView({ p }: { p: Plan }): ReactNode {
  const outer = p.outer ?? p.art ?? [30, 40];
  const art = p.art ?? outer;
  const k = 150 / outer[1];
  const W = outer[0] * k;
  const H = outer[1] * k;
  const ox = 58;
  const oy = 28;
  const aw = art[0] * k;
  const ah = art[1] * k;
  const ax = ox + (W - aw) / 2;
  const ay = oy + (H - ah) / 2;
  const f = p.kind === 'framed' ? RAIL * k : 0;
  const vbW = ox + W + 64;
  const vbH = oy + H + 40;
  return (
    <svg className={`${styles.svg} wc-mono`} viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label="尺寸图">
      <g className={styles.ink}>
        {/* 中心线 */}
        <path className={styles.centre} d={`M${ox + W / 2} ${oy - 14}V${oy + H + 14}M${ox - 14} ${oy + H / 2}H${ox + W + 14}`} />
        <rect x={ox} y={oy} width={W} height={H} className={p.kind === 'framed' ? styles.outer : styles.sheet} />
        {p.kind === 'framed' ? (
          <>
            <rect x={ox + f} y={oy + f} width={W - 2 * f} height={H - 2 * f} className={styles.matFill} />
            <path className={styles.thin} d={`M${ox} ${oy}l${f} ${f}M${ox + W} ${oy}l${-f} ${f}M${ox} ${oy + H}l${f} ${-f}M${ox + W} ${oy + H}l${-f} ${-f}`} />
          </>
        ) : null}
        <rect x={ax} y={ay} width={aw} height={ah} className={styles.art} />
        {/* 尺寸线 */}
        <Dim x1={ox} y1={oy - 16} x2={ox + W} y2={oy - 16} label={p.kind === 'digital' ? 'W px' : 'W'} />
        <Dim x1={ox + W + 16} y1={oy} x2={ox + W + 16} y2={oy + H} label={p.kind === 'digital' ? 'H px' : 'H'} side="right" />
        {p.kind !== 'digital' && (aw < W - 0.5 || ah < H - 0.5) ? (
          <>
            <Dim x1={ax} y1={oy + H + 18} x2={ax + aw} y2={oy + H + 18} label="A" />
            {p.kind === 'framed' ? (
              <>
                <Dim x1={ox - 14} y1={oy} x2={ox - 14} y2={oy + f} label="F" side="left" />
                <Dim x1={ox - 14} y1={oy + f} x2={ox - 14} y2={ay} label="M" side="left" />
                <text className={styles.note} x={ox + f + 3} y={oy + f + 10}>
                  45°
                </text>
              </>
            ) : (
              <Dim x1={ox - 14} y1={oy} x2={ox - 14} y2={ay} label="m" side="left" />
            )}
          </>
        ) : null}
      </g>
    </svg>
  );
}

/** 等轴的五层分解：铝皮复合背板、画芯、卡纸、亚克力、铝合金框（sukima-book frameKit.explode） */
function Exploded({ p, image }: { p: Plan; image: OfferImage }): ReactNode {
  const id = useId().replace(/:/g, '');
  const outer = p.outer ?? [42, 52];
  const art = p.art ?? [30, 40];
  const s = 1.9;
  const [w, h] = [outer[0] * s, outer[1] * s];
  const [aw, ah] = [art[0] * s, art[1] * s];
  const f = RAIL * s;
  const gap = 40;
  const iso = (ty: number) => `matrix(0.866 0.5 -0.866 0.5 ${h * 0.866 + 16} ${ty})`;
  const layers = ['frame', 'acrylic', 'mat', 'print', 'backing'] as const;
  const label: Record<(typeof layers)[number], string> = {
    frame: '黑色铝合金框 · F',
    acrylic: '影像级高透亚克力',
    mat: '卡纸 · 45° 斜切口',
    print: '画芯 · 哈内姆勒棉浆纸',
    backing: '铝皮复合背板',
  };
  const top = 18;
  const depth = (w + h) * 0.5;
  // 等轴变换后菱形最右的角是 (w, 0) 那个角：x = 0.866(w + h) + 16，y = ty + 0.5w；标签从这里引出去
  const right = (w + h) * 0.866 + 16;
  const vbW = right + 172;
  const vbH = top + gap * (layers.length - 1) + depth + 8;
  const ring = `M0 0H${w}V${h}H0Z M${f} ${f}V${h - f}H${w - f}V${f}Z`;
  const ax = (w - aw) / 2;
  const ay = (h - ah) / 2;
  return (
    <svg className={styles.svg} viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label="装裱分解图：从上到下是框、亚克力、卡纸、画芯、背板">
      <defs>
        <clipPath id={`${id}-art`}>
          <rect x={ax} y={ay} width={aw} height={ah} />
        </clipPath>
      </defs>
      {[...layers].reverse().map((L) => {
        const i = layers.indexOf(L);
        const ty = top + gap * i;
        return (
          <g key={L}>
            <g transform={iso(ty)}>
              {L === 'backing' ? <rect width={w} height={h} className={styles.backing} /> : null}
              {L === 'print' ? (
                <>
                  <rect x={ax - 1.2 * s} y={ay - 1.2 * s} width={aw + 2.4 * s} height={ah + 2.4 * s} className={styles.printPaper} />
                  <image href={image.src} x={ax} y={ay} width={aw} height={ah} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-art)`} />
                </>
              ) : null}
              {L === 'mat' ? (
                <>
                  <path fillRule="evenodd" d={`M${f} ${f}H${w - f}V${h - f}H${f}Z M${ax} ${ay}V${ay + ah}H${ax + aw}V${ay}Z`} className={styles.matLayer} />
                  <rect x={ax} y={ay} width={aw} height={ah} className={styles.bevelLine} />
                </>
              ) : null}
              {L === 'acrylic' ? (
                <>
                  <rect x={f} y={f} width={w - 2 * f} height={h - 2 * f} className={styles.acrylic} />
                  <path d={`M${w * 0.15} ${f}L${f} ${h * 0.12}M${w * 0.32} ${f}L${f} ${h * 0.26}`} className={styles.glint} />
                </>
              ) : null}
              {L === 'frame' ? (
                <>
                  <path fillRule="evenodd" d={ring} className={styles.rails} />
                  <path d={`M0 0l${f} ${f}M${w} 0l${-f} ${f}M0 ${h}l${f} ${-f}M${w} ${h}l${-f} ${-f}`} className={styles.mitre} />
                </>
              ) : null}
            </g>
            <path className={styles.leader} d={`M${right + 3} ${ty + w * 0.5}H${right + 14}`} />
            <text className={styles.layerLabel} x={right + 18} y={ty + w * 0.5} dominantBaseline="central">
              {label[L]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * 当前规格画成什么样：左边俯视尺寸图，右边（装框时）五层分解。图下一行等宽读数把代号换成数字。
 */
export default function SpecDrawing({ spec, image }: SpecDrawingProps): ReactNode {
  const p = planOf(spec);
  const readout: string[] = [];
  if (p.kind === 'digital') {
    if (p.outer) readout.push(`W × H  ${pair(p.outer)} px`);
  } else {
    if (p.outer) readout.push(`W × H  ${pair(p.outer)} cm`);
    else if (p.outerText) readout.push(`W × H  ${p.outerText}`);
    if (p.art && (!p.outer || pair(p.art) !== pair(p.outer))) readout.push(`A  ${pair(p.art)} cm`);
    if (p.kind === 'framed') {
      readout.push(`F  ${RAIL} cm`);
      if (p.outer && p.art) readout.push(`M  ≈ ${cm((p.outer[0] - p.art[0]) / 2 - RAIL)} cm`);
    } else if (p.outer && p.art && pair(p.art) !== pair(p.outer)) {
      readout.push(`m  ${cm((p.outer[0] - p.art[0]) / 2)} cm`);
    } else {
      readout.push('满印 · Full bleed');
    }
  }
  const kicker = p.kind === 'framed' ? 'Framing · 装裱' : p.kind === 'sheet' ? 'Sheet · 画芯' : 'File · 数字文件';
  return (
    <figure className={styles.figure}>
      <figcaption className={`${styles.kicker} wc-mono`}>
        <span>{kicker}</span>
        <span>{spec.name}</span>
      </figcaption>
      <div className={styles.drawings} data-kind={p.kind}>
        <PlanView p={p} />
        {p.kind === 'framed' ? <Exploded p={p} image={image} /> : null}
      </div>
      {readout.length ? <p className={`${styles.readout} wc-mono`}>{readout.join('   ·   ')}</p> : null}
    </figure>
  );
}
