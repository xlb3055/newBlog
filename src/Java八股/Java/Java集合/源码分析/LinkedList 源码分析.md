---
icon: pen-to-square
date: 2024-12-04
category:
- 后端
tag:
- Java
- 源码分析
- 后端开发技巧
---
# LinkedList

### LinkedList 简介

`LinkedList` 是 Java 中一种链表数据结构，它实现了 `List` 接口，并提供了高效的插入和删除操作。与 `ArrayList` 等基于数组的数据结构不同，`LinkedList` 是由一系列节点组成的，每个节点包含数据以及指向下一个节点的引用。

### LinkedList 插入和删除元素的时间复杂度

- **插入元素**：
    - 在链表的头部或尾部插入元素的时间复杂度是 \( O(1) \)，因为只需要修改头节点或尾节点的引用。
    - 在链表的中间插入元素的时间复杂度是 \( O(n) \)，需要遍历链表找到插入位置。

- **删除元素**：
    - 删除头部或尾部元素的时间复杂度是 \( O(1) \)。
    - 删除链表中的任意元素的时间复杂度是 \( O(n) \)，需要遍历链表找到要删除的元素。

### LinkedList 为什么不能实现 `RandomAccess` 接口？

`RandomAccess` 接口是 Java 中用来标识支持快速随机访问的集合类型。实现了 `RandomAccess` 接口的集合可以通过索引直接访问元素，时间复杂度为 \( O(1) \)。

然而，`LinkedList` 不能实现 `RandomAccess` 接口，因为链表的每个节点都与前后节点通过引用连接，而无法通过索引直接访问特定元素。要访问链表中的某个元素，必须从头节点开始，顺序遍历链表直到找到目标元素，因此随机访问的时间复杂度为 \( O(n) \)，无法满足 `RandomAccess` 接口的要求。

### LinkedList 源码分析

#### 初始化

`LinkedList` 的初始化通常由无参构造器完成：

```java
public LinkedList() {
    this.size = 0;
    this.head = new Node<E>(null);  // 哨兵节点
    this.tail = new Node<E>(null);  // 哨兵节点
    head.next = tail;  // 头节点指向尾节点
    tail.prev = head;  // 尾节点指向头节点
}
```

初始化时，`LinkedList` 创建了一个双向链表，包含一个头节点和一个尾节点，两个节点通过 `next` 和 `prev` 引用互相连接。

#### 插入元素

`LinkedList` 插入元素的方法有多种，常见的包括：

- 在尾部插入元素：

```java
public boolean add(E e) {
    linkLast(e);
    return true;
}

void linkLast(E e) {
    final Node<E> l = tail.prev;
    final Node<E> newNode = new Node<>(l, e, tail);
    tail.prev = newNode;
    l.next = newNode;
    size++;
}
```

- 在头部插入元素：

```java
public void addFirst(E e) {
    linkFirst(e);
}

void linkFirst(E e) {
    final Node<E> f = head.next;
    final Node<E> newNode = new Node<>(head, e, f);
    head.next = newNode;
    f.prev = newNode;
    size++;
}
```

#### 获取元素

`LinkedList` 获取元素时需要遍历链表，时间复杂度为 \( O(n) \)。常用的获取方法如下：

```java
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}

Node<E> node(int index) {
    if (index < (size >> 1)) {  // 从头开始遍历
        Node<E> x = head.next;
        for (int i = 0; i < index; i++) {
            x = x.next;
        }
        return x;
    } else {  // 从尾开始遍历
        Node<E> x = tail;
        for (int i = size - 1; i > index; i--) {
            x = x.prev;
        }
        return x;
    }
}
```

#### 删除元素

删除元素时，`LinkedList` 需要调整节点的连接，时间复杂度为 \( O(1) \)（当节点已知）：

```java
public E remove(int index) {
    checkElementIndex(index);
    Node<E> target = node(index);
    E element = target.item;
    unlink(target);
    return element;
}

void unlink(Node<E> node) {
    final E element = node.item;
    final Node<E> prev = node.prev;
    final Node<E> next = node.next;

    prev.next = next;
    next.prev = prev;
    node.item = null;
    node.next = null;
    node.prev = null;
    size--;
}
```

#### 遍历链表

链表遍历可以通过迭代器实现：

```java
public Iterator<E> iterator() {
    return new Itr();
}

private class Itr implements Iterator<E> {
    private Node<E> lastReturned = null;
    private Node<E> next = head.next;

    public boolean hasNext() {
        return next != tail;
    }

    public E next() {
        if (!hasNext()) throw new NoSuchElementException();
        lastReturned = next;
        next = next.next;
        return lastReturned.item;
    }
}
```

### LinkedList 常用方法测试

```java
public class LinkedListTest {
    public static void main(String[] args) {
        LinkedList<Integer> list = new LinkedList<>();

        // 插入元素
        list.add(1);
        list.add(2);
        list.add(3);
        
        // 获取元素
        System.out.println("Element at index 1: " + list.get(1));  // 输出: 2

        // 删除元素
        list.remove(1);  // 删除索引为 1 的元素

        // 遍历链表
        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }

        // 输出：1 3
    }
}
```

### 总结

- **优点**：`LinkedList` 在插入和删除元素时非常高效，尤其是在链表的头部和尾部，时间复杂度为 \( O(1) \)。
- **缺点**：由于不能进行随机访问，获取和查找元素的时间复杂度为 \( O(n) \)，因此在频繁的索引操作时效率较低。

