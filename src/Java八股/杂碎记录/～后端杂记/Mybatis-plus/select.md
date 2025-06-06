---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Mybatis-plus
- 后端开发技巧
---
# Mybatis-plus 的select语法（部分）
```java
//    测试查询
    @Test
    public void testSelectById(){
        User user = userMapper.selectById(1796463485688344577L);
        System.out.println(user);
    }

//    测试批量查询
    @Test
    public void testSelectBatchId(){
        List<User> users = userMapper.selectBatchIds(Arrays.asList(1796463485688344577L, 1796471132068089857L));
        users.forEach(System.out::println);
    }

//    按条件查询之一：使用map操作
    @Test
    public void testSelectBatchIds(){
        HashMap<String, Object> map = new HashMap<>();
        // 自定义要查询的条件
        map.put("name","张三");
        map.put("age",3);

        List<User> users = userMapper.selectByMap(map);
        users.forEach(System.out::println);
    }

// 分页查询
userMapper.selectPage(new Page<>(当前页,每页条数),wrapper构造器);
```