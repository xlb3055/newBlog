---
icon: pen-to-square
date: 2024-08-11
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# Java 反射创建class类的创建方式有哪些
```java
// 测试class类的创建方式有哪些
public class Test01 {

    public static void main(String[] args) throws ClassNotFoundException {
        Person person = new Student();
        System.out.println("这个人是："+person.name);

        // 方式一：通过对象获得
        Class c1 = person.getClass();
        System.out.println(c1.hashCode());
        // 方式二：forname获得
        Class c2 = Class.forName("reflectionStudy.Student");
        System.out.println(c2.hashCode());
        // 方式三：通过类名.class获得
        Class c3 = Student.class;
        System.out.println(c3.hashCode());
        // 方式四：基本内置类型的包装类都有一个Type属性
        Class c4 = Integer.TYPE;
        System.out.println(c4);

        // 获得父类类型
        Class c5 = c1.getSuperclass();
        System.out.println(c5);

    }
}

class Person{
    String name;

    public Person(){}
    public Person(String name){
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                '}';
    }
}

class Student extends Person{
    public Student(){
        this.name = "学生";
    }
}
class Teacher extends Person{
    public Teacher(){
        this.name = "老师";
    }
}
```
