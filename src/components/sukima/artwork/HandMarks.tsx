'use client';

import React, { createElement, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './HandMarks.module.css';

/** 选中标记：一枚实心的小方块（印刷目录里勾选用的那种），SSR 直接输出 */
export function InkCheck({ className }: { className?: string }): ReactNode {
  return (
    <svg className={clsx(styles.check, className)} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="6" y="6" width="12" height="12" fill="currentColor" />
    </svg>
  );
}

/** 步骤编号：等宽数字，补零成两位（01、02） */
export function HandCircle({ n, className }: { n: string; className?: string }): ReactNode {
  return (
    <span className={clsx(styles.circle, 'wc-mono', className)} aria-hidden="true">
      {n.padStart(2, '0')}
    </span>
  );
}

const NUMBERED = /^(\d+)\.\s*([\s\S]*)$/;

export interface StepTitleProps {
  /** 原来的整句标题，如「1. 扫码支付 / Payment」：开头的「1.」画成手画圈里的 1，读屏照读整句 */
  text: string;
  as?: 'h2' | 'h3';
  id?: string;
  className?: string;
}

/** 带编号的小标题：「01」等宽小字在前。没有「数字.」开头时原样输出 */
export function StepTitle({ text, as = 'h2', id, className }: StepTitleProps): ReactNode {
  const m = NUMBERED.exec(text);
  return createElement(
    as,
    { id, className: clsx(styles.step, className) },
    m ? (
      <>
        <HandCircle n={m[1]} />
        <span className="wc-sr-only">{`${m[1]}. `}</span>
        <span className={styles.stepText}>{m[2]}</span>
      </>
    ) : (
      <span className={styles.stepText}>{text}</span>
    ),
  );
}
