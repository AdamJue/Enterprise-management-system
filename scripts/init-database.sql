-- 企业管理系统数据库初始化脚本
-- 创建时间: 2024-12-24
-- 数据库: MySQL 8.0+

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS enterprise_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE enterprise_management;

-- =============================================
-- 用户相关表
-- =============================================

-- 用户表
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `firstName` VARCHAR(50) NOT NULL COMMENT '名',
    `lastName` VARCHAR(50) NOT NULL COMMENT '姓',
    `avatar` VARCHAR(255) NULL COMMENT '头像URL',
    `phone` VARCHAR(20) NULL COMMENT '手机号',
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    `lastLoginAt` DATETIME NULL COMMENT '最后登录时间',
    `refreshToken` TEXT NULL COMMENT '刷新令牌',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`),
    INDEX `idx_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 角色表
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '角色ID',
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    `description` TEXT NULL COMMENT '角色描述',
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_name` (`name`),
    INDEX `idx_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 权限表
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '权限ID',
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '权限名称',
    `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
    `resource` VARCHAR(50) NOT NULL COMMENT '资源类型',
    `description` TEXT NULL COMMENT '权限描述',
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_name` (`name`),
    INDEX `idx_action_resource` (`action`, `resource`),
    INDEX `idx_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 用户角色关联表
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
    `userId` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `roleId` VARCHAR(36) NOT NULL COMMENT '角色ID',
    PRIMARY KEY (`userId`, `roleId`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 角色权限关联表
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
    `roleId` VARCHAR(36) NOT NULL COMMENT '角色ID',
    `permissionId` VARCHAR(36) NOT NULL COMMENT '权限ID',
    PRIMARY KEY (`roleId`, `permissionId`),
    FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- =============================================
-- 订单相关表
-- =============================================

-- 订单表
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '订单ID',
    `orderNumber` VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    `customerId` VARCHAR(36) NOT NULL COMMENT '客户ID',
    `customerName` VARCHAR(100) NOT NULL COMMENT '客户姓名',
    `totalAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '总金额',
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
    `createdBy` VARCHAR(36) NOT NULL COMMENT '创建人ID',
    `assignedTo` VARCHAR(36) NULL COMMENT '分配给谁',
    `notes` TEXT NULL COMMENT '备注',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_order_number` (`orderNumber`),
    INDEX `idx_customer` (`customerId`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_by` (`createdBy`),
    INDEX `idx_assigned_to` (`assignedTo`),
    INDEX `idx_created_at` (`createdAt`),
    FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`),
    FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单项表
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '订单项ID',
    `orderId` VARCHAR(36) NOT NULL COMMENT '订单ID',
    `productId` VARCHAR(36) NOT NULL COMMENT '产品ID',
    `productName` VARCHAR(100) NOT NULL COMMENT '产品名称',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
    `unitPrice` DECIMAL(10, 2) NOT NULL COMMENT '单价',
    `totalPrice` DECIMAL(10, 2) NOT NULL COMMENT '小计',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_order_id` (`orderId`),
    INDEX `idx_product_id` (`productId`),
    FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单项表';

-- =============================================
-- 系统管理相关表
-- =============================================

