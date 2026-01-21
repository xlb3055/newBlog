---
icon: pen-to-square
date: 2025-12-09
category:
- 后端
tag:
- 哈希表
- 优先队列
- leetcode
---

# 347. 前 K 个高频元素

## 📝 题目描述
给你一个整数数组 `nums` 和一个整数 `k`，请返回数组中出现频率**前 k 高**的元素，返回顺序可以任意。


---

## 📌 示例

### 示例 1
输入：
```
nums = [1,1,1,2,2,3], k = 2
```
输出：
```
[1,2]
```
解释：1 出现 3 次，2 出现 2 次，3 出现 1 次，前 2 高频的元素是 1 和 2。


### 示例 2
输入：
```
nums = [1], k = 1
```
输出：
```
[1]
```


### 示例 3
输入：
```
nums = [1,2,1,2,1,2,3,1,2], k = 2
```
输出：
```
[1,2]
```


---

# 🚀 最优解：哈希表+小顶堆

### 🔍 思路解析
核心策略：**先统计元素频率，再用小顶堆筛选出前k个高频元素**（小顶堆能保证堆内始终是当前“候选的前k高频元素”，超过k时弹出最小的）。
1. 统计频率：用哈希表 `map` 记录每个元素出现的次数（键=元素，值=出现次数）；
2. 维护小顶堆：用优先队列实现小顶堆，堆的排序依据是元素的**出现频率**（频率小的排前面）；
3. 筛选前k高频：遍历哈希表的元素-频率对，依次加入堆：
   - 若堆的大小 < k：直接加入；
   - 若堆的大小 = k：加入新元素后，弹出堆顶（频率最小的元素）；
4. 提取结果：堆中剩余的k个元素就是前k高频元素，取出存入数组。


---

## ✅ 完整代码（Java）
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 读取数组长度
        int n = scanner.nextInt();
        int[] nums = new int[n];

        // 读取数组元素
        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextInt();
        }

        // 读取k值
        int k = scanner.nextInt();

        Solution solution = new Solution();
        int[] result = solution.topKFrequent(nums, k);

        // 输出结果（格式：[1, 2]）
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");

        scanner.close();
    }
}

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 1. 统计每个元素的出现频率
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            map.put(num, map.getOrDefault(num, 0) + 1);
        }

        // 2. 小顶堆：按频率从小到大排序
        PriorityQueue<Map.Entry<Integer, Integer>> queue = new PriorityQueue<>(
            (x, y) -> x.getValue() - y.getValue()
        );

        // 3. 筛选前k高频元素
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            queue.add(entry);
            if (queue.size() > k) {
                queue.poll(); // 弹出频率最小的元素
            }
        }

        // 4. 提取堆中的元素作为结果
        int[] ans = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            ans[i] = queue.poll().getKey();
        }
        return ans;
    }
}
```


---

# 🧠 通俗易懂解释
可以把过程拆成“数次数→挑前k多”两步：
1. **数次数**：用哈希表给每个数“记考勤”，比如 `[1,1,1,2,2,3]` 里，1记3次、2记2次、3记1次；
2. **挑前k多**：用一个“只能装k个元素的小篮子（小顶堆）”，规则是“篮子里最小的数会被优先踢出去”：
    - 先把1（3次）放进篮子，再放2（2次），篮子满了（k=2）；
    - 再放3（1次），篮子超了，把最小的3踢出去，最后篮子里剩下的1、2就是前2高频的元素。


---

# ⏱ 时间复杂度
- 统计频率：\(O(n)\)（遍历数组一次）；
- 堆操作：\(O(m \log k)\)（m是数组中不同元素的个数，最多为n；每次堆的插入/弹出是\(\log k\)复杂度）；
- 总复杂度：\(O(n \log k)\)（n是数组长度）。


---

# 💾 空间复杂度
### \(O(n)\)
哈希表存储频率需要\(O(m)\)空间（m≤n），堆最多存储k个元素，整体空间由数组长度决定。
```
