#!/bin/bash

echo "================================"
echo "企业管理系统数据库验证脚本"
echo "================================"
echo

echo "正在检查Docker服务状态..."

# 检查MySQL容器是否运行
if ! docker ps | grep -q ems_mysql; then
    echo "[错误] MySQL容器未运行，请先启动Docker服务："
    echo "docker-compose up -d mysql"
    exit 1
fi

echo "[成功] MySQL容器正在运行"
echo

echo "正在验证数据库初始化..."
echo

# 执行验证SQL脚本
docker exec -i ems_mysql mysql -uroot -proot123456 < scripts/verify-database.sql

echo
echo "================================"
echo "验证完成！"
echo "================================"
echo

echo "如果看到以上数据统计信息，说明数据库初始化成功！"
echo
echo "默认登录账号："
echo "- 管理员: admin / Admin123!"
echo "- 经理: manager / User123!"
echo "- 员工: employee / User123!"
echo

read -p "按任意键继续..." 