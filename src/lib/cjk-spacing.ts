/**
 * 盘古之白 — the gap between Chinese and Latin letters or digits.
 *
 * The sources are inconsistent: some entries were written with a space on
 * both sides of every English word, some with none, so one page read airy
 * and the next cramped. Rather than ask every entry to agree, the gap is
 * normalised at build time to a single ordinary space, the same in every
 * browser. (CSS `text-autospace` would do it natively, but only in recent
 * Chromium and Safari, and its 1/8-em gap would still differ from the full
 * spaces already typed into half the sources.)
 *
 * Only the boundary between a Han/kana character and an ASCII letter or
 * digit is touched. Punctuation on either side — full-width or not — is left
 * alone, because Chinese punctuation already carries its own white.
 */

const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff";
/** What counts as "Latin" on the side facing the Chinese character. */
const LATIN_HEAD = "A-Za-z0-9\u00c0-\u024f";
const LATIN_TAIL = "A-Za-z0-9\u00c0-\u024f%";

const CJK_THEN_LATIN = new RegExp(`([${CJK}])([${LATIN_HEAD}])`, "g");
const LATIN_THEN_CJK = new RegExp(`([${LATIN_TAIL}])([${CJK}])`, "g");
const IS_CJK = new RegExp(`[${CJK}]`);
const IS_LATIN_HEAD = new RegExp(`[${LATIN_HEAD}]`);
const IS_LATIN_TAIL = new RegExp(`[${LATIN_TAIL}]`);

/** Inserts the gap inside one string. */
export function spaceCjk(text: string): string {
  return text
    .replace(CJK_THEN_LATIN, "$1 $2")
    .replace(LATIN_THEN_CJK, "$1 $2");
}

/** Whether `left` followed directly by `right` wants a gap between them. */
function wantsGap(left: string, right: string): boolean {
  return (
    (IS_CJK.test(left) && IS_LATIN_HEAD.test(right)) ||
    (IS_LATIN_TAIL.test(left) && IS_CJK.test(right))
  );
}

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  children?: Node[];
};

const BLOCKS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "li", "blockquote", "td", "th", "figcaption", "dt", "dd",
]);
/** Code is never rewritten, but it still has edges: `用max_tokens` → `用 max_tokens`. */
const OPAQUE = new Set(["code", "kbd", "samp"]);
/** Elements that end a run of inline text — no gap is carried across them. */
const BREAKS = new Set(["br", "img", "pre", "script", "style"]);

type Piece =
  | { kind: "text"; node: Node }
  | { kind: "opaque"; first: string; last: string }
  | { kind: "break" };

function textOf(node: Node): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/** The block's inline content in reading order, nested markup flattened. */
function flatten(node: Node, out: Piece[]) {
  for (const child of node.children ?? []) {
    if (child.type === "text") {
      out.push({ kind: "text", node: child });
    } else if (child.tagName && OPAQUE.has(child.tagName)) {
      const text = textOf(child);
      if (text) out.push({ kind: "opaque", first: text[0], last: text.at(-1)! });
    } else if (child.tagName && BREAKS.has(child.tagName)) {
      out.push({ kind: "break" });
    } else if (child.tagName && BLOCKS.has(child.tagName)) {
      // A nested block (a paragraph inside a list item) is its own run.
      out.push({ kind: "break" });
      space(child);
      out.push({ kind: "break" });
    } else if (child.children) {
      flatten(child, out);
    }
  }
}

function space(block: Node) {
  const pieces: Piece[] = [];
  flatten(block, pieces);

  let prev: Piece | undefined;
  for (const piece of pieces) {
    if (piece.kind === "text") {
      piece.node.value = spaceCjk(piece.node.value ?? "");
    }
    if (piece.kind === "break") {
      prev = undefined;
      continue;
    }

    const first = piece.kind === "text" ? piece.node.value?.[0] : piece.first;
    const last =
      prev?.kind === "text" ? prev.node.value?.at(-1) : prev?.kind === "opaque" ? prev.last : undefined;

    if (first && last && wantsGap(last, first)) {
      // The gap goes into whichever neighbour is plain text — never into code.
      if (prev?.kind === "text") prev.node.value += " ";
      else if (piece.kind === "text") piece.node.value = ` ${piece.node.value}`;
    }

    // An empty text node has no edge of its own; keep the previous one.
    if (piece.kind !== "text" || piece.node.value) prev = piece;
  }
}

function walk(node: Node) {
  if (node.tagName === "pre" || node.tagName === "code") return;
  if (node.tagName && BLOCKS.has(node.tagName)) {
    space(node);
    return;
  }
  node.children?.forEach(walk);
}

/** Rehype pass applying `spaceCjk` across an MDX body, block by block. */
export default function rehypeCjkSpacing() {
  return (tree: Node) => walk(tree);
}
