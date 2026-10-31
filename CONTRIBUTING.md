# 开发指南

欢迎提交 issue 或 pull request。本项目边界为纯粹的搜索与关注内容，不添加推荐流、热搜、排行榜或自动连播。

## 本地开发流程

```bash
# 1. 安装依赖
npm install

# 2. 生成本地配置
node scripts/setup.mjs

# 3. 启动开发模式
npm run dev
```

前端界面运行在 `http://127.0.0.1:5173`，后端 API 服务运行在 `http://127.0.0.1:3880`。

## 打包桌面版

```bash
# 编译前后端
npm run build

# 打包 Windows 独立客户端
node scripts/package-desktop.mjs
```
