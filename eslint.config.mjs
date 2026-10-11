import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build output from opennextjs-cloudflare — generated, not authored.
    ".open-next/**",
    ".wrangler/**",
  ]),
  {
    /**
     * 制品区（隙间月影）是从 sukima-ml 整套搬过来的。那边是 Docusaurus，没有这两条
     * 编译器规则，代码里确实有「effect 里同步 setState」和「渲染期读 ref」的写法
     * （翻页动画、立绘点击命中、气泡定位都依赖它们）。搬运阶段不动行为：改这些地方
     * 要重新手验那几条交互，这里先把规则收窄——主站自己的代码照旧受约束。
     */
    files: ["src/components/sukima/**", "src/app/sukima/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
