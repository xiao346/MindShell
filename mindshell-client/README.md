# MindShell 客户端

React、TypeScript、Vite 和 Tauri 客户端，提供 SSH 连接管理、终端和 AI 运维对话。

安装 Node.js 22+ 后，在本目录运行以下命令。

~~~sh
npm ci
npm run dev
~~~

浏览器打开 [localhost:5173](http://localhost:5173)。开发环境将同源的 /api 请求代理到本机 8091 端口。

安装 Rust 和 Tauri 平台依赖后，可用 npm run tauri dev 启动桌面窗口。用 npm run build 构建网页。

后端配置见 [MindShell 启动说明](../README.md)。
