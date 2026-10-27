'use client';

import React, { createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { motion, useInView, useMotionValue } from 'framer-motion';
import { hangAngle } from './draw';
import { motionAllowedNow } from './hooks';
import styles from './InkFrame.module.css';

export interface InkFrameProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 画心：通常是一张 <img>（宽 100%）或 <picture> */
  children: ReactNode;
  /** 外层标签，默认 figure；放进 <button> 这类只能装行内内容的地方时用 span */
  as?: 'figure' | 'div' | 'span';
  /** 投影和反光的档：sm（缩略图，投影浅、不反光）/ md（默认）/ lg。框条、卡纸的比例三档一样 */
  size?: 'sm' | 'md' | 'lg';
  /** 挂绳：从上方挂画轨斜拉到画框两个上角的两根钢丝 */
  hang?: boolean;
  /** 挂画轨：只在 hang 时有效，默认画一段，比画框宽出两边各 14% */
  rail?: boolean;
  /** 进入视口时在挂绳上轻轻晃一下（峰值约 ±1.5°，两秒内停稳） */
  swing?: boolean;
  /** 这个值变了就再晃一下（例如轮播换页） */
  swingKey?: string | number;
  /** 墙上的投影，默认 true */
  shadow?: boolean;
  /** 图注（仅 as="figure" 时输出 figcaption） */
  caption?: ReactNode;
  /** 木刻时代的参数，改版后不再起作用 */
  seed?: number;
  nominal?: readonly [number, number];
}

/**
 * 社团实际卖的那只框（sukima-book web/core/frame.js 的 frameKit）：画芯短边 30 cm，四边 5 cm 卡纸、窗口居中，
 * 黑色铝合金框条正面 1 cm、四角 45° 斜接；所以装好的框宽 42 cm。这里按框的实际宽度换算成 cm（--cm = 宽 / 42），
 * 网页上任何尺寸比例都不变。从外到里：框条（上、左受光）→ 卡纸（棉卡，带纸纹）→ 45° 斜切口露出的白芯 →
 * 画芯（卡纸在上沿、左沿投下一道细影，纸面一层很淡的棉纤维）→ 盖在最上面的亚克力反光。
 */
export default function InkFrame({
  children,
  as = 'figure',
  size = 'md',
  hang = false,
  rail,
  swing = false,
  swingKey,
  shadow = true,
  caption,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  seed, nominal,
  className,
  ...rest
}: InkFrameProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const rotate = useMotionValue(0);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const showRail = hang && (rail ?? true);

  useEffect(() => {
    if (!swing || !inView || !motionAllowedNow()) return undefined;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = (now - t0) / 1000;
      if (t >= 2.4) {
        rotate.set(0);
        return;
      }
      rotate.set((hangAngle(t) * 180) / Math.PI);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      rotate.set(0);
    };
  }, [swing, inView, swingKey, rotate]);

  const inner = (
    <>
      {showRail ? <span className={styles.rail} aria-hidden="true" /> : null}
      <motion.span className={styles.swing} style={{ rotate }}>
        {hang ? (
          <span className={styles.cords} aria-hidden="true">
            <svg className={styles.cordSvg} viewBox="0 0 100 13" preserveAspectRatio="none" focusable="false">
              <path d="M24.2 0L2.9 13M75.8 0L97.1 13" fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <span className={styles.hook} style={{ left: '24.2%' }} />
            <span className={styles.hook} style={{ left: '75.8%' }} />
          </span>
        ) : null}
        <span className={styles.body}>
          <span className={styles.rails} aria-hidden="true">
            <span data-side="t" />
            <span data-side="r" />
            <span data-side="b" />
            <span data-side="l" />
          </span>
          <span className={styles.mat}>
            <span className={styles.bevel}>
              <span className={styles.art}>
                {children}
                <span className={styles.paper} aria-hidden="true" />
              </span>
            </span>
          </span>
          <span className={styles.glass} aria-hidden="true" />
        </span>
      </motion.span>
      {caption && as === 'figure' ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </>
  );

  return createElement(
    as,
    {
      ...rest,
      ref,
      className: clsx(styles.frame, className),
      'data-size': size,
      'data-hang': hang || undefined,
      'data-shadow': shadow ? undefined : 'false',
    },
    inner,
  );
}
