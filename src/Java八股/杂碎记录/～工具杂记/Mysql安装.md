---
icon: pen-to-square
date: 2024-08-13
category:
- 开发工具
tag:
- 开发工具
---
# Mysql安装
## 一、下载
[下载地址](https://dev.mysql.com/downloads/mysql/)<br>
下载第一个zip压缩包<br>
![img.png](../../postImg/mysqlInstall/mysqlInstall1.png)
**下一个页面直接选左下角的no thanks .....直接开始下载**
下载后解压缩
## 二、配置文件
1.在解压后的文件夹中新建txt文件，并改为my.ini<br>
![在这里插入图片描述](../../postImg/mysqlInstall/mysqlInstall2.png)

2.双击打开my.ini文件，将下面代码复制进去，***注意：1.修改其中的安装目录和存放目录，下面是我的路径，根据需要修改。2.端口号如果冲突也可以根据需要修改***

```bash
[mysql]

# 设置mysql客户端默认字符集
default-character-set=utf8
 
[mysqld]
#设置3306端口
port = 3306
# 设置mysql的安装目录
basedir=E:\MySQL\mysql-8.4.0-winx64
# 设置mysql数据库的数据的存放目录
datadir=E:\MySQL\mysql-8.4.0-winx64\data
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
```

## 三、初始化 
1. 在解压缩后的bin文件夹内右键打开终端
   如果按**直接打开管理员身份终端**的方法则输入以下命令
   `mysqld --initialize --console`
   如果这步出错，查看配置文件my.ini中安装目录和数据存放目录是否正确，或复制粘贴可能附带的版权声明是否删除
   5.上一步的结果中，找到root@localhost:后面的字符串是初始密码，记下来，修改密码的时候要用
   ![在这里插入图片描述](../../postImg/mysqlInstall/mysqlInstall3.png)

## 四、安装启动
1.安装
以**管理员身份**运行cmd，进入解压缩后的bin文件夹
输入以下命令(下面的MySQL是服务名，可以根据自己需求修改)：
```bash
mysqld --install Mysql  
```
出现 Service successfully installed 则为安装成功 <br>
![在这里插入图片描述](../../postImg/mysqlInstall/mysqlInstall4.png)

2.启动服务
输入以下命令：
```bash
net start mysql
```
![在这里插入图片描述](../../postImg/mysqlInstall/mysqlInstall5.png)<br>
**注意：**
1. 启动服务这一步必须要在管理员身份下打开。
2. 如果上一个步骤**安装**时服务名不满意可以使用以下命令行删除，重新进行上一个步骤
```bash
sc delete 服务名
```
	p.s 如果忘记服务名具体是什么，可以按住win+R，输入 services.msc，在打开的服务列表中找到服务名

3. 如果要停止mysql，命令为 `net stop mysql`
## 五、更改密码
```bash
mysql -u root -p
```
**注意:**
1. 输入密码时，无法复制粘贴，需要手动输入
2. 密码是 ：

> 三、初始化 5. 上一步的结果中，找到root@localhost:后面的字符串是初始密码，记下来，修改密码的时候要用
      ![在这里插入图片描述](../../postImg/mysqlInstall/mysqlInstall6.png)
      登录成功：
      ![在这里插入图片描述](../../postImg/mysqlInstall/mysqlInstall7.png)

验证密码后会变成` mysql>`，然后输入命令：
```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
```
![](../../postImg/mysqlInstall/mysqlInstall8.png)