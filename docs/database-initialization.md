# 数据库初始化说明

## 📋 概述

企业管理系统的数据库会在Docker容器启动时自动初始化，无需手动操作。本文档说明了初始化过程和验证方法。

## 🔄 自动初始化流程

### 1. 触发机制
当MySQL容器首次启动时，Docker会自动执行 `scripts/init-database.sql` 脚本。

### 2. 初始化内容

#### 数据库和表结构
- 创建 `enterprise_management` 数据库
- 创建10个业务表：
  - `users` - 用户表
  - `roles` - 角色表  
  - `permissions` - 权限表
  - `user_roles` - 用户角色关联表
  - `role_permissions` - 角色权限关联表
  - `orders` - 订单表
  - `order_items` - 订单项表
  - `audit_logs` - 审计日志表
  - `notifications` - 通知表
  - `system_configs` - 系统配置表

#### 基础数据
- **4个默认角色**：
  - `admin` - 系统管理员（全部权限）
  - `manager` - 部门经理（业务管理权限）
  - `employee` - 普通员工（基础权限）
  - `guest` - 访客（只读权限）

- **17个权限项**：
  - 用户管理：`user.read`, `user.write`, `user.create`, `user.delete`
  - 角色管理：`role.read`, `role.write`
  - 权限管理：`permission.read`, `permission.write`
  - 订单管理：`order.read`, `order.write`, `order.create`, `order.delete`
  - 系统管理：`admin.read`, `admin.write`
  - 审计日志：`audit.read`
  - 系统配置：`config.read`, `config.write`

- **3个测试用户**：
  - `admin` / `Admin123!` - 系统管理员
  - `manager` / `User123!` - 部门经理
  - `employee` / `User123!` - 普通员工

- **示例数据**：
  - 3个测试订单和订单项
  - 系统配置参数
  - 用户通知示例

## ✅ 验证初始化结果

### 方法1: 使用验证脚本（推荐）

**Windows用户**：
```cmd
scripts\verify-database.bat
```

**Linux/Mac用户**：
```bash
chmod +x scripts/verify-database.sh
./scripts/verify-database.sh
```

### 方法2: 手动验证

```bash
# 连接到MySQL容器
docker exec -it ems_mysql mysql -uroot -proot123456

# 在MySQL命令行中执行
USE enterprise_management;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM roles;
SELECT COUNT(*) FROM permissions;
```

**预期结果**：
- 应该看到10个表
- users表：3条记录
- roles表：4条记录
- permissions表：17条记录

### 方法3: 运行完整验证

```bash
# 执行完整的数据库验证脚本
docker exec -i ems_mysql mysql -uroot -proot123456 < scripts/verify-database.sql
```

## 🛠️ 故障排除

### 问题1: 数据库未初始化

**症状**：连接数据库时提示 `Unknown database 'enterprise_management'`

**解决方案**：
```bash
# 重新创建MySQL容器
docker-compose down
docker volume rm enterprise-management-system_mysql_data
docker-compose up -d mysql

# 等待30秒后验证
docker exec -it ems_mysql mysql -uroot -proot123456 -e "SHOW DATABASES;"
```

### 问题2: 表为空或数据不完整

**症状**：数据库存在但表中没有数据

**解决方案**：
```bash
# 手动执行初始化脚本
docker exec -i ems_mysql mysql -uroot -proot123456 < scripts/init-database.sql
```

### 问题3: 权限错误

**症状**：`Access denied for user 'root'@'%'`

**解决方案**：
```bash
# 检查容器状态
docker logs ems_mysql

# 重置MySQL容器
docker-compose restart mysql
```

## 📝 重要说明

### 安全提醒
- 默认密码仅用于开发环境
- 生产环境必须修改所有默认密码
- 建议启用SSL连接

### 数据持久化
- 数据存储在Docker卷中：`enterprise-management-system_mysql_data`
- 删除卷会丢失所有数据
- 建议定期备份重要数据

### 脚本特性
- 使用 `INSERT IGNORE` 避免重复插入
- 支持多次执行而不会出错
- 包含完整的外键约束

## 🔗 相关文档

- [数据库设计文档](./database-design.md)
- [安装指南](./setup-guide.md)
- [后端架构文档](./backend-architecture.md)

## 📞 获取帮助

如果遇到数据库初始化问题：

1. 检查Docker容器状态：`docker-compose ps`
2. 查看MySQL日志：`docker logs ems_mysql`
3. 运行验证脚本确认问题
4. 参考故障排除部分
5. 联系开发团队

---

**数据库初始化完成后，您就可以开始使用系统了！** 🎉 