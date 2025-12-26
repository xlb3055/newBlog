---
icon: pen-to-square
date: 2024-12-02
category:
- 后端
tag:
- 链表
- 快慢指针
- leecode
---
# 142. 环形链表 II



#### 题目描述

给定一个链表的头节点 `head`，返回链表开始入环的第一个节点。如果链表无环，则返回 `null`。

- **链表中有环**：链表的某个节点的 `next` 指针指向了链表中某个先前的节点，形成一个环。即从某个节点开始，你可以一直沿着 `next` 指针循环回到该节点。
- **链表中没有环**：链表的每个节点的 `next` 指针指向 `null`，并且遍历完链表后会到达末尾。

你需要实现一个高效的算法，判断链表是否有环，并且找出环的入口节点。

---

#### 示例

**示例 1：**
```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有环，尾部连接到第二个节点。
```

**示例 2：**
```
输入：head = [1,2], pos = 0
输出：true
解释：链表中有环，尾部连接到第一个节点。
```

**示例 3：**
```
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
```

---

### 解题思路

#### 1. 快慢指针法（Floyd's Tortoise and Hare）

解决链表环形问题的常见高效方法是使用 **快慢指针**（Floyd's Cycle-Finding Algorithm）。该算法的思路是：
- **慢指针**：每次移动一步。
- **快指针**：每次移动两步。

**为什么这种方法有效？**

- 如果链表中存在环，快指针必定会比慢指针先进入环，而后它们必定会在环中相遇。
- 如果链表没有环，快指针会首先到达链表的末尾（即 `null`），此时我们可以确认链表没有环。

#### 2. 数学推导：如何找出环的入口

**关键推导：**
- f=2s （快指针每次2步，路程刚好2倍）
- f = s + nb (相遇时，刚好多走了n圈）
- 推导出：s = nb （此时慢指针走了nb步，也一定是在环内）
- 从head结点走到入环点需要走 ：a + nb， 而slow已经走了nb，那么slow再走a步就是入环点了。
- 如何知道slow刚好走了a步？从head开始，和slow指针一起走，相遇时刚好就是a步。


#### 3. 为什么使用快慢指针？
- **空间复杂度**：快慢指针法只需要常数的空间，因此其空间复杂度为 \( O(1) \)。
- **时间复杂度**：最多会遍历链表两次，第一次用快指针到达环的入口，第二次用快慢指针相遇，时间复杂度为 \( O(n) \)。

---

### 代码实现

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 读取链表节点值
        String[] values = scanner.nextLine().split(" ");
        ListNode head = null;
        ListNode tail = null;
        for (String val : values) {
            if (!val.isEmpty()) {
                ListNode newNode = new ListNode(Integer.parseInt(val));
                if (head == null) {
                    head = newNode;
                    tail = newNode;
                } else {
                    tail.next = newNode;
                    tail = newNode;
                }
            }
        }

        // 读取环的位置（-1表示没有环）
        int pos = scanner.nextInt();

        // 如果需要创建环
        if (pos >= 0) {
            ListNode current = head;
            ListNode cycleNode = null;

            // 找到要形成环的节点
            for (int i = 0; current != null; i++) {
                if (i == pos) {
                    cycleNode = current;
                    break;
                }
                current = current.next;
            }

            // 将尾节点连接到指定节点
            if (cycleNode != null && tail != null) {
                tail.next = cycleNode;
            }
        }

        Solution solution = new Solution();
        ListNode result = solution.detectCycle(head);

        if (result != null) {
            System.out.println(result.val);
        } else {
            System.out.println("null");
        }

        scanner.close();
    }
}

class Solution {
    public ListNode detectCycle(ListNode head) {
        // 使用快慢指针
        if (head == null || head.next == null) {
            return null;  // 如果链表为空或只有一个节点，肯定没有环
        }

        ListNode slow = head;  // 慢指针
        ListNode fast = head;  // 快指针

        // 步骤 1：找出快慢指针相遇点
        while (fast != null && fast.next != null) {
            slow = slow.next;        // 慢指针每次移动一步
            fast = fast.next.next;   // 快指针每次移动两步

            if (slow == fast) {
                // 步骤 2：快慢指针相遇，找环的入口
                ListNode entry = head;  // 新的指针从头开始
                while (entry != slow) {
                    entry = entry.next;
                    slow = slow.next;
                }
                return entry;  // 返回环的入口节点
            }
        }

        return null;  // 快指针到达链表末尾，说明没有环
    }
}

// 定义链表节点
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}
```

---

### 代码详解

1. **初始化**：
    - 创建两个指针：`slow`（慢指针）和 `fast`（快指针），都指向链表头节点。

2. **循环遍历**：
    - **快指针**每次移动两步，**慢指针**每次移动一步。
    - 如果快指针和慢指针相遇，则说明链表中有环，进入步骤 2 寻找环的入口。
    - 如果快指针走到链表末尾，则说明链表无环，返回 `null`。

3. **寻找环的入口**：
    - 在快慢指针相遇后，从链表头结点开始，设置一个新的指针 `entry`，并与慢指针一起每次走一步，直到它们相遇。相遇时，`entry` 就是环的入口节点。

4. **测试用例**：
    - 测试了三种情况：
        - **有环**：构造链表 `3 -> 2 -> 0 -> -4` 并形成环，入口节点是 `2`。
        - **有环**：构造链表 `1 -> 2 -> 1` 并形成环，入口节点是 `1`。
        - **无环**：构造链表 `1`，无环。

---

### 时间复杂度和空间复杂度

- **时间复杂度**：\( O(n) \)，其中 \( n \) 是链表的长度。快慢指针最多会遍历链表两次：一次检测环是否存在，第二次找到环的入口。
- **空间复杂度**：\( O(1) \)，只使用了常数的空间来存储两个指针。

--- 