-- 审计日志表
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '日志ID',
    `userId` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `action` VARCHAR(100) NOT NULL COMMENT '操作动作',
    `resource` VARCHAR(100) NOT NULL COMMENT '操作资源',
    `resourceId` VARCHAR(36) NULL COMMENT '资源ID',
    `details` JSON NULL COMMENT '详细信息',
    `ipAddress` VARCHAR(45) NULL COMMENT 'IP地址',
    `userAgent` TEXT NULL COMMENT '用户代理',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_user_id` (`userId`),
    INDEX `idx_action` (`action`),
    INDEX `idx_resource` (`resource`),
    INDEX `idx_created_at` (`createdAt`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审计日志表';

-- 通知表
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '通知ID',
    `userId` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `type` ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info' COMMENT '通知类型',
    `title` VARCHAR(200) NOT NULL COMMENT '通知标题',
    `message` TEXT NOT NULL COMMENT '通知内容',
    `data` JSON NULL COMMENT '附加数据',
    `isRead` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_user_id` (`userId`),
    INDEX `idx_type` (`type`),
    INDEX `idx_is_read` (`isRead`),
    INDEX `idx_created_at` (`createdAt`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- 系统配置表
DROP TABLE IF EXISTS `system_configs`;
CREATE TABLE `system_configs` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '配置ID',
    `key` VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    `value` TEXT NOT NULL COMMENT '配置值',
    `description` TEXT NULL COMMENT '配置描述',
    `type` ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string' COMMENT '值类型',
    `isPublic` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否公开',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_key` (`key`),
    INDEX `idx_is_public` (`isPublic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =============================================
-- 初始化数据
-- =============================================

-- 插入默认权限
INSERT IGNORE INTO `permissions` (`id`, `name`, `action`, `resource`, `description`) VALUES
('perm-user-read', 'user.read', 'read', 'user', '查看用户信息'),
('perm-user-write', 'user.write', 'write', 'user', '编辑用户信息'),
('perm-user-delete', 'user.delete', 'delete', 'user', '删除用户'),
('perm-user-create', 'user.create', 'create', 'user', '创建用户'),
('perm-role-read', 'role.read', 'read', 'role', '查看角色'),
('perm-role-write', 'role.write', 'write', 'role', '管理角色'),
('perm-permission-read', 'permission.read', 'read', 'permission', '查看权限'),
('perm-permission-write', 'permission.write', 'write', 'permission', '管理权限'),
('perm-order-read', 'order.read', 'read', 'order', '查看订单'),
('perm-order-write', 'order.write', 'write', 'order', '编辑订单'),
('perm-order-delete', 'order.delete', 'delete', 'order', '删除订单'),
('perm-order-create', 'order.create', 'create', 'order', '创建订单'),
('perm-admin-read', 'admin.read', 'read', 'admin', '查看管理功能'),
('perm-admin-write', 'admin.write', 'write', 'admin', '管理系统设置'),
('perm-audit-read', 'audit.read', 'read', 'audit', '查看审计日志'),
('perm-config-read', 'config.read', 'read', 'config', '查看系统配置'),
('perm-config-write', 'config.write', 'write', 'config', '管理系统配置');

-- 插入默认角色
INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES
('role-admin', 'admin', '系统管理员 - 拥有所有权限'),
('role-manager', 'manager', '部门经理 - 拥有业务管理权限'),
('role-employee', 'employee', '普通员工 - 拥有基本业务权限'),
('role-guest', 'guest', '访客 - 只读权限');

-- 分配权限给角色
INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`) VALUES
-- 管理员拥有所有权限
('role-admin', 'perm-user-read'), ('role-admin', 'perm-user-write'), ('role-admin', 'perm-user-delete'), ('role-admin', 'perm-user-create'),
('role-admin', 'perm-role-read'), ('role-admin', 'perm-role-write'),
('role-admin', 'perm-permission-read'), ('role-admin', 'perm-permission-write'),
('role-admin', 'perm-order-read'), ('role-admin', 'perm-order-write'), ('role-admin', 'perm-order-delete'), ('role-admin', 'perm-order-create'),
('role-admin', 'perm-admin-read'), ('role-admin', 'perm-admin-write'),
('role-admin', 'perm-audit-read'), ('role-admin', 'perm-config-read'), ('role-admin', 'perm-config-write'),

-- 经理拥有业务管理权限
('role-manager', 'perm-user-read'), ('role-manager', 'perm-user-write'),
('role-manager', 'perm-order-read'), ('role-manager', 'perm-order-write'), ('role-manager', 'perm-order-create'),
('role-manager', 'perm-admin-read'),

-- 员工拥有基本业务权限
('role-employee', 'perm-user-read'),
('role-employee', 'perm-order-read'), ('role-employee', 'perm-order-create'),

-- 访客只有查看权限
('role-guest', 'perm-user-read'),
('role-guest', 'perm-order-read');

-- 插入默认管理员用户
-- 密码: Admin123! (bcrypt加密后的值)
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `firstName`, `lastName`) VALUES
('user-admin', 'admin', 'admin@example.com', '$2b$12$8vKQWd0LhEGXXW.YcGgzOekK9OofyOWdwfRtJvXrXr7ZJjK8LCmAa', '系统', '管理员');

