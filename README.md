<p align="center">
  <img src="docs/assets/banner.png" width="100%" alt="Bilight Banner">
</p>

# Bilight (纯净桌面客户端)

搜你所想，看你所选。

Bilight 是一个只保留搜索与关注的纯净 B 站桌面客户端，去掉了推荐、热搜、排行榜和自动连播。下载解压后直接双击 `Bilight.exe` 即可使用。

---

## 优化与改进

相较于原版，桌面版做了以下改动：

- **开箱即用**：独立绿色客户端，无需配置任何外部依赖，首次运行自动生成所需密钥与本地数据库。
- **画质与高帧率支持**：解除原版仅允许 AVC(H.264) 的限制，支持 HEVC(H.265) 与 AV1 现代高画质流，可流畅播放 4K 超清、1080P 高码率与 60fps 高帧率视频。
- **播放缓冲优化**：媒体分片提升至 2MB 并支持 6 路并发，前置缓冲时间扩至 30~60 秒，首帧起播延迟缩短至约 0.5 秒，暂停时持续后台缓冲。
- **目录自包含**：所有登录凭据、本地 SQLite 数据库与缓存文件均存放在自身的 `data/` 目录下，绿色便携，不产生系统冗余。
- **桌面端体验细节**：支持单实例互斥（重复打开自动置顶已有窗口）、退出时记忆窗口大小与位置、支持 F11 全屏切换与快捷键控制。
- **萌系图标定制**：采用定制的二次元小电视立绘图标，内置进 PE 启动程序中。

---

## 界面预览

### 首页搜索
![首页搜索](docs/assets/web-home.png)

### 关注动态
![关注视频](docs/assets/web-following.png)

### UP 主空间与合集
![UP 主空间与合集](docs/assets/web-collections.png)

---

## 使用方法

1. 从 [Releases 页面](https://github.com/zhaominyi190/Bilight/releases) 下载最新的 `Bilight-v0.1.4-Windows-x64.zip`。
2. 解压到本地任意目录。
3. 双击运行 `Bilight.exe` 即可。
4. 打开后扫码或短信登录已有的 B 站账号。

目录结构保持简洁：
```text
Bilight/
├── Bilight.exe     # 启动程序
├── core/           # 运行库与依赖组件
└── data/           # 用户登录凭据与缓存（首次启动后自动生成）
```

---

## 本地编译构建

如果想从源码自己编译：

```bash
# 1. 克隆代码
git clone https://github.com/zhaominyi190/Bilight.git
cd Bilight

# 2. 安装依赖
npm install

# 3. 编译前端与服务端
npm run build

# 4. 打包 Windows 客户端
node scripts/package-desktop.mjs
```

打包完成后，成品会输出在 `D:\software\Bilight` 目录中。

---

## 致谢与声明

- 本项目基于 [Ownhelm/Bilight](https://github.com/Ownhelm/Bilight) 移植与扩展，遵循 MIT 开源许可。
- 视频播放器基于 ArtPlayer 与 dash.js。
- 本项目为个人学习与非盈利开源研究，并非哔哩哔哩官方客户端。使用时请遵守相关平台规则与版权规范。
