# fish²lab

fish²lab 是 Silas Su（苏心贤）的个人站点。一个 Next.js / OpenNext 构建同时服务主页、摄影作品集、研究记录和博客，最终运行在 Cloudflare Workers。

## URL 架构

站内链接统一使用 apex path，浏览器因此可以在任意 hostname 下继续做客户端导航；搜索和分享使用另一套 canonical URL。

| 内容 | canonical host | 内部 path |
| --- | --- | --- |
| 主页、About、Friends、Tags | `fish2lab.com` | `/`、`/about`、`/friends`、`/tags/:tag` |
| 摄影 | `portfolio.fish2lab.com` | `/portfolio` |
| 研究 | `research.fish2lab.com` | `/research` |
| 博客 | `blog.fish2lab.com` | `/blog` |

`www.fish2lab.com` 永久重定向到 apex。三个集合子域由 `next.config.ts` 的 host rewrite 映射到内部 path；不要在 Cloudflare 分别建立四个 Worker。

每个 canonical host 都有自己的 `/robots.txt` 和 `/sitemap.xml`。这是有意的：sitemap 内的 URL 必须与 sitemap 自身属于同一 host。

## 本地开发

需要 Node.js 20.9 或更高版本。依赖和开发服务器：

```bash
npm ci
npm run dev
```

普通 Next.js 生产构建用 `npm run build`。准备发布时还要跑 OpenNext 的 Cloudflare artifact preview，因为 `next start` 不会覆盖 Worker rewrite、静态资源 binding 和 cache interception：

```bash
npm run lint
npm run build
npm run preview
```

`preview` 默认监听 `http://127.0.0.1:8787`。子域路由可直接用 Host header 检查：

```bash
curl -I http://127.0.0.1:8787/
curl -I -H 'Host: portfolio.fish2lab.com' http://127.0.0.1:8787/
curl -I -H 'Host: research.fish2lab.com' http://127.0.0.1:8787/sitemap.xml
curl -I -H 'Host: blog.fish2lab.com' http://127.0.0.1:8787/robots.txt
```

## 内容

正文在 `content/{photography,research,blog}/`。frontmatter 至少包含 `title`、`date`、`summary` 和 `tags`；`legacy: true` 会把旧作放到 archive shelf，开发环境之外的 `draft: true` 不会进入构建。

摄影原图放进 `public/images/series/<slug>/` 后运行：

```bash
npm run series:manifest
```

它会从真实文件尺寸重建 `src/lib/series-frames.generated.ts`。半调图资产由 `npm run halftone` 重建。

## Giscus

