# Admin (B 端)

独立的管理后台应用，使用 React + Ant Design，管理骑手提交信息。

## 主要能力
- 列表查看：分页展示提交数据
- 筛选：关键词（姓名/手机号/证件）、城市、状态、发货状态、物流状态
- 编辑：抽屉表单直接更新数据

## 启动
```bash
npm i
npm run dev
```
默认端口：5174。

## 配置
- 接口基地址：`src/pages/App.jsx` 中的 `API_BASE`（默认 `http://localhost:7001`）

## 代码结构
- `src/pages/App.jsx` 后台主页面（表格、筛选、编辑抽屉）
- `src/main.jsx` 入口；`vite.config.js` 开发配置

## 接口约定
- GET `/api/riders` 列表（支持 page、pageSize、keyword、city、status、shipping_status、logistics_status）
- PUT `/api/riders/:id` 更新单条

## 后续可扩展
- 登录鉴权（会话/Cookie、JWT 均可）
- 批量操作、导出 CSV/Excel
- 角色权限、操作审计
