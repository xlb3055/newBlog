---
icon: pen-to-square
date: 2024-11-19
category:
- 后端
tag:
- 子串
- 前缀和
- leecode
---
# 和为 K 的子数组

---

### **问题理解**

我们需要找到 **连续子数组** 的和等于给定值 `k` 的个数。

**定义子数组**：
- 子数组是数组中任意连续的一段。
- 比如，对于数组 `[1, 2, 3, 4]`，长度为 3 的子数组有 `[1, 2, 3]` 和 `[2, 3, 4]`。

---

### **解题核心：前缀和 + 哈希表**

#### **什么是前缀和？**

前缀和是一种用来快速计算子数组和的技巧。对于数组 `nums`，我们定义前缀和数组 `sum`：
- `sum[i]` 表示从数组开始到第 `i` 个元素的累积和：
  ```text
  sum[i] = nums[0] + nums[1] + ... + nums[i]
  ```

#### **用前缀和计算任意子数组的和**

假设数组中有两个前缀和：
- `sum[j]` 表示从开始到位置 `j` 的累积和。
- `sum[i-1]` 表示从开始到位置 `i-1` 的累积和。

那么，从位置 `i` 到 `j` 的子数组和为：
```text
subarraySum(i, j) = sum[j] - sum[i-1]
```
如果这个和等于 `k`：
```text
sum[j] - sum[i-1] = k
```
我们可以转化为：
```text
sum[i-1] = sum[j] - k
```

---

#### **用哈希表存储前缀和**

为了快速找到满足 `sum[i-1] = sum[j] - k` 的情况，我们使用一个哈希表 `map`：
- **键**：前缀和 `sum[i]` 的值。
- **值**：当前前缀和出现的次数。

每次计算到 `sum[j]` 时，检查哈希表中是否有 `sum[j] - k`：
- 如果存在，则说明从某个位置到 `j` 的子数组和等于 `k`。
- 然后将当前的 `sum[j]` 添加到哈希表中，更新其出现的次数。

---

### **算法详细步骤**

1. 初始化一个哈希表 `map`，存储前缀和：
    - 初始放入 `(0, 1)`，表示前缀和为 `0` 的情况出现过 1 次（便于处理边界情况）。
2. 遍历数组 `nums`，逐步计算前缀和 `sum[j]`。
3. 对于每个前缀和 `sum[j]`：
    - 计算目标前缀和 `target = sum[j] - k`。
    - 检查哈希表中是否存在 `target`：
        - 如果存在，累加 `target` 的出现次数到结果中。
    - 更新哈希表中 `sum[j]` 的出现次数。
4. 遍历完成后，返回结果。

---

### **详细代码实现**

```java
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextInt();
        }
        int k = scanner.nextInt();

        Solution solution = new Solution();
        int result = solution.subarraySum(nums, k);
        System.out.println(result);

        scanner.close();
    }
}

class Solution {
    public int subarraySum(int[] nums, int k) {
        // 初始化哈希表，记录前缀和出现次数
        HashMap<Integer, Integer> map = new HashMap<>();
        map.put(0, 1); // 初始值：前缀和为 0 出现 1 次

        int sum = 0; // 当前的前缀和
        int count = 0; // 和为 k 的子数组个数

        // 遍历数组
        for (int num : nums) {
            sum += num; // 更新前缀和

            // 计算当前前缀和是否存在目标前缀和
            int target = sum - k;
            if (map.containsKey(target)) {
                count += map.get(target); // 累加目标前缀和的出现次数
            }

            // 更新当前前缀和的出现次数
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }

        return count;
    }
}
```

---

### **案例分析**

#### 输入：`nums = [1, 2, 3], k = 3`

**步骤**：

1. 初始化：
    - `sum = 0`，`count = 0`，`map = {0: 1}`。

2. 遍历数组：
    - 第 1 个元素 `num = 1`：
        - `sum = sum + num = 0 + 1 = 1`。
        - 目标前缀和 `target = sum - k = 1 - 3 = -2` 不在 `map` 中。
        - 更新 `map = {0: 1, 1: 1}`。

    - 第 2 个元素 `num = 2`：
        - `sum = sum + num = 1 + 2 = 3`。
        - 目标前缀和 `target = sum - k = 3 - 3 = 0` 在 `map` 中，出现次数为 1。
        - `count = count + map.get(target) = 0 + 1 = 1`。
        - 更新 `map = {0: 1, 1: 1, 3: 1}`。

    - 第 3 个元素 `num = 3`：
        - `sum = sum + num = 3 + 3 = 6`。
        - 目标前缀和 `target = sum - k = 6 - 3 = 3` 在 `map` 中，出现次数为 1。
        - `count = count + map.get(target) = 1 + 1 = 2`。
        - 更新 `map = {0: 1, 1: 1, 3: 1, 6: 1}`。

**最终结果**：`count = 2`。

---

### **时间复杂度分析**

1. **时间复杂度**：
    - 遍历数组一次，时间复杂度为 `O(n)`。
    - 哈希表的插入和查找操作为 `O(1)`。
    - 总时间复杂度：`O(n)`。

2. **空间复杂度**：
    - 使用了一个哈希表存储前缀和，空间复杂度为 `O(n)`。

---

### **总结**

1. **核心点**：
    - 通过前缀和和哈希表，我们能快速找到符合条件的子数组。
    - 哈希表的作用是记住已经计算过的前缀和，避免重复计算。

2. **适用场景**：
    - 本算法适合处理大规模数组数据，效率较高。
    - 当需要快速找到和为特定值的子数组时，非常有效。
    - 适用于需要频繁查询和更新前缀和的场景。
