import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  // 配置 `posts` 目录的各个子目录，取消统一的“面试题”标题
  "/posts/": [
    {
      text: "Java",
      icon: "fab fa-java",
      prefix: "Java/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "计算机基础",
      icon: "fas fa-desktop",
      prefix: "计算机基础/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "数据库",
      icon: "fas fa-database",
      prefix: "数据库/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "开发工具",
      icon: "fas fa-wrench",
      prefix: "开发工具/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "常用框架",
      icon: "fas fa-th",
      prefix: "常用框架/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "系统设计",
      icon: "fas fa-cogs",
      prefix: "系统设计/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "分布式",
      icon: "fas fa-network-wired",
      prefix: "分布式/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "高性能",
      icon: "fas fa-rocket",
      prefix: "高性能/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "高可用",
      icon: "fas fa-shield-alt",
      prefix: "高可用/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "杂碎记录",
      icon: "fas fa-sticky-note",
      prefix: "杂碎记录/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
  ],

  // 数据结构与算法独立的侧边栏
  "/leetcode/": [
    {
      text: "哈希",
      icon: " fas fa-project-diagram",
      prefix: "哈希/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "双指针",
      icon: " fas fa-project-diagram",
      prefix: "双指针/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "滑动窗口",
      icon: " fas fa-project-diagram",
      prefix: "滑动窗口/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "子串",
      icon: " fas fa-project-diagram",
      prefix: "子串/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "数组",
      icon: " fas fa-project-diagram",
      prefix: "数组/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "矩阵",
      icon: " fas fa-project-diagram",
      prefix: "矩阵/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "链表",
      icon: " fas fa-project-diagram",
      prefix: "链表/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
  ],
  // 项目经验独立的侧边栏
  "/tech/": [
    {
      text: "RabbitMQ",
      icon: "fas fa-sitemap",
      prefix: "RabbitMQ/",
      children: "structure",
      collapsible: true,
      expanded: false,  // 默认展开
    },
    {
      text: "Redis",
      icon: "fas fa-sitemap",
      prefix: "Redis/",
      children: "structure",
      collapsible: true,
      expanded: false,  // 默认展开
    },
    {
      text: "MyBatis",
      icon: "fas fa-sitemap",
      prefix: "MyBatis/",
      children: "structure",
      collapsible: true,
      expanded: false,  // 默认展开
    },
    {
      text: "实习日记",
      icon: "fas fa-sitemap",
      prefix: "实习日记/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
  ],
  // 根目录和 intro 的配置（如果需要）
  "/": [
    "",
    "intro",
  ],
});
