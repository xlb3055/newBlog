---
icon: pen-to-square
date: 2024-08-11
category:
- 前端
tag:
- Node.js
- 前端开发技巧
---
# http-server的安装及使用
## 什么是http-server？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http-server 是一个简单的命令行 HTTP 服务器，它可以快速地将任何目录变成一个 HTTP 服务器。这对于快速搭建本地开发环境、测试静态网页或分享文件非常有用。
## http-server的安装
1. 打开终端或命令提示符
2. 使用命令 `npm install -g http-server` 进行全局安装。<br>
如果只希望在当前项目使用，则使用命令 `npm install http-server --save-dev`
``` bash
npm install -g http-server
npm install http-server --save-dev
```
## http-server的使用
使用命令 `http-server [path] [-p port]`启动服务器，其中：
* `[path]`为指定作为HTTP服务器根目录的文件夹，如果不指定，则默认使用当前目录。
* `[-p port]`为可选参数，用于指定服务器监听的端口，默认为8080端口。
``` bash
http-server [path] [-p port]
# 举个栗子：
# http-server E:\CodeProject\IDEAProgram\FileUpload\uploads -p 3010
# 意为将本地项目 FileUpload 的 uploads 文件夹作为HTTP服务器根目录，同时指定端口号为3010
```