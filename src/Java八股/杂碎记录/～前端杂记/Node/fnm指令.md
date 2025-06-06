---
icon: pen-to-square
date: 2024-08-11
category:
- 前端
tag:
- Node.js
- 前端开发技巧
---
# fnm指令

写在前面：fnm是一个基于Rust的Node.js版本管理工具，其命令如下，若要下载安装fnm,请点击查看文章[fnm下载](../../～工具杂记/fnm的安装.md)
```sh
/*列出所有可供下载的node版本*/
fnm ls-remote

/*查看系统安装了哪些版本*/
fnm list

/*使用特定版本的node*/
/*<version>是自己指定的版本号，如19.3.0*/
fnm use <version>

/*查看当前正在运行的版本号*/
fnm current

/*卸载node版本*/
/*<version>是自己指定的版本号，如19.3.0*/
fnm uninstall <version>

/*设置版本别名*/
fnm alias <version> <name>

```