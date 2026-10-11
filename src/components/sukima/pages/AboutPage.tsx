'use client';

import React from 'react';
import Link from 'next/link';
import { Caption, HandTitle, InkButton, InkFrame, InkRule, LabelCard, PaperSection } from '../woodcut';
import InkQuote from './InkQuote';
import styles from './about.module.css';

export default function About() {
    return (
        <>
<PaperSection as="main" tone="wall" width="wide" space="md">
                <div className={styles.grid}>
                    {/* 左：挂在墙上的主催照片 + 图注展签（桌面跟着滚动停在视口里） */}
                    <div className={styles.visual}>
                        <div className={styles.frameBox}>
                            <InkFrame
                                hang
                                swing
                                size="md"
                                seed={27}
                                nominal={[340, 340]}
                                caption={<Caption size="sm">{'Fig 1. The Creator, 2025.'}</Caption>}
                                className={styles.frame}
                            >
                                <img
                                    src={'/images/sukima/authors/xinxian.webp'}
                                    alt="Su Xinxian"
                                    width={1000}
                                    height={1000}
                                    loading="eager"
                                    decoding="async"
                                />
                            </InkFrame>
                        </div>
                        <InkButton to="/sukima/giclee" size="md">
                            {"我们选择的工艺——Giclée"}
                        </InkButton>
                    </div>

                    {/* 右（手机在下）：一张大展签 */}
                    <LabelCard as="article" nominal={[620, 1000]} seed={35} className={styles.card}>
                        <header className={styles.head}>
                            <HandTitle as="h1" size="title" delay={0.5} className={styles.title}>
                                {'About the Organizer｜关于主催'}
                            </HandTitle>
                            <p className={styles.name}>
                                {"苏心贤"}
                            </p>
                            <p className={styles.role}>
                                {"Founder & Chief Developer · Photographer"}
                            </p>
                        </header>

                        <InkRule weight="thin" length={560} seed={11} />

                        <section className={styles.block}>
                            <h2 className={styles.blockTitle}>{"Profile"}</h2>
                            <p>
                                <strong>{"Organizer's Personal Site"}</strong>: <a href="https://fish2lab.com" target="_blank" rel="noopener noreferrer">fish2lab.com</a>
                            </p>
                            <p>
                                <a href="https://research.fish2lab.com" target="_blank" rel="noopener noreferrer">{"研究"}</a>
                                {' / '}
                                <a href="https://portfolio.fish2lab.com" target="_blank" rel="noopener noreferrer">{"胶片作品集"}</a>
                                {' / '}
                                <a href="https://blog.fish2lab.com" target="_blank" rel="noopener noreferrer">{"博客"}</a>
                                {' / '}
                                <a href="https://github.com/fish2lab" target="_blank" rel="noopener noreferrer">GitHub</a>
                            </p>
                            <p>
                                {"北京交通大学博士生，做 LLM 安全与 agent harness：系统怎样告诉模型「这段话是谁说的」，这件事失灵时会发生什么。\n                                    也拍中画幅胶片、学数学，关心学习科学和认知安全。"}
                            </p>
                        </section>

                        <InkRule weight="thin" length={560} seed={12} />

                        <section className={styles.block}>
                            <h2 className={styles.blockTitle}>{"Recently"}</h2>
                            <ul className={styles.plainList}>
                                <li>{"研究上下文窗口里的「来源」：prompt injection 为什么能得手"}</li>
                                <li>{"写一篇立场论文：agent harness 不会被 scaling 吃掉，只会缩成一个内核"}</li>
                                <li>
                                    <a href="https://github.com/fish2lab/DSCodex" target="_blank" rel="noopener noreferrer">DSCodex</a>
                                    {"：在原版 Codex / ChatGPT 桌面端里用 DeepSeek"}
                                </li>
                                <li>{"中画幅胶片，和一个东方同人游戏的坑"}</li>
                            </ul>
                        </section>

                        <InkRule weight="thin" length={560} seed={13} />

                        <InkQuote className={styles.quote} seed={19} nominal={170}>
                            <p>
                                {"\"sukima-ml stands for Sukima Moonlight, but Machine Learning? I can do that too 😉\""}
                            </p>
                            <p>
                                {"希望为东方带来更有文化底蕴的制品。\n                                    上学好累，下辈子想做人见人爱的富家天才美少女。"}
                            </p>
                        </InkQuote>

                        <p className={styles.notice}>
                            {"* Currently, this circle is just me working solo, but I'm excited about what we'll create together!"}
                        </p>
                    </LabelCard>
                </div>
            </PaperSection>
        </>
    );
}
