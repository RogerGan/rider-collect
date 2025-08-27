# Rider Collect Backend (Egg.js)

用于收集外卖骑手信息，数据存储在本地 MySQL。

## 主要技术
- Egg.js + egg-mysql + egg-cors

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
- GET `/api/riders` 列表分页
- GET `/api/riders/:id` 详情

## 配置
- 数据库账号：root / 111111（已在 `config/config.default.js` 中配置）
- 关闭 CSRF，允许 CORS
