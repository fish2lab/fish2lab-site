"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/reading";

/**
 * The article's side rail, after claude.dev: the title surfaces once the
 * masthead scrolls away, then the section tree with the current section
 * lit, then how far through the text you are. Below xl the rail gives way
 * to a single bar under the nav: the current section and a percentage,
 * with the progress drawn along its bottom edge.
 *
 * Progress and the current section are both measured against `#article-body`,
 * so comments and tags under the text don't count as reading.
 */
export function ReadingRail({ title, toc }: { title: string; toc: TocItem[] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [titleOn, setTitleOn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const body = document.getElementById("article-body");
    if (!body) return;
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = body.getBoundingClientRect();
      const span = rect.height - window.innerHeight * 0.6;
      const read = (window.innerHeight * 0.4 - rect.top) / Math.max(span, 1);
      setProgress(Math.min(1, Math.max(0, read)));
      setTitleOn(rect.top < 0);

      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [toc]);

  const percent = Math.round(progress * 100);
  // The h3s under the section you're in open up; the rest stay folded.
  const sectionOf = toc.reduce<(string | null)[]>((acc, item, index) => {
    acc.push(item.depth === 2 ? item.id : (acc[index - 1] ?? null));
    return acc;
  }, []);
  const activeIndex = toc.findIndex((item) => item.id === active);
  const openSection = sectionOf[activeIndex];
  const activeText = toc[activeIndex]?.text ?? title;

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href.split("#")[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className={`reading-bar ${titleOn ? "is-on" : ""}`}
      >
        <span className="reading-bar-text">{activeText}</span>
        <span className="label-caps tabular-nums">
          {String(percent).padStart(2, "0")}%
        </span>
        <span
          className="reading-bar-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <aside className="reading-rail" aria-label="文章导航">
        <p className={`reading-rail-title ${titleOn ? "is-on" : ""}`}>{title}</p>

        {toc.length > 0 ? (
          <nav className="flex flex-col gap-3">
            <p className="label-caps">Contents / 目录</p>
            <ol className="reading-tree">
              {toc.map((item, index) => {
                if (item.depth === 3 && sectionOf[index] !== openSection) {
                  return null;
                }
                return (
                  <li key={item.id} data-depth={item.depth}>
                    <a
                      href={`#${item.id}`}
                      aria-current={item.id === active ? "location" : undefined}
                    >
                      <span aria-hidden="true">└</span>
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          <div className="reading-meter" aria-hidden="true">
            <span style={{ width: `${percent}%` }} />
          </div>
          <span className="label-caps tabular-nums">
            {String(percent).padStart(2, "0")}%
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button type="button" onClick={copyLink} className="reading-action">
            <span aria-hidden="true">└</span>
            {copied ? "已复制链接" : "复制链接"}
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className="reading-action"
          >
            <span aria-hidden="true">└</span>
            回到顶部
          </button>
        </div>
      </aside>
    </>
  );
}
