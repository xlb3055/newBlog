---
icon: pen-to-square
date: 2025-2-4
category:
- 后端
tag:
- MyBatis
---
# 拦截器和dfa算法脱敏


## **1. 相关技术和概念讲解**

### 1.1 **MyBatis 拦截器 (Interceptor)**

**MyBatis** 是一款流行的持久层框架，广泛应用于 Java 项目中。**MyBatis 拦截器** 是 MyBatis 提供的一个插件机制，用于在执行 SQL 语句时对 SQL 操作进行拦截和处理。通过拦截器，你可以在执行数据库操作前后，增加额外的逻辑，比如记录日志、数据校验、缓存处理等。

#### MyBatis 拦截器的核心概念：
- **拦截器接口**：通过实现 `Interceptor` 接口来自定义拦截器。
- **拦截方法**：MyBatis 提供了 `intercept` 方法，你可以在这个方法中编写自己的逻辑，处理 SQL 执行前、后或异常时的操作。
- **SQL 会话对象**：拦截器通过 `Invocation` 对象获取 SQL 执行的具体信息。

#### 在敏感词过滤方案中的作用：
- 拦截器能够在 SQL 执行前后，对传入的用户数据进行敏感词过滤，从而避免不良内容进入数据库。

### 1.2 **DFA 算法（确定有限自动机）**

**DFA 算法**（Deterministic Finite Automaton，确定有限自动机）是一种用于高效模式匹配的算法。它非常适合用于敏感词过滤，因为它可以在常数时间内查找一个文本是否包含某些敏感词。

#### DFA 算法的基本工作原理：
1. **构建状态机**：通过给定的敏感词，构建一个 **状态机**，将每个敏感词分解为一个个字符的状态转换。
2. **遍历输入文本**：DFA 算法会从文本的第一个字符开始，根据状态机的规则进行状态转换，如果遇到与敏感词相匹配的字符序列，就识别为敏感词。
3. **匹配效率**：DFA 算法在查找过程中时间复杂度为 O(n)，其中 n 是文本的长度。相较于其他算法（如暴力匹配、Boyer-Moore 等），DFA 算法的匹配效率非常高。

### 1.3 **结合 MyBatis 拦截器和 DFA 算法的敏感词过滤方案**

这个方案的主要目的是在数据写入数据库之前，通过拦截器对数据进行敏感词过滤，确保不良内容不会被存储到数据库中。具体的流程如下：

1. **定义敏感词列表**：从配置文件或数据库中加载敏感词，构建 DFA 状态机。
2. **MyBatis 拦截器拦截插入或更新操作**：在数据插入数据库之前，拦截 SQL 请求，对用户提交的文本数据（如评论、帖子内容等）进行敏感词过滤。
3. **DFA 算法进行敏感词匹配**：通过 DFA 算法检测文本中的敏感词，如果匹配到敏感词，则进行相应处理（如替换、屏蔽、提示用户等）。
4. **返回清理后的数据**：将过滤后的内容传递给 SQL 执行，确保数据的健康性。

## **2. 方案设计**

### 2.1 **步骤概览**

1. **构建 DFA 状态机**：
    - 从数据库或配置文件中加载敏感词。
    - 使用 DFA 算法构建状态机。

2. **实现 MyBatis 拦截器**：
    - 编写 MyBatis 插件，通过拦截器对 SQL 执行过程中的文本数据进行预处理。
    - 在插入或更新数据时，对内容进行敏感词过滤。

3. **将敏感词过滤与数据库操作结合**：
    - 在插入、更新等操作前，使用敏感词过滤对文本数据进行处理。
    - 在检测到敏感词时，采取相应的措施，如替换、删除敏感词等。

### 2.2 **构建 DFA 状态机**

我们可以使用 DFA 算法来构建敏感词的匹配状态机。这里的核心思路是，将每个敏感词作为状态机的路径，将字符作为状态之间的转换。

例如，假设我们有敏感词列表：`["badword", "evil"]`，我们可以根据这些敏感词构建 DFA。

#### DFA 状态机的构建：
1. 为每个敏感词的每个字符创建一个状态。
2. 为每个状态之间创建转换关系。
3. 最终，构建的 DFA 状态机会根据字符的输入进行状态转移，如果最终达到一个敏感词的结束状态，就表示该文本包含敏感词。

### 2.3 **实现 MyBatis 拦截器**

MyBatis 的拦截器可以实现对数据库操作的拦截。在这个方案中，我们主要拦截 **INSERT** 和 **UPDATE** 操作，对用户提交的文本数据进行处理。

```java
public class SensitiveWordInterceptor implements Interceptor {
    private SensitiveWordFilter sensitiveWordFilter; // DFA 过滤器

    public SensitiveWordInterceptor(SensitiveWordFilter filter) {
        this.sensitiveWordFilter = filter;
    }

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 获取参数对象
        Object[] args = invocation.getArgs();
        
        for (Object arg : args) {
            if (arg instanceof String) {
                String content = (String) arg;
                // 执行敏感词过滤
                String filteredContent = sensitiveWordFilter.filter(content);
                // 替换原内容
                arg = filteredContent;
            }
        }
        return invocation.proceed();
    }
}
```

#### 2.3.1 **过滤逻辑**

```java
public class SensitiveWordFilter {
    private DFAStateMachine stateMachine;

    public SensitiveWordFilter(Set<String> sensitiveWords) {
        this.stateMachine = new DFAStateMachine(sensitiveWords);
    }

    public String filter(String input) {
        return stateMachine.filter(input);
    }
}
```

### 2.4 **DFA 状态机的实现**

我们实现一个简单的 DFA 状态机来匹配敏感词。

```java
public class DFAStateMachine {
    private Map<Integer, Map<Character, Integer>> stateTable = new HashMap<>();
    private Set<Integer> terminalStates = new HashSet<>();
    private int stateCounter = 0;

    public DFAStateMachine(Set<String> sensitiveWords) {
        buildStateMachine(sensitiveWords);
    }

    private void buildStateMachine(Set<String> sensitiveWords) {
        // 为每个敏感词创建状态机
        for (String word : sensitiveWords) {
            int currentState = 0;
            for (char c : word.toCharArray()) {
                Map<Character, Integer> transitions = stateTable.get(currentState);
                if (transitions == null) {
                    transitions = new HashMap<>();
                    stateTable.put(currentState, transitions);
                }
                currentState = transitions.computeIfAbsent(c, k -> ++stateCounter);
            }
            terminalStates.add(currentState);
        }
    }

    public String filter(String input) {
        StringBuilder result = new StringBuilder();
        int state = 0;
        for (char c : input.toCharArray()) {
            Map<Character, Integer> transitions = stateTable.get(state);
            if (transitions != null && transitions.containsKey(c)) {
                state = transitions.get(c);
                // 如果到了终止状态，说明发现敏感词
                if (terminalStates.contains(state)) {
                    result.append("[敏感词]");
                    state = 0; // 回到初始状态
                }
            } else {
                result.append(c);
                state = 0;
            }
        }
        return result.toString();
    }
}
```

## **3. 小结**

- **MyBatis 拦截器**：通过拦截器可以在 SQL 执行前对用户提交的内容进行敏感词过滤，防止敏感内容进入数据库。
- **DFA 算法**：利用 DFA 算法高效地检测文本中的敏感词，确保过滤过程的高效性和准确性。
- **结合 MyBatis 和 DFA 实现敏感词过滤**：通过将 DFA 算法与 MyBatis 拦截器结合，实现了对数据库操作中敏感内容的实时过滤，确保社区内容的健康和安全。


