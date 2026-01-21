---
icon: pen-to-square
date: 2025-12-09
category:
- 后端
tag:
- 优先队列
- 快速选择
- 数组
- leetcode
---

# 215. 数组中的第K个最大元素

## 📝 题目描述
给定整数数组 `nums` 和整数 `k`，请返回数组中**排序后第 k 个最大的元素**（注意：不是第 k 个不同的元素）。

题目要求设计并实现**时间复杂度为 O(n)** 的算法解决此问题（实际常用解法包括“小顶堆法”和“快速选择法”）。


---

## 📌 示例

### 示例 1
输入：
```
nums = [3,2,1,5,6,4], k = 2
```
输出：
```
5
```
解释：数组排序后为 `[1,2,3,4,5,6]`，第 2 个最大的元素是 5。


### 示例 2
输入：
```
nums = [3,2,3,1,2,4,5,5,6], k = 4
```
输出：
```
4
```
解释：数组排序后为 `[1,2,2,3,3,4,5,5,6]`，第 4 个最大的元素是 4。


---

# 🚀 解法1：小顶堆法（实现简单）

### 🔍 思路解析
核心策略：**维护一个大小为 k 的小顶堆，堆内始终保存“当前候选的前 k 大元素”；遍历数组时，超过 k 则弹出堆顶（堆内最小的元素），最终堆顶就是第 k 大的元素**。
1. 初始化小顶堆（Java 优先队列默认是小顶堆）；
2. 遍历数组的每个元素：
   - 将元素加入堆；
   - 若堆的大小 > k，弹出堆顶（移除当前堆中最小的元素）；
3. 遍历结束后，堆顶元素就是第 k 个最大元素。


---

## ✅ 小顶堆代码（Java）
```java
import java.util.PriorityQueue;
import java.util.Scanner;

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
        int result = solution.findKthLargest(nums, k);

        // 输出结果
        System.out.println(result);

        scanner.close();
    }
}

class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        for (int num : nums) {
            queue.add(num);
            // 堆大小超过k时，弹出最小元素
            if (queue.size() > k) {
                queue.poll();
            }
        }
        // 堆顶即为第k大元素
        return queue.peek();
    }
}
```


---

# 🚀 解法2：快速选择法（满足O(n)要求）

### 🔍 思路解析
核心策略：基于**快速排序的分区思想**，每次选择一个“基准元素”，将数组分成“比基准大”“等于基准”“比基准小”的三部分，通过判断基准的位置，缩小查找范围，直到找到第 k 大的元素。
1. 定义分区函数：随机选基准，将数组中**比基准大的元素放左边，比基准小的放右边**；
2. 递归/迭代调整查找范围：
    - 若基准的位置 == k-1（数组从0开始，第k大对应下标k-1），直接返回基准；
    - 若基准位置 < k-1，在右侧继续查找；
    - 若基准位置 > k-1，在左侧继续查找。


---

## ✅ 快速选择代码（Java）
```java
import java.util.Random;
import java.util.Scanner;

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
        int result = solution.findKthLargest(nums, k);

        // 输出结果
        System.out.println(result);

        scanner.close();
    }
}

class Solution {
    private Random random = new Random();

    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, 0, nums.length - 1, k - 1);
    }

    // 在[left, right]范围内找下标为target的元素
    private int quickSelect(int[] nums, int left, int right, int target) {
        int pivotIndex = partition(nums, left, right);
        if (pivotIndex == target) {
            return nums[pivotIndex];
        } else if (pivotIndex < target) {
            return quickSelect(nums, pivotIndex + 1, right, target);
        } else {
            return quickSelect(nums, left, pivotIndex - 1, target);
        }
    }

    // 分区：返回基准最终的下标，保证左边≥基准，右边≤基准
    private int partition(int[] nums, int left, int right) {
        // 随机选基准，避免最坏情况
        int randomIndex = left + random.nextInt(right - left + 1);
        swap(nums, left, randomIndex);

        int pivot = nums[left];
        int i = left, j = right;
        while (i < j) {
            // 从右找比基准大的元素
            while (i < j && nums[j] <= pivot) j--;
            // 从左找比基准小的元素
            while (i < j && nums[i] >= pivot) i++;
            swap(nums, i, j);
        }
        // 基准放到最终位置
        swap(nums, left, i);
        return i;
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```


---

# 🧠 通俗易懂解释

### 小顶堆法
把过程想象成“选尖子生”：
- 要选班级里第2名的学生，准备一个只能坐2人的“小凳子堆”（小顶堆）；
- 让所有学生依次坐凳子：凳子坐满后，再来新学生，就把当前凳子里成绩最差的学生“挤走”；
- 所有学生走完后，凳子上剩下的最差学生，就是班级第2名（因为凳子里是前2名，堆顶是这两个里的最小值）。

以示例1 `nums = [3,2,1,5,6,4], k=2` 为例：
- 依次加3、2 → 堆是[2,3]；
- 加1 → 堆超了，挤走1 → 堆还是[2,3]；
- 加5 → 堆超了，挤走2 → 堆是[3,5]；
- 加6 → 堆超了，挤走3 → 堆是[5,6]；
- 加4 → 堆超了，挤走4 → 堆是[5,6]；
- 堆顶5就是第2大元素。


### 快速选择法
把过程想象成“分蛋糕找第k块”：
- 拿一块蛋糕当“基准”，把所有比它大的蛋糕放左边，比它小的放右边；
- 看基准的位置：如果它正好是第k块，直接拿；如果在第k块左边，就去右边找；如果在右边，就去左边找；
- 重复直到找到第k块（不用把所有蛋糕排好序，节省时间）。


---

# ⏱ 时间复杂度
| 解法       | 时间复杂度       | 说明                     |
|------------|------------------|--------------------------|
| 小顶堆法   | \(O(n \log k)\)  | 每次堆操作是\(\log k\)级 |
| 快速选择法 | 平均\(O(n)\)     | 最坏\(O(n^2)\)（随机基准可避免） |


---

# 💾 空间复杂度
- 小顶堆法：\(O(k)\)（堆最多存k个元素）；
- 快速选择法：\(O(\log n)\)（递归栈深度，迭代版可优化到\(O(1)\)）。
```
