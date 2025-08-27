# Rider Collect Backend (Egg.js)

用于收集外卖骑手信息，数据存储在本地 MySQL。

## 主要技术
- Egg.js + egg-sequelize（mysql2）+ egg-cors

## 启动
```bash
cd backend
npm i
# 先在 MySQL 执行 ../db/schema.sql
npm run dev
# 访问 http://localhost:7001
```

## API
- POST `/api/riders` 新增骑手
- GET `/api/riders` 列表分页 + 筛选（支持 page、pageSize、keyword、city、status、shipping_status、logistics_status）
- GET `/api/riders/:id` 详情
- PUT `/api/riders/:id` 更新（后台编辑）

## 配置
- 数据库账号：root / 111111（`config/config.default.js`）
- 关闭 CSRF，允许 CORS

## 数据结构
表：`riders`
- 基础字段：`name`、`phone`、`id_number`、`city`、`address`、`carrier_pref`、`vehicle_type`、`emergency_*`、`note`、`agree`
- 软删除：`is_deleted`
- 审计：`created_at`、`updated_at`
- 后台状态：`status`、`shipping_status`、`logistics_status`
