# 企业管理系统后端架构文档

## 项目概述

本项目采用基于NestJS的微服务架构，提供企业管理系统的后端服务。系统包含API网关、用户服务、订单服务和管理服务四个核心微服务。

## 技术栈

### 核心框架
- **NestJS**: Node.js企业级应用框架
- **TypeScript**: 强类型JavaScript超集
- **TypeORM**: 对象关系映射(ORM)框架

### 数据库与缓存
- **MySQL 8.0**: 主数据库
- **Redis**: 缓存和会话存储

### 消息队列
- **RabbitMQ**: 微服务间异步通信

### 日志与监控
- **Winston**: 日志记录
- **Elasticsearch**: 日志存储
- **Kibana**: 日志可视化

### 安全与认证
- **JWT**: 身份认证
- **bcrypt**: 密码加密
- **Helmet**: 安全中间件

## 微服务架构

### 1. API网关 (api-gateway)
**端口**: 3000  
**职责**: 
- 统一入口点
- 路由转发
- 身份认证
- 请求限流
- API文档

**核心模块**:
- `AuthModule`: 认证模块
- `UsersModule`: 用户管理代理
- `OrdersModule`: 订单管理代理
- `AdminModule`: 系统管理代理
- `CommonModule`: 通用服务

### 2. 用户服务 (user-service)
**端口**: 3001  
**职责**:
- 用户管理
- 角色权限
- 身份验证

**核心实体**:
- `User`: 用户实体
- `Role`: 角色实体
- `Permission`: 权限实体

### 3. 订单服务 (order-service)
**端口**: 3002  
**职责**:
- 订单管理
- 订单状态跟踪
- 订单统计

### 4. 管理服务 (admin-service)
**端口**: 3003  
**职责**:
- 系统配置
- 数据统计
- 审计日志
- 通知管理

## 数据库设计

### 核心表结构

#### 用户相关表
- `users`: 用户基本信息
- `roles`: 角色定义
- `permissions`: 权限定义
- `user_roles`: 用户角色关联
- `role_permissions`: 角色权限关联

#### 业务相关表
- `orders`: 订单主表
- `order_items`: 订单项目
- `audit_logs`: 审计日志
- `notifications`: 系统通知

## API设计

### 认证接口
```
POST /api/v1/auth/login     # 用户登录
POST /api/v1/auth/register  # 用户注册
GET  /api/v1/auth/profile   # 获取用户信息
POST /api/v1/auth/refresh   # 刷新Token
POST /api/v1/auth/logout    # 退出登录
```

### 用户管理接口
```
GET    /api/v1/users        # 获取用户列表
POST   /api/v1/users        # 创建用户
GET    /api/v1/users/:id    # 获取用户详情
PUT    /api/v1/users/:id    # 更新用户信息
DELETE /api/v1/users/:id    # 删除用户
```

### 订单管理接口
```
GET    /api/v1/orders       # 获取订单列表
POST   /api/v1/orders       # 创建订单
GET    /api/v1/orders/:id   # 获取订单详情
PUT    /api/v1/orders/:id   # 更新订单
DELETE /api/v1/orders/:id   # 删除订单
```

## 配置管理

### 环境变量
```bash
# 应用配置
NODE_ENV=development
PORT=3000

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# 数据库配置
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=enterprise_management

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ配置
RABBITMQ_URL=amqp://localhost:5672
```

## 部署架构

```
┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Frontend      │
│  (反向代理)      │    │   (Angular)     │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                    │
         ┌─────────────────┐
         │   API Gateway   │
         │    (端口:3000)   │
         └─────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼───┐    ┌─────▼─────┐    ┌───▼───┐
│用户服务│    │  订单服务  │    │管理服务│
│:3001  │    │   :3002   │    │ :3003 │
└───────┘    └───────────┘    └───────┘
    │               │               │
    └───────────────┼───────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐   ┌─────▼─────┐   ┌─────▼─────┐
│ MySQL  │   │   Redis   │   │ RabbitMQ  │
│ :3306  │   │   :6379   │   │  :5672    │
└────────┘   └───────────┘   └───────────┘
```

## 安全特性

### 1. 身份认证
- JWT Token认证
- 刷新Token机制
- 密码强度验证
- 登录失败限制

### 2. 权限控制
- 基于角色的访问控制(RBAC)
- 细粒度权限管理
- API级权限验证

### 3. 数据安全
- 密码bcrypt加密
- 敏感数据脱敏
- SQL注入防护
- XSS攻击防护

## 监控与日志

### 1. 日志系统
- 分级日志记录
- 结构化日志格式
- 日志轮转策略
- 集中化日志收集

### 2. 监控指标
- 应用性能监控
- 数据库性能监控
- 内存使用监控
- 错误率监控

## 开发指南

### 1. 本地开发环境搭建
```bash
# 1. 启动基础设施
docker-compose up -d

# 2. 安装依赖
cd backend
npm run install:all

# 3. 启动服务
npm start
```

### 2. 代码规范
- 使用TypeScript严格模式
- 遵循NestJS最佳实践
- 统一的错误处理
- 完整的API文档

### 3. 测试策略
- 单元测试覆盖
- 集成测试
- E2E测试
- 性能测试

## 扩展计划

### 1. 功能扩展
- [ ] 文件上传服务
- [ ] 邮件通知服务
- [ ] 工作流引擎
- [ ] 报表生成服务

### 2. 技术优化
- [ ] 服务发现与注册
- [ ] 分布式缓存
- [ ] 读写分离
- [ ] 消息队列集群

### 3. 运维优化
- [ ] 容器化部署
- [ ] CI/CD流水线
- [ ] 自动化监控
- [ ] 灾备方案

## 默认账号

**管理员账号**:
- 用户名: admin
- 密码: Admin123!
- 角色: 系统管理员

## 相关文档

- [前端架构文档](./frontend-architecture.md)
- [API接口文档](http://localhost:3000/api/docs)
- [数据库设计文档](./database-design.md)
- [部署运维文档](./deployment-guide.md) 