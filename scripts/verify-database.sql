-- 数据库验证脚本
-- 用于验证数据库初始化是否成功

USE enterprise_management;

-- 显示所有表
SELECT '=== 数据库表列表 ===' AS info;
SHOW TABLES;

-- 统计各表数据量
SELECT '=== 数据统计 ===' AS info;
SELECT 
    'users' AS table_name, 
    COUNT(*) AS record_count 
FROM users
UNION ALL
SELECT 
    'roles' AS table_name, 
    COUNT(*) AS record_count 
FROM roles
UNION ALL
SELECT 
    'permissions' AS table_name, 
    COUNT(*) AS record_count 
FROM permissions
UNION ALL
SELECT 
    'user_roles' AS table_name, 
    COUNT(*) AS record_count 
FROM user_roles
UNION ALL
SELECT 
    'role_permissions' AS table_name, 
    COUNT(*) AS record_count 
FROM role_permissions
UNION ALL
SELECT 
    'orders' AS table_name, 
    COUNT(*) AS record_count 
FROM orders
UNION ALL
SELECT 
    'order_items' AS table_name, 
    COUNT(*) AS record_count 
FROM order_items
UNION ALL
SELECT 
    'notifications' AS table_name, 
    COUNT(*) AS record_count 
FROM notifications
UNION ALL
SELECT 
    'system_configs' AS table_name, 
    COUNT(*) AS record_count 
FROM system_configs;

-- 显示用户信息
SELECT '=== 用户信息 ===' AS info;
SELECT 
    username,
    email,
    firstName,
    lastName,
    isActive,
    createdAt
FROM users
ORDER BY createdAt;

-- 显示角色权限分配
SELECT '=== 角色权限分配 ===' AS info;
SELECT 
    r.name AS role_name,
    r.description AS role_description,
    COUNT(rp.permissionId) AS permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.roleId
GROUP BY r.id, r.name, r.description
ORDER BY r.name;

-- 显示用户角色分配
SELECT '=== 用户角色分配 ===' AS info;
SELECT 
    u.username,
    u.email,
    GROUP_CONCAT(r.name) AS roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.userId
LEFT JOIN roles r ON ur.roleId = r.id
GROUP BY u.id, u.username, u.email
ORDER BY u.username;

-- 显示订单状态统计
SELECT '=== 订单状态统计 ===' AS info;
SELECT 
    status,
    COUNT(*) AS count,
    SUM(totalAmount) AS total_amount
FROM orders
GROUP BY status
ORDER BY status;

-- 显示系统配置
SELECT '=== 系统配置 ===' AS info;
SELECT 
    `key`,
    `value`,
    description,
    type,
    isPublic
FROM system_configs
ORDER BY `key`;

-- 验证完成信息
SELECT '=== 验证完成 ===' AS info;
SELECT 
    CONCAT('数据库: ', DATABASE()) AS database_info,
    CONCAT('验证时间: ', NOW()) AS verify_time,
    '数据库初始化验证完成！' AS status; 