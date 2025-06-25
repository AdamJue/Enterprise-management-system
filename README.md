# 企业管理系统 (Enterprise Management System)

基于 NestJS + Angular 的现代化企业管理系统，采用微服务架构设计。

## 🏗️ 系统架构

```
前端 (Angular) → API网关 (NestJS) → 微服务集群 → 消息队列 → 数据库
```

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端 | Angular | 17.x |
| 后端 | NestJS | 10.x |
| 数据库 | MySQL | 8.x |
| 缓存 | Redis | 7.x |
| 消息队列 | RabbitMQ | 3.x |
| 容器化 | Docker | 24.x |

## 📁 项目结构

```
enterprise-management-system/
├── frontend/                 # Angular 前端应用
├── backend/                  # NestJS 后端服务
│   ├── api-gateway/         # API 网关服务
│   ├── user-service/        # 用户认证服务
│   ├── order-service/       # 订单管理服务
│   └── admin-service/       # 后台管理服务
├── shared/                  # 共享库和工具
├── docker/                  # Docker 配置文件
├── docs/                    # 项目文档
└── scripts/                 # 部署脚本
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+
- Redis 7.0+

### 一键启动（推荐）

**Windows用户**:
```powershell
# 运行PowerShell启动脚本
./scripts/start-dev.ps1
```

**Linux/Mac用户**:
```bash
# 运行Bash启动脚本
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

### 分步启动

1. **克隆项目**
```bash
git clone <repository-url>
cd enterprise-management-system
```

2. **启动基础设施服务**
```bash
# 启动MySQL、Redis、RabbitMQ等服务
docker-compose up -d

# 等待MySQL启动完成（约30秒），验证数据库初始化
docker exec -it ems_mysql mysql -uroot -proot123456 -e "USE enterprise_management; SHOW TABLES; SELECT COUNT(*) as user_count FROM users;"
```
> 💡 数据库会自动初始化，包含默认用户、角色、权限等数据

3. **安装依赖**
```bash
# 安装后端依赖
cd backend
npm run install:all

# 安装前端依赖
cd ../frontend
npm install
```

4. **启动服务**
```bash
# 启动后端微服务
cd backend
npm start

# 启动前端服务
cd ../frontend
npm start
```

### 访问地址

- 🌐 **前端应用**: http://localhost:4200
- 🔗 **API网关**: http://localhost:3000
- 📚 **API文档**: http://localhost:3000/api/docs
- 🗄️  **数据库**: localhost:3306 (root/root123456)
- 📮 **Redis**: localhost:6379
- 🐰 **RabbitMQ管理**: http://localhost:15672 (ems_user/ems_password)

### 默认账号

**管理员账号**:
- 用户名: admin
- 密码: Admin123!

**其他测试账号**:
- manager / User123! (部门经理)
- employee / User123! (普通员工)

### 数据库初始化

系统会自动创建以下数据：
- ✅ 10个数据表（用户、角色、权限、订单等）
- ✅ 4个默认角色（admin、manager、employee、guest）
- ✅ 17个权限项（用户管理、订单管理、系统管理等）
- ✅ 3个测试用户和示例数据

详细信息请查看：`scripts/init-database.sql`

## 📊 功能模块

- 🔐 **用户认证与权限管理** - JWT认证、RBAC权限控制
- 👥 **员工信息管理** - 员工CRUD、部门管理
- 📋 **订单与任务处理** - 订单流程、状态管理
- ✅ **审批流程管理** - 自定义审批流程
- 📈 **数据看板** - 可视化统计图表
- ⚙️ **系统配置** - 参数配置、日志管理

## 🔧 开发指南

### API 文档
- Swagger UI: http://localhost:3000/api/docs
- API 网关: http://localhost:3000

### 数据库迁移
```bash
cd backend/user-service
npm run migration:run
```

### 测试
```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e
```

## 📝 开发规范

- 使用 TypeScript 严格模式
- 遵循 NestJS 最佳实践
- 使用 Angular 官方风格指南
- 代码提交前必须通过 ESLint 检查

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目链接: [https://github.com/your-username/enterprise-management-system]
