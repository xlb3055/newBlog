---
icon: pen-to-square
date: 2024-08-11
category:
- 前端
tag:
- Js
- 前端开发技巧
---
# Js判断对象是否为空对象的方法

首先定义一个空对象如下：
```javascript
const test_data = {}
```

方法一： 
```javascript
// 1. 使用JSON.stringify(obj)将对象转换成字符串，如果是空对象，转换后字符串为"{}"
// 2. 返回true表示为空对象
console.log(JSON.stringify(test_data) === "{}");
```

方法二：  

```javascript
// 1. 使用Object.keys(obj)获得对象的属性名列表
// 2. 如果属性名列表长度为0则表示为空数组
console.log(Object.keys(test_data).length == 0);
```

方法三：  

```javascript
let result = function(obj){
	for(let key in obj){
		return false; // 如果对象不为空，则能进行遍历，如果为空则无法遍历
	}
	return true;
}
console.log(result(test_data)); // 如果是空对象，返回true
```
