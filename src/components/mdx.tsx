import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkGfm from "remark-gfm";

import rehypeCjkQuotes from "@/lib/rehype-cjk-quotes";

function ContentImage({
  src,
  alt = "",
  width,
  height,
  ...props
}: React.ComponentProps<"img">) {
  if (typeof src !== "string") return null;

  const intrinsicWidth = Number(width) || 1600;
  const intrinsicHeight = Number(height) || 1067;

  /* .plate-ground lays the shimmering ground behind the picture while it
     loads — see "Image ground" in globals.css. */
  return (
    <span className="plate-ground">
      <img
        src={src}
        alt={alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
        {...props}
      />
    </span>
  );
}

/**
 * Typography lives in the `.prose` class in globals.css. The only override
 * that isn't pure typography is swapping in framework-aware primitives
 * (next/link) and grounding pictures with .plate-ground.
 */
const components = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");

    return isInternal ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    );
  },

  img: ContentImage,
  ContentImage,
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkCjkFriendly],
            rehypePlugins: [rehypeSlug, rehypeCjkQuotes],
          },
        }}
      />
    </div>
  );
}
