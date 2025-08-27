# Rider Collect (Egg.js + React)

外卖骑手信息收集与营销活动页面。一键本地运行，数据落地本地 MySQL（root/111111）。

## 目录结构
- `backend/` Egg.js 服务端，提供骑手信息 API
- `frontend/` React 前端（C 端），包含信息收集表单与营销活动
- `admin/` React + Ant Design 管理后台（B 端）
- `db/schema.sql` 数据库建表脚本

> 说明：后端已使用 `egg-sequelize + mysql2`，兼容 MySQL 8 默认认证方式。

## 本地运行
1) 初始化数据库（首次）
```sql
SOURCE ./db/schema.sql;
```
或复制 `db/schema.sql` 内容到你的 MySQL 客户端执行。

如果你是从早期版本升级，且表中还没有状态列，请执行（已解耦的后台所需字段）：
```sql
ALTER TABLE riders 
  ADD COLUMN status VARCHAR(20) DEFAULT 'new',
  ADD COLUMN shipping_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN logistics_status VARCHAR(30) DEFAULT 'pending';
```

2) 启动后端（端口 7001）
```bash
cd backend
npm i
npm run dev
```

> 配置位置：`backend/config/config.default.js`（数据库、CORS、app keys 等）。

3) 启动前端（C 端，端口 5173）
```bash
cd ../frontend
npm i
npm run dev
```

4) 启动后台（B 端，端口 5174）
```bash
cd ../admin
npm i
npm run dev
```

5) 访问
- C 端（用户提交页）: `http://localhost:5173/`
- B 端（管理后台）: `http://localhost:5174/`

## 接口说明
- POST `http://localhost:7001/api/riders` 新增（C 端提交）
- GET `http://localhost:7001/api/riders` 列表（支持分页与筛选）
  - query：`page`、`pageSize`、`keyword`（姓名/手机号/证件 模糊）、`city`、`status`、`shipping_status`、`logistics_status`
- GET `http://localhost:7001/api/riders/:id` 详情
- PUT `http://localhost:7001/api/riders/:id` 更新（B 端编辑）

示例：
```bash
# 列表 + 筛选 + 分页
curl "http://localhost:7001/api/riders?page=1&pageSize=10&keyword=张&city=上海&status=review"

# 更新一条（例如在后台保存）
curl -X PUT "http://localhost:7001/api/riders/1" \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved","shipping_status":"packed","logistics_status":"in_transit"}'
```

## 环境要求
- Node.js 16+
- 本地 MySQL 可用，账号 `root` 密码 `111111`

> 如果你自定义了 MySQL 账号/密码/端口，请同步修改 `backend/config/config.default.js`。

## 注意
- 生产环境请开启更严格的校验与安全设置（如 CSRF、字段加密、审计日志等）。
- 若需要鉴权（登录后台）、操作审计、导出 CSV/Excel、批量操作、角色权限，可在 `admin/` 内进一步扩展。
- C 端表单的接口地址默认 `http://localhost:7001`，如需跨域部署，请在后端 CORS 中调整允许的域。
