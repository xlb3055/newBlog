---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Mybatis-plus
- 后端开发技巧
---
# Mybatis-plus 连接mysql数据库的配置项
```properties
# 数据库
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/[数据库名称]?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root 
    password: [密码] 

```