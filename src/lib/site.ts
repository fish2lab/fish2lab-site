export const SITE_URL = "https://fish2lab.com";
export const SITE_NAME = "fish2lab";
export const SITE_TITLE = "fish²lab — Silas Su · 苏心贤";
export const SITE_DESCRIPTION =
  "Photography, research and blog posts by Silas Su. 摄影系列、研究进度与文章。";
export const HTML_LANG = "zh-CN";
export const OG_LOCALE = "zh_CN";

/** The line the whole site is built around; the home page opens on it. */
export const SITE_VISION = "A public record of a private practice.";

export const SITE_AUTHOR = {
  name: "Silas Su",
  nameZh: "苏心贤",
  email: "fish2lab@gmail.com",
} as const;

/**
 * The NeoBar splits the list in two: the three sections ride the bar's
 * centre line as one segmented control — a single quiet switch rather than
 * three competing buttons — and About sits hard right where it mirrors the
 * wordmark on the left. Everywhere else (mobile menu, footer) nav stays
 * plain text links, and those take `navLinks`, which is just the two put
 * back together in reading order.
 */
export const navCentreLinks = [
  { label: "Portfolio", labelZh: "作品", href: "/portfolio" },
  { label: "Research", labelZh: "研究", href: "/research" },
  { label: "Blog", labelZh: "文章", href: "/blog" },
] as const;

export const navEdgeLink = {
  label: "About",
  labelZh: "关于",
  href: "/about",
} as const;

export const navLinks = [...navCentreLinks, navEdgeLink] as const;

/**
 * The footer carries one link the top nav does not: 友情链接 sits a rung
 * below the four sections, reachable from every page but never competing
 * with them.
 */
export const footerLinks = [
  ...navLinks,
  { label: "Friends", labelZh: "友情链接", href: "/friends" },
] as const;

/**
 * My other sites, named in full. `note` is only read by the home page's
 * Elsewhere card, which has the room for it; the footer and About page show
 * labels alone.
 */
export const elsewhere = [
  {
    label: "隙间月影 Sukima Moonlight",
    href: "https://sukima.fish2lab.com",
    note: "东方 Project 同人企划",
  },
] as const;

/**
 * Ways to reach me. These render as icons everywhere rather than as text, so
 * `label` is never printed — it is the accessible name, which is why each one
 * spells out the destination a sighted reader gets from the glyph.
 */
export const contacts = [
  { id: "mail", label: `Email ${SITE_AUTHOR.email}`, href: `mailto:${SITE_AUTHOR.email}` },
  { id: "github", label: "GitHub — fish2lab", href: "https://github.com/fish2lab" },
  { id: "x", label: "X — @Chypre271828", href: "https://x.com/Chypre271828" },
] as const;

/**
 * 友情链接, carried over from xian-yuyu-diary. Hand-kept, in no particular
 * order — never seeded with plausible-looking entries, since an invented
 * friend link is a link to someone who never agreed to it.
 *
 * `avatar` is either a short glyph the card sets in type, or an image path
 * under /public. The diary used the same two-kind model and most of these
 * people are represented by a single character rather than a photo, which is
 * worth keeping: it is the thing that makes the list look hand-made.
 */
export type Friend = {
  name: string;
  href: string;
  /** How the address is written out, e.g. "carolyn.sh" or a site's own name. */
  linkText: string;
  note?: string;
  avatar:
    | { type: "glyph"; content: string }
    | { type: "image"; src: string };
};

