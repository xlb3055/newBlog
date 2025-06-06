import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

const ENCRYPT_PASSWORD = ["1234"]

// 定义主题配置
export default hopeTheme({
  // 网站基本信息
  hostname: "https://xlb3055.github.io",
  
  author: {
    name: "Bin",
    url: "/avator_img.jpg",
  },

  // 使用更现代的图标集
  iconAssets: "fontawesome-with-brands",
  
  // 设置Logo
  logo: "/avator_img.jpg",
  logoDark: "/avator_img.jpg",
  
  // GitHub仓库链接
  repo: "xlb3055/newBlog",
  repoLabel: "GitHub",
  
  docsDir: "src",
  
  // 深色模式切换按钮
  darkmode: "switch",
  
  // 全屏按钮支持
  fullscreen: true,
  
  // 页面信息显示
  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "路漫漫其修远兮，吾将上下而求索。",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "一个努力学习进步的开发者",
    intro: "/intro.html",
    // 博客头部配置
    avatar: "/avator_img.jpg",
    // 每页文章数量
    articlePerPage: 10,
    // 社交媒体链接
    medias: {
      GitHub: "https://github.com/xlb3055",
      Zhihu: "https://www.zhihu.com",
      Email: "1428982342@qq.com",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": ENCRYPT_PASSWORD,
    },
  },
  
  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题插件
  plugins: {
    // 博客插件
    blog: true,
    
    // 评论功能 - 暂时禁用，需要先在GitHub上安装Giscus应用
    // comment: {
    //   provider: "Giscus",
    //   repo: "xlb3055/blog-comments",
    //   repoId: "R_kgDOLF4Lfg",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOLF4Lfs4CdXVK",
    // },
    
    // 代码复制功能
    copyCode: {
      showInMobile: true,
    },
    
    // 图片预览
    photoSwipe: true,
    
    // 搜索功能
    search: true,
    
    // 阅读进度条
    readingTime: true,
    
    // 组件支持
    components: {
      components: ["Badge", "VPCard"],
    },

    // Markdown 增强
    mdEnhance: {
      // 文本对齐
      align: true,
      // 属性支持
      attrs: true,
      // 代码块分组
      codetabs: true,
      // 组件支持
      component: true,
      // 代码演示
      demo: true,
      // 图片增强
      figure: true,
      // 图片懒加载
      imgLazyload: true,
      // 图片大小
      imgSize: true,
      // 包含文件
      include: true,
      // 标记
      mark: true,
      // 脚注
      footnote: true,
      // 图表
      chart: true,
      // 流程图
      flowchart: true,
      // 代码块高亮
      vPre: true,
      plantuml: true,
      spoiler: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
