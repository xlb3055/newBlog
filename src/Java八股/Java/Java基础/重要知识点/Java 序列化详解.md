---
icon: pen-to-square
date: 2024-12-02
category:
- 后端
tag:
- Java
- 后端开发技巧
---
# Java 序列化详解


Java 序列化是指将对象转换为字节流的过程，以便将其写入文件、发送到网络中，或存储到数据库中。反序列化则是序列化的逆过程，将字节流转换回原始对象。序列化在分布式系统、缓存、持久化等场景中被广泛使用。本文将深入探讨 Java 的序列化及其常见协议。

---

### 1. **什么是序列化和反序列化？**

- **序列化**：序列化是将对象转换为字节流的过程。它能够将对象的状态保存下来，以便后续能够恢复原始对象。序列化通常用于网络通信、缓存、文件存储等场景。
- **反序列化**：反序列化是序列化的逆过程，将字节流恢复成原始对象。在接收到序列化的字节流后，反序列化将这些字节重新转换为对象。

**举例**：

1. **序列化**：将一个 Java 对象转换为字节流，可以通过 ObjectOutputStream 将其写入文件。
2. **反序列化**：通过 ObjectInputStream 读取字节流，并转换回原始 Java 对象。

---

### 2. **常见序列化协议有哪些？**

Java 提供了多种序列化协议，适用于不同的场景和需求。常见的序列化协议包括：

- **JDK 默认序列化**
- **Kryo**
- **Protobuf**
- **ProtoStuff**
- **Hessian**

每种协议的设计理念、性能和使用场景有所不同。

---

### 3. **JDK 自带的序列化方式**

Java 自带的序列化方式是基于 `java.io.Serializable` 接口的。任何实现了该接口的类都可以被序列化。

#### 3.1 **实现 Serializable 接口**

要使对象支持 JDK 序列化，类必须实现 `java.io.Serializable` 接口，该接口没有任何方法，它只是作为一个标识，告诉 JVM 该对象是可以被序列化的。

```java
import java.io.*;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        // 序列化对象
        User user = new User("John", 30);
        FileOutputStream fileOut = new FileOutputStream("user.ser");
        ObjectOutputStream out = new ObjectOutputStream(fileOut);
        out.writeObject(user);
        out.close();
        fileOut.close();

        // 反序列化对象
        FileInputStream fileIn = new FileInputStream("user.ser");
        ObjectInputStream in = new ObjectInputStream(fileIn);
        User deserializedUser = (User) in.readObject();
        in.close();
        fileIn.close();

        System.out.println("Deserialized User: " + deserializedUser.getName() + ", " + deserializedUser.getAge());
    }
}
```

#### 3.2 **限制与缺点**
- **性能**：JDK 自带的序列化方式相对较慢，尤其是在大规模数据传输时。
- **不可读性**：生成的字节流无法直接读取，无法跨语言使用。
- **版本兼容性**：当类结构变化时（如添加、删除字段），会导致反序列化失败，需要管理 `serialVersionUID`。

---

### 4. **Kryo**

**Kryo** 是一个高效的序列化框架，性能比 JDK 默认序列化方式要好很多。它的优点包括更小的序列化数据、更高的序列化/反序列化速度，并且支持更多类型的数据。

#### 4.1 **Kryo 的优点**：
- **性能优越**：Kryo 的序列化速度和数据压缩率比 Java 默认序列化方式要快得多。
- **支持复杂对象**：能够处理复杂的对象类型，包括 `ArrayList`、`HashMap`、`Set` 等。
- **跨语言支持**：Kryo 可以通过配置与其他语言的实现互操作。

#### 4.2 **示例代码**：

```java
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Output;
import com.esotericsoftware.kryo.io.Input;

import java.io.*;

public class KryoExample {
    public static void main(String[] args) throws IOException {
        Kryo kryo = new Kryo();
        Output output = new Output(new FileOutputStream("user.kryo"));
        User user = new User("John", 30);
        kryo.writeObject(output, user);
        output.close();

        Input input = new Input(new FileInputStream("user.kryo"));
        User deserializedUser = kryo.readObject(input, User.class);
        input.close();

        System.out.println("Deserialized User: " + deserializedUser.getName() + ", " + deserializedUser.getAge());
    }
}
```

