# 部署配置文档 - 在线医疗咨询平台

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | 1.0.0 |
| 更新时间 | 2026-04-29 |
| 项目名称 | qa-live-healthcare |

---

## 1. 环境要求

### 1.1 运行环境

| 环境 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 16.0.0 | 推荐 18.x LTS 或更高 |
| npm | >= 8.0.0 | 推荐 10.x |
| 操作系统 | Windows/macOS/Linux | 跨平台支持 |

### 1.2 浏览器兼容性

| 浏览器 | 最低版本 | 推荐版本 |
|--------|----------|----------|
| Chrome | 87+ | 最新版 |
| Firefox | 78+ | 最新版 |
| Safari | 14+ | 最新版 |
| Edge | 88+ | 最新版 |
| IE | 不支持 | - |

---

## 2. 开发环境配置

### 2.1 本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd qa-live-healthcare

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:5173
```

### 2.2 开发环境变量

创建 `.env.development` 文件（可选）：

```env
# 开发环境配置
VITE_APP_TITLE=在线医疗咨询平台
VITE_APP_BASE_URL=http://localhost:3000
VITE_API_PREFIX=/api/v1
VITE_ENABLE_MOCK=true
```

---

## 3. 生产构建

### 3.1 构建命令

```bash
# 构建生产环境版本
npm run build

# 预览构建结果
npm run preview
```

### 3.2 构建输出

构建成功后，会在项目根目录生成 `dist/` 文件夹：

```
dist/
├── index.html              # 应用入口
├── assets/                 # 静态资源
│   ├── index-[hash].css    # 样式文件
│   ├── index-[hash].js     # 主包
│   └── chunk-[hash].js     # 懒加载模块
└── favicon.svg             # 图标
```

### 3.3 构建配置

当前 `vite.config.ts` 配置：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### 3.4 增强构建配置

创建 `vite.config.ts` 的完整配置：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // 基础路径
  base: '/',
  
  // 构建选项
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 生成 sourcemap（生产环境建议关闭）
    sourcemap: false,
    
    // 打包大小限制警告
    chunkSizeWarningLimit: 1000, // KB
    
    // 资源内联阈值
    assetsInlineLimit: 4096, // 4KB
    
    // CSS 代码分割
    cssCodeSplit: true,
    
    // 自定义压缩
    minify: 'terser',
    
    // Terser 配置
    terserOptions: {
      compress: {
        drop_console: true,    // 移除 console.log
        drop_debugger: true,   // 移除 debugger
      },
    },
  },
  
  // 服务器配置（开发环境）
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // 预览服务器配置
  preview: {
    port: 4173,
    host: '0.0.0.0',
  },
})
```

---

## 4. 环境变量配置

### 4.1 环境变量文件

| 文件名 | 用途 | 示例 |
|--------|------|------|
| `.env` | 默认值 | 所有环境的默认配置 |
| `.env.development` | 开发环境 | 开发服务器配置 |
| `.env.production` | 生产环境 | 生产环境配置 |
| `.env.local` | 本地覆盖 | 不会被 git 提交 |

### 4.2 变量定义

创建 `.env.production` 文件：

```env
# 应用标题
VITE_APP_TITLE=在线医疗咨询平台

# API 基础 URL
VITE_API_BASE_URL=https://api.example.com

# API 前缀
VITE_API_PREFIX=/api/v1

# 启用 Mock 数据
VITE_ENABLE_MOCK=false

# 是否启用分析
VITE_ENABLE_ANALYTICS=true
```

### 4.3 使用环境变量

```typescript
// 在代码中使用
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;

// 在 HTML 中使用
// <title>%VITE_APP_TITLE%</title>
```

---

## 5. Nginx 部署配置

### 5.1 单页面应用配置

创建 `nginx.conf`：

```nginx
# 工作进程数
worker_processes auto;

# 错误日志
error_log /var/log/nginx/error.log warn;

# 进程文件
pid /var/run/nginx.pid;

events {
    # 每个工作进程的最大连接数
    worker_connections 1024;
}

http {
    # 引入 MIME 类型
    include /etc/nginx/mime.types;
    
    # 默认文件类型
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 访问日志
    access_log /var/log/nginx/access.log main;
    
    # 高效文件传输
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 超时设置
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
    
    # 限制请求体大小
    client_max_body_size 10M;
    
    # 上游服务器（如果有 API 后端）
    upstream api_backend {
        server localhost:3000;
    }
    
    # 主服务器块
    server {
        listen 80;
        server_name example.com www.example.com;
        
        # 重定向到 HTTPS（生产环境启用）
        # return 301 https://$server_name$request_uri;
        
        # 字符集
        charset utf-8;
        
        # 根目录
        root /var/www/qa-live-healthcare/dist;
        index index.html;
        
        # 日志
        access_log /var/log/nginx/qa-live-healthcare.access.log;
        error_log /var/log/nginx/qa-live-healthcare.error.log;
        
        # SPA 路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # API 代理（如果有后端服务）
        location /api/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # 禁止访问隐藏文件
        location ~ /\. {
            deny all;
        }
    }
}
```

