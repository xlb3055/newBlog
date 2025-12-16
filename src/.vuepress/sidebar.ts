import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  // 配置 `posts` 目录的各个子目录，取消统一的“面试题”标题
  "/Java八股/": [
    {
      text: "Java基础",
      icon: "fab fa-java",
      prefix: "Java/Java基础/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "Java并发",
      icon: "fab fa-java",
      prefix: "Java/Java并发/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "Java集合",
      icon: "fab fa-java",
      prefix: "Java/Java集合/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "Linux",
      icon: "fab fa-linux",
      prefix: "计算机基础/Linux/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "操作系统",
      icon: "fas fa-laptop-code",
      prefix: "计算机基础/操作系统/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "计算机网络",
      icon: "fas fa-network-wired",
      prefix: "计算机基础/网络/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "MySQL",
      icon: "fas fa-database",
      prefix: "数据库/MySQL/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "Redis",
      icon: "fas fa-server",
      prefix: "数据库/Redis/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "MongoDB",
      icon: "fas fa-leaf",
      prefix: "数据库/MongoDB/",
      children: "structure",
      collapsible: true,
      expanded: true,
    },
    {
      text: "Elasticsearch",
      icon: "fas fa-search",
      prefix: "数据库/Elasticsearch/",
      children: "structure",
      collapsible: true,
      expanded: false,
    },
    {
      text: "数据库基础",
      icon: "fas fa-database",
      prefix: "数据库/基础/",
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
    {
      text: "技巧",
      icon: " fas fa-project-diagram",
      prefix: "技巧/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "多维动态规划",
      icon: " fas fa-project-diagram",
      prefix: "多维动态规划/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
      {
      text: "动态规划",
      icon: " fas fa-project-diagram",
      prefix: "动态规划/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "贪心",
      icon: " fas fa-project-diagram",
      prefix: "贪心/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "堆",
      icon: " fas fa-project-diagram",
      prefix: "堆/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "栈",
      icon: " fas fa-project-diagram",
      prefix: "栈/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "二分查找",
      icon: " fas fa-project-diagram",
      prefix: "二分查找/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
  ],
  // 项目经验独立的侧边栏
  "/tech/": [
    {
      text: "场景",
      icon: "fas fa-sitemap",
      prefix: "场景/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
  ],
  "/奶奶八股/": [
    {
      text: "基础",
      icon: "fas fa-sitemap",
      prefix: "基础/",
      children: "structure",
      collapsible: true,
      expanded: true,  // 默认展开
    },
    {
      text: "Neo4j",
      icon: "fas fa-sitemap",
      prefix: "Neo4j/",
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
