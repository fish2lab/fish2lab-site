'use client';

import React, { memo, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';
import type { Side } from './edges';
import styles from './RoughBorder.module.css';

/** all 四边；x 上下两边；y 左右两边；或单独一边 */
export type RoughSides = 'all' | 'x' | 'y' | Side;

export interface RoughBorderProps {
  /**
   * line：沿盒子边描一圈木刻毛边线（片子的 outline）；
   * fill：给同色的实心块加木刻刀口的外沿（片子的 block 毛边），color 要和块的底色一样。
   */
  variant?: 'line' | 'fill';
  /** line 的线宽（像素），默认 2 */
  weight?: number;
  /** 起伏幅度（像素）。line 是中线的起伏，默认 .6；fill 是外沿平均伸出多少，默认 1.2 */
  amp?: number;
  /** 起伏的长度（像素，按标称尺寸）。line 默认 40，fill 默认 14 */
  freq?: number;
  /** line 的线宽起伏，默认 .3 */
  roughness?: number;
  /** line 的飞白 0..1，默认 0 */
  dry?: number;
  /** fill 的长刺概率，默认 0 */
  spike?: number;
  /** fill 的刺长（像素），默认 4 */
  spikeLen?: number;
  seed?: number;
  /** 「抖」：useJitterTick() 的返回值，加在 seed 上；0 = 形状固定 */
  jitter?: number;
  /** 标称尺寸 [宽, 高]（像素）。毛边按这个长度生成，再沿边拉伸到实际长度；填和实际尺寸差不多的数就行 */
  nominal?: readonly [number, number];
  /** line 的中线离盒子边向内多少（数字是像素，也可以是 CSS 长度，如 'calc(var(--fw) * .35)'）；负数向外 */
  inset?: number | string;
  sides?: RoughSides;
  /** 颜色，默认 currentColor */
  color?: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

const SIDES: Record<RoughSides, readonly Side[]> = {
  all: ['top', 'right', 'bottom', 'left'],
  x: ['top', 'bottom'],
  y: ['left', 'right'],
  top: ['top'],
  right: ['right'],
  bottom: ['bottom'],
  left: ['left'],
};
const len = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

/**
 * 2026-10 改版后的边：line 是一圈笔直的发丝线（weight 不到 2.5 是 1px，否则 2px），fill 不再画毛边（块本身的底色就是边）。
 * 起伏、飞白、刺、seed 这些参数还收着，只是不再起作用——调用处不用改。
 */
function RoughBorder({ variant = 'line', weight = 2, inset = 0, sides = 'all', color, opacity, className, style }: RoughBorderProps): ReactNode {
  if (variant === 'fill') return null;
  const w = weight < 2.5 ? 1 : 2;
  const on = new Set(SIDES[sides]);
  const bw = (['top', 'right', 'bottom', 'left'] as const).map((s) => (on.has(s) ? `${w}px` : '0')).join(' ');
  return <span className={clsx(styles.rb, className)} aria-hidden="true" style={{ inset: len(inset), borderStyle: 'solid', borderWidth: bw, borderColor: 'currentColor', color, opacity, ...style }} />;
}

export default memo(RoughBorder);
