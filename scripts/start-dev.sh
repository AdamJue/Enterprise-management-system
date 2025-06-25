#!/bin/bash

# 企业管理系统开发环境启动脚本

echo "🚀 启动企业管理系统开发环境..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 启动基础设施服务
echo "📦 启动基础设施服务（MySQL, Redis, RabbitMQ等）..."
docker-compose up -d

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 验证数据库初始化
echo "🗄️  验证数据库初始化..."
sleep 20
if docker exec ems_mysql mysql -uroot -proot123456 -e "USE enterprise_management; SELECT COUNT(*) as count FROM users;" 2>/dev/null | grep -q "count"; then
    echo "✅ 数据库初始化成功"
else
    echo "⚠️  数据库可能未完全初始化"
fi

# 安装依赖
echo "📦 安装后端依赖..."
cd backend
npm run install:all

# 启动后端服务
echo "🚀 启动后端微服务..."
npm start &

# 启动前端服务
echo "🌐 启动前端服务..."
cd ../frontend
npm start &

echo "✅ 所有服务启动完成！"
echo ""
echo "🌐 前端地址: http://localhost:4200"
echo "🔗 API网关: http://localhost:3000"
echo "📚 API文档: http://localhost:3000/api/docs"
echo "🗄️  数据库: localhost:3306 (root/root123456)"
echo "📮 Redis: localhost:6379"
echo "🐰 RabbitMQ: localhost:15672 (ems_user/ems_password)"
echo ""
echo "默认管理员账号："
echo "用户名: admin"
echo "密码: Admin123!"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait 