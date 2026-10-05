import GithubSlugger from "github-slugger";

/**
 * Reading aids derived from an entry's MDX source at build time: the section
 * tree for the article rail, an estimated reading time, and the straight →
 * curly quote pass that Chinese prose needs.
 */

export type TocItem = { id: string; text: string; depth: 2 | 3 };

const CJK = /[㐀-鿿豈-﫿　-〿＀-￯]/;
const FENCE = /^(```|~~~)/;

export function hasCjk(text: string): boolean {
  return CJK.test(text);
}

/**
 * Straight `"` in Chinese prose renders as a Latin inch mark (″) in Gelasio.
 * Pair them up as “ ”; quotes that are already curly keep their direction
 * and reset the pairing, so a mixed paragraph still comes out balanced.
 */
export function curlQuotes(text: string, state = { open: false }): string {
  return text.replace(/["“”]/g, (mark) => {
    if (mark === "“") state.open = true;
    else if (mark === "”") state.open = false;
    else state.open = !state.open;
    return state.open ? "“" : "”";
  });
}

/** Markdown inline syntax → the plain text rehype-slug will see. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`~]/g, "")
    .trim();
}

function bodyLines(body: string): string[] {
  let fenced = false;
  return body.split("\n").filter((line) => {
    if (FENCE.test(line.trim())) {
      fenced = !fenced;
      return false;
    }
    return !fenced;
  });
}

/**
 * `##` and `###` headings with the ids rehype-slug gives them. Every heading
 * level runs through the same slugger, in document order, so duplicate titles
 * get the same `-1`, `-2` suffixes the rendered page does.
 */
export function tableOfContents(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  for (const line of bodyLines(body)) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = plainText(match[2]);
    const id = slugger.slug(text);
    const depth = match[1].length;
    if (depth === 2 || depth === 3) {
      items.push({ id, text: hasCjk(text) ? curlQuotes(text) : text, depth });
    }
  }

  return items;
}

/**
 * Chinese reads at roughly 400 characters a minute, English at 230 words;
 * a mixed page is the sum of both. Code is left out.
 */
export function readingMinutes(body: string): number {
  const text = plainText(bodyLines(body).join("\n"));
  const cjk = text.match(/[㐀-鿿豈-﫿]/g)?.length ?? 0;
  const words =
    text.replace(/[㐀-鿿豈-﫿]/g, " ").match(/[A-Za-z0-9]+/g)
      ?.length ?? 0;
  return Math.max(1, Math.round(cjk / 400 + words / 230));
}
