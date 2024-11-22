---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# Java 反射获取Class类的实例
```java
        /**
         * 获取Class类的实例
         */
        // 1. 已知具体的类，通过类的class属性获取。该方法最为安全可靠，程序性能最高。
        Class clazz = User.class;
        // 2. 已知某个类的实例，调用该实例的getClass()方法获取Class对象
        Class clazz1 = user.getClass();
        // 3. 已知一个类的全类名，且该类在类路径下，可通过Class类的静态方法forName()获取，可能抛出ClassNotDoundException
        Class clazz2 = Class.forName("reflectionStudy.User");
        // 4. 内置基本数据类型可以直接用类名.Type
        // 5. 还可以利用ClassLoader
```