### 5.2 HTTPS 配置（生产环境）

```nginx
# HTTPS 服务器块
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL 证书
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 其他配置同上...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 5.3 Docker + Nginx 部署

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动
CMD ["nginx", "-g", "daemon off;"]
```

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

## 6. 云平台部署

### 6.1 Vercel 部署

创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

部署命令：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 6.2 Netlify 部署

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

部署命令：

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

### 6.3 腾讯云静态网站托管

1. 将 `dist/` 目录打包
2. 上传至 COS 存储桶
3. 配置静态网站托管
4. 绑定自定义域名
5. 配置 CDN 加速

---

## 7. CI/CD 配置

### 7.1 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
      
      - name: Deploy to server
        if: github.ref == 'refs/heads/main'
        run: |
          # 部署脚本
          echo "Deploying to server..."
          # rsync -avz --delete dist/ user@server:/var/www/qa-live-healthcare/
```

### 7.2 GitLab CI/CD

创建 `.gitlab-ci.yml`：

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache rsync openssh
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $SERVER_HOST >> ~/.ssh/known_hosts
    - rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:/var/www/qa-live-healthcare/
  only:
    - main
```

---

## 8. 性能优化配置

### 8.1 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['ant-design-vue'],
        },
      },
    },
    // 压缩
    minify: 'esbuild',
    // 目标浏览器
    target: 'es2015',
  },
})
```

### 8.2 资源优化

```typescript
// 使用图片压缩
import { vitePlugin as compressImages } from 'vite-plugin-compress-images';

export default defineConfig({
  plugins: [
    vue(),
    compressImages({
      jpg: { quality: 80 },
      png: { quality: 80 },
      gif: { maxColors: 128 },
    }),
  ],
})
```

---

## 9. 监控与日志

### 9.1 错误监控

```typescript
// src/error-handler.ts
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 上报至监控服务
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  // 上报至监控服务
});
```

### 9.2 性能监控

```typescript
// src/performance.ts
const reportPerformance = () => {
  const timing = performance.timing;
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  const firstPaint = performance.getEntriesByType('paint')[0];
  
  console.log('Page load time:', loadTime);
  console.log('First paint:', firstPaint?.startTime);
};
```

---

## 10. 安全配置

### 10.1 CSP 内容安全策略

```nginx
# Nginx 配置
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com;" always;
```

### 10.2 CORS 配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // CORS 头
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['access-control-allow-origin'] = '*';
          });
        },
      },
    },
  },
})
```

---

## 11. 备份与回滚

### 11.1 备份策略

```bash
#!/bin/bash
# backup.sh

# 创建备份目录
BACKUP_DIR="/ backups/qa-live-healthcare/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 备份构建产物
cp -r dist/ $BACKUP_DIR/

# 备份配置文件
cp .env.production $BACKUP_DIR/

# 压缩
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR

# 清理临时目录
rm -rf $BACKUP_DIR

echo "Backup created: $BACKUP_DIR.tar.gz"
```

### 11.2 回滚脚本

```bash
#!/bin/bash
# rollback.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./rollback.sh <backup-file>"
  exit 1
fi

# 解压备份
tar -xzf $BACKUP_FILE

# 获取目录名
DIR_NAME=$(basename $BACKUP_FILE .tar.gz)

# 替换当前构建
rm -rf dist/
cp -r $DIR_NAME/dist/ ./

# 清理
rm -rf $DIR_NAME

echo "Rollback completed"
```

---

## 12. 部署检查清单

### 12.1 部署前检查

| 检查项 | 说明 | 状态 |
|--------|------|------|
| Node.js 版本 | 确保 >= 16.0.0 | ☐ |
| 依赖安装 | `npm ci` 无错误 | ☐ |
| 类型检查 | `npm run build` 通过 | ☐ |
| 环境变量 | 生产环境变量已配置 | ☐ |
| API 配置 | API 地址已更新 | ☐ |
| 静态资源 | 图片、字体正常加载 | ☐ |

### 12.2 部署后检查

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 首页访问 | 页面正常加载 | ☐ |
| 路由跳转 | SPA 路由正常 | ☐ |
| API 请求 | 接口调用正常 | ☐ |
| 控制台错误 | 无 JavaScript 错误 | ☐ |
| 移动端适配 | 响应式布局正常 | ☐ |
| HTTPS | 证书有效 | ☐ |

---

## 13. 故障排查

### 13.1 常见问题

| 问题 | 解决方案 |
|------|----------|
| 页面空白 | 检查路由配置 `try_files` |
| 静态资源 404 | 检查 `base` 配置和路径 |
| API 请求失败 | 检查代理配置和 CORS |
| 构建失败 | 检查 TypeScript 类型错误 |
| 内存溢出 | 增加 Node.js 内存 `NODE_OPTIONS=--max-old-space-size=4096` |

### 13.2 日志查看

```bash
# Nginx 错误日志
tail -f /var/log/nginx/error.log

# Nginx 访问日志
tail -f /var/log/nginx/access.log

# 应用日志
journalctl -u nginx -f
```

---

*最后更新：2026-04-29*
