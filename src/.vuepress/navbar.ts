import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    // 最上面的导航栏
    text: "面试专题",//名称
    icon: "fas fa-folder-open",//图标
    link: "/posts/",//路由
  },
  {
    // 最上面的导航栏
    text: "数据结构与算法",//名称
    icon: "fas fa-sitemap",//图标
    link: "/leetcode/",//路由
  },
  {
    // 最上面的导航栏
    text: "技术提升",//名称
    icon: "fas fa-folder-open",//图标
    link: "/tech/",//路由
  },
  // {
  //   text: "博文",
  //   icon: "pen-to-square",
  //   prefix: "/posts/",// 如果有子菜单的话相当于前面拼接一个/posts/地址
  //   children: [//如果有子菜单的话
  //     {
  //       text: "苹果",
  //       icon: "pen-to-square",
  //       prefix: "apple/",
  //       children: [
  //     标题
  //         { text: "苹果1", icon: "pen-to-square", link: "1" },
  //         { text: "苹果2", icon: "pen-to-square", link: "2" },
  //         "3",//这个是主题设置的快捷功能，等价于上面的{ text: "苹果3", icon: "pen-to-square", link: "3" },
  //         "4",
  //       ],
  //     },
  //     {
  //       text: "香蕉",
  //       icon: "pen-to-square",
  //       prefix: "banana/",
  //       children: [
  //         {
  //           text: "香蕉 1",
  //           icon: "pen-to-square",
  //           link: "1",
  //         },
  //         {
  //           text: "香蕉 2",
  //           icon: "pen-to-square",
  //           link: "2",
  //         },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     { text: "樱桃", icon: "pen-to-square", link: "cherry" },
  //     { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
  //     "tomato",
  //     "strawberry",
  //   ],
  // },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
