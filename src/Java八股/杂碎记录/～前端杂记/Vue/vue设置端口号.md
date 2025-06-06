---
icon: pen-to-square
date: 2024-08-11
category:
- 前端
tag:
- Vue
- 前端开发技巧
---

# Vue设置端口号
>  在 vue.config.js 文件中加入注释部分代码

```javascript
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	/*
	从这里开始
	*/
	devServer: {
		port: 8099, //此处为自己设置的端口号
	}
	/*
	到这里结束
	*/
})
```
