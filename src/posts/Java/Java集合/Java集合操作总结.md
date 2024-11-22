---
icon: pen-to-square
date: 2024-11-14
category:
- 后端
tag:
- Java
- 集合
- 后端开发技巧
---
# Java集合操作总结

### 集合判空

判断集合是否为空可以通过 `isEmpty()` 或 `size()` 方法：

```java
List<String> list = new ArrayList<>();
if (list.isEmpty()) {
    System.out.println("集合为空");
}
```
或者：

```java
if (list.size() == 0) {
    System.out.println("集合为空");
}
```

### 集合转 Map

集合转 `Map` 可以使用 Java 8 的 `Collectors.toMap()` 方法。比如将一个 `List` 转换成 `Map`，以 `id` 为键：

```java
List<User> userList = Arrays.asList(new User(1, "Alice"), new User(2, "Bob"));
Map<Integer, String> userMap = userList.stream()
                                      .collect(Collectors.toMap(User::getId, User::getName));
```

### 集合遍历

常见的集合遍历方式有：

1. **增强型 for 循环**：
   ```java
   for (String item : list) {
       System.out.println(item);
   }
   ```

2. **迭代器**：
   ```java
   Iterator<String> iterator = list.iterator();
   while (iterator.hasNext()) {
       System.out.println(iterator.next());
   }
   ```

3. **Java 8 Stream API**：
   ```java
   list.forEach(System.out::println);
   ```

### 集合去重

使用 `Set` 去重：

```java
List<Integer> list = Arrays.asList(1, 2, 3, 3, 4);
Set<Integer> set = new HashSet<>(list);  // 去重后的集合
```

使用 Java 8 Stream 去重：

```java
List<Integer> list = Arrays.asList(1, 2, 3, 3, 4);
List<Integer> distinctList = list.stream().distinct().collect(Collectors.toList());
```

### 集合转数组

将集合转为数组：

```java
List<String> list = Arrays.asList("A", "B", "C");
String[] array = list.toArray(new String[0]);  // 使用指定类型的数组
```

### 数组转集合

将数组转为集合：

```java
String[] array = {"A", "B", "C"};
List<String> list = Arrays.asList(array);
```

---

