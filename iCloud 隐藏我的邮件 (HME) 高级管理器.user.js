// ==UserScript==
// @name         iCloud 隐藏我的邮件 (HME) 高级管理器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 iCloud 网页版边缘常驻悬浮球，点击弹出 macOS 极简风格的管理面板。支持一键生成、列表管理、停用/恢复别名。内置自动时间排序及无痕 ChatGPT 快捷启动功能。
// @author       Your Assistant
// @match        *://*.icloud.com/*
// @match        *://*.icloud.com.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @connect      icloud.com
// @connect      icloud.com.cn
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 🎨 1. SVG 图标库 (Inline SVG, 零外部依赖)
    // ==========================================
    const SVG = {
        search: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        loader: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: hme-spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
        copy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
        inbox: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>`,
        mail: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
        chat: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    // ==========================================
    // ⚙️ 2. 全局状态与基础配置
    // ==========================================
    const CLIENT_BUILD = "2610Hotfix23";
    const CLIENT_ID = "37bd9669-50c3-4d52-af42-1d240d3ac4f3";
    let cachedApiBase = null;
    let emails = [];
    let isWorking = false;

    // ==========================================
    // 📡 3. 核心网络通信 (特权 API)
    // ==========================================
    function makeRequest(url, method, payload = null) {
        const domainBase = window.location.hostname.includes('icloud.com.cn') ? 'icloud.com.cn' : 'icloud.com';
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'text/plain',
                    'Origin': `https://www.${domainBase}`
                },
                data: payload ? JSON.stringify(payload) : null,
                withCredentials: true,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try { resolve(JSON.parse(res.responseText)); } 
                        catch(e) { resolve(res.responseText); }
                    } else {
                        reject(new Error(`HTTP ${res.status}`));
                    }
                },
                onerror: () => reject(new Error("网络请求被拦截")),
                ontimeout: () => reject(new Error("请求超时"))
            });
        });
    }

    async function getApiBase() {
        if (cachedApiBase) return cachedApiBase;

        const domainBase = window.location.hostname.includes('icloud.com.cn') ? 'icloud.com.cn' : 'icloud.com';
        const setupUrl = `https://setup.${domainBase}/setup/ws/1/validate?clientBuildNumber=${CLIENT_BUILD}&clientId=${CLIENT_ID}`;
        
        const data = await makeRequest(setupUrl, 'POST');
        if (!data || !data.webservices) throw new Error("凭证已失效，请刷新页面重新登录");

        const ws = data.webservices;
        const candidates = ['maildomainws', 'premiummailsettings'];
        const fuzzy = ['mail', 'hme', 'hide'];
        
        let foundUrl = null;
        for (const key of candidates) { if (ws[key]?.url) { foundUrl = ws[key].url; break; } }
        if (!foundUrl) {
            for (const key in ws) {
                if (fuzzy.some(p => key.toLowerCase().includes(p)) && ws[key]?.url) {
                    foundUrl = ws[key].url; break;
                }
            }
        }

        if (!foundUrl) throw new Error("该账号未开通隐藏邮件功能或无 iCloud+ 订阅");
        cachedApiBase = foundUrl;
        return cachedApiBase;
    }

    async function callApi(path, method, payload = null) {
        const base = await getApiBase();
        const url = `${base}${path}?clientBuildNumber=${CLIENT_BUILD}&clientId=${CLIENT_ID}`;
        return await makeRequest(url, method, payload);
    }

    // ==========================================
    // 💻 4. UI 渲染与样式注入 (OpenAI 极简风格)
    // ==========================================
    const styleContent = `
        /* 变量定义 */
        :root {
            --hme-bg: #F7F7F8;
            --hme-card: #FFFFFF;
            --hme-primary: #10A37F;
            --hme-primary-hover: #0e8f6e;
            --hme-border: #E5E5EA;
            --hme-text: #353740;
            --hme-text-muted: #8e8ea0;
            --hme-danger: #ef4146;
            --hme-danger-bg: rgba(239, 65, 70, 0.08);
            --hme-shadow: 0 20px 60px rgba(0,0,0,0.15);
            --hme-font: -apple-system, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        /* 悬浮球 */
        #hme-float-btn {
            position: fixed; right: 24px; bottom: 24px; width: 48px; height: 48px;
            background: var(--hme-primary); color: white; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; box-shadow: 0 4px 12px rgba(16, 163, 127, 0.4);
            z-index: 999998; font-family: var(--hme-font); font-size: 22px; font-weight: 500;
            transition: transform 0.2s, box-shadow 0.2s; user-select: none;
        }
        #hme-float-btn:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(16, 163, 127, 0.5); }

        /* 模态遮罩 */
        #hme-modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px);
            z-index: 999999; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.2s ease;
        }

        /* 主容器 (无边框 + 阴影) */
        #hme-modal-box {
            width: 700px; height: 520px; background: var(--hme-bg);
            border-radius: 12px; box-shadow: var(--hme-shadow);
            display: flex; flex-direction: column; overflow: hidden;
            font-family: var(--hme-font); color: var(--hme-text);
            transform: scale(0.98); transition: transform 0.2s ease;
            border: 1px solid rgba(255,255,255,0.2);
        }

        /* 极简标题栏 (无红绿灯按钮) */
        .hme-titlebar {
            height: 38px; background: var(--hme-bg); border-bottom: 1px solid var(--hme-border);
            display: flex; align-items: center; justify-content: center; padding: 0 16px; user-select: none;
        }
        .hme-title-text { font-size: 13px; font-weight: 600; color: var(--hme-text-muted); }

        /* 布局 */
        .hme-layout { display: flex; flex: 1; overflow: hidden; }
        .hme-sidebar {
            width: 160px; background: var(--hme-card); border-right: 1px solid var(--hme-border);
            padding: 16px 8px; display: flex; flex-direction: column; gap: 4px;
        }
        .hme-nav-item {
            padding: 10px 12px; border-radius: 8px; cursor: default;
            color: var(--hme-primary); background: rgba(16, 163, 127, 0.08);
            font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px;
        }
        .hme-nav-item.ghost-nav {
            background: transparent; color: var(--hme-text-muted); cursor: pointer; transition: all 0.2s;
        }
        .hme-nav-item.ghost-nav:hover { background: rgba(0,0,0,0.04); color: var(--hme-text); }
        .hme-content { flex: 1; padding: 20px; display: flex; flex-direction: column; overflow: hidden; }

        /* 控件 */
        .hme-toolbar { display: flex; justify-content: space-between; margin-bottom: 16px; gap: 12px; }
        .hme-search {
            flex: 1; display: flex; align-items: center; background: var(--hme-card);
            border: 1px solid var(--hme-border); border-radius: 8px; padding: 0 12px;
        }
        .hme-search input {
            border: none; background: transparent; padding: 8px; width: 100%;
            font-size: 13px; color: var(--hme-text); outline: none;
        }
        .hme-btn {
            background: var(--hme-primary); color: white; border: none; padding: 8px 16px;
            border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;
            display: flex; align-items: center; gap: 6px; transition: background 0.2s;
        }
        .hme-btn:hover:not(:disabled) { background: var(--hme-primary-hover); }
        .hme-btn.ghost { background: var(--hme-card); color: var(--hme-text); border: 1px solid var(--hme-border); }
        .hme-btn.ghost:hover { background: #f0f0f0; }
        .hme-btn.danger { background: var(--hme-danger-bg); color: var(--hme-danger); }
        .hme-btn.danger:hover { background: var(--hme-danger); color: white; }
        .hme-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* 表格区 */
        .hme-table-wrap { flex: 1; overflow-y: auto; background: var(--hme-card); border: 1px solid var(--hme-border); border-radius: 8px; }
        .hme-table { width: 100%; border-collapse: collapse; text-align: left; }
        .hme-table th { position: sticky; top: 0; background: #f9f9fa; font-size: 12px; font-weight: 500; color: var(--hme-text-muted); padding: 12px 16px; border-bottom: 1px solid var(--hme-border); z-index: 10; }
        .hme-table td { padding: 12px 16px; border-bottom: 1px solid var(--hme-border); vertical-align: middle; }
        .hme-table tr:hover td { background: rgba(0,0,0,0.01); }
        
        .hme-label-text { font-size: 13px; font-weight: 600; margin-bottom: 4px; display:flex; align-items:center; gap:6px;}
        .hme-tag-off { background: var(--hme-danger-bg); color: var(--hme-danger); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 500;}
        .hme-email-text { font-size: 12px; color: var(--hme-text-muted); font-family: monospace; display:flex; align-items:center;}
        .hme-icon-btn { background: none; border: none; color: var(--hme-text-muted); cursor: pointer; padding: 4px; border-radius: 4px; margin-left: 4px; display:flex;}
        .hme-icon-btn:hover { background: rgba(0,0,0,0.05); color: var(--hme-text); }

        /* iOS Toggle Switch */
        .hme-toggle { position: relative; display: inline-block; width: 36px; height: 20px; }
        .hme-toggle input { opacity: 0; width: 0; height: 0; }
        .hme-slider { position: absolute; cursor: pointer; inset: 0; background: var(--hme-border); transition: .3s; border-radius: 20px; }
        .hme-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .hme-toggle input:checked + .hme-slider { background: var(--hme-primary); }
        .hme-toggle input:checked + .hme-slider:before { transform: translateX(16px); }

        /* 状态与动画 */
        .hme-empty { text-align: center; padding: 60px 20px; color: var(--hme-text-muted); font-size: 13px; display:flex; flex-direction:column; align-items:center; gap:12px; }
        @keyframes hme-spin { 100% { transform: rotate(360deg); } }
        
        /* Toast 通知 */
        #hme-toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .hme-toast { background: var(--hme-card); color: var(--hme-text); padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 8px; font-size: 13px; font-family: var(--hme-font); animation: hme-slide-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; border-left: 3px solid var(--hme-primary); }
        .hme-toast.error { border-left-color: var(--hme-danger); }
        @keyframes hme-slide-in { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    `;

    // 注入 DOM
    function initUI() {
        const style = document.createElement('style');
        style.textContent = styleContent;
        document.head.appendChild(style);

        // 悬浮按钮
        const floatBtn = document.createElement('div');
        floatBtn.id = 'hme-float-btn';
        floatBtn.innerHTML = 'M';
        floatBtn.title = "打开 iCloud 隐藏邮箱管理";
        document.body.appendChild(floatBtn);

        // Toast 容器
        const toastBox = document.createElement('div');
        toastBox.id = 'hme-toast-container';
        document.body.appendChild(toastBox);

        // 主模态框
        const overlay = document.createElement('div');
        overlay.id = 'hme-modal-overlay';
        overlay.innerHTML = `
            <div id="hme-modal-box">
                <div class="hme-titlebar">
                    <div class="hme-title-text">隐藏我的邮件</div>
                </div>
                <div class="hme-layout">
                    <div class="hme-sidebar">
                        <div class="hme-nav-item">${SVG.mail} 别名管理</div>
                        <!-- 新增：无痕访问 ChatGPT 快捷通道 -->
                        <div class="hme-nav-item ghost-nav" id="hme-nav-chatgpt" title="在新无痕窗口中打开 ChatGPT">
                            ${SVG.chat} 无痕问 AI
                        </div>
                    </div>
                    <div class="hme-content">
                        <div class="hme-toolbar">
                            <div class="hme-search">
                                ${SVG.search}
                                <input type="text" id="hme-search-input" placeholder="搜索别名或标签...">
                            </div>
                            <button class="hme-btn ghost" id="hme-btn-copy-all" title="复制所有邮箱地址">${SVG.copy} 复制全部</button>
                            <button class="hme-btn ghost" id="hme-btn-refresh">${SVG.refresh} 刷新</button>
                            <button class="hme-btn" id="hme-btn-generate">${SVG.plus} 生成别名</button>
                        </div>
                        <div class="hme-table-wrap">
                            <table class="hme-table">
                                <thead><tr><th>标签 / 邮箱地址</th><th style="width:100px;">转发状态</th></tr></thead>
                                <tbody id="hme-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 悬浮球点击事件
        floatBtn.addEventListener('click', () => {
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.style.opacity = '1';
                document.getElementById('hme-modal-box').style.transform = 'scale(1)';
                fetchData(); // 自动加载数据
            }, 10);
        });

        // 遮罩层点击关闭
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeUI(); });

        document.getElementById('hme-btn-refresh').addEventListener('click', fetchData);
        document.getElementById('hme-btn-generate').addEventListener('click', handleGenerate);
        document.getElementById('hme-search-input').addEventListener('input', renderTable);
        
        // 绑定：一键复制所有邮箱
        document.getElementById('hme-btn-copy-all').addEventListener('click', () => {
            if (!emails || emails.length === 0) {
                showToast("当前没有可复制的邮箱", "info");
                return;
            }
            // 提取所有邮箱并用换行符连接
            const allEmailsText = emails.map(h => h.hme).join('\n');
            GM_setClipboard(allEmailsText, "text");
            showToast(`已成功复制 ${emails.length} 个邮箱地址！`, "success");
        });
        
        // 绑定无痕 ChatGPT 点击事件 (使用 Tampermonkey 特权 API)
        document.getElementById('hme-nav-chatgpt').addEventListener('click', () => {
            try {
                // {incognito: true} 强制打开无痕窗口
                GM_openInTab('https://chatgpt.com', { active: true, incognito: true });
                showToast("已在新无痕窗口启动 ChatGPT", "success");
            } catch(e) {
                // 如果用户没有在油猴扩展设置里允许“在无痕模式下运行”，则回退为正常打开
                window.open('https://chatgpt.com', '_blank');
                showToast("已打开 ChatGPT（请在扩展管理中允许此脚本在无痕模式运行以使用无痕功能）", "info");
            }
        });
    }

    function closeUI() {
        const overlay = document.getElementById('hme-modal-overlay');
        overlay.style.opacity = '0';
        document.getElementById('hme-modal-box').style.transform = 'scale(0.98)';
        setTimeout(() => overlay.style.display = 'none', 200);
    }

    // ==========================================
    // 🔔 5. 交互与逻辑封装
    // ==========================================
    function showToast(msg, type = 'success') {
        const box = document.getElementById('hme-toast-container');
        const toast = document.createElement('div');
        toast.className = `hme-toast ${type}`;
        const icon = type === 'success' ? SVG.success : (type === 'error' ? SVG.error : SVG.info);
        toast.innerHTML = `${icon} <span style="line-height:1.4;">${msg}</span>`;
        box.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function copyToClipboard(text) {
        GM_setClipboard(text, "text");
        showToast("已复制到剪贴板: " + text);
    }

    // ==========================================
    // 🧠 6. 核心业务流 (CRUD)
    // ==========================================
    
    // 渲染表格
    function renderTable() {
        const tbody = document.getElementById('hme-tbody');
        const q = document.getElementById('hme-search-input').value.trim().toLowerCase();
        
        const filtered = emails.filter(h => 
            (h.hme && h.hme.toLowerCase().includes(q)) || 
            (h.label && h.label.toLowerCase().includes(q))
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2"><div class="hme-empty">${SVG.inbox} 没有找到别名或需重新登录</div></td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        filtered.forEach(h => {
            const tr = document.createElement('tr');
            
            // 列1：信息与时间备注
            const td1 = document.createElement('td');
            const timestamp = h.createTimestamp || h.createdAt;
            const timeStr = timestamp ? new Date(timestamp).toLocaleString() : '';
            td1.innerHTML = `
                <div class="hme-label-text">
                    ${h.label.replace(/</g, '&lt;')} 
                    ${!h.isActive ? `<span class="hme-tag-off">已停用</span>` : ''}
                </div>
                <div class="hme-email-text" style="margin-bottom: 4px;">
                    ${h.hme} 
                    <button class="hme-icon-btn copy-btn" title="复制">${SVG.copy}</button>
                    <button class="hme-icon-btn view-btn" title="在收件箱中查看">${SVG.externalLink}</button>
                </div>
                ${timeStr ? `<div style="font-size: 10px; color: var(--hme-text-muted); opacity: 0.8;">生成时间: ${timeStr}</div>` : ''}
            `;
            td1.querySelector('.copy-btn').onclick = () => copyToClipboard(h.hme);
            td1.querySelector('.view-btn').onclick = () => {
                GM_setClipboard(h.hme, "text");
                showToast("已复制地址，正在打开邮箱...", "success");
                setTimeout(() => {
                    const domainBase = window.location.hostname.includes('icloud.com.cn') ? 'icloud.com.cn' : 'icloud.com';
                    window.open(`https://www.${domainBase}/mail/`, 'iCloudMailWindow');
                }, 600);
            };

            // 列2：开关
            const td2 = document.createElement('td');
            td2.innerHTML = `
                <label class="hme-toggle">
                    <input type="checkbox" ${h.isActive ? 'checked' : ''} class="cb-toggle">
                    <span class="hme-slider"></span>
                </label>
            `;
            td2.querySelector('.cb-toggle').onchange = async (e) => {
                if(isWorking) { e.preventDefault(); return; }
                const targetState = e.target.checked;
                isWorking = true;
                
                try {
                    const action = targetState ? '/v1/hme/reactivate' : '/v1/hme/deactivate';
                    const res = await callApi(action, 'POST', { anonymousId: h.anonymousId });
                    if(res.success) {
                        h.isActive = targetState;
                        showToast(`已${targetState ? '恢复' : '停用'}转发`);
                    } else throw new Error();
                } catch(err) {
                    e.target.checked = !targetState;
                    showToast('操作失败，请重试', 'error');
                }
                isWorking = false;
                renderTable(); // 刷新视觉状态
            };

            tr.appendChild(td1); tr.appendChild(td2);
            tbody.appendChild(tr);
        });
    }

    // 获取列表 (含时间排序功能)
    async function fetchData() {
        if(isWorking) return;
        isWorking = true;
        const tbody = document.getElementById('hme-tbody');
        tbody.innerHTML = `<tr><td colspan="2"><div class="hme-empty">${SVG.loader} 正在同步 iCloud 数据...</div></td></tr>`;
        
        try {
            const res = await callApi('/v2/hme/list', 'GET');
            if (res && res.result && res.result.hmeEmails) {
                // 【核心修改】：按创建时间进行降序排序 (最新的排在最前面)
                emails = res.result.hmeEmails.sort((a, b) => {
                    const timeA = a.createTimestamp || a.createdAt || 0;
                    const timeB = b.createTimestamp || b.createdAt || 0;
                    return timeB - timeA;
                });
                renderTable();
            } else {
                throw new Error("无法读取列表");
            }
        } catch (e) {
            emails = [];
            renderTable();
            showToast(e.message, 'error');
        }
        isWorking = false;
    }

    // 生成别名
    async function handleGenerate() {
        if(isWorking) return;
        const btn = document.getElementById('hme-btn-generate');
        isWorking = true; btn.disabled = true;
        showToast("正在请求分配新邮箱...", "info");

        try {
            const genRes = await callApi('/v1/hme/generate', 'POST', { lang: "zh-cn" });
            if (!genRes.success || !genRes.result || !genRes.result.hme) throw new Error("分配失败");
            
            const hme = genRes.result.hme;
            const label = 'Alias_' + Math.random().toString(36).substring(2, 6).toUpperCase();
            
            const resRes = await callApi('/v1/hme/reserve', 'POST', {
                hme: hme, label: label, note: "由油猴高级管理器生成"
            });

            if (resRes.success) {
                showToast(`生成成功: ${hme}`);
                copyToClipboard(hme);
                await fetchData();
            } else {
                throw new Error("保留邮箱失败");
            }
        } catch (e) {
            showToast(e.message, 'error');
        }
        
        isWorking = false; btn.disabled = false;
    }

    // ==========================================
    // 🚀 7. 启动挂载
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})();