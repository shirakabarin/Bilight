<p align="center">
  <img src="docs/assets/banner.png" width="100%" alt="Bilight for Windows Banner">
</p>

# Bilight (Windows 独立桌面版)

搜你所想，看你所选。

Bilight 原版是一个只保留搜索与关注的纯净 B 站客户端，去掉了推荐、热搜、排行榜和自动连播。不过原项目主要面向 iOS、Android 以及 Docker 本地部署，没有直接提供 Windows 下开箱即用的桌面客户端。

这个项目是 Bilight 的 Windows 原生客户端移植版本。不需要安装 Docker 或配置 Node.js 运行环境，下载解压后直接双击 `Bilight.exe` 即可使用。

---

## 优化与改进

相较于原版，Windows 桌面版做了以下改动：

- **免环境依赖**：打包为独立绿色版，双击即可启动，运行时自动生成所需密钥与本地数据库。
- **画质与高帧率支持**：解除原版只使用 H.264 的限制，加入 HEVC 与 AV1 编解码支持，可正常播放 4K 超清、1080P 高码率以及 60 帧视频流。
- **播放缓冲优化**：调整了代理分片大小与并发队列，前置缓冲时间提升至 30~60 秒，起播延迟缩短至约 0.5 秒，暂停时仍会在后台预加载后续内容。
- **目录自包含**：所有登录凭据、本地 SQLite 数据库与缓存文件均存放在程序自身的 `data/` 目录下，不会向系统 C 盘写入数据。
- **桌面端体验细节**：支持单实例互斥（重复打开自动置顶已有窗口）、退出时记忆窗口大小与位置、支持 F11 全屏切换与快捷键控制。
- **应用图标替换**：替换了默认的 Electron 图标，采用重绘的二次元猫耳小电视图标。

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
2. 解压到本地任意目录（例如 `D:\software\Bilight`）。
3. 双击运行 `Bilight.exe`。
4. 打开后扫码或短信登录已有的 B 站账号即可使用。

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
