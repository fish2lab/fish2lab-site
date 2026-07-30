<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Writing entries in `content/`

Write prose. Not bullets.

The single hardest rule on this site: **no bullet lists, no numbered lists, no "key takeaways", no bolded lead-ins stacked one per line.** The author finds them unreadable and considers them the clearest tell that a machine wrote the page. A sequence of steps is written as a sequence of sentences — 先……然后……如果……最后 — because that is what carries the reasoning between the steps, which is the part worth reading. The moment you reach for `-` at the start of a line, you have thrown that away.

Aim at what a good print writer does: continuous paragraphs that argue, each one following from the last. `##` and `###` subheads are fine and welcome; a long piece needs them. A blockquote for a real quotation is fine. A fenced code block is fine when it holds actual code, a request body, or a measurement readout — evidence, in other words, not decoration. Tables and charts are fine when the data genuinely has two dimensions; a table is not a licence to smuggle a bullet list back in sideways.

Use bold sparingly, for a term being defined or a claim the whole paragraph turns on — never as a substitute for structure. Prefer the concrete over the summarising: a number, a version, a specific failure beats "several improvements were made".

Frontmatter is the only structured part of an entry. `title`, `date` (`YYYY-MM-DD`), `summary` and `tags` are expected; `legacy: true` shelves an entry under the archive mark on the index; research entries may add `status` and `venue`. Note that MDX has no HTML comments — `<!-- … -->` is a build error — and that a bare `{`, `}` or `<` in prose is parsed as JSX.
