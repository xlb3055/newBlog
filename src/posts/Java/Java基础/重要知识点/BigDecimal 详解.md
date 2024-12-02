---
icon: pen-to-square
date: 2024-12-02
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# BigDecimal 详解


在 Java 中，浮点数类型（`float` 和 `double`）由于其二进制表示的限制，无法精确表示十进制的小数，尤其是进行金融计算等需要高精度的场景时，浮点数类型可能会导致精度丢失。为了在需要高精度计算的场景中避免精度问题，Java 提供了 `BigDecimal` 类，它可以用于表示任意精度的浮动小数，并提供丰富的数学运算方法。

---

### 1. **BigDecimal 介绍**

`BigDecimal` 类是 `java.math` 包中的一个类，用于进行高精度的算术运算。与浮点数类型不同，`BigDecimal` 可以精确地表示任意大小和精度的小数。通常用于财务计算、货币兑换、统计学等要求高精度的应用中。

`BigDecimal` 的内部表示方式为不变的、基于字符串的数字，并通过指定舍入模式来避免舍入误差。

---

### 2. **BigDecimal 常见方法**

#### 2.1 **创建 `BigDecimal` 对象**

`BigDecimal` 可以通过不同的方式创建，常见的有以下几种：

- **从 `String` 创建**：推荐使用 `String` 类型来创建 `BigDecimal`，因为直接从字符串构造可以保证精度。

  ```java
  BigDecimal bd1 = new BigDecimal("123.456");
  ```

- **从 `double` 创建**：不推荐直接从 `double` 创建 `BigDecimal`，因为 `double` 本身可能存在精度问题。

  ```java
  BigDecimal bd2 = new BigDecimal(0.1);  // 可能会出现精度问题
  ```

- **从 `int` 或 `long` 创建**：可以用 `int` 或 `long` 创建 `BigDecimal`，这对于整数值的精度是可靠的。

  ```java
  BigDecimal bd3 = new BigDecimal(123);  // 整数创建 BigDecimal
  ```

#### 2.2 **加减乘除运算**

`BigDecimal` 提供了精确的加、减、乘、除操作。常用的操作方法如下：

- **加法：** `add(BigDecimal augend)`

  ```java
  BigDecimal bd1 = new BigDecimal("10.5");
  BigDecimal bd2 = new BigDecimal("20.3");
  BigDecimal result = bd1.add(bd2);  // 10.5 + 20.3 = 30.8
  ```

- **减法：** `subtract(BigDecimal subtrahend)`

  ```java
  BigDecimal result = bd1.subtract(bd2);  // 10.5 - 20.3 = -9.8
  ```

- **乘法：** `multiply(BigDecimal multiplicand)`

  ```java
  BigDecimal result = bd1.multiply(bd2);  // 10.5 * 20.3 = 213.15
  ```

- **除法：** `divide(BigDecimal divisor)`，如果结果需要精确的小数位，可以指定舍入模式。

  ```java
  BigDecimal result = bd1.divide(bd2, 2, RoundingMode.HALF_UP);  // 精确到小数点后两位
  ```

#### 2.3 **大小比较**

`BigDecimal` 提供了多种方式来比较两个数的大小：

- **`compareTo(BigDecimal val)`**：返回值为 `-1`、`0` 或 `1`，分别表示小于、等于或大于。

  ```java
  BigDecimal bd1 = new BigDecimal("10.5");
  BigDecimal bd2 = new BigDecimal("20.3");
  int comparison = bd1.compareTo(bd2);  // -1 表示 bd1 < bd2
  ```

- **`equals(Object obj)`**：比较 `BigDecimal` 对象的值和精度。如果两个对象的值相等，但精度不同，`equals()` 会返回 `false`。

  ```java
  BigDecimal bd1 = new BigDecimal("10.50");
  BigDecimal bd2 = new BigDecimal("10.5");
  boolean areEqual = bd1.equals(bd2);  // false，精度不同
  ```

#### 2.4 **保留几位小数**

`BigDecimal` 提供了多种方式来控制结果的小数位数，常用的方法有：

- **`setScale(int newScale)`**：指定小数点后保留的位数，如果原始数据位数不足，则会进行补零操作。

  ```java
  BigDecimal bd1 = new BigDecimal("10.12345");
  BigDecimal result = bd1.setScale(3, RoundingMode.HALF_UP);  // 保留3位小数，结果为 10.123
  ```

- **`setScale(int newScale, RoundingMode roundingMode)`**：通过指定舍入模式控制如何舍入数字。常见的舍入模式有 `RoundingMode.HALF_UP`、`RoundingMode.HALF_DOWN`、`RoundingMode.CEILING`、`RoundingMode.FLOOR` 等。

  ```java
  BigDecimal bd1 = new BigDecimal("10.6789");
  BigDecimal result = bd1.setScale(2, RoundingMode.HALF_UP);  // 保留2位小数，结果为 10.68
  ```

#### 2.5 **BigDecimal 等值比较问题**

`BigDecimal` 对象进行比较时要特别注意，由于浮点数的表示问题，`BigDecimal` 的等值比较通常不直接使用 `==`，而是使用 `compareTo()` 或 `equals()` 方法。

- **`==`**：用于比较两个对象的引用是否相同，不适用于 `BigDecimal` 的数值比较。

  ```java
  BigDecimal bd1 = new BigDecimal("10.0");
  BigDecimal bd2 = new BigDecimal("10.0");
  boolean areEqual = (bd1 == bd2);  // 错误，引用比较，结果为 false
  ```

- **`equals()`**：用于比较两个 `BigDecimal` 对象的数值及精度是否相同。

  ```java
  boolean areEqual = bd1.equals(bd2);  // true，值和精度都相同
  ```

- **`compareTo()`**：如果只关心数值大小，可以使用 `compareTo()`，这不会考虑精度。

  ```java
  boolean areEqual = (bd1.compareTo(bd2) == 0);  // true，仅值相等
  ```

#### 2.6 **BigDecimal 工具类分享**

为了方便常见的 `BigDecimal` 操作，可以使用一些工具类进行封装，简化使用。例如：

```java
import java.math.BigDecimal;

public class BigDecimalUtil {
    
    // 加法
    public static BigDecimal add(BigDecimal a, BigDecimal b) {
        return a.add(b);
    }
    
    // 减法
    public static BigDecimal subtract(BigDecimal a, BigDecimal b) {
        return a.subtract(b);
    }
    
    // 乘法
    public static BigDecimal multiply(BigDecimal a, BigDecimal b) {
        return a.multiply(b);
    }
    
    // 除法
    public static BigDecimal divide(BigDecimal a, BigDecimal b, int scale, RoundingMode roundingMode) {
        return a.divide(b, scale, roundingMode);
    }
    
    // 设置精度
    public static BigDecimal setScale(BigDecimal value, int scale, RoundingMode roundingMode) {
        return value.setScale(scale, roundingMode);
    }
}
```

这样，所有常见的 `BigDecimal` 操作就可以通过工具类来完成，减少代码冗余。

---

### 3. **总结**

`BigDecimal` 是 Java 中用于进行高精度数值计算的类，避免了浮点数类型带来的精度丢失问题。它提供了丰富的操作方法，包括加、减、乘、除等基本数学运算，以及精确的小数位控制、大小比较和等值比较。在进行数值计算时，建议优先考虑使用 `BigDecimal` 来确保计算结果的精确性，尤其在金融、科学计算等对精度要求高的场景中。