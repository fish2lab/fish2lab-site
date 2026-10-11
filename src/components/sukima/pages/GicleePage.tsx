'use client';

import React, { useState, type ReactNode } from 'react';
import { HandTitle, InkFrame, InkRule, LabelCard, PaperSection } from '../woodcut';
import ExhibitCard from './ExhibitCard';
import InkCircleNum from './InkCircleNum';
import Lightbox, { type LightboxImage } from './Lightbox';
import LongCaption from './LongCaption';
import styles from './giclee.module.css';

/** 小节标题前原来的 emoji（🎨📜🖼️⏳）换成手画圈里的编号；译文里如果还带着 emoji，这里去掉 */
const stripLeadingEmoji = (s: string): string => s.replace(/^[\p{Extended_Pictographic}\u{FE0F}\u{200D}]+\s*/u, '');

interface Photo extends LightboxImage {
    /** 手机两列时独占一行（横图） */
    wide?: boolean;
}

function SectionHead({ num, title, seed }: { num: string; title: string; seed: number }): ReactNode {
    return (
        <div className={styles.sectionHead}>
            <InkCircleNum size="lg" seed={seed}>{num}</InkCircleNum>
            <HandTitle as="h2" size="section" per={0.035} className={styles.sectionTitle}>
                {stripLeadingEmoji(title)}
            </HandTitle>
        </div>
    );
}

/** 一张设备 / 纸张的照片：木刻框，点开看大图，下面一张小展签当图注 */
function FramedFigure({ photo, caption, seed, narrow, onOpen }: { photo: Photo; caption: string; seed: number; narrow?: boolean; onOpen: (p: Photo) => void }): ReactNode {
    return (
        <figure className={styles.figure} data-narrow={narrow || undefined}>
            <button
                type="button"
                className={styles.zoom}
                onClick={() => onOpen(photo)}
                aria-label={`查看大图：${photo.alt}`}
            >
                <InkFrame as="span" size="md" seed={seed} nominal={narrow ? [440, 620] : [720, 490]}>
                    <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                </InkFrame>
            </button>
            <figcaption className={styles.figcaption}>
                <LongCaption size="sm" seed={seed + 3}>{caption}</LongCaption>
            </figcaption>
        </figure>
    );
}

/** 细节照片墙：统一裁成竖幅挂成一排，点开看原图 */
function PhotoWall({ photos, seed, onOpen }: { photos: readonly Photo[]; seed: number; onOpen: (p: Photo) => void }): ReactNode {
    return (
        <ul className={styles.photoWall} data-count={photos.length}>
            {photos.map((p, i) => (
                <li key={p.src} className={styles.photoCell} data-wide={p.wide || undefined}>
                    <button
                        type="button"
                        className={styles.zoom}
                        onClick={() => onOpen(p)}
                        aria-label={`查看大图：${p.alt}`}
                    >
                        <InkFrame as="span" size="sm" seed={seed + i * 5} nominal={[230, 300]}>
                            <span className={styles.crop}>
                                <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
                            </span>
                        </InkFrame>
                    </button>
                </li>
            ))}
        </ul>
    );
}

function FeatureList({ children }: { children: ReactNode }): ReactNode {
    return <ul className={styles.featureList}>{children}</ul>;
}

function Feature({ title, seed, children }: { title: ReactNode; seed: number; children: ReactNode }): ReactNode {
    return (
        <ExhibitCard as="li" seed={seed} nominal={[230, 220]} className={styles.featureItem}>
            <div className={styles.featureTitle}>{title}</div>
            {children}
        </ExhibitCard>
    );
}

