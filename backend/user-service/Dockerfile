# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖，用于构建）
RUN npm install && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 删除开发依赖
RUN npm prune --production

# 暴露端口
EXPOSE 3001

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

# 启动应用
CMD ["npm", "run", "start:prod"] 