---
icon: pen-to-square
date: 2024-12-02
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# Java 代理模式详解


代理模式（Proxy Pattern）是一种结构型设计模式，允许通过代理对象来控制对目标对象的访问。代理对象通过实现与目标对象相同的接口，将目标对象的操作委托给目标对象执行，并且可以在委托的基础上增加额外的操作。代理模式常用于以下场景：远程代理、虚拟代理、保护代理、智能代理等。

---

### 1. **代理模式**

代理模式的核心思想是通过创建一个代理类来控制对目标类的访问。代理类与目标类通常实现相同的接口，在代理类中可以加入额外的处理逻辑，比如权限控制、日志记录、延迟加载等。代理模式本质上是一种将方法调用委托给另一个对象的设计模式。

代理模式的角色有：
- **Subject（主题接口）**：通常是目标类和代理类都实现的接口。
- **RealSubject（真实主题）**：目标类，实际执行操作的类。
- **Proxy（代理类）**：代理类，代理对象对真实对象进行包装和控制。

---

### 2. **静态代理**

静态代理是在编译时就确定代理类和目标类之间的关系，代理类会显式地调用目标类的方法。静态代理一般需要手动编写代码，代理类与目标类会同时编译，且代理类在代码中已经确定。

#### 2.1 **静态代理的实现**

假设我们有一个 `Service` 接口和其实现类 `ServiceImpl`，以及一个 `ProxyService` 代理类。

```java
// 目标类接口
public interface Service {
    void performAction();
}

// 目标类实现
public class ServiceImpl implements Service {
    @Override
    public void performAction() {
        System.out.println("Action performed by ServiceImpl.");
    }
}

// 代理类
public class ProxyService implements Service {
    private ServiceImpl service;

    public ProxyService(ServiceImpl service) {
        this.service = service;
    }

    @Override
    public void performAction() {
        System.out.println("Proxy: Pre-action.");
        service.performAction();
        System.out.println("Proxy: Post-action.");
    }
}
```

#### 2.2 **使用静态代理**

```java
public class Main {
    public static void main(String[] args) {
        Service service = new ServiceImpl();
        Service proxyService = new ProxyService(service);
        
        proxyService.performAction();
    }
}
```

**输出：**
```
Proxy: Pre-action.
Action performed by ServiceImpl.
Proxy: Post-action.
```

静态代理可以在调用目标方法之前和之后加入一些自定义的行为。

---

### 3. **动态代理**

动态代理是指在运行时动态地生成代理类，并在代理类中实现对目标对象方法的代理。动态代理的优势在于不需要为每个目标类编写一个代理类，可以通过反射机制在运行时生成代理对象。

#### 3.1 **JDK 动态代理机制**

JDK 动态代理是基于 Java 反射机制和接口实现的，要求目标类必须实现接口。通过 `Proxy` 类的 `newProxyInstance` 方法可以创建代理对象，并动态地代理接口方法。

##### 3.1.1 **JDK 动态代理实现**

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// 目标类接口
public interface Service {
    void performAction();
}

// 目标类实现
public class ServiceImpl implements Service {
    @Override
    public void performAction() {
        System.out.println("Action performed by ServiceImpl.");
    }
}

// 动态代理处理类
public class DynamicProxyHandler implements InvocationHandler {
    private Object target;

    public DynamicProxyHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Proxy: Pre-action.");
        Object result = method.invoke(target, args);
        System.out.println("Proxy: Post-action.");
        return result;
    }
}

// 主程序
public class Main {
    public static void main(String[] args) {
        ServiceImpl service = new ServiceImpl();
        Service proxyService = (Service) Proxy.newProxyInstance(
                Service.class.getClassLoader(),
                new Class<?>[]{Service.class},
                new DynamicProxyHandler(service)
        );

        proxyService.performAction();
    }
}
```

**输出：**
```
Proxy: Pre-action.
Action performed by ServiceImpl.
Proxy: Post-action.
```

JDK 动态代理要求目标对象实现接口，通过 `Proxy.newProxyInstance()` 方法动态生成代理对象，并指定代理处理类 `InvocationHandler`，在 `invoke()` 方法中实现代理逻辑。

#### 3.2 **CGLIB 动态代理机制**

CGLIB（Code Generation Library）是一个功能强大的字节码生成库，它可以在运行时动态生成目标类的子类来实现代理，而不要求目标类实现接口。CGLIB 动态代理是通过继承目标类并重写其方法来实现的。

##### 3.2.1 **CGLIB 动态代理实现**

```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

// 目标类
public class ServiceImpl {
    public void performAction() {
        System.out.println("Action performed by ServiceImpl.");
    }
}

// CGLIB 动态代理
public class CGLibProxy implements MethodInterceptor {
    private Object target;

    public CGLibProxy(Object target) {
        this.target = target;
    }

    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        System.out.println("Proxy: Pre-action.");
        Object result = method.invoke(target, args);
        System.out.println("Proxy: Post-action.");
        return result;
    }

    public static Object createProxy(Class<?> targetClass) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(targetClass);
        enhancer.setCallback(new CGLibProxy(targetClass));
        return enhancer.create();
    }
}

// 主程序
public class Main {
    public static void main(String[] args) {
        ServiceImpl service = new ServiceImpl();
        ServiceImpl proxyService = (ServiceImpl) CGLibProxy.createProxy(ServiceImpl.class);

        proxyService.performAction();
    }
}
```

**输出：**
```
Proxy: Pre-action.
Action performed by ServiceImpl.
Proxy: Post-action.
```

CGLIB 动态代理通过继承目标类，动态生成代理类，并通过 `MethodInterceptor` 的 `intercept()` 方法来实现代理逻辑。它不需要目标类实现接口，但无法代理 `final` 类和 `final` 方法。

#### 3.3 **JDK 动态代理和 CGLIB 动态代理对比**

- **JDK 动态代理**：
    - 需要目标类实现接口。
    - 代理对象实现的是目标类的接口。
    - 性能稍逊，主要因为需要使用反射机制。
    - 适用于接口驱动的设计。

- **CGLIB 动态代理**：
    - 通过继承目标类生成代理类。
    - 代理类是目标类的子类。
    - 不需要目标类实现接口，可以代理没有接口的类。
    - 适用于没有接口的类，但无法代理 `final` 类和 `final` 方法。

---

### 4. **静态代理和动态代理的对比**

| 特性               | 静态代理                         | 动态代理                           |
|--------------------|----------------------------------|------------------------------------|
| **代理生成**       | 编译时生成代理类                  | 运行时动态生成代理类                |
| **代理对象类型**   | 代理类与目标类的关系是静态的       | 通过反射或字节码生成代理类          |
| **灵活性**         | 不灵活，代理类需要手动编写         | 灵活，代理类可以在运行时动态生成     |
| **性能**           | 相对较快                           | 由于使用反射，性能相对较慢          |
| **适用场景**       | 适用于目标类固定且不需要频繁变化   | 适用于目标类多变的情况              |

---

### 5. **总结**

代理模式是通过代理类控制对目标类的访问，它可以增强目标类的功能，例如进行权限控制、日志记录等。静态代理和动态代理是实现代理模式的两种常见方式。静态代理需要提前编写代理类，而动态代理则可以在运行时动态生成代理类，提供了更高的灵活性。JDK 动态代理依赖于接口，而 CGLIB 动态代理通过字节码技术为目标类生成子类。在实际应用中，选择哪种代理方式取决于具体的需求和目标类的设计。

