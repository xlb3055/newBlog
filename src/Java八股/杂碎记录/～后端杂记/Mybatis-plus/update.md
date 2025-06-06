---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Mybatis-plus
- 后端开发技巧
---
# Mybatis-plus 的update语法（部分）
## update 的基本使用
```java
    //测试更新
    @Test
    public void testUpdate() {
        User user = new User();
        user.setId(1796384136507219970L);
        user.setName("huo");
        // 注意参数是 对象
        int i = userMapper.updateById(user);
        System.out.println(i);
    }
```

## update的自动填充策略

创建时间、修改时间。这些东西操作一遍都是自动化完成的。<br>
阿里巴巴开发手册：所有数据库表：gmt_create、gmt_modified几乎所有的表都要配置上！而且需要自动化

* 方式一：数据库级别

1. 在表中新增字段 `create_time`，`update_time`
2. 设置根据当前时间戳更新
3. 把实体类同样新增字段`createTime`、`updateTime`

* 方式二：代码级别

1. 在表中新增字段 `create_time`，`update_time`
2. 把实体类同样新增字段`createTime`、`updateTime`
3. 实体类字段添加注解
```java
    // 字段添加填充内容
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    // 字段更新填充内容
    @TableField(fill = FieldFill.UPDATE)
    private Date updateTime;
```
4. 编写处理器来处理这个注解即可
   ```java
   @Slf4j
   @Component
   public class MyMetaObjectHandler implements MetaObjectHandler {
       // 插入时填充策略
       @Override
       public void insertFill(MetaObject metaObject) {
           log.info("开始插入填充...");
   //        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
           this.setFieldValByName("createTime",new Date(),metaObject);
           this.setFieldValByName("updateTime",new Date(),metaObject);
       }
   
       // 更新时填充策略
       @Override
       public void updateFill(MetaObject metaObject) {
           log.info("开始更新填充...");
   //        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
           this.setFieldValByName("updateTime",new Date(),metaObject);
       }
   }
   ```
