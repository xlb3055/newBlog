---
icon: pen-to-square
date: 2024-12-03
category:
  - 后端
tag:
  - Java
  - 后端开发技巧
---
# Java 魔法类 Unsafe 详解


#### 1. **Unsafe 介绍**

`Unsafe` 是 Java 的一个内部类，属于 `sun.misc` 包。它提供了一些底层的操作功能，这些操作在 Java 语言的常规 API 中是不可访问的。由于其强大的功能，它被称为 "魔法类"。`Unsafe` 主要用于开发性能关键的代码，底层库的实现，甚至在一些特殊情况下，修改 Java 堆栈、直接操作内存和对象等。

然而，由于其功能非常强大，`Unsafe` 是非标准的工具，不建议直接使用。在 JDK9 及以后，`Unsafe` 的使用受到了更严格的限制，但它依然在 Java 的运行时中扮演着重要角色。

#### 2. **Unsafe 创建**

`Unsafe` 类本身并不能直接通过构造器进行实例化。它的唯一实例是通过反射获得的。创建 `Unsafe` 对象的方式如下：

```java
import sun.misc.Unsafe;
import java.lang.reflect.Field;

public class UnsafeDemo {
    public static void main(String[] args) throws Exception {
        Field unsafeField = Unsafe.class.getDeclaredField("theUnsafe");
        unsafeField.setAccessible(true);
        Unsafe unsafe = (Unsafe) unsafeField.get(null);
        
        System.out.println(unsafe);
    }
}
```

**注意：** 获取 `Unsafe` 实例的代码只能在 JDK 内部使用，因为它使用了反射机制来访问 `Unsafe` 的私有字段。在普通的开发中，直接使用 `Unsafe` 会受到限制。

#### 3. **Unsafe 功能**

`Unsafe` 提供了一些非常低层次的操作，主要包括：

- 内存操作：通过 `Unsafe` 可以直接分配和访问内存。
- 对象操作：能够操作对象的字段（包括私有字段）。
- 数组操作：可以直接对数组进行读写操作。
- CAS 操作（Compare-And-Swap）：提供无锁的并发编程操作。
- 线程调度：控制线程的启动、暂停和中断等。
- Class 操作：直接获取类元数据。

#### 4. **内存操作**

`Unsafe` 提供了许多内存操作方法，允许你直接操作内存区域，避免了传统的 Java 堆内存管理。它提供了以下常用的方法：

- **分配内存**：
  ```java
  long address = unsafe.allocateMemory(1024L);  // 分配 1024 字节的内存
  ```

- **释放内存**：
  ```java
  unsafe.freeMemory(address);  // 释放之前分配的内存
  ```

- **设置内存**：
  ```java
  unsafe.setMemory(address, 1024L, (byte) 0);  // 将 1024 字节的内存区域设置为零
  ```

- **访问内存内容**：
  ```java
  unsafe.putInt(address, 42);  // 在内存地址上存储一个整数值
  int value = unsafe.getInt(address);  // 从内存地址读取整数
  ```

#### 5. **内存屏障**

内存屏障是一种硬件指令，用于确保操作的顺序。在并发编程中，内存屏障可以帮助处理线程间的同步问题，避免某些操作顺序被 CPU 重排。

`Unsafe` 提供了以下内存屏障操作：

- **插入全屏障**：确保所有读写操作都不会被重排序。
  ```java
  unsafe.fullFence();  // 全屏障
  ```

- **插入读取屏障**：确保前面的读取操作不会被重排序到后面。
  ```java
  unsafe.loadFence();  // 读取屏障
  ```

- **插入写入屏障**：确保前面的写操作不会被重排序到后面。
  ```java
  unsafe.storeFence();  // 写入屏障
  ```

#### 6. **对象操作**

`Unsafe` 可以直接访问和修改对象的字段，包括私有字段。这在 Java 的反射机制无法做到的情况下非常有用。常用的操作包括：

- **获取对象字段偏移量**：
  ```java
  long offset = unsafe.objectFieldOffset(Field field);
  ```

- **获取对象字段值**：
  ```java
  Object value = unsafe.getObject(object, offset);  // 获取字段值
  ```

- **设置对象字段值**：
  ```java
  unsafe.putObject(object, offset, value);  // 设置字段值
  ```

- **获取对象实例的构造方法**：
  ```java
  unsafe.ensureClassInitialized(SomeClass.class);
  ```

#### 7. **数组操作**

`Unsafe` 提供了对数组进行操作的能力，类似于 `System.arraycopy()`，但是更底层，允许直接操作数组元素。常用的数组操作包括：

- **获取数组元素的偏移量**：
  ```java
  long arrayBaseOffset = unsafe.arrayBaseOffset(int[].class);
  ```

- **获取数组的规模（长度）**：
  ```java
  int arrayIndexScale = unsafe.arrayIndexScale(int[].class);
  ```

- **设置数组值**：
  ```java
  unsafe.putInt(array, arrayBaseOffset + i * arrayIndexScale, value);  // 设置数组元素
  ```

- **获取数组值**：
  ```java
  int value = unsafe.getInt(array, arrayBaseOffset + i * arrayIndexScale);
  ```

#### 8. **CAS 操作（Compare-And-Swap）**

CAS 操作是一种无锁的原子操作，它用于并发编程中，帮助实现线程安全的更新。`Unsafe` 提供了多个版本的 CAS 操作，支持原子地比较并交换数据。

- **基本 CAS 操作**：
  ```java
  boolean success = unsafe.compareAndSwapInt(object, offset, expectedValue, newValue);
  ```

- **CAS 用于数组**：
  ```java
  boolean success = unsafe.compareAndSwapObject(array, arrayBaseOffset + i * arrayIndexScale, expectedValue, newValue);
  ```

#### 9. **线程调度**

`Unsafe` 提供了一些方法用于线程调度和管理，包括启动、暂停和中断线程等。

- **启动线程**：
  ```java
  unsafe.unpark(thread);  // 唤醒线程
  unsafe.park(false, 0);  // 阻塞当前线程
  ```

- **中断线程**：
  ```java
  unsafe.interrupt(thread);  // 中断线程
  ```

#### 10. **Class 操作**

`Unsafe` 还提供了一些类加载相关的操作，可以直接获取类的元数据。

- **确保类已经初始化**：
  ```java
  unsafe.ensureClassInitialized(SomeClass.class);
  ```

#### 11. **系统信息**

`Unsafe` 还可以获取一些底层的系统信息，如 JVM 内存和硬件特性。

- **获取 JVM 启动时的内存布局**：
  ```java
  long maxMemory = unsafe.maxMemory();
  ```

---

### 总结

`Unsafe` 是 Java 中提供的一个强大但危险的工具，它允许直接操作内存、修改对象字段、执行 CAS 操作、操控线程等。尽管它提供了对 Java 内存模型的低级控制，但是不建议普通开发者使用它，因为不当使用会引发难以调试的错误。对于一般的 Java 开发者，应该依赖于标准的并发工具和内存管理方式，避免直接使用 `Unsafe` 类。