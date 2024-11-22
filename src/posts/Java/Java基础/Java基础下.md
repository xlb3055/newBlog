---
icon: pen-to-square
date: 2024-11-10
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# Java基础面试题下


---

# Java 基础知识面试问题详解

## 异常处理

### 1. Exception 和 Error 有什么区别？
- **Exception**：表示程序在运行时的非严重问题，是可以捕获并处理的异常。如文件未找到（`FileNotFoundException`）或数组越界（`ArrayIndexOutOfBoundsException`）。
- **Error**：表示系统级的严重错误，通常无法恢复或处理，如内存不足（`OutOfMemoryError`）。程序一般不需要处理 `Error`。

```java
try {
    int[] arr = new int[5];
    System.out.println(arr[10]); // 数组越界
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("捕获到 Exception: " + e.getMessage());
}
```

### 2. Checked Exception 和 Unchecked Exception 有什么区别？
- **Checked Exception**：在编译时被强制检查，必须使用 `try-catch` 或 `throws` 声明处理，如 `IOException`。
- **Unchecked Exception**：编译时不强制检查，通常是程序逻辑错误导致的，如 `NullPointerException`。

```java
public void readFile(String fileName) throws IOException {
    BufferedReader reader = new BufferedReader(new FileReader(fileName));
    // 如果文件不存在，这里会抛出 IOException
}
```

### 3. Throwable 类常用方法有哪些？
- **`getMessage()`**：返回异常的简短描述。
- **`printStackTrace()`**：打印异常的详细堆栈跟踪，帮助定位错误。
- **`getCause()`**：返回引发此异常的原因。

### 4. try-catch-finally 如何使用？
- **try**：包含可能抛出异常的代码。
- **catch**：用于捕获并处理异常。
- **finally**：无论是否有异常，`finally` 中的代码始终会执行。

```java
try {
    int result = 10 / 0; // 将会抛出异常
} catch (ArithmeticException e) {
    System.out.println("捕获到异常: " + e.getMessage());
} finally {
    System.out.println("这是 finally 块，始终执行");
}
```

### 5. finally 中的代码一定会执行吗？
- **通常会执行**，即使 `try` 或 `catch` 块有 `return` 语句。
- **特殊情况**：JVM 崩溃或执行 `System.exit()` 会导致 `finally` 不执行。

### 6. 如何使用 try-with-resources 代替 try-catch-finally？
- **try-with-resources**：自动关闭实现了 `AutoCloseable` 接口的资源，如文件、数据库连接等。相比手动关闭资源更安全。

```java
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    System.out.println(reader.readLine());
} catch (IOException e) {
    System.out.println("文件读取失败");
}
```

### 7. 异常使用有哪些需要注意的地方？
- 避免使用 `catch(Exception e)` 捕获所有异常，因为这可能掩盖程序中的错误。
- 捕获后尽量提供有用的信息，而不是简单地打印异常信息。

---

## 泛型

### 1. 什么是泛型？有什么作用？
- **泛型**：允许类和方法可以操作各种不同数据类型，而不必指定特定的类型，保证代码的复用性和类型安全性。

### 2. 泛型的使用方式有哪几种？
- **泛型类**：例如 `List<T>`。
- **泛型方法**：如 `<T> T getData(T data)`。
- **泛型接口**：如 `Comparable<T>`。

```java
// 泛型类示例
class Box<T> {
    private T content;
    public void setContent(T content) { this.content = content; }
    public T getContent() { return content; }
}

Box<Integer> integerBox = new Box<>();
integerBox.setContent(10);
System.out.println(integerBox.getContent());
```

### 3. 项目中哪里用到了泛型？
- 泛型在 Java 集合框架中大量使用，如 `List<T>`、`Map<K, V>`，可以确保集合中的元素类型一致，避免类型转换错误。

---

## 反射

### 1. 何谓反射？
- **反射**：Java 的一种机制，允许在运行时检查和修改类、方法和属性的信息。

### 2. 反射的优缺点？
- **优点**：提高灵活性，可以动态加载类，适合编写框架、插件等。
- **缺点**：性能开销较大，不安全（可以访问私有成员），代码可读性差。

### 3. 反射的应用场景？
- 框架（如 Spring）、动态代理、依赖注入（如注解驱动）等。

```java
Class<?> clazz = Class.forName("java.util.ArrayList");
Method addMethod = clazz.getMethod("add", Object.class);
List<String> list = new ArrayList<>();
addMethod.invoke(list, "反射添加的元素");
System.out.println(list);
```

---

## 注解

### 1. 何谓注解？
- **注解**：用于给代码提供元数据的标记，注解信息可用于编译检查或运行时处理。

### 2. 注解的解析方法有哪几种？
- **编译时解析**：通过注解处理器（APT）在编译阶段解析。
- **运行时解析**：通过反射机制读取和解析注解。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface MyAnnotation {
    String value();
}

@MyAnnotation("这是一个自定义注解")
public void myMethod() {}
```

---

## SPI

### 1. 何谓 SPI？
- **SPI**（Service Provider Interface）：Java 提供的一种服务提供机制，允许在运行时动态加载实现类。

### 2. SPI 和 API 有什么区别？
- **API**：定义程序调用的接口。
- **SPI**：定义服务提供者接口，便于实现多态和扩展。

### 3. SPI 的优缺点？
- **优点**：插件化设计，提高扩展性。
- **缺点**：加载实现类时有性能开销，配置较复杂。

---

## 序列化和反序列化

### 1. 什么是序列化和反序列化？
- **序列化**：将对象转换为字节流，以便存储或传输。
- **反序列化**：将字节流转换回对象。

### 2. 如果有些字段不想进行序列化怎么办？
- 使用 `transient` 关键字标记不参与序列化的字段。

```java
class Person implements Serializable {
    private String name;
    private transient int age; // age 字段不会被序列化
}
```

### 3. 常见序列化协议有哪些？
- Java 序列化、JSON、XML、Protocol Buffers、Kryo 等。

### 4. 为什么不推荐使用 JDK 自带的序列化？
- **效率低下**，生成的字节流较大，存在安全漏洞，推荐使用其他序列化方式。

---

## I/O

### 1. Java IO 流了解吗？
- Java I/O 提供了多种输入输出流操作，支持文件读写、网络通信等。

### 2. I/O 流为什么要分为字节流和字符流呢？
- **字节流**：处理二进制数据，如图片、视频。
- **字符流**：处理文本文件，自动处理 Unicode 字符。

### 3. Java IO 中的设计模式有哪些？
- **装饰器模式**：增强流的功能，例如 `BufferedReader` 装饰 `FileReader`。
- **适配器模式**：`InputStreamReader` 将字节流适配为字符流。

### 4. BIO、NIO 和 AIO 的区别？
- **BIO**：每个连接对应一个线程，适合少量连接。
- **NIO**：一个线程管理多个连接，适合高并发场景。
- **AIO**：异步操作，支持超高并发，适合大规模 I/O 处理。

---

## 语法糖

### 1. 什么是语法糖？
- **语法糖**：使代码更简洁、可读的语言特性，本质不改变代码功能。

### 2. Java 中有哪些常见的语法糖？
- **自动装箱/拆箱**：`Integer i = 10;` 实际上编译器将 int 自动转换为 Integer。
- **泛型**：`List<String> list = new ArrayList<>();`。
- **增强 for 循环**：`for (String s : list)`。
- **可变参数**：`public void method(String... args)`。

---

