---
icon: pen-to-square
date: 2024-11-14
category:
- 后端
tag:
- Java
- 源码分析
- 后端开发技巧
---
# ArrayList

### `ArrayList` 核心源码解读与扩容机制分析

#### **ArrayList 扩容机制**

`ArrayList` 的底层实现依赖一个数组，当元素数量达到数组的最大容量时，`ArrayList` 会自动扩容。扩容的过程是通过 `grow` 方法进行的，该方法通常会将当前数组的容量增大为原容量的 1.5 倍。为了避免内存浪费，扩容操作会保证新数组的大小至少为所需的最小容量。

1. **扩容过程**：  
   当调用 `add()` 方法往 `ArrayList` 中添加元素时，如果当前数组没有足够的空间，`ArrayList` 会调用 `ensureCapacityInternal()` 方法确保容量足够。如果当前数组容量不足，`grow()` 方法会被调用来扩展数组。
   ```java
   private void grow(int minCapacity) {
       int oldCapacity = elementData.length;
       int newCapacity = oldCapacity + (oldCapacity >> 1);  // 扩容为原容量的1.5倍
       if (newCapacity - minCapacity < 0)  // 如果新容量不够，设为最小容量
           newCapacity = minCapacity;
       if (newCapacity > MAX_ARRAY_SIZE)  // 防止容量超过最大值
           newCapacity = hugeCapacity(minCapacity);
       elementData = Arrays.copyOf(elementData, newCapacity);
   }
   ```

2. **`ensureCapacityInternal()`**：  
   这个方法确保 `ArrayList` 的容量至少为所需容量，若当前容量不足会调用 `grow()` 扩容。
   ```java
   private void ensureCapacityInternal(int minCapacity) {
       if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
           elementData = new Object[DEFAULT_CAPACITY];  // 默认容量
       }
       if (minCapacity - elementData.length > 0)
           grow(minCapacity);
   }
   ```

#### **`System.arraycopy()` 与 `Arrays.copyOf()` 的区别**

- **`System.arraycopy()`**：  
  这是 Java 提供的底层方法，用于高效地将数组中的一部分元素复制到另一个数组中。它通过原生方法直接操作内存，性能非常高。
  ```java
  System.arraycopy(elementData, index, elementData, index + 1, size - index);
  ```
  在 `ArrayList` 的 `add()` 和 `remove()` 方法中，我们使用 `System.arraycopy()` 来移动数组中的元素。例如，在 `add()` 方法中，将插入位置之后的元素向后移动一个位置。

- **`Arrays.copyOf()`**：  
  这是 Java 提供的更高层的数组复制方法，用来复制一个数组，并返回一个新的数组。它在扩容操作中非常常见，尤其是在数组需要重新分配更大空间时。
  ```java
  Arrays.copyOf(elementData, size);  // 创建一个新的数组并复制旧数组内容
  ```
  在 `ArrayList` 的 `clone()` 和 `toArray()` 方法中，`Arrays.copyOf()` 被用来创建新数组。

#### **`ensureCapacity()` 方法**

为了提高性能，特别是在需要大量添加数据时，我们可以显式地调用 `ensureCapacity()` 方法来提前扩容，而不是等到实际超出容量时才进行扩容。
```java
public void ensureCapacity(int minCapacity) {
    int minExpand = (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) ? 0 : DEFAULT_CAPACITY;
    if (minCapacity > minExpand) {
        ensureCapacityInternal(minCapacity);
    }
}
```

### 总结

- **扩容机制**：`ArrayList` 会在元素数量达到当前数组容量时自动扩容，扩容比例为原容量的 1.5 倍，扩容过程中使用 `Arrays.copyOf()` 复制元素。
- **`System.arraycopy()` 与 `Arrays.copyOf()`**：前者用于数组的高效元素移动，后者则用于扩容时创建新数组并复制数据。
- **`ensureCapacity()`**：为了提升性能，可以显式地设置 `ArrayList` 的最小容量，避免多次扩容带来的性能损耗。

