# 企业管理系统开发环境启动脚本 (Windows PowerShell)

Write-Host "🚀 启动企业管理系统开发环境..." -ForegroundColor Green

# 检查Docker是否运行
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker未运行，请先启动Docker" -ForegroundColor Red
    exit 1
}

# 启动基础设施服务
Write-Host "📦 启动基础设施服务（MySQL, Redis, RabbitMQ等）..." -ForegroundColor Yellow
docker-compose up -d

# 等待数据库启动
Write-Host "⏳ 等待数据库启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 验证数据库初始化
Write-Host "🗄️  验证数据库初始化..." -ForegroundColor Yellow
Start-Sleep -Seconds 20
try {
    $result = docker exec ems_mysql mysql -uroot -proot123456 -e "USE enterprise_management; SELECT COUNT(*) as count FROM users;" 2>$null
    if ($result -match "count") {
        Write-Host "✅ 数据库初始化成功" -ForegroundColor Green
    } else {
        Write-Host "⚠️  数据库可能未完全初始化" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  无法验证数据库状态" -ForegroundColor Yellow
}

# 安装依赖
Write-Host "📦 安装后端依赖..." -ForegroundColor Yellow
Set-Location backend
npm run install:all

# 启动后端服务
Write-Host "🚀 启动后端微服务..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Minimized

# 启动前端服务
Write-Host "🌐 启动前端服务..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Minimized

Write-Host "✅ 所有服务启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 前端地址: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔗 API网关: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API文档: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host "🗄️  数据库: localhost:3306 (root/root123456)" -ForegroundColor Cyan
Write-Host "📮 Redis: localhost:6379" -ForegroundColor Cyan
Write-Host "🐰 RabbitMQ: localhost:15672 (ems_user/ems_password)" -ForegroundColor Cyan
Write-Host ""
Write-Host "默认管理员账号：" -ForegroundColor Yellow
Write-Host "用户名: admin" -ForegroundColor White
Write-Host "密码: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 