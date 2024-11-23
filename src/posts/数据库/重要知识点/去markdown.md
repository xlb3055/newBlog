---
icon: pen-to-square
date: 2024-11-22
category:
- 后端
tag:
- MySQL
- 数据库
---
# 去markdown乱码

Here is the English version of the responses, structured to sound natural and like a university-level student answering:

---

### **Question 1**

#### **(a) Purpose of SQL Operators/Clauses**

1. **Select**  
   **Purpose**: Used to retrieve specific data from one or more columns in a table.  
   **Example**: Retrieve the names and grades of students from the `students` table:
   ```sql
   SELECT name, grade FROM students;
   ```

2. **Having**  
   **Purpose**: Filters the results of grouped data after applying the `GROUP BY` clause.  
   **Example**: Show only those courses where the average grade is above 60:
   ```sql
   SELECT course_id, AVG(grade) 
   FROM grades 
   GROUP BY course_id 
   HAVING AVG(grade) > 60;
   ```

3. **Join**  
   **Purpose**: Combines rows from two or more tables based on a related column.  
   **Example**: Fetch each student and their associated employer contact information:
   ```sql
   SELECT s.name, e.contact 
   FROM students s 
   JOIN employers e ON s.employer_id = e.id;
   ```

4. **Count**  
   **Purpose**: Returns the number of rows that meet certain conditions or the total row count of a table.  
   **Example**: Count the number of students who have paid their fees:
   ```sql
   SELECT COUNT(*) FROM students WHERE paid = 'Y';
   ```

5. **Where**  
   **Purpose**: Filters records based on specified conditions before they are processed.  
   **Example**: Find all students who are participating in a project:
   ```sql
   SELECT studno, name 
   FROM students 
   WHERE project = 'Y';
   ```

---

#### **(b) Advantages of a Database Management System (DBMS)**

1. **Data Integrity**: DBMS ensures that the data is consistent and accurate across the database, particularly through constraints and transaction management. For instance, duplicate entries can be avoided using primary keys.

2. **Efficient Query Processing**: Unlike manual searches in a file-based system, DBMS uses indexing and optimization techniques to execute queries efficiently.

3. **Data Security**: Permissions and access controls allow for secure management of sensitive data. For example, an admin might have full access while regular users can only view specific fields.

4. **Reduced Redundancy**: By normalizing data, a DBMS reduces data duplication, saving storage space and ensuring a single point of truth for updates.

---

### **Question 2**

#### **(a) Purpose of Entity-Relationship (ER) Modeling**

**Purpose**:
- ER modeling simplifies the understanding of the data requirements of a system by visually representing entities, their attributes, and relationships.
- It provides a blueprint for database design, helping translate real-world processes into structured data.

**Example**:  
A hospital system:
- **Entities**: Patients, Doctors, Appointments.
- **Attributes**: A patient has attributes such as `Patient_ID`, `Name`, and `Contact`.
- **Relationships**:
    - A patient **books** an appointment with a doctor.
    - A doctor **handles** multiple appointments.

**ER Diagram**:
```
Patients --< Books >-- Appointments --< Handled_by >-- Doctors
```

---

#### **(b) Data Independence**

**Definition**:  
Data independence refers to the ability to change the database schema at one level without impacting the schema at the next higher level.

**How It Works**:  
DBMS uses three levels of architecture:
1. **Physical Level**: Describes how data is physically stored.
2. **Conceptual Level**: Describes the structure of the entire database.
3. **External Level**: Describes how end users interact with the database.

**Importance**:
- **Flexibility**: Developers can update physical storage (e.g., switching to SSD) without affecting users or applications.
- **Scalability**: Logical schema modifications (e.g., adding a new column) don't require changes to the application layer.

---

### **Question 3**

#### **(a) Base Relation vs. View**

**Base Relation**:  
A base relation is a table stored in the database. It represents the actual data stored physically.

**View**:  
A view is a virtual table created by a query, which doesn’t store data itself but retrieves it dynamically.

