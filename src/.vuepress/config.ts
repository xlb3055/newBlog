import { defineUserConfig } from "vuepress";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import theme from "./theme.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineUserConfig({
  base: "/newBlog/",

  lang: "zh-CN",
  title: "Bin的技术博客",
  description: "记录八股和相关技术的博客",

  theme,

  alias: {
    "@theme-hope/modules/blog/components/InfoList": resolve(
      __dirname,
      "components/InfoList.js"
    ),
  },

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
