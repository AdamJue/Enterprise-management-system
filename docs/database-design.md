# 企业管理系统数据库设计文档

## 概述

本文档描述了企业管理系统的数据库设计，包含用户权限管理、订单管理、系统配置等核心功能模块的数据表结构。

## 数据库信息

- **数据库名称**: `enterprise_management`
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`
- **数据库引擎**: InnoDB
- **MySQL版本**: 8.0+

## 表结构设计

### 1. 用户权限模块

#### 1.1 用户表 (users)

存储系统用户的基本信息。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 用户ID (UUID) |
| username | VARCHAR(50) | NOT NULL, UNIQUE | - | 用户名 |
| email | VARCHAR(100) | NOT NULL, UNIQUE | - | 邮箱地址 |
| password | VARCHAR(255) | NOT NULL | - | 密码 (bcrypt加密) |
| firstName | VARCHAR(50) | NOT NULL | - | 名 |
| lastName | VARCHAR(50) | NOT NULL | - | 姓 |
| avatar | VARCHAR(255) | NULL | - | 头像URL |
| phone | VARCHAR(20) | NULL | - | 手机号 |
| isActive | BOOLEAN | NOT NULL | TRUE | 是否激活 |
| lastLoginAt | DATETIME | NULL | - | 最后登录时间 |
| refreshToken | TEXT | NULL | - | 刷新令牌 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- `idx_username` (username)
- `idx_email` (email)  
- `idx_active` (isActive)

#### 1.2 角色表 (roles)

定义系统中的用户角色。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 角色ID (UUID) |
| name | VARCHAR(50) | NOT NULL, UNIQUE | - | 角色名称 |
| description | TEXT | NULL | - | 角色描述 |
| isActive | BOOLEAN | NOT NULL | TRUE | 是否激活 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- `idx_name` (name)
- `idx_active` (isActive)

#### 1.3 权限表 (permissions)

定义系统中的操作权限。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 权限ID (UUID) |
| name | VARCHAR(50) | NOT NULL, UNIQUE | - | 权限名称 |
| action | VARCHAR(50) | NOT NULL | - | 操作类型 (read/write/delete/create) |
| resource | VARCHAR(50) | NOT NULL | - | 资源类型 (user/order/admin等) |
| description | TEXT | NULL | - | 权限描述 |
| isActive | BOOLEAN | NOT NULL | TRUE | 是否激活 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- `idx_name` (name)
- `idx_action_resource` (action, resource)
- `idx_active` (isActive)

#### 1.4 用户角色关联表 (user_roles)

用户与角色的多对多关联关系。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| userId | VARCHAR(36) | NOT NULL, FK | 用户ID |
| roleId | VARCHAR(36) | NOT NULL, FK | 角色ID |

**主键**: (userId, roleId)
**外键**: 
- userId → users(id) ON DELETE CASCADE
- roleId → roles(id) ON DELETE CASCADE

#### 1.5 角色权限关联表 (role_permissions)

角色与权限的多对多关联关系。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| roleId | VARCHAR(36) | NOT NULL, FK | 角色ID |
| permissionId | VARCHAR(36) | NOT NULL, FK | 权限ID |

**主键**: (roleId, permissionId)
**外键**:
- roleId → roles(id) ON DELETE CASCADE
- permissionId → permissions(id) ON DELETE CASCADE

### 2. 订单管理模块

#### 2.1 订单表 (orders)

存储订单的主要信息。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 订单ID (UUID) |
| orderNumber | VARCHAR(50) | NOT NULL, UNIQUE | - | 订单号 |
| customerId | VARCHAR(36) | NOT NULL | - | 客户ID |
| customerName | VARCHAR(100) | NOT NULL | - | 客户姓名 |
| totalAmount | DECIMAL(10,2) | NOT NULL | 0.00 | 总金额 |
| status | ENUM | NOT NULL | pending | 订单状态 |
| createdBy | VARCHAR(36) | NOT NULL, FK | - | 创建人ID |
| assignedTo | VARCHAR(36) | NULL, FK | - | 分配给谁 |
| notes | TEXT | NULL | - | 备注 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**订单状态枚举值**:
- `pending`: 待处理
- `processing`: 处理中
- `shipped`: 已发货
- `delivered`: 已送达
- `cancelled`: 已取消

**索引**:
- `idx_order_number` (orderNumber)
- `idx_customer` (customerId)
- `idx_status` (status)
- `idx_created_by` (createdBy)
- `idx_assigned_to` (assignedTo)
- `idx_created_at` (createdAt)

**外键**:
- createdBy → users(id)
- assignedTo → users(id)

#### 2.2 订单项表 (order_items)

存储订单中的具体商品项目。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 订单项ID (UUID) |
| orderId | VARCHAR(36) | NOT NULL, FK | - | 订单ID |
| productId | VARCHAR(36) | NOT NULL | - | 产品ID |
| productName | VARCHAR(100) | NOT NULL | - | 产品名称 |
| quantity | INT | NOT NULL | 1 | 数量 |
| unitPrice | DECIMAL(10,2) | NOT NULL | - | 单价 |
| totalPrice | DECIMAL(10,2) | NOT NULL | - | 小计 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- `idx_order_id` (orderId)
- `idx_product_id` (productId)

**外键**:
- orderId → orders(id) ON DELETE CASCADE

### 3. 系统管理模块

#### 3.1 审计日志表 (audit_logs)

记录系统操作的审计日志。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 日志ID (UUID) |
| userId | VARCHAR(36) | NOT NULL, FK | 用户ID |
| action | VARCHAR(100) | NOT NULL | 操作动作 |
| resource | VARCHAR(100) | NOT NULL | 操作资源 |
| resourceId | VARCHAR(36) | NULL | 资源ID |
| details | JSON | NULL | 详细信息 |
| ipAddress | VARCHAR(45) | NULL | IP地址 |
| userAgent | TEXT | NULL | 用户代理 |
| createdAt | DATETIME | NOT NULL | 创建时间 |

**索引**:
- `idx_user_id` (userId)
- `idx_action` (action)
- `idx_resource` (resource)
- `idx_created_at` (createdAt)

**外键**:
- userId → users(id)

#### 3.2 通知表 (notifications)

存储系统通知信息。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 通知ID (UUID) |
| userId | VARCHAR(36) | NOT NULL, FK | - | 用户ID |
| type | ENUM | NOT NULL | info | 通知类型 |
| title | VARCHAR(200) | NOT NULL | - | 通知标题 |
| message | TEXT | NOT NULL | - | 通知内容 |
| data | JSON | NULL | - | 附加数据 |
| isRead | BOOLEAN | NOT NULL | FALSE | 是否已读 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**通知类型枚举值**:
- `info`: 信息
- `success`: 成功
- `warning`: 警告
- `error`: 错误

**索引**:
- `idx_user_id` (userId)
- `idx_type` (type)
- `idx_is_read` (isRead)
- `idx_created_at` (createdAt)

**外键**:
- userId → users(id)

#### 3.3 系统配置表 (system_configs)

存储系统配置参数。

| 字段名 | 数据类型 | 约束 | 默认值 | 描述 |
|--------|----------|------|--------|------|
| id | VARCHAR(36) | PRIMARY KEY | - | 配置ID (UUID) |
| key | VARCHAR(100) | NOT NULL, UNIQUE | - | 配置键 |
| value | TEXT | NOT NULL | - | 配置值 |
| description | TEXT | NULL | - | 配置描述 |
| type | ENUM | NOT NULL | string | 值类型 |
| isPublic | BOOLEAN | NOT NULL | FALSE | 是否公开 |
| createdAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**值类型枚举**:
- `string`: 字符串
- `number`: 数字
- `boolean`: 布尔值
- `json`: JSON对象

**索引**:
- `idx_key` (key)
- `idx_is_public` (isPublic)

## 初始化数据

### 默认角色

| 角色ID | 角色名 | 描述 |
|--------|--------|------|
| role-admin | admin | 系统管理员 - 拥有所有权限 |
| role-manager | manager | 部门经理 - 拥有业务管理权限 |
| role-employee | employee | 普通员工 - 拥有基本业务权限 |
| role-guest | guest | 访客 - 只读权限 |

### 默认权限

| 权限名 | 操作 | 资源 | 描述 |
|--------|------|------|------|
| user.read | read | user | 查看用户信息 |
| user.write | write | user | 编辑用户信息 |
| user.delete | delete | user | 删除用户 |
| user.create | create | user | 创建用户 |
| order.read | read | order | 查看订单 |
| order.write | write | order | 编辑订单 |
| order.delete | delete | order | 删除订单 |
| order.create | create | order | 创建订单 |
| admin.read | read | admin | 查看管理功能 |
| admin.write | write | admin | 管理系统设置 |

### 默认用户

| 用户名 | 密码 | 角色 | 描述 |
|--------|------|------|------|
| admin | Admin123! | admin | 系统管理员 |
| manager | User123! | manager | 部门经理 |
| employee | User123! | employee | 普通员工 |

## 数据关系图

```
users ←→ user_roles ←→ roles ←→ role_permissions ←→ permissions
  ↓
orders ←→ order_items
  ↓
audit_logs
  ↓
notifications
```

## 性能优化建议

### 1. 索引优化
- 为常用查询字段添加索引
- 避免在小表上创建过多索引
- 定期分析查询性能

### 2. 分区策略
- 对于大表（如audit_logs）考虑按时间分区
- 订单表可按年份或状态分区

### 3. 缓存策略
- 用户权限信息缓存
- 系统配置缓存
- 常用查询结果缓存

### 4. 归档策略
- 定期归档历史审计日志
- 清理过期通知
- 备份重要业务数据

## 数据安全

### 1. 敏感数据保护
- 密码使用bcrypt加密
- 个人信息字段考虑加密存储
- 审计日志不记录敏感信息

### 2. 访问控制
- 数据库用户权限最小化
- 定期更换数据库密码
- 启用SSL连接

### 3. 备份恢复
- 定期全量备份
- 增量备份策略
- 备份数据加密存储

## 版本管理

- **当前版本**: 1.0.0
- **创建日期**: 2024-12-24
- **最后更新**: 2024-12-24

## 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| 1.0.0 | 2024-12-24 | 初始版本创建 | System | 