**Benefits of Views**:
1. **Simplified Queries**: Encapsulate complex queries into reusable views.
2. **Data Security**: Restrict access to sensitive columns by exposing only necessary data via views.
3. **Data Independence**: Users interact with views, even if the underlying table structure changes.

**Example in HR**:
- **Base Table**: `employees` contains sensitive data like `salary`.
- **View**: A view called `employee_summary` only shows `name` and `department`:
  ```sql
  CREATE VIEW employee_summary AS 
  SELECT name, department 
  FROM employees;
  ```

---

#### **(b) File-Based System vs. DBMS**

1. **Data Redundancy**: File systems often store duplicate data, whereas DBMS uses normalization to eliminate redundancy.
2. **Data Security**: DBMS provides granular user-level security, unlike basic file permissions.
3. **Concurrent Access**: DBMS allows multiple users to access data simultaneously without conflicts, while file systems lack concurrency control.
4. **Query Optimization**: DBMS employs indexing and query planners for faster searches, whereas file systems rely on manual file traversal.

---

### **Question 4**

#### **(a) Attributes Concepts**

1. **Attribute Domain**:  
   Defines the set of valid values for an attribute.  
   **Example**: The `Age` attribute has a domain of integers between 0 and 120.

2. **Simple Attribute**:  
   A single-valued, indivisible attribute.  
   **Example**: A `Phone_Number` field that stores only one number per record.

3. **Composite Attribute**:  
   An attribute that can be divided into smaller parts.  
   **Example**: An `Address` field comprising `Street`, `City`, and `Zip_Code`.

---

#### **(b) Ternary Relationships and Entity Types**

**Ternary Relationships**: Involve three entities. For example, in a library system:
- **Entities**: Students, Books, Librarians.
- **Relationships**:
    - A **Student** borrows a **Book**, which is issued by a **Librarian**.

**Multiplicity Constraints**:
1. **One-to-One**: Each librarian issues only one book to one student at a time.
2. **Many-to-One**: Many students can borrow the same book.
3. **Many-to-Many**: Multiple students borrow multiple books issued by multiple librarians.

**Strong vs. Weak Entities**:
- A **Strong Entity** has a primary key (e.g., `Student_ID`).
- A **Weak Entity** relies on a related strong entity for identification (e.g., `Order_Details` depends on `Order_ID`).

---

### **Question 5**

#### **(a) Entities and Functional Dependencies**

**Entities**:
1. Students (`studno`, `name`).
2. Employers (`empl_id`, `empl_phone`).
3. Certificates (`cert_id`, `tutor`).

**Functional Dependencies**:
- `studno → name, empl_id, empl_phone`.
- `studno → paid, project, eligible`.
- `cert_id → tutor`.

---

#### **(b) Normalization to 3NF**

1. **Unnormalized Form (UNF)**:  
   Original table contains repeating groups.

2. **First Normal Form (1NF)**:  
   Separate repeating groups into individual rows.

3. **Second Normal Form (2NF)**:  
   Remove partial dependencies. Ensure all non-key attributes are fully dependent on the primary key.

4. **Third Normal Form (3NF)**:  
   Eliminate transitive dependencies, ensuring no non-key attribute depends on another non-key attribute.

---

### **Question 6**

#### **(a) Threats to Database Systems**

1. **SQL Injection**: Attackers inject malicious SQL to manipulate data.
2. **Unauthorized Access**: Insufficient access control leads to sensitive data exposure.
3. **Data Loss**: Hardware failure or accidental deletion can cause irrecoverable data loss.
4. **Malware**: Viruses targeting database servers disrupt operations.

---

#### **(b) Countermeasures**

1. **Computer-Based**: Use parameterized queries to prevent SQL injection.
2. **Non-Computer-Based**: Conduct regular training to ensure employees follow data security protocols.

--- 

These responses are concise, to the point, and demonstrate a clear understanding of the concepts while avoiding overly complex language.