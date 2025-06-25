# 企业管理系统安装指南

## 📋 环境要求

### 必需软件

1. **Node.js** (版本 18.0+)
   - [下载地址](https://nodejs.org/)
   - 验证安装: `node --version`

2. **Docker Desktop** (版本 24.0+)
   - [下载地址](https://www.docker.com/products/docker-desktop/)
   - 验证安装: `docker --version` 和 `docker-compose --version`

3. **Git**
   - [下载地址](https://git-scm.com/)
   - 验证安装: `git --version`

### 可选软件

- **MySQL Workbench** - 数据库管理工具
- **Postman** - API测试工具
- **Visual Studio Code** - 代码编辑器

## 🚀 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd enterprise-management-system
```

### 2. 启动基础设施服务

确保Docker Desktop正在运行，然后执行：

```bash
# 启动所有基础设施服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

预期输出：
```
NAME                IMAGE                                    STATUS
ems_elasticsearch   docker.elastic.co/elasticsearch:8.11.0  Up
ems_kibana         docker.elastic.co/kibana:8.11.0         Up  
ems_mysql          mysql:8.0                               Up
ems_nginx          nginx:alpine                            Up
ems_rabbitmq       rabbitmq:3-management-alpine            Up
ems_redis          redis:7-alpine                          Up
```

### 3. 验证数据库初始化

等待MySQL启动完成（约30秒），然后验证数据库是否正确初始化：

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

预期结果：
- 应该看到10个表
- users表有3条记录
- roles表有4条记录  
- permissions表有17条记录

### 4. 安装后端依赖

```bash
cd backend
npm run install:all
```

这将安装所有微服务的依赖包：
- api-gateway
- user-service
- order-service
- admin-service

### 5. 安装前端依赖

```bash
cd ../frontend
npm install
```

### 6. 启动服务

#### 方法1: 一键启动（推荐）

**Windows用户**:
```powershell
./scripts/start-dev.ps1
```

**Linux/Mac用户**:
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

#### 方法2: 分别启动

**启动后端微服务**:
```bash
cd backend
npm start
```

**启动前端应用**:
```bash
cd frontend
npm start
```

## 🔍 验证安装

### 1. 检查服务状态

访问以下地址验证各服务是否正常运行：

| 服务 | 地址 | 状态检查 |
|------|------|----------|
| 前端应用 | http://localhost:4200 | 显示登录页面 |
| API网关 | http://localhost:3000 | 返回404（正常） |
| API文档 | http://localhost:3000/api/docs | 显示Swagger UI |
| RabbitMQ管理 | http://localhost:15672 | 显示管理界面 |

### 2. 测试登录功能

使用默认管理员账号登录：
- 用户名: `admin`
- 密码: `Admin123!`

### 3. 测试API接口

使用Postman或curl测试API：

```bash
# 登录获取Token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# 获取用户信息（需要替换TOKEN）
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ 故障排除

### 常见问题

#### 1. Docker相关问题

**问题**: `docker-compose: command not found`
**解决**: 
- 确保Docker Desktop已安装并启动
- 在Windows上可能需要重启终端
- 尝试使用 `docker compose` 而不是 `docker-compose`

**问题**: 端口冲突
**解决**:
```bash
# 检查端口占用
netstat -an | findstr :3306
netstat -an | findstr :6379

# 停止冲突的服务或修改docker-compose.yml中的端口映射
```

#### 2. 数据库连接问题

**问题**: 数据库连接失败
**解决**:
```bash
# 检查MySQL容器状态
docker logs ems_mysql

# 重启MySQL容器
docker-compose restart mysql

# 等待30秒后重试
```

#### 3. 依赖安装问题

**问题**: npm install失败
**解决**:
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install

# 使用国内镜像（中国用户）
npm config set registry https://registry.npmmirror.com
```

#### 4. 服务启动问题

**问题**: 微服务启动失败
**解决**:
1. 检查依赖是否完全安装
2. 确保数据库已启动
3. 检查端口是否被占用
4. 查看错误日志

### 日志查看

```bash
# 查看Docker服务日志
docker-compose logs -f mysql
docker-compose logs -f redis
docker-compose logs -f rabbitmq

# 查看应用日志
cd backend/api-gateway && npm run start:dev
cd backend/user-service && npm run start:dev
```

## 📊 性能监控

### 1. 数据库监控

```sql
-- 查看数据库状态
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Queries';
SHOW PROCESSLIST;

-- 查看表大小
SELECT 
    table_name AS "Table",
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES 
WHERE table_schema = "enterprise_management"
ORDER BY (data_length + index_length) DESC;
```

### 2. 应用监控

- 内存使用: `docker stats`
- CPU使用: `top` 或 `htop`
- 网络连接: `netstat -an`

## 🔧 开发环境配置

### 1. IDE配置

**Visual Studio Code推荐插件**:
- Angular Language Service
- TypeScript Importer
- Prettier
- ESLint
- Docker
- MySQL

### 2. 代码格式化

```bash
# 安装全局工具
npm install -g prettier eslint

# 格式化代码
cd frontend && npm run format
cd backend && npm run format
```

### 3. 调试配置

在VS Code中创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API Gateway",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/api-gateway/src/main.ts",
      "outFiles": ["${workspaceFolder}/backend/api-gateway/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"]
    }
  ]
}
```

## 📚 下一步

安装完成后，您可以：

1. 阅读 [API文档](http://localhost:3000/api/docs)
2. 查看 [数据库设计文档](./database-design.md)
3. 了解 [后端架构](./backend-architecture.md)
4. 学习 [前端架构](./frontend-architecture.md)
5. 开始开发新功能

## 🆘 获取帮助

如果遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查项目的GitHub Issues
3. 联系开发团队

---

**祝您使用愉快！** 🎉 