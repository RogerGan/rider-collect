# Rider Collect (Egg.js + React)

外卖骑手信息收集与营销活动页面。一键本地运行，数据落地本地 MySQL（root/111111）。

## 目录结构
- `backend/` Egg.js 服务端，提供骑手信息 API
- `frontend/` React 前端（C 端），包含信息收集表单与营销活动
- `admin/` React + Ant Design 管理后台（B 端）
- `db/schema.sql` 数据库建表脚本

## 本地运行
1) 初始化数据库
```sql
SOURCE ./db/schema.sql;
```
或复制 `db/schema.sql` 内容到你的 MySQL 客户端执行。

2) 启动后端（端口 7001）
```bash
cd backend
npm i
npm run dev
```

3) 启动前端（端口 5173）
```bash
cd ../frontend
npm i
npm run dev
```

4) 启动后台（端口 5174）
```bash
cd ../admin
npm i
npm run dev
```

5) 访问
- C 端: `http://localhost:5173/`
- B 端: `http://localhost:5174/`

## 接口说明
- POST `http://localhost:7001/api/riders` 新增
- GET `http://localhost:7001/api/riders` 列表（支持 page、pageSize、keyword、city、status、shipping_status、logistics_status）
- GET `http://localhost:7001/api/riders/:id` 详情
- PUT `http://localhost:7001/api/riders/:id` 更新（用于后台编辑）

## 环境要求
- Node.js 16+
- 本地 MySQL 可用，账号 `root` 密码 `111111`

## 注意
- 生产环境请开启更严格的校验与安全设置（如 CSRF、字段加密、审计日志等）。
