import { curlQuotes, hasCjk } from "@/lib/reading";

/**
 * Rehype pass for Chinese paragraphs: straight `"` becomes “ ”, and each
 * quote mark is wrapped in `span.cjk-q` so it takes the Chinese face's
 * full-width glyph instead of Gelasio's narrow Latin one. Blocks without
 * Chinese text and anything inside code are left alone.
 */

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const BLOCKS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "li", "blockquote", "td", "th", "figcaption", "dt", "dd",
]);
const SKIP = new Set(["code", "pre", "kbd", "samp", "script", "style"]);

function textOf(node: Node): string {
  if (node.type === "text") return node.value ?? "";
  if (node.tagName && SKIP.has(node.tagName)) return "";
  return (node.children ?? []).map(textOf).join("");
}

function splitQuotes(value: string): Node[] {
  return value
    .split(/([“”])/)
    .filter(Boolean)
    .map((part) =>
      part === "“" || part === "”"
        ? {
            type: "element",
            tagName: "span",
            properties: { className: ["cjk-q"] },
            children: [{ type: "text", value: part }],
          }
        : { type: "text", value: part },
    );
}

function curl(node: Node, state: { open: boolean }) {
  if (!node.children) return;
  node.children = node.children.flatMap((child) => {
    if (child.type === "text") {
      return splitQuotes(curlQuotes(child.value ?? "", state));
    }
    if (child.tagName && !SKIP.has(child.tagName)) curl(child, state);
    return [child];
  });
}

function walk(node: Node) {
  if (node.tagName && SKIP.has(node.tagName)) return;
  if (node.tagName && BLOCKS.has(node.tagName)) {
    if (hasCjk(textOf(node))) curl(node, { open: false });
    return;
  }
  node.children?.forEach(walk);
}

export default function rehypeCjkQuotes() {
  return (tree: Node) => walk(tree);
}
