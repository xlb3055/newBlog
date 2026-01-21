---
icon: pen-to-square
date: 2025-01-04
category:
- 后端
tag:
- 链表
- leecode
---

# 25. K 个一组翻转链表

## 📝 题目描述
给定链表的头节点 `head`，要求**每 k 个节点一组**进行翻转，返回修改后的链表。
- 若节点总数不是 k 的整数倍，剩余的节点保持原有顺序；
- 不能修改节点内部的数值，需通过调整节点指针完成交换。


## 📌 示例
### 示例 1
输入：`head = [1,2,3,4,5], k = 2`
输出：`[2,1,4,3,5]`
解释：每 2 个节点为一组翻转，前 4 个节点分成两组（`1→2`、`3→4`），分别翻转为 `2→1`、`4→3`，剩余节点 `5` 保持不变。


## 🚀 最优解：递归+局部翻转
### 🔍 思路解析
核心策略：**先检查当前组是否有 k 个节点，再局部翻转当前组，最后递归处理剩余链表**：
1. **检查节点数量**：遍历当前组，若不足 k 个节点，直接返回原头节点；
2. **局部翻转当前组**：用双指针（`pre`、`cur`）翻转当前 k 个节点，得到翻转后的新头节点；
3. **递归处理剩余链表**：将当前组的原头节点（翻转后的尾节点）的 `next` 指向剩余链表的翻转结果；
4. **返回结果**：返回当前组翻转后的新头节点。


---

## ✅ 完整代码（Java）
```java
import java.util.Scanner;

public class Main {
    private static ListNode buildList(String line) {
        if (line == null) {
            return null;
        }
        line = line.trim();
        if (line.isEmpty()) {
            return null;
        }
        String[] values = line.split(" ");
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (String val : values) {
            if (val.isEmpty()) {
                continue;
            }
            tail.next = new ListNode(Integer.parseInt(val));
            tail = tail.next;
        }
        return dummy.next;
    }

    private static void printList(ListNode head) {
        StringBuilder sb = new StringBuilder();
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) {
                sb.append(" ");
            }
            head = head.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.hasNextLine() ? scanner.nextLine() : "";
        ListNode head = buildList(line);
        int k = scanner.hasNextInt() ? scanner.nextInt() : 0;

        if (k <= 1) {
            printList(head);
            scanner.close();
            return;
        }

        Solution solution = new Solution();
        ListNode result = solution.reverseKGroup(head, k);
        printList(result);
        scanner.close();
    }
}

class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        if (head == null) return null;
        ListNode temp = head;
        // 检查当前组是否有k个节点
        for (int i = 0; i < k; i++) {
            if (temp == null) return head; // 不足k个，直接返回原头
            temp = temp.next;
        }
        // 翻转当前k个节点，得到新头cur
        ListNode cur = reverse(head, k);
        // 原头节点（翻转后的尾）的next指向剩余链表的翻转结果
        head.next = reverseKGroup(temp, k);
        return cur;
    }

    // 翻转以head为头的k个节点，返回翻转后的新头
    private ListNode reverse(ListNode head, int k) {
        ListNode pre = null;
        ListNode cur = head;
        while (k-- > 0) {
            ListNode nextTemp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = nextTemp;
        }
        return pre;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
```


---

## 🧠 通俗易懂解释
可以把链表想象成“一段段车厢”，每 k 个车厢为一组翻转，过程类似：
1. **检查车厢数**：先确认当前段有 k 节车厢，不足则不翻转；
2. **翻转当前段**：将当前 k 节车厢的顺序倒转；
3. **连接后续段**：把当前段的尾端连接到下一段翻转后的车头；
4. **重复操作**：对后续段执行同样的步骤。

以示例1（`head = [1,2,3,4,5], k=2`）为例：
1. 检查当前组（`1→2`）有2个节点，翻转得到 `2→1`；
2. 剩余链表为 `3→4→5`，递归处理：
    - 检查组（`3→4`）有2个节点，翻转得到 `4→3`；
    - 剩余链表为 `5`，不足2个节点，返回 `5`；
    - 原头 `3` 的 `next` 指向 `5`，得到 `4→3→5`；
3. 原头 `1` 的 `next` 指向 `4`，最终结果为 `2→1→4→3→5`。


---

## ⏱ 时间复杂度
- \(O(n)\)（`n` 为链表长度）
  每个节点仅被翻转一次（局部翻转），且仅遍历一次，无额外嵌套操作。


---

## 💾 空间复杂度
- \(O(n/k)\)（`k` 为每组节点数）
  递归调用栈的深度为组数（每处理一组递归一次），空间消耗与链表长度成正比。
