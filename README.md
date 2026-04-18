iCloud 隐藏我的邮件 (Hide My Email) 高级管理器

一个专为 Apple iCloud 网页版设计的 Tampermonkey (油猴) / ScriptCat (脚本猫) 增强脚本。通过调用底层 API 与注入极简的 macOS 原生风格 UI，让你能在浏览器中以最高效、最沉浸的方式管理“隐藏我的邮件”别名。

特别适用于需要高频生成纯净邮箱以注册各种平台（如 ChatGPT、X、GitHub）并规避风控的场景。

⚠️ 使用前提条件 (非常重要)

为确保脚本能正常工作并达到免验证注册的效果，请务必确认您满足以下条件：

必须拥有 iCloud+ 订阅：“隐藏我的邮件”属于 Apple 的付费进阶功能。您必须是 iCloud+ 订阅用户，或者加入了共享 iCloud+ 服务的家庭组。如果是普通免费账号，API 将无法为您分配邮箱。

邮箱后缀必须为 @icloud.com：为了在注册 ChatGPT 等高风控平台时完美规避检测，请确保您生成的别名后缀是原生的 @icloud.com（享受 Apple 官方域名的极高信任权重）。如果使用其他自定义域名后缀，极大概率依然会触发手机号码验证或图形验证拦截。

✨ 核心特性
<img width="714" height="531" alt="image" src="https://github.com/user-attachments/assets/87da6235-b153-4ea7-80fe-956f8310d7d4" />


🍏 沉浸式 macOS 原生 UI

采用全局居中模态框 + Glassmorphism（毛玻璃）背景。

纯内联 SVG 图标渲染，零外部依赖，告别网络加载延迟与供应链投毒风险。

⚡️ 降维跨域请求 (无视 CORS)

深度调用 GM_xmlhttpRequest 特权 API，直接携带 iCloud 凭证发起请求，免去繁琐的前端跨域限制，永不掉线。

🛠 极致的管理工作流

一键极速生成：瞬间生成 Alias_XXXX 格式别名并自动写入剪贴板。

时间降序排列：最新生成的别名永远置顶。

一键批量导出：支持一键复制您拥有的所有别名（自动换行排版）。

无缝收件箱跳转：点击邮箱旁的“外链”按钮，自动复制别名并聚焦/打开 iCloud 收件箱，绝不制造冗余标签页。

🤖 隐私模式增强

内置“无痕问 AI”快捷入口，一键唤起隐身模式下的 ChatGPT。

🚀 安装指南

安装脚本管理器：确保您的浏览器已安装 Tampermonkey 或 ScriptCat (脚本猫) 扩展。

安装本脚本：

点击此处安装：👉 安装 icloud_hme_manager.user.js (请根据你的仓库实际路径调整此链接)

或者手动在 Tampermonkey / 脚本猫 中新建脚本，并复制 icloud_hme_manager.user.js 的源码粘贴保存。

📖 使用说明

登录 icloud.com 或 icloud.com.cn（云上贵州）。

页面右下角将出现一个绿色的悬浮按钮 M，点击即可呼出管理面板。

⚠️ 首次运行授权：

第一次点击“生成”或“刷新”时，Tampermonkey / 脚本猫 会提示请求跨域访问 setup.icloud.com，请务必点击 “始终允许 (Always Allow)”。

若需使用“无痕问 AI”功能，请在浏览器的扩展管理中，为对应的脚本管理器开启 “在无痕模式下允许运行” 权限。

🔒 安全与隐私声明

本项目涉及敏感的个人邮箱管理，安全性是最高优先级的考量：

数据零外发：脚本的 @connect 权限严格白名单锁定为 icloud.com 与 icloud.com.cn。您的任何账号、Cookie 及邮箱数据均只在本地与 Apple 服务器之间端到端传输，绝对不会发送给任何第三方。

代码全明文：开源、无混淆、无加密，欢迎所有人进行 Code Review
