---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Mybatis-plus
- 后端开发技巧
---
# Mybatis-plus 的 insert语法（部分）
## insert的基本使用
```java
// 测试插入
    @Test
    public void testInsert(){
        User user = new User();
        user.setName("Howkinsen");
        user.setAge(3);
        user.setEmail("191050249@qq.com");

        int result = userMapper.insert(user);
        System.out.println(result);
        System.out.println(user);
    }
```

## insert的主键生成策略（雪花算法）

默认主键生成策略为ASSIGN_ID(3)---雪花算法：通过算法获得默认全局唯一id

分布式系统唯一id生成：[点此查看博客](https://juejin.cn/post/7191431147593662523?searchId=2024053111385686E03120FF5EDDABDB8E#heading-6)

### 什么是雪花算法

雪花算法是 Twitter 工程师提出的生成全局唯一 ID 的方案，其核心思想是：使用41bit作为毫秒数，10bit作为及其的ID（5个bit是数据中心，5个bit是机器ID），12bit作为毫秒内的流水号（意味着每个节点在每毫秒可以产生4096个ID），最后还有一个符号位，永远是0，可以保证几乎全球唯一！

## 设置主键自增

我们可以根据需要配置主键自增：
1. 实体类字段上 `@TableId(type = IdType.AUTO)`
2. 数据库字段设置自增
3. 其他的主线配置选项源码解释
```java
public enum IdType {
    AUTO(0), // 数据库id自增
    NONE(1), // 未设置主键
    INPUT(2), // 手动输入
    ASSIGN_ID(3), // 默认的全局id 雪花算法
    ASSIGN_UUID(4); // 全局唯一id uuid
}
```