-- 插入测试用户
-- 密码: User123! (bcrypt加密后的值)
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `firstName`, `lastName`) VALUES
('user-manager', 'manager', 'manager@example.com', '$2b$12$8vKQWd0LhEGXXW.YcGgzOekK9OofyOWdwfRtJvXrXr7ZJjK8LCmAa', '部门', '经理'),
('user-employee', 'employee', 'employee@example.com', '$2b$12$8vKQWd0LhEGXXW.YcGgzOekK9OofyOWdwfRtJvXrXr7ZJjK8LCmAa', '普通', '员工');

-- 分配角色给用户
INSERT IGNORE INTO `user_roles` (`userId`, `roleId`) VALUES
('user-admin', 'role-admin'),
('user-manager', 'role-manager'),
('user-employee', 'role-employee');

-- 插入系统配置
INSERT IGNORE INTO `system_configs` (`id`, `key`, `value`, `description`, `type`, `isPublic`) VALUES
('config-1', 'system.name', '企业管理系统', '系统名称', 'string', TRUE),
('config-2', 'system.version', '1.0.0', '系统版本', 'string', TRUE),
('config-3', 'system.maintenance', 'false', '维护模式', 'boolean', FALSE),
('config-4', 'auth.session_timeout', '1440', '会话超时时间(分钟)', 'number', FALSE),
('config-5', 'auth.max_login_attempts', '5', '最大登录尝试次数', 'number', FALSE),
('config-6', 'notification.email_enabled', 'true', '邮件通知开关', 'boolean', FALSE),
('config-7', 'file.max_upload_size', '10485760', '最大上传文件大小(字节)', 'number', FALSE);

-- 插入示例订单数据
INSERT IGNORE INTO `orders` (`id`, `orderNumber`, `customerId`, `customerName`, `totalAmount`, `status`, `createdBy`, `notes`) VALUES
('order-1', 'ORD-20241224-001', 'customer-1', '张三', 1299.99, 'pending', 'user-admin', '测试订单1'),
('order-2', 'ORD-20241224-002', 'customer-2', '李四', 2599.50, 'processing', 'user-manager', '测试订单2'),
('order-3', 'ORD-20241224-003', 'customer-3', '王五', 899.00, 'shipped', 'user-employee', '测试订单3');

-- 插入订单项数据
INSERT IGNORE INTO `order_items` (`id`, `orderId`, `productId`, `productName`, `quantity`, `unitPrice`, `totalPrice`) VALUES
('item-1', 'order-1', 'product-1', '笔记本电脑', 1, 1299.99, 1299.99),
('item-2', 'order-2', 'product-2', '智能手机', 2, 1299.75, 2599.50),
('item-3', 'order-3', 'product-3', '无线耳机', 1, 899.00, 899.00);

-- 插入示例通知
INSERT IGNORE INTO `notifications` (`id`, `userId`, `type`, `title`, `message`) VALUES
('notif-1', 'user-admin', 'info', '系统初始化完成', '企业管理系统已成功初始化，您可以开始使用了。'),
('notif-2', 'user-manager', 'success', '欢迎使用', '欢迎使用企业管理系统，您的账号已激活。'),
('notif-3', 'user-employee', 'info', '新订单通知', '您有新的订单需要处理，请及时查看。');

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 显示初始化完成信息
SELECT '数据库初始化完成！' AS message;
SELECT '默认管理员账号: admin / Admin123!' AS admin_info;
SELECT '数据库名称: enterprise_management' AS database_info;
SELECT CONCAT('初始化时间: ', NOW()) AS init_time; 