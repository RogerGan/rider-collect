# Frontend (C 端)

单页应用，包含营销信息与骑手信息提交表单，面向手机端布局。

## 目录
- `src/App.jsx` 单页：营销区块 + 表单 + 最近提交
- `src/pages/marketing.css` 营销样式（部分组件复用）
- `src/index.css` Vite 模板基础样式

## 启动
```bash
npm i
npm run dev
```

默认接口地址：`http://localhost:7001`（见 `src/pages/FormPage.jsx` 与 `src/App.jsx` 中的 `API_BASE`）。

## 开发提示
- 表单校验：提交前校验 `姓名`、`手机号`、`证件号`，勾选 `agree` 才能提交。
- 成功后重置表单并刷新“最近提交”。
- 若后端地址变动，修改 `API_BASE` 即可。

## 文件说明
- `src/App.jsx`
  - 合并营销与表单为一个页面，移动端优先布局
  - 封装 `submit`、`loadList` 等数据请求逻辑
  - 最近提交表格在小屏下支持横向滚动
- `src/pages/marketing.css`
  - 营销区块卡片、按钮等样式

## TODO（可选）
- 隐私协议弹窗与勾选明示
- 表单草稿自动保存（localStorage）
- 异常态与网络错误的统一提示
