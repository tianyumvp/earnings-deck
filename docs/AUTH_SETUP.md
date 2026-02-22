# BriefingDeck 认证配置指南

## 概述

BriefingDeck 使用 **NextAuth.js** + **Google OAuth** + **Neon Postgres** 实现用户认证系统。

---

## 环境变量配置

在 `.env.local` 文件中配置以下变量：

```bash
# NextAuth Secret（生成命令：openssl rand -base64 32）
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Neon Postgres 数据库
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require
```

---

## Google OAuth 配置步骤

### 1. 创建 OAuth 2.0 客户端 ID

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 选择或创建项目
3. 点击 **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
4. 如果提示配置同意屏幕，选择 **"External"** 类型
5. 应用类型选择 **"Web application"**
6. 名称填写 **"BriefingDeck Web"**

### 2. 配置授权回调 URL

在 **Authorized redirect URIs** 中添加：

```
# 本地开发
http://localhost:3000/api/auth/callback/google

# 生产环境
https://briefingdeck.com/api/auth/callback/google
```

### 3. 保存凭证

创建后，Google 会显示：
- **Client ID** - 类似：`6862326177782-xxx.apps.googleusercontent.com`
- **Client Secret** - 类似：`GOCSPX-xxx`

⚠️ **重要**：Client Secret 只显示一次，请务必保存！

### 4. 配置 .env.local

将获取的 Client ID 和 Client Secret 填入 `.env.local`：

```bash
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## 数据库表初始化

首次运行时需要创建数据库表：

```bash
# 方式1：使用 Node.js 脚本
node db/setup.js

# 方式2：手动执行 SQL
psql $POSTGRES_URL -f db/init.sql
```

这会创建 NextAuth 所需的表：
- `users` - 用户信息
- `accounts` - 社交账号绑定
- `sessions` - 会话记录
- `verification_tokens` - 验证令牌

---

## 测试登录

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:3000

3. 点击右上角的 **"Sign up"** 或 **"Log in"**

4. 使用 Google 账号登录

5. 登录成功后，右上角会显示用户头像和名称

---

## 常见问题

### 错误：`invalid_client (Unauthorized)`

**原因**：Client ID 或 Client Secret 不正确

**解决**：
1. 检查 `.env.local` 中的值是否完整（没有多余空格）
2. 在 Google Cloud Console 中重置 Secret
3. 重启 Next.js 服务器

### 错误：`redirect_uri_mismatch`

**原因**：回调 URL 配置不正确

**解决**：
1. 在 Google Cloud Console 中添加正确的回调 URL
2. 等待 5 分钟让配置生效

### 错误：`relation "users" does not exist`

**原因**：数据库表未创建

**解决**：运行 `node db/setup.js` 初始化数据库

---

## 用户管理

管理员可以查看注册用户列表：

```
http://localhost:3000/admin/users
```

显示信息：
- 用户头像和名称
- 邮箱地址
- 注册时间

---

## 部署到生产环境

1. 在 Vercel Dashboard 添加环境变量：
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `POSTGRES_URL`

2. 在 Google Cloud Console 中添加生产环境回调 URL：
   ```
   https://your-domain.com/api/auth/callback/google
   ```

3. 发布 OAuth 同意屏幕（从测试模式转为生产模式）