export const friends: readonly Friend[] = [
  {
    name: "Carolyn Sun",
    href: "https://carolyn.sh/",
    linkText: "carolyn.sh",
    note: "高技术力美少女的站点",
    avatar: { type: "glyph", content: "⌘" },
  },
  {
    name: "🐟🐟",
    href: "https://github.com/HFDLYS/BJTUselfService",
    linkText: "交大自由行",
    note: "一己之力熏陶北交的🐟文化",
    avatar: { type: "image", src: "/images/friends/yuyu.webp" },
  },
  {
    name: "上条当咩",
    href: "https://love.nimisora.icu/",
    linkText: "某科学的变异当麻",
    note: "bjtu.top 的运营者",
    avatar: { type: "glyph", content: "天" },
  },
  {
    name: "Alexander Gu",
    href: "https://alexgu.art/",
    linkText: "alexgu.art",
    note: "胶片摄影爱好者，用镜头记录模拟世界的美好",
    avatar: { type: "glyph", content: "📷" },
  },
  {
    name: "Zemengzhou Space",
    href: "https://zemengzhou.com",
    linkText: "zemengzhou.com",
    note: "择梦舟的奇幻漂流",
    avatar: { type: "image", src: "/images/friends/zemengzhou.webp" },
  },
];

/** What to send me if you want to swap links — the /friends page shows it. */
export const LINK_EXCHANGE = {
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  avatar: `${SITE_URL}/images/mark/whale-fish_320.webp`,
} as const;

/** Author facts shared by the About page and the home-page profile card. */
export const ABOUT = {
  role: "PhD Student, Photographer and Learner",
  roleZh: "博士生 · 摄影师 · 学习者",
  affiliation: "Beijing Jiaotong University",
  field: "Computer Science → Cybersecurity",
  location: "Beijing / 北京",

  interests: ["Agent", "Cognitive Science", "Math"],

  research: [
    "Self-improving harnesses: accepting and rolling back self-made changes, human review for behaviour rules, retrodiction as the signal",
    "Agent security at the harness layer: indirect prompt injection, Skills / MCP supply chain, execution sandboxing, memory poisoning",
    "Refusal robustness inside the model: refusal directions, SAE features, latent channels that escape token-level audits",
  ],

  recently: [
    {
      title: "研究：RSI（递归自我改进）",
      body: "模型已经强到可以在 harness 层套用深度学习里那些符合直觉的老办法，比如正则化、off-policy 经验、验证集隔离，并用它们直接提升模型表现。我关心的是：如果 RSI 正在重走深度学习和 LLM 的老路，那它当前状态的下一步、下下步是什么？例如，可编辑的 verifier 如何保持可信。我只想做那些价值不会随模型变强而缩水的问题。",
    },
    {
      title: "用 Agent 加速学习",
      body: "坦白说，Agent 太强以后，我更常拿它做 ROI 不明但精神净值很高的东西，比如 Three.js 和各种偏艺术创作的项目。却忽略了一件可能 4o 就能做好的事：指导我自己学习。现在想把这件事补回来。",
    },
    {
      title: "Personal Agent 与“人”这个混沌系统",
      body: "现在的 Personal Agent 能帮你做事，但还不能指导元行动：教你做对的事，降低难度，同时提升你的元认知和动机。很多事，尤其是身体和健康，终究“绝知此事要躬行”。为什么还没有一个 Agent 能接住“生活”这个 high-level 问题？这是我在想的。",
    },
    {
      title: "学习在 AGI 时代仍然有效的知识",
      body: "重点是计算机与安全的底层功夫。目的不是自己手写一切，而是当模型交出一份看起来很对的结果时，我能看出它哪里不对。",
    },
    {
      title: "欣赏各种形态的艺术",
      body: "",
    },
  ],

  gear: [
    { name: "Fujifilm GFX100s", detail: "102 MP · 44×33mm · Medium Format" },
    { name: "GF 45mm f/2.8 R WR", detail: "Prime" },
  ],
} as const;

/**
 * Giscus comment thread config.
 *
 * The public IDs come from giscus.app after enabling Discussions and granting
 * the Giscus GitHub App access to fish2lab/fish2lab-site. Threads map strictly by
 * each entry's canonical URL (`specific` mapping) into the Announcements
 * category, so apex and subdomain hosts share one discussion.
 */
export const GISCUS: {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
} | null = {
  repo: "fish2lab/fish2lab-site",
  repoId: "R_kgDOToNj5w",
  category: "Announcements",
  categoryId: "DIC_kwDOToNj584DCTnw",
};
