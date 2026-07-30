import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

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

  return (
    <Image
      src={src}
      alt={alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      sizes="(min-width: 768px) 40rem, 100vw"
      className="h-auto w-full"
      {...props}
    />
  );
}

/**
 * Typography lives in the `.prose` class in globals.css. These overrides only
 * exist to swap in framework-aware primitives (next/link, next/image).
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
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
