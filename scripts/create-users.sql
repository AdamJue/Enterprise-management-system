-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    avatar VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    lastLoginAt DATETIME NULL,
    refreshToken TEXT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建角色表
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认管理员用户
INSERT IGNORE INTO users (id, username, email, password, firstName, lastName) VALUES
('user-admin', 'admin', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xOvzlNnX6', '系统', '管理员');

-- 插入默认角色
INSERT IGNORE INTO roles (id, name, description) VALUES
('role-admin', 'admin', '系统管理员');

-- 分配角色给用户
INSERT IGNORE INTO user_roles (userId, roleId) VALUES
('user-admin', 'role-admin'); 