---

### 5. **Protobuf (Protocol Buffers)**

**Protobuf** 是 Google 开发的一种语言中立、平台中立、可扩展的序列化协议，它非常高效，适用于跨语言的场景。Protobuf 的二进制格式相比 JSON 或 XML 更紧凑。

#### 5.1 **Protobuf 的优点**：
- **高效的序列化/反序列化**：相对于 JSON 和 XML，Protobuf 更加高效。
- **跨语言支持**：Protobuf 支持多种语言，包括 Java、C++、Python 等。
- **兼容性**：Protobuf 支持向后和向前兼容，可以在不影响已有数据的情况下修改数据结构。

#### 5.2 **Protobuf 示例代码**：

Protobuf 的使用首先需要定义 `.proto` 文件，然后编译生成 Java 类。

**定义 `User.proto` 文件**：

```proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
}
```

使用 Protobuf 编译器生成 Java 类后，可以这样使用：

```java
import com.example.protobuf.UserProtos.User;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class ProtobufExample {
    public static void main(String[] args) throws IOException {
        // 序列化
        User user = User.newBuilder().setName("John").setAge(30).build();
        FileOutputStream output = new FileOutputStream("user.pb");
        user.writeTo(output);
        output.close();

        // 反序列化
        FileInputStream input = new FileInputStream("user.pb");
        User deserializedUser = User.parseFrom(input);
        input.close();

        System.out.println("Deserialized User: " + deserializedUser.getName() + ", " + deserializedUser.getAge());
    }
}
```

---

### 6. **ProtoStuff**

**ProtoStuff** 是一个高效的序列化框架，兼容 Protobuf，但提供了更高的序列化和反序列化速度，并且可以更灵活地与其他类型的数据进行交互。

#### 6.1 **ProtoStuff 的优点**：
- **快速**：相比 Protobuf，ProtoStuff 的性能更强，尤其是在大数据量场景下。
- **跨语言支持**：与 Protobuf 类似，ProtoStuff 也能与其他语言进行交互。

#### 6.2 **示例代码**：

```java
import io.protostuff.LinkedBuffer;
import io.protostuff.ProtostuffIOUtil;
import io.protostuff.Schema;
import io.protostuff.runtime.RuntimeSchema;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class ProtoStuffExample {
    public static void main(String[] args) throws IOException {
        User user = new User("John", 30);
        Schema<User> schema = RuntimeSchema.getSchema(User.class);

        // 序列化
        LinkedBuffer buffer = LinkedBuffer.allocate(256);
        FileOutputStream fos = new FileOutputStream("user.proto");
        ProtostuffIOUtil.writeTo(fos, user, schema, buffer);
        fos.close();

        // 反序列化
        FileInputStream fis = new FileInputStream("user.proto");
        User deserializedUser = new User(null, 0);
        ProtostuffIOUtil.mergeFrom(fis, deserializedUser, schema);
        fis.close();

        System.out.println("Deserialized User: " + deserializedUser.getName() + ", " + deserializedUser.getAge());
    }
}
```

---

### 7. **Hessian**

**Hessian** 是一个轻量级的、跨语言的二进制序列化协议，适用于 RPC（远程过程调用）场景。它是 Web 服务的序列化协议，支持多个编程语言

。

#### 7.1 **Hessian 的优点**：
- **跨语言支持**：除了 Java，Hessian 还支持 Python、Ruby 等语言。
- **高效的二进制格式**：比 XML 和 JSON 更紧凑。

---

### 8. **总结**

不同的序列化协议各有优缺点，选择合适的协议取决于应用场景：
- **JDK 自带序列化**：简单易用，但性能差。
- **Kryo**：性能较好，适合 Java 环境。
- **Protobuf**：跨语言支持，适合大规模数据交换。
- **ProtoStuff**：性能优越，适合需要高性能序列化的场景。
- **Hessian**：适合 RPC 和 Web 服务的序列化需求。