文章组件使用公开仓库 [`fish2lab/fish2lab-site`](https://github.com/fish2lab/fish2lab-site) 的 GitHub Discussions，通过官方 `@giscus/react`（`<giscus-widget>`）挂载——不要在 RSC 树里直接放 `client.js` 的 `<script>`，Next.js 会把它提升到 `<head>`，评论 iframe 就插不进正文。Giscus GitHub App 已授权该仓库；映射是每篇文章的 canonical URL（`specific` + strict），讨论限定在 `Announcements` category，配置在 `src/lib/site.ts`。这样 `fish2lab.com/blog/…` 与 `blog.fish2lab.com/…` 共用同一条讨论。评论区接近 viewport 时才加载第三方 iframe，首次评论时 Giscus 才会创建对应 Discussion。

如果仓库发生转移、改名或重建 category，需要在 [giscus.app](https://giscus.app/) 重新取得 repository/category IDs，不能只改仓库名称。GraphQL 的 `repoId` / `categoryId` 在单纯改名后通常不变，但 `data-repo` 字符串必须改成新的 `owner/name`。

## 首次上线顺序

顺序的关键是先验证 GitHub/Giscus 的公开身份，再验证没有生产域名的 Worker artifact，最后才让 Cloudflare 接管 hostname。这样不会让一份尚未通过 Worker smoke test 的代码直接占用主域名。

### 1. 固定 GitHub 仓库和 Giscus

确认公开仓库仍已开启 Discussions、Giscus API 能返回 `Announcements` category。随后运行质量门并提交源码：

```bash
npm ci
npm run lint
npm run build
git add <本次要发布的文件>
git commit
git push -u origin main
```

不要在这一步把 Cloudflare token 写进仓库；Giscus 的四个 ID 是公开标识符，可以正常提交。

### 2. 准备 Cloudflare zone 和发布凭据

确认 `fish2lab.com` 已是当前 Cloudflare account 下的 active zone。Custom Domain 会由 Cloudflare 创建 DNS record 和证书，不需要预先给五个 hostname 填 placeholder IP；但同名 hostname 如果已经有 CNAME，必须先移除或迁移。

本机可以用 OAuth：

```bash
npx wrangler login --use-keyring
npx wrangler whoami
```

自动发布使用 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`，两者只放在本机进程环境或 GitHub Actions secrets。当前 token 只负责 Workers Scripts；Custom Domains 固定由 Cloudflare Dashboard 管理，因此 `wrangler.jsonc` 有意不声明 `route` 或 `routes`。如果未来希望 Wrangler 同时修改域名绑定，token 还必须具有 Zone / Workers Routes / Edit，并把五个 `custom_domain` route 恢复到配置。

### 3. 验证真实 Cloudflare artifact

```bash
npm ci
npm run lint
npm run build
npm run preview
```

除了页面本身，至少检查 apex 和三个子域的 `robots.txt`、`sitemap.xml`、canonical、Open Graph image，以及一个带中文或空格的 tag URL。`preview` 通过后再结束进程。

### 4. 新账号首次引导时先部署到 workers.dev

这一步只在迁移 Cloudflare account 或重建 Worker 时需要。临时把 `wrangler.jsonc` 的 `workers_dev` 设为 `true`，部署一次：

```bash
npm run deploy
```

在 Wrangler 输出的 URL 上检查主页、任意集合页、静态图片、`/robots.txt` 和 `/sitemap.xml`。这里的 hostname 不是 canonical host，因此只验证 artifact 能否工作，不把这个地址提交给搜索引擎。

### 5. 关闭 workers.dev 并绑定生产域名

workers.dev smoke 通过后，把 `workers_dev` 恢复为 `false` 并再次部署。然后在 Worker 的 Domains 页面逐一添加以下 Custom Domains：

```text
fish2lab.com
www.fish2lab.com
portfolio.fish2lab.com
research.fish2lab.com
blog.fish2lab.com
```

Cloudflare 会为这五个精确 hostname 建立 DNS 和证书；Custom Domain 不支持 wildcard，所以这里不能压成 `*.fish2lab.com`。Dashboard 是这些绑定的状态所有者，后续 `npm run deploy` 只替换 Worker 版本，不会删除或重建域名。首次引导完成后不再重复第 4、5 步。

### 6. 生产验收与搜索引擎提交

生产验收应覆盖 `https://fish2lab.com/`、三个集合子域的首页和 entry short URL、`www` 到 apex 的永久重定向、四份 robots 与 sitemap、页面 canonical/JSON-LD/Open Graph image，以及实际 Giscus 登录和首条测试评论。

域名稳定后，在 Google Search Console 验证 `fish2lab.com` 的 Domain property，并分别提交：

```text
https://fish2lab.com/sitemap.xml
https://portfolio.fish2lab.com/sitemap.xml
https://research.fish2lab.com/sitemap.xml
https://blog.fish2lab.com/sitemap.xml
```

## 后续发布

常规发布不再重复 GitHub/Giscus 和域名认证，只需在干净 checkout 中运行 `npm ci`、lint、build、OpenNext preview、deploy，然后对 canonical hosts 做最小远端 smoke。本站没有 ISR 或运行时内容写入；所有正文变化都随新 artifact 发布，因此 OpenNext 使用只读 Static Assets incremental cache，不需要 KV、R2、Queue 或 D1。
