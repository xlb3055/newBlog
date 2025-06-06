---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# Java反射的主要api
```java
     // 反射的主要API
     java.lang.Class // 代表一个类
     java.lang.reflect.Method // 代表类的方法
     java.lang.reflect.Field // 代表类的成员变量
     java.lang.reflect.Contructor // 代表类的构造器
     
     // class类的常用方法
     static ClassforName // 返回指定类名name的Class对象
     Object newInstance() // 调用缺省构造函数，返回Class对象的一个实例
     getName() // 返回此Class对象所表示的实体（类，接口，数组类或void）的名称
     Class getSuperClass // 返回当前Class对象的父类的Class对象
     Class[] getinterfaces() // 获取当前Class对象的接口
     ClassLoader getClassLoader() // 返回类的类加载器
     Constructor[] getConstructors() // 返回一个包含某些Constructoe对象的数组
     Method getMethod(String name,Class.. T) // 返回一个Method对象，此对象的形参类型为paramType
     Field[] getDeclaredFields() // 返回Field对象的一个数组
```
