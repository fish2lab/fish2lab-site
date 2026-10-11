import Link from "next/link";

import { InkFrame, InkRule } from "@/components/sukima/woodcut";
import { artworks } from "@/lib/sukima/gallery";
import { getArtworkTitle } from "@/lib/sukima/galleryTranslations";

import styles from "./gallery-row.module.css";

/**
 * 画廊墙下面那一排：四幅东方版挂在同一道挂画轨上，一幅一个名字，点进各自的详情页。
 *
 * 原站（sukima-ml）的这一排是首页那面 560vh 滚动墙拉到最远之后的收尾画面。这里只留
 * 静止的那一排——制品区的首页第一屏已经是展厅，再加一段滚动驱动的镜头会让人分不清
 * 自己在哪一层。画框仍然用 InkFrame 的挂绳（绳高是框宽的 13%），所以旁边那道挂画轨
 * 的上下位置按同一个比例算，见 gallery-row.module.css 的 --rope。
 */
export function GalleryRow() {
  return (
    <section className={styles.row} data-wc-tone="wall" aria-labelledby="sukima-row-heading">
      <h2 id="sukima-row-heading" className="wc-sr-only">
        墙上的四幅画
      </h2>

      <InkRule className={styles.rail} weight="thin" length={1200} seed={13} decorative />

      {artworks.map((artwork, i) => (
        <Link
          key={artwork.id}
          href={artwork.link}
          className={styles.item}
          style={{ "--ar": (artwork.imageWidth / artwork.imageHeight).toFixed(4) } as React.CSSProperties}
        >
          <InkFrame as="div" hang rail={false} size="sm" nominal={[280, 380]} seed={61 + i * 7}>
            <img
              src={artwork.imagePath}
              alt=""
              width={artwork.imageWidth}
              height={artwork.imageHeight}
              loading="lazy"
              decoding="async"
            />
          </InkFrame>
          <span className={styles.title}>{getArtworkTitle(artwork)}</span>
        </Link>
      ))}

      <InkRule className={styles.skirting} weight="bold" length={1440} seed={17} decorative />
    </section>
  );
}
