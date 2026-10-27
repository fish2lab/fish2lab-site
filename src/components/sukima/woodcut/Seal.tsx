'use client';

import React, { useId, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Seal.module.css';

export interface SealProps {
  /** 四个字，右列先读、从上到下（默认「隙間月影」） */
  text?: string;
  /** 边长（CSS 长度），默认 64px */
  size?: string;
  /** 歪多少度，默认 -4 */
  tilt?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * 社团的朱文…白文印（sukima-book web/core/paper.js 的 seal()）：红底、字刻成纸色，内框一圈，
 * 印面带一点没压实的飞白（feTurbulence 当遮罩），整枚正片叠底压在纸上。纯装饰，对读屏隐藏。
 */
export default function Seal({ text = '隙間月影', size = '64px', tilt = -4, className, style }: SealProps): ReactNode {
  const id = useId().replace(/:/g, '');
  const ch = [...text];
  // 右列：第 1、2 字；左列：第 3、4 字
  const cells: [string, number, number][] = [
    [ch[0], 74, 30],
    [ch[1], 74, 74],
    [ch[2], 26, 30],
    [ch[3], 26, 74],
  ];
  return (
    <svg className={clsx(styles.seal, 'wc-keep-font', className)} viewBox="0 0 100 100" style={{ width: size, height: size, rotate: `${tilt}deg`, ...style }} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${id}-dry`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 7 -4.4" />
        </filter>
        <mask id={`${id}-m`}>
          <rect width="100" height="100" fill="#fff" />
          <rect x="7" y="7" width="86" height="86" fill="none" stroke="#000" strokeWidth="3" />
          {cells.map(([c, x, y]) => (
            <text key={`${c}${x}${y}`} x={x} y={y} className={styles.glyph} textAnchor="middle" dominantBaseline="central" fill="#000">
              {c}
            </text>
          ))}
          <rect width="100" height="100" filter={`url(#${id}-dry)`} fill="#000" opacity="0.8" />
        </mask>
      </defs>
      <rect width="100" height="100" rx="7" fill="currentColor" mask={`url(#${id}-m)`} />
    </svg>
  );
}