export default function GicleePage() {
    const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

    const openImage = (photo: Photo) => {
        setSelectedImage(photo);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const epson: Photo = { src: '/images/sukima/giclee/epson9580_web.webp', alt: 'Epson SureColor P9580', width: 1200, height: 809 };
    const datasheet: Photo = {
        src: '/images/sukima/giclee/datasheet-PhotoRag308.webp',
        alt: 'Hahnemühle Photo Rag 308g',
        width: 1200,
        height: 1697,
    };
    const paperDetails: Photo[] = [
        { src: '/images/sukima/giclee/BaS-huaxin.webp', alt: 'Detail Shot 1', width: 1200, height: 1490 },
        { src: '/images/sukima/giclee/IMG_0199.webp', alt: 'Detail Shot 2', width: 1200, height: 1600 },
        { src: '/images/sukima/giclee/IMG_0202.webp', alt: 'Detail Shot 3', width: 1200, height: 900, wide: true },
    ];
    const framingDetails: Photo[] = [
        { src: '/images/sukima/giclee/F253B61EBC19D9DF60101EEC6BAF2242.webp', alt: 'Framing Detail 1', width: 1200, height: 2133 },
        { src: '/images/sukima/giclee/IMG_0195.webp', alt: 'Framing Detail 2', width: 1200, height: 1600 },
        { src: '/images/sukima/giclee/IMG_0196.webp', alt: 'Framing Detail 3', width: 1200, height: 1600 },
        { src: '/images/sukima/giclee/IMG_0197.webp', alt: 'Framing Detail 4', width: 1200, height: 1600 },
    ];

    return (
        <>
<PaperSection as="main" tone="wall" width="narrow" space="md">
                <article className={styles.article}>

                    <header className={styles.header}>
                        <img
                            src={"/images/sukima/sukima-ml.svg"}
                            alt={'Sukima Moonlight'}
                            className={styles.logo}
                            width={200}
                            height={120}
                            loading="eager"
                            decoding="sync"
                        />
                        <HandTitle as="h1" size="title" className={styles.mainTitle}>
                            {[
                                '不止是周边，',
                                '这是通往幻想乡的',
                                '“真迹”',
                            ].join('\n')}
                        </HandTitle>
                    </header>

                    <InkRule weight="bold" dry={0.25} length={720} seed={41} decorative />

                    {/* Intro */}
                    <div className={styles.section}>
                        <p className={styles.introText}>
                            {'我们一直在思考：当那些恢弘的世界名画浸入幻想的染缸，又再次回到现实中时，它们应该以什么样的方式降临我们身边？'}
                            <br />
                            {'是随处可见、反光刺眼的普通海报？还是表面粗糙，挂一阵子就卷边褪色的塑料布？'}
                        </p>
                        <div className={styles.vow}>
                            <HandTitle as="p" size="display" per={0.12} className={styles.vowNo}>
                                {'不。'}
                            </HandTitle>
                            <HandTitle as="p" size="section" per={0.05} delay={0.35} className={styles.vowLine}>
                                {'幻想乡的少女们，值得被最高规格的礼遇。'}
                            </HandTitle>
                        </div>
                        <p className={styles.textBlock}>
                            <>{"为了完美复刻画师笔下那个绮丽的世界，我们按照"}{<strong>{'收藏级艺术品复刻'}</strong>}{"的标准，制作了我们所有的「艺术微喷 (Giclée)」制品。"}</>
                        </p>
                        <p className={styles.textBlock}>
                            {"这不仅是一张画，更是一份可以传世的实体收藏。"}
                        </p>
                    </div>

                    <InkRule weight="thin" length={720} seed={42} />

                    {/* Section 1: Printer */}
                    <section className={styles.section}>
                        <SectionHead num="一" seed={51} title={'🎨 只有 12 色，才能捕捉“隙间”的深邃'} />
                        <p className={styles.sectionSubtitle}>{"【Epson SureColor P9580 · 旗舰级输出】"}</p>

                        <p className={styles.textBlock}>
                            <>{"普通印刷只有 CMYK 4种颜色，印不出"}{<strong>{'八云紫隙间里那种深邃的紫'}</strong>}{"，也还原不了"}{<strong>{'博丽神社鸟居那抹正红'}</strong>}{"。"}</>
                        </p>
                        <p className={styles.textBlock}>
                            <>{"所以，我们动用了爱普生的当家怪兽 —— "}{<strong>SureColor P9580</strong>}{"。"}</>
                        </p>

                        <FramedFigure
                            photo={epson}
                            seed={61}
                            onOpen={openImage}
                            caption={'Epson SureColor P9580 旗舰级大幅面打印机'}
                        />

                        <FeatureList>
                            <Feature seed={71} title={"12色墨水系统"}>
                                <p>
                                    <>{"它拥有普通打印机没有的"}{<strong>{'专属橙、绿、紫'}</strong>}{"墨水。那些绚烂的光影，只有它能分毫不差地还原。"}</>
                                </p>
                            </Feature>
                            <Feature seed={73} title={"极致的黑"}>
                                <p>{"拥有4种不同浓度的黑色墨水。它印出的黑色不是死黑，而是像夜空一样有层次、有质感的黑。"}</p>
                            </Feature>
                            <Feature seed={75} title={"微米级精度"}>
                                <p>{"2400dpi 分辨率 + 3.5pl 极微墨滴。你需要拿着放大镜，才能惊叹于角色的睫毛和发丝竟如此清晰，肉眼完全看不到任何噪点。"}</p>
                            </Feature>
                        </FeatureList>
                    </section>

                    <InkRule weight="thin" length={720} seed={43} />

                    {/* Section 2: Paper */}
                    <section className={styles.section}>
                        <SectionHead num="二" seed={52} title={'📜 触手可及的“名画”触感'} />
                        <p className={styles.sectionSubtitle}>{"【哈内姆勒 Photo Rag® 308g · 顶级画纸】"}</p>

                        <p className={styles.textBlock}>
                            {'如果说墨水是灵魂，那纸张就是肉体。我们拒绝了廉价的相纸，选用了 德国哈内姆勒 (Hahnemühle) —— 这个从1584年就开始造纸的传奇品牌。'}
                        </p>

                        <FramedFigure
                            photo={datasheet}
                            seed={63}
                            narrow
                            onOpen={openImage}
                            caption={'Hahnemühle Photo Rag® 308g 数据表'}
                        />

                        <p className={styles.textBlock}>
                            <>{"我们使用的是他们最经典的 "}{<strong>Photo Rag 308g</strong>}{<em>{'（紫妈那幅比较特殊，因为黑色面积太大选用了更贵的硫化钡纯棉纸）'}</em>}{"："}</>
                        </p>

                        <FeatureList>
                            <Feature seed={77} title={"100% 纯棉制造"}>
                                <p>{"指尖划过，你能感受到如同古籍、水彩纸那样的温润棉质纹理，绝非普通纸浆可比。"}</p>
                            </Feature>
                            <Feature seed={79} title={"厚重 308gsm"}>
                                <p>{"拿在手里沉甸甸的分量感，挺括厚实，不会像普通海报那样软塌塌。"}</p>
                            </Feature>
                            <Feature seed={81} title={"高级哑光面"}>
                                <p>
                                    <>{<strong>{'这是重点！'}</strong>}{" 它完全不反光。无论你宿舍或房间的灯光如何照射，任何角度都能完美欣赏画面，没有刺眼的白斑。"}</>
                                </p>
                            </Feature>
                        </FeatureList>

                        <p className={styles.textBlock}>
                            {"为了让大家更直观地感受差异，我们拍摄了实际成品的细节图："}
                        </p>
                        <PhotoWall photos={paperDetails} seed={91} onOpen={openImage} />
                    </section>

                    <InkRule weight="thin" length={720} seed={44} />

                    {/* Section 3: Framing */}
                    <section className={styles.section}>
                        <SectionHead num="三" seed={53} title={'🖼️ 最后的加冕：画廊级装裱'} />
                        <p className={styles.textBlock}>
                            {"好马配好鞍。为了保护这幅作品，我们在装裱上也近乎强迫症："}
                        </p>
                        <FeatureList>
                            <Feature seed={83} title={"影像级高透亚克力"}>
                                <p>{"比玻璃更透、更轻、更安全。"}</p>
                            </Feature>
                            <Feature seed={85} title={"铝合金画框 & 铝皮背板"}>
                                <p>{"防潮防变形，给画作最坚实的支撑。"}</p>
                            </Feature>
                            <Feature seed={87} title={"博物馆级无酸卡纸"}>
                                <p>{"确保画芯不会因为接触酸性物质而发黄。"}</p>
                            </Feature>
                        </FeatureList>

                        <PhotoWall photos={framingDetails} seed={101} onOpen={openImage} />
                    </section>

                    <InkRule weight="thin" length={720} seed={45} />

                    {/* Section 4: Value */}
                    <section className={styles.section}>
                        <SectionHead num="四" seed={54} title={'⏳ 时间的礼物'} />
                        <p className={styles.textBlock}>
                            {"为什么要选择艺术微喷？"}
                        </p>
                        <p className={styles.textBlock}>
                            {'普通的印刷品，挂一年就会在阳光下褪色。'}
                            <br />
                            <>{"但得益于"}{<strong>{'无酸纯棉纸张'}</strong>}{"与"}{<strong>{'颜料墨水'}</strong>}{"的结合，这幅作品达到了"}{<strong>{'“收藏级”标准'}</strong>}{"。"}</>
                        </p>
                        <p className={styles.textBlock}>
                            {"它可以陪伴你读完高中、大学，甚至当你步入社会、组建家庭，回头看时，墙上的她们依然一如初见。"}
                        </p>
                    </section>

                    {/* Conclusion：居中的一张展签 */}
                    <div className={styles.conclusion}>
                        <LabelCard
                            as="aside"
                            titleAs="p"
                            title={'希望我们出售的不是一份画芯，更是一份能跨越时间、值得珍藏的爱意。'}
                            nominal={[560, 200]}
                            seed={111}
                            className={styles.conclusionCard}
                        />
                    </div>

                </article>
            </PaperSection>

            <Lightbox
                image={selectedImage ? { ...selectedImage, alt: 'Full size' } : null}
                label={selectedImage?.alt}
                onClose={closeImage}
            />
        </>
    );
}
