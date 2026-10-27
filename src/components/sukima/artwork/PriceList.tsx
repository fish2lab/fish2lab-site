'use client';

import React, { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import { RoughBorder } from '../woodcut';
import type { PriceRowView } from '@/lib/sukima/offers';
import { InkCheck, StepTitle } from './HandMarks';
import styles from './PriceList.module.css';

export interface PriceListProps {
  /** 原来的标题，如「选择供奉规格 (Select Offering)」「1. 选择规格 (Select Size)」 */
  title: string;
  rows: readonly PriceRowView[];
  onSelect: (id: string) => void;
  /** 价目表底部的小字（001 的成本说明） */
  children?: ReactNode;
  className?: string;
}

/**
 * 价目表，排成印刷目录的一页：每个规格一行，发丝线隔开，名字、尺寸在左，等宽价格在右。
 * 选中的那行左边一枚实心小方块、名字加粗。role="radiogroup"：Tab 进来落在选中的那行，上下（左右）键切换，Home / End 到头尾。
 */
export default function PriceList({ title, rows, onSelect, children, className }: PriceListProps): ReactNode {
  const titleId = useId();
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const current = Math.max(0, rows.findIndex((r) => r.selected));

  const go = (i: number) => {
    const k = (i + rows.length) % rows.length;
    onSelect(rows[k].id);
    refs.current[k]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        go(i + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        go(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(rows.length - 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        onSelect(rows[i].id);
        break;
      default:
    }
  };

  return (
    <div className={clsx(styles.card, className)}>
      <RoughBorder variant="fill" amp={0.9} freq={30} seed={61} nominal={[560, 520]} className={styles.edge} />
      <StepTitle text={title} id={titleId} className={styles.title} />
      <div role="radiogroup" aria-labelledby={titleId} className={styles.list}>
        {rows.map((r, i) => (
          <div
            key={r.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="radio"
            aria-checked={r.selected}
            tabIndex={i === current ? 0 : -1}
            className={styles.row}
            data-selected={r.selected ? '' : undefined}
            onClick={() => onSelect(r.id)}
            onKeyDown={(e) => onKeyDown(e, i)}>
            <span className={styles.mark} aria-hidden="true">
              {r.selected ? <InkCheck /> : null}
            </span>
            <span className={styles.line}>
              <span className={styles.name} title={r.label}>
                {r.name}
                {r.spec ? <span className={styles.spec}> ({r.spec})</span> : null}
              </span>
              <span className={styles.leader} aria-hidden="true" />
              <span className={clsx(styles.price, 'wc-mono')}>{r.price}</span>
            </span>
            {r.tags.length || r.details.length ? (
              <span className={styles.more}>
                {r.tags.map((t) => (
                  <span key={t} className={clsx(styles.tag, 'wc-mono')} data-recommended={r.recommended ? '' : undefined}>
                    {t}
                  </span>
                ))}
                {r.details.map((d) => (
                  <span key={d} className={styles.detail}>
                    {d}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
