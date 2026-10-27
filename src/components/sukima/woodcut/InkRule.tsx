'use client';

import React, { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './InkRule.module.css';

export interface InkRuleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 粗细：hair 1.4px、thin 2.6px（默认）、bold 5px，或直接给像素 */
  weight?: 'hair' | 'thin' | 'bold' | number;
  seed?: number;
  /** 飞白 0..1，默认 0 */
  dry?: number;
  /** 两头收尖的比例，默认 .1；0 两头平齐 */
  taper?: number;
  /** 中线上下起伏（像素），默认按粗细 */
  amp?: number;
  /** 标称长度（像素），默认 720；线按这个长度生成再拉伸到实际宽度 */
  length?: number;
  /** 颜色，默认 currentColor */
  color?: string;
  /** true：纯装饰，对读屏隐藏；默认 false，是 role="separator" 的分隔线 */
  decorative?: boolean;
  /** 在视口里时一直轻轻地抖（8 次/秒） */
  jitter?: boolean;
}

const WEIGHTS = { hair: 1.4, thin: 2.6, bold: 5 } as const;

/** 分隔线：一道笔直的发丝线（bold 是 2px）。 */
export default function InkRule({
  weight = 'thin',
  color,
  decorative = false,
  className,
  style,
  // 木刻时代的参数（起伏、飞白、抖动），改版后不再起作用，从 rest 里拿掉免得落到 DOM 上
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  seed, dry, taper, amp, length, jitter,
  ...rest
}: InkRuleProps): ReactNode {
  const w = typeof weight === 'number' ? weight : WEIGHTS[weight];
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'separator', 'aria-orientation': 'horizontal' as const };
  return <div {...a11y} {...rest} className={clsx(styles.rule, className)} style={{ height: w >= 4 ? 2 : 1, color, ...style }} />;
}
