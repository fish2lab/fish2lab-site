import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { SITE_AUTHOR, SITE_VISION } from "@/lib/site";

/* next/image cannot render inside ImageResponse's Satori tree. */
/* eslint-disable @next/next/no-img-element */

export const SOCIAL_IMAGE_ALT =
  "fish²lab — photography, research and writing by Silas Su";
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };
export const SOCIAL_IMAGE_CONTENT_TYPE = "image/png";

export async function createSocialImage() {
  const mark = await readFile(
    path.join(process.cwd(), "public/images/mark/whale-fish_640.png"),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#faf8f4",
        color: "#26231f",
        padding: "72px 84px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 760,
        }}
      >
        <div style={{ display: "flex", fontSize: 82, letterSpacing: "-3px" }}>
          fish²lab
        </div>
        <div
          style={{
            display: "flex",
            width: 92,
            height: 3,
            margin: "28px 0 30px",
            background: "#b71c1c",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 34,
            lineHeight: 1.25,
            color: "#5a544c",
          }}
        >
          {SITE_VISION}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 19,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#9c9285",
          }}
        >
          {SITE_AUTHOR.name} · {SITE_AUTHOR.nameZh}
        </div>
      </div>
      <img
        src={`data:image/png;base64,${mark.toString("base64")}`}
        width={250}
        height={250}
        alt=""
        style={{ objectFit: "contain" }}
      />
    </div>,
    SOCIAL_IMAGE_SIZE,
  );
}
