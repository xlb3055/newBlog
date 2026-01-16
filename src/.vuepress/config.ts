import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/newBlog/",

  lang: "zh-CN",
  title: "Bin的技术博客",
  description: "记录八股和相关技术的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
