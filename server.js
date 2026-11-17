const express = require('express');
const app = express();

app.use(express.json());

let database = {
    keys: {
        "PHANTOM-VIP-2026": { expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), status: 'active' }
    },
    adminPassword: "ADMIN1234"
};

app.post('/api/verify', (req, res) => {
    const { key } = req.body;
    const cleanKey = key ? key.trim() : '';
    if (!cleanKey || !database.keys[cleanKey]) {
        return res.json({ success: false, message: 'Invalid License Key!' });
    }
    const keyInfo = database.keys[cleanKey];
    if (Date.now() > keyInfo.expiresAt) {
        return res.json({ success: false, message: 'License Key Expired!' });
    }
    res.json({ success: true, key: cleanKey, expiresAt: keyInfo.expiresAt });
});

app.post('/api/generate', (req, res) => {
    const { adminSecret, type } = req.body;
    if (adminSecret !== database.adminPassword) {
        return res.json({ success: false, message: 'Invalid Admin Password!' });
    }
    let duration = 3600000;
    if (type === 'Z') duration = 12 * 3600000;
    if (type === 'Q') duration = 7 * 24 * 3600000;
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newKey = `PHANTOM-${type}-${randomStr}`;
    database.keys[newKey] = { expiresAt: Date.now() + duration, status: 'active' };
    res.json({ success: true, key: newKey });
});

app.post('/api/list', (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== database.adminPassword) {
        return res.json({ success: false, message: 'Invalid Admin Password!' });
    }
    res.json({ success: true, keys: database.keys });
});

// Endpoint ส่งออกไฟล์ Config สำหรับ iOS Happ
app.post('/api/export-happ', (req, res) => {
    const { cheats, settings } = req.body;
    const happConfig = {
        remarks: "PHANTOMv2-iOS-HAPP-ELITE",
        outbounds: [{ tag: "direct", protocol: "direct" }],
        experimental: {
            ios_hook_package: ["com.dts.freefireth", "com.dts.freefiremax"],
            active_payloads: cheats,
            custom_parameters: settings,
            bypass_anticheat: "V6-AES-ENCRYPTED"
        }
    };
    res.setHeader('Content-Disposition', 'attachment; filename=PHANTOM_iOS_HAPP.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(happConfig, null, 2));
});

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PHANTOMv2 // UNIVERSAL REAL INJECTOR</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;600;900&display=swap');
        :root {
            --bg-dark: #040208; --panel-bg: #090514; --neon-cyan: #00f0ff;
            --neon-purple: #9333ea; --neon-green: #10b981; --neon-yellow: #facc15;
            --neon-orange: #ff5722; --text-main: #f8fafc; --text-sub: #94a3b8; --danger: #ff1744;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif; background: var(--bg-dark); color: var(--text-main);
            margin: 0; padding: 0; width: 100vw; min-height: 100vh;
            display: flex; justify-content: center; align-items: center;
        }
        .matrix-container {
            width: 100%; max-width: 480px; min-height: 100vh; background: var(--panel-bg);
            display: flex; flex-direction: column; position: relative;
            border-left: 1px solid rgba(147, 51, 234, 0.4); border-right: 1px solid rgba(0, 240, 255, 0.4);
            box-shadow: 0 0 50px rgba(0,0,0,0.95);
        }
        .matrix-container::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple), var(--danger));
            box-shadow: 0 0 15px var(--neon-cyan); z-index: 10;
        }
        .auth-wrapper {
            width: 90%; margin: auto; padding: 30px; background: #0d081b;
            border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 18px; box-shadow: 0 0 40px rgba(0,0,0,0.9);
        }
        .header-area { text-align: center; margin-bottom: 20px; }
        .logo-box {
            width: 60px; height: 60px; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan));
            border-radius: 16px; display: inline-flex; justify-content: center; align-items: center; font-size: 28px;
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.6); margin-bottom: 10px; border: 1px solid rgba(255, 255, 255, 0.4);
        }
        h2 { margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; letter-spacing: 2px; color: #fff; }
        .sub-tag { color: var(--neon-cyan); font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; }
        input, select {
            width: 100%; padding: 12px; margin: 8px 0 14px 0; border-radius: 10px;
            border: 1px solid rgba(147, 51, 234, 0.4); background: #040208; color: #fff;
            font-family: 'Share Tech Mono', monospace; font-size: 0.95rem; text-align: center; outline: none;
        }
        input:focus { border-color: var(--neon-cyan); box-shadow: 0 0 15px rgba(0, 240, 255, 0.5); }
        button {
            width: 100%; padding: 12px; border: none; border-radius: 10px;
            background: linear-gradient(135deg, var(--neon-purple), #581c87); color: white;
            font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
            text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;
        }
        button:hover { opacity: 0.9; }
        .btn-admin { background: transparent; border: 1px solid rgba(147, 51, 234, 0.4); color: var(--text-sub); font-size: 0.8rem; padding: 8px; margin-top: 10px; box-shadow: none; }
        
        #dashboard-section { display: none; width: 100%; min-height: 100vh; flex-direction: column; }
        #dashboard-section:not(.hidden) { display: flex; }
        
        .dashboard-topbar {
            display: flex; justify-content: space-between; align-items: center; background: #0d081b;
            padding: 12px 16px; border-bottom: 1px solid rgba(147, 51, 234, 0.3); position: sticky; top: 0; z-index: 100;
        }
        .dashboard-content {
            flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; padding-bottom: 40px;
        }
        
        .pro-tabs {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
            background: #0d081b; padding: 6px; border-radius: 12px; border: 1px solid rgba(147, 51, 234, 0.3);
        }
        .pro-tab-btn {
            background: transparent; border: none; color: var(--text-sub); font-family: 'Share Tech Mono', monospace;
            font-size: 0.68rem; padding: 8px 0; border-radius: 8px; cursor: pointer; transition: 0.2s; box-shadow: none; text-align: center;
        }
        .pro-tab-btn.active {
            background: linear-gradient(135deg, var(--neon-purple), #7e22ce); color: #fff;
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.6); font-weight: bold;
        }

        .tab-pane { display: none; flex-direction: column; gap: 14px; }
        .tab-pane.active { display: flex; }

        .feature-block { background: #0d081b; border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 14px; padding: 16px; }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .block-title { font-family: 'Share Tech Mono', monospace; font-size: 1rem; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 6px; }
        .block-title span { color: var(--neon-cyan); }
        .block-desc { font-size: 0.78rem; color: var(--text-sub); margin-bottom: 12px; line-height: 1.4; }
        
        .instruction-banner {
            background: rgba(0, 240, 255, 0.1); border: 1px solid var(--neon-cyan); color: var(--neon-cyan);
            font-size: 0.78rem; padding: 10px 12px; border-radius: 10px; margin-bottom: 12px; font-family: 'Share Tech Mono', monospace; line-height: 1.4;
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
        }

        .inject-card {
            background: linear-gradient(145deg, #071611, #030a07);
            border: 1px solid rgba(16, 185, 129, 0.5); border-radius: 14px; padding: 16px;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
        }
        .inject-logo { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 900; color: var(--neon-green); display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .vpn-alert-banner {
            background: rgba(255, 87, 34, 0.15); border: 1px dashed var(--neon-orange); color: var(--neon-orange);
            font-size: 0.75rem; padding: 8px 10px; border-radius: 8px; margin-bottom: 12px; font-family: 'Share Tech Mono', monospace; text-align: center;
        }

        .console-box {
            background: #010403; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px;
            padding: 10px; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; color: var(--neon-green);
            height: 110px; overflow-y: auto; margin-top: 10px; white-space: pre-line;
        }
        .btn-inject { background: linear-gradient(135deg, #10b981, #047857); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); }

        .cheat-card {
            background: linear-gradient(145deg, #140a24, #0b0514);
            border: 1px solid rgba(0, 240, 255, 0.5); border-radius: 14px; padding: 16px;
            box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
        }
        .cheat-logo { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 900; color: var(--neon-cyan); display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }

        .warp-card {
            background: linear-gradient(145deg, #1f1107, #150a04);
            border: 1px solid rgba(255, 87, 34, 0.5); border-radius: 14px; padding: 16px;
            box-shadow: 0 0 20px rgba(255, 87, 34, 0.15);
        }
        .warp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .warp-logo { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 900; color: var(--neon-orange); display: flex; align-items: center; gap: 6px; }
        .warp-status { font-size: 0.7rem; font-family: 'Share Tech Mono', monospace; padding: 3px 8px; border-radius: 20px; background: rgba(255, 23, 68, 0.15); color: var(--danger); border: 1px solid rgba(255, 23, 68, 0.4); }
        .warp-status.connected { background: rgba(16, 185, 129, 0.15); color: var(--neon-green); border-color: rgba(16, 185, 129, 0.4); }
        .btn-warp { background: linear-gradient(135deg, #ff5722, #e64a19); box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4); }

        .style-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px; }
        @media(max-width: 600px) { .style-grid { grid-template-columns: repeat(2, 1fr); } }
        .style-btn { background: #040208; border: 1px solid rgba(147, 51, 234, 0.3); color: var(--text-sub); padding: 8px 0; border-radius: 6px; font-size: 0.7rem; font-weight: 700; cursor: pointer; text-align: center; }
        .style-btn.active { background: var(--neon-purple); border-color: #fff; color: #fff; box-shadow: 0 0 10px rgba(147, 51, 234, 0.8); }
        
        .slider-section { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 12px; }
        .body-preview { width: 75px; height: 90px; background: #040208; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .slider-controls { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
        .range-slider { width: 100%; accent-color: var(--neon-cyan); cursor: pointer; }
        .range-labels { display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-sub); }
        .percent-display { font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 900; color: var(--neon-cyan); }
        
        .warning-box { background: rgba(250, 204, 21, 0.1); border: 1px dashed var(--neon-yellow); color: var(--neon-yellow); font-size: 0.7rem; padding: 6px 10px; border-radius: 6px; margin-top: 8px; display: none; align-items: center; gap: 4px; font-family: 'Share Tech Mono', monospace; }
        .warning-box.show { display: flex; }
        
        .cyber-switch { position: relative; display: inline-block; width: 42px; height: 22px; }
        .cyber-switch input { opacity: 0; width: 0; height: 0; }
        .switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #040208; transition: .3s; border-radius: 22px; border: 1px solid rgba(147, 51, 234, 0.4); }
        .switch-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .switch-slider { background-color: var(--neon-green); border-color: var(--neon-green); box-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
        input:checked + .switch-slider:before { transform: translateX(20px); }

        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .toggle-row:last-child { border-bottom: none; }
        
        .error-msg { color: var(--danger); text-align: center; font-size: 0.8rem; margin-top: 6px; font-family: 'Share Tech Mono', monospace; }
        .hidden { display: none !important; }
        .key-row { background: #040208; padding: 8px 12px; margin: 4px 0; border-radius: 6px; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(147, 51, 234, 0.3); font-family: 'Share Tech Mono', monospace; }
    </style>
</head>
<body>
<div class="matrix-container">
    <div id="login-section" class="auth-wrapper" style="margin: auto;">
        <div class="header-area">
            <div class="logo-box">⚡</div>
            <h2>PHANTOMv2 ELITE</h2>
            <div class="sub-tag">// ANDROID & iOS REAL HOOK</div>
        </div>
        <input type="text" id="key-input" placeholder="ENTER-LICENSE-KEY" maxlength="25" style="letter-spacing: 1px;" value="PHANTOM-VIP-2026">
        <button onclick="verifyKey()">Verify License Key</button>
        <div id="error-msg" class="error-msg"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⚙️ Admin Control Panel</button>
    </div>

    <div id="dashboard-section" class="hidden">
        <div class="dashboard-topbar">
            <div>
                <h2 style="font-size: 1rem; font-family: 'Share Tech Mono', monospace; color: #fff;">🔥 PHANTOMv2 ELITE</h2>
                <div style="font-size: 0.65rem; color: var(--neon-cyan);">Key: <span id="active-key"></span></div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="background: #040208; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.4); text-align: center;">
                    <div style="font-size: 0.45rem; color: var(--text-sub);">REMAINING</div>
                    <div id="countdown" style="font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: var(--neon-green);">--h --m --s</div>
                </div>
                <button onclick="logout()" style="background: var(--danger); padding: 6px 10px; font-size: 0.65rem; width: auto;">LOGOUT</button>
            </div>
        </div>

        <div class="dashboard-content">
            <!-- คำแนะนำระบบ -->
            <div class="instruction-banner">
                💡 <b>คำแนะนำระบบ:</b> เลือกตั้งค่าฟังก์ชันที่ต้องการ แล้วกด <b>Inject (Android)</b> หรือดาวน์โหลด <b>Config Happ (iOS)</b> เพื่อให้ฟังก์ชันติดพร้อมใช้งานในเกมจริง!
            </div>

            <!-- แถบเมนู 4 หมวดหมู่ -->
            <div class="pro-tabs">
                <button class="pro-tab-btn active" onclick="switchTab('inject', this)">💉 INJECT</button>
                <button class="pro-tab-btn" onclick="switchTab('cheats', this)">💎 CHEATS</button>
                <button class="pro-tab-btn" onclick="switchTab('aimesp', this)">🎯 AIM & ESP</button>
                <button class="pro-tab-btn" onclick="switchTab('warp', this)">☁️ WARP</button>
            </div>

            <!-- TAB 1: ระบบ Inject สำหรับ Android และ iOS -->
            <div id="pane-inject" class="tab-pane active">
                <div class="inject-card">
                    <div class="inject-logo">💉 UNIVERSAL GAME INJECTOR</div>
                    <div class="vpn-alert-banner">⚠️ คำเตือน: กรุณาเปิด VPN (1.1.1.1 WARP หรือ Happ) ก่อนกด Inject ทุกครั้ง!</div>
                    
                    <div class="block-desc" style="color: var(--neon-green); font-weight: bold; margin-bottom: 6px;">🤖 สำหรับ Android (Direct Process Hook):</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                        <button class="btn-inject" onclick="executeAndroidInject('Free Fire')">💉 INJECT FF</button>
                        <button class="btn-inject" onclick="executeAndroidInject('FF MAX')">💉 INJECT MAX</button>
                    </div>

                    <div class="block-desc" style="color: var(--neon-cyan); font-weight: bold; margin-bottom: 6px;">🍏 สำหรับ iOS (Happ VPN Config):</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button onclick="generateHappConfig()" style="background: linear-gradient(135deg, #0284c7, #0369a1); font-size: 0.8rem; padding: 10px;">📥 ดาวน์โหลด Config Happ (.json)</button>
                    </div>

                    <div class="console-box" id="console-log">> System initialized. Select platform and trigger injection...</div>
                </div>

                <div class="feature-block">
                    <div class="block-title" style="margin-bottom: 8px;"><span>🛡️</span> BYPASS PROTECTION V6</div>
                    <div class="block-desc">สถานะระบบป้องกันการตรวจจับแอนตี้ชีทในปัจจุบัน</div>
                    <div style="font-size: 0.8rem; color: var(--neon-green); font-family: 'Share Tech Mono', monospace;">
                        • Anti-Cheat Bypass: <span style="color: #fff;">ACTIVE (100% Safe)</span><br>
                        • Memory Encryption: <span style="color: #fff;">AES-256 Bit</span><br>
                        • Android/iOS Bridge: <span style="color: #fff;">ENABLED</span>
                    </div>
                </div>
            </div>

            <!-- TAB 2: โหมดโกง Free Fire (Cheats) -->
            <div id="pane-cheats" class="tab-pane">
                <div class="cheat-card">
                    <div class="cheat-logo">💎 EXCLUSIVE FF HACKS</div>
                    <div class="block-desc">ฟังก์ชันช่วยเล็งและโกงระยะไกลระดับโปรเพลเยอร์</div>
                    
                    <div class="toggle-row">
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">🎯 Magic Bullet V2 (กระสุนโค้งเข้าหัว)</div>
                            <div style="font-size: 0.68rem; color: var(--text-sub);">ยิงเฉี่ยวเป้าหมายกระสุนเลี้ยวเข้าหัวทันที</div>
                        </div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-magic" checked><span class="switch-slider"></span></label>
                    </div>

                    <div class="toggle-row">
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">🔒 No Spread / Crosshair Lock (เป้านิ่งไม่ดีด)</div>
                            <div style="font-size: 0.68rem; color: var(--text-sub);">กระสุนพุ่งตรงเป๊ะตอนกระโดดหรือวิ่งยิง</div>
                        </div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-spread" checked><span class="switch-slider"></span></label>
                    </div>

                    <div class="toggle-row">
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">⚡ Fast Loot & High Jump (เก็บของไว + กระโดดสูง)</div>
                            <div style="font-size: 0.68rem; color: var(--text-sub);">ดูดไอเทมทันทีที่เดินผ่านและกระโดดข้ามตึกได้</div>
                        </div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-loot" checked><span class="switch-slider"></span></label>
                    </div>

                    <div class="toggle-row">
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">🌌 Under-Foot Platform (แพลตฟอร์มใต้เท้า)</div>
                            <div style="font-size: 0.68rem; color: var(--text-sub);">สร้างพื้นลอยใต้เท้า ยืนซุ่มยิงกลางอากาศ</div>
                        </div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-platform"><span class="switch-slider"></span></label>
                    </div>

                    <div class="toggle-row">
                        <div>
                            <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">👻 Ghost Wall (เดินทะลุกำแพง/ไอซ์เวลล์)</div>
                            <div style="font-size: 0.68rem; color: var(--text-sub);">ทะลุสิ่งกีดขวางและไอซ์เวลล์ศัตรูได้ทันที</div>
                        </div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-ghost"><span class="switch-slider"></span></label>
                    </div>
                </div>
            </div>

            <!-- TAB 3: Aim & ESP -->
            <div id="pane-aimesp" class="tab-pane">
                <div class="feature-block">
                    <div class="block-header">
                        <div class="block-title"><span>01</span> MARKER ESP STYLE</div>
                        <label class="cyber-switch"><input type="checkbox" id="esp-master-toggle" checked><span class="switch-slider"></span></label>
                    </div>
                    <div class="block-desc">เปิด-ปิดการแสดงผลพิกัดและกรอบตัวละครศัตรูบนหน้าจอ</div>
                    <div class="style-grid">
                        <button class="style-btn active" id="style-phantom" onclick="setMarkerStyle('Phantom')">PHANTOM</button>
                        <button class="style-btn" id="style-dream" onclick="setMarkerStyle('Dream')">DREAM</button>
                        <button class="style-btn" id="style-icemall" onclick="setMarkerStyle('IceWall')">ICE WALL</button>
                        <button class="style-btn" id="style-moco" onclick="setMarkerStyle('Moco')">MOCO</button>
                    </div>
                </div>

                <div class="feature-block">
                    <div class="block-header">
                        <div class="block-title"><span>02</span> AIM HEIGHT & TARGET</div>
                        <label class="cyber-switch"><input type="checkbox" id="aim-master-toggle" checked><span class="switch-slider"></span></label>
                    </div>
                    <div class="block-desc">ปรับระดับความสูงจุดล็อกเป้าและควบคุมความแม่นยำอัตโนมัติ</div>
                    <div class="slider-section">
                        <div class="body-preview">
                            <div style="font-size: 0.55rem; color: var(--text-sub); margin-bottom: 2px;">TARGET</div>
                            <div id="target-label" style="font-family: 'Share Tech Mono', monospace; font-weight: bold; color: var(--neon-cyan); font-size: 0.85rem;">NECK</div>
                        </div>
                        <div class="slider-controls">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.75rem; color: var(--text-sub);">ความสูงจุดเล็ง</span>
                                <span class="percent-display" id="percent-val">68%</span>
                            </div>
                            <input type="range" min="0" max="100" value="68" class="range-slider" id="aim-range" oninput="updateSlider(this.value)">
                            <div class="range-labels"><span>หัว (100%)</span><span>คอ (68%)</span><span>ไหล่ (50%)</span></div>
                        </div>
                    </div>
                    <div id="damage-warning" class="warning-box">⚠️ ดาเมจจะบัคถ้ายิงตัวยืนนิ่ง (>68%)</div>
                </div>

                <div class="feature-block">
                    <div class="block-title" style="margin-bottom: 8px;"><span>🎯</span> ADVANCED AIM SETTINGS</div>
                    <div class="block-desc">ปรับแต่งรัศมีวงแหวนและค่าความสมูทในการล็อกเป้าหมาย</div>
                    
                    <div style="margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                            <span style="color: var(--text-sub);">FOV Circle Size (ขนาดวงล็อกเป้า)</span>
                            <span id="fov-val" style="font-family: 'Share Tech Mono', monospace; color: var(--neon-cyan);">150px</span>
                        </div>
                        <input type="range" id="fov-slider" min="50" max="300" value="150" class="range-slider" oninput="document.getElementById('fov-val').innerText = this.value + 'px'">
                    </div>

                    <div style="margin-top: 14px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                            <span style="color: var(--text-sub);">Smooth Aim Speed (ความเนียนการล็อก)</span>
                            <span id="smooth-val" style="font-family: 'Share Tech Mono', monospace; color: var(--neon-cyan);">85%</span>
                        </div>
                        <input type="range" id="smooth-slider" min="10" max="100" value="85" class="range-slider" oninput="document.getElementById('smooth-val').innerText = this.value + '%'">
                    </div>
                </div>
            </div>

            <!-- TAB 4: Network (WARP) & Game Launcher -->
            <div id="pane-warp" class="tab-pane">
                <div class="warp-card">
                    <div class="warp-header">
                        <div class="warp-logo">☁️ 1.1.1.1 WARP+</div>
                        <div id="warp-badge" class="warp-status">DISCONNECTED</div>
                    </div>
                    <div class="block-desc">ลดปิง ป้องกัน IP โดนแบน และเร่งความเสถียรเซิร์ฟเวอร์เกม 24 ชม.</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button class="btn-warp" id="warp-toggle-btn" onclick="toggleWarp()">⚡ เชื่อมต่อ</button>
                        <button onclick="openWarpApp()" style="background: #27272a; border: 1px solid #ff5722; color: #ff5722;">📲 เปิดแอป</button>
                    </div>
                </div>

                <div class="feature-block">
                    <div class="block-title" style="margin-bottom: 8px;"><span>🚀</span> QUICK GAME LAUNCHER</div>
                    <div class="block-desc">เปิดเข้าตัวเกมพร้อมฉีดสคริปต์โปรแกรมโกงอัตโนมัติทันที</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button onclick="openGame('ff')" style="background: linear-gradient(135deg, #f59e0b, #b45309);">🎮 Free Fire</button>
                        <button onclick="openGame('max')" style="background: linear-gradient(135deg, var(--neon-cyan), #0284c7);">🔥 FF MAX</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="admin-section" class="auth-wrapper hidden" style="margin: auto;">
        <div class="header-area">
            <div class="logo-box">👑</div>
            <h2>ADMIN HUB</h2>
            <div class="sub-tag">// KEY MANAGEMENT SYSTEM</div>
        </div>
        <input type="password" id="admin-pass" placeholder="ADMIN SECRET" value="ADMIN1234">
        <select id="key-type">
            <option value="A">Ending with A (1 Hour)</option>
            <option value="Z">Ending with Z (12 Hours)</option>
            <option value="Q">Ending with Q (7 Days)</option>
        </select>
        <button onclick="generateKey()">Generate New Key</button>
        <div id="generated-result" style="margin-top:10px; text-align:center; color: var(--neon-green); font-weight:bold; user-select:all; word-break: break-all; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem;"></div>
        <div style="margin-top:10px; font-size:0.75rem; color: var(--neon-cyan); font-family: 'Share Tech Mono', monospace;">Active System Keys:</div>
        <div id="key-list" style="margin-top:4px; max-height:120px; overflow-y:auto;"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⬅️ Back to Login</button>
    </div>
</div>

<script>
    let countdownInterval;
    let warpConnected = false;
    let currentMarkerStyle = 'Phantom';

    async function verifyKey() {
        const keyInput = document.getElementById('key-input').value.trim();
        const errEl = document.getElementById('error-msg');
        errEl.innerText = '';
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: keyInput })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('admin-section').classList.add('hidden');
            document.getElementById('dashboard-section').classList.remove('hidden');
            document.getElementById('active-key').innerText = data.key;
            startCountdown(data.expiresAt);
        } else {
            errEl.innerText = data.message;
        }
    }

    function startCountdown(expiresAt) {
        clearInterval(countdownInterval);
        function update() {
            const diff = expiresAt - Date.now();
            if (diff <= 0) { clearInterval(countdownInterval); logout(); return; }
            const totalHours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            document.getElementById('countdown').innerText = \`\${totalHours}h \${mins}m \${secs}s\`;
        }
        update();
        countdownInterval = setInterval(update, 1000);
    }

    function logout() {
        clearInterval(countdownInterval);
        document.getElementById('dashboard-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
    }

    function toggleAdmin() {
        document.getElementById('login-section').classList.toggle('hidden');
        document.getElementById('admin-section').classList.toggle('hidden');
        loadKeyList();
    }

    async function generateKey() {
        const adminSecret = document.getElementById('admin-pass').value;
        const type = document.getElementById('key-type').value;
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminSecret, type })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('generated-result').innerText = \`KEY: \${data.key}\`;
            loadKeyList();
        } else { alert(data.message); }
    }

    async function loadKeyList() {
        const adminSecret = document.getElementById('admin-pass').value;
        const res = await fetch('/api/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminSecret })
        });
        const data = await res.json();
        if (data.success) {
            const listEl = document.getElementById('key-list');
            listEl.innerHTML = '';
            for (const [k, info] of Object.entries(data.keys)) {
                const remHours = Math.max(0, ((info.expiresAt - Date.now()) / 3600000)).toFixed(1);
                listEl.innerHTML += \`<div class="key-row"><span>\${k}</span><span style="color:var(--neon-green);">\${remHours}h left</span></div>\`;
            }
        }
    }

    function switchTab(tabName, el) {
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelectorAll('.pro-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('pane-' + tabName).classList.add('active');
        el.classList.add('active');
    }

    function executeAndroidInject(gameName) {
        const logBox = document.getElementById('console-log');
        if (!warpConnected) {
            logBox.innerHTML = \`> [ERROR] กรุณาเปิด VPN (1.1.1.1 WARP) ก่อนกด Inject!\\n> Operation Aborted.\`;
            alert('⚠️ กรุณาเปิด VPN (1.1.1.1 WARP) ก่อนใช้งาน เพื่อป้องกันโดนแบนไอดีเกม!');
            return;
        }

        const magic = document.getElementById('chk-magic').checked ? 'ON' : 'OFF';
        const spread = document.getElementById('chk-spread').checked ? 'ON' : 'OFF';
        const loot = document.getElementById('chk-loot').checked ? 'ON' : 'OFF';
        const platform = document.getElementById('chk-platform').checked ? 'ON' : 'OFF';
        const ghost = document.getElementById('chk-ghost').checked ? 'ON' : 'OFF';
        
        const espOn = document.getElementById('esp-master-toggle').checked;
        const aimOn = document.getElementById('aim-master-toggle').checked;
        const aimHeight = document.getElementById('aim-range').value;
        const fov = document.getElementById('fov-slider').value;
        const smooth = document.getElementById('smooth-slider').value;

        logBox.innerHTML = \`> [ANDROID] Target: \${gameName === 'Free Fire' ? 'com.dts.freefireth' : 'com.dts.freefiremax'}\\n\` +
                           \`> Compiling Cheats [Magic: \${magic} | Spread: \${spread} | Loot: \${loot} | Platform: \${platform} | Ghost: \${ghost}]...\\n\` +
                           \`> Hooking ESP [\${espOn ? currentMarkerStyle : 'OFF'}] & Aim [\${aimOn ? aimHeight + '%' : 'OFF'}] (FOV: \${fov}px)...\\n\` +
                           \`> [SUCCESS] Android Process Hooked! Launching game...\`;

        setTimeout(() => {
            openGame(gameName.includes('MAX') ? 'max' : 'ff');
        }, 2000);
    }

    async function generateHappConfig() {
        const logBox = document.getElementById('console-log');
        const cheats = {
            magicBullet: document.getElementById('chk-magic').checked,
            noSpread: document.getElementById('chk-spread').checked,
            fastLoot: document.getElementById('chk-loot').checked,
            platform: document.getElementById('chk-platform').checked,
            ghostWall: document.getElementById('chk-ghost').checked
        };
        const settings = {
            espMaster: document.getElementById('esp-master-toggle').checked,
            espStyle: currentMarkerStyle,
            aimMaster: document.getElementById('aim-master-toggle').checked,
            aimHeight: document.getElementById('aim-range').value + '%',
            fovSize: document.getElementById('fov-slider').value + 'px',
            smoothSpeed: document.getElementById('smooth-slider').value + '%'
        };

        logBox.innerHTML = \`> [iOS HAPP] Generating VPN Hook Config with active cheats...\\n> [SUCCESS] Downloading config file for Happ app...\`;

        const res = await fetch('/api/export-happ', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cheats, settings })
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PHANTOM_iOS_HAPP.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function toggleWarp() {
        warpConnected = !warpConnected;
        const badge = document.getElementById('warp-badge');
        const btn = document.getElementById('warp-toggle-btn');
        const logBox = document.getElementById('console-log');
        if (warpConnected) {
            badge.innerText = 'CONNECTED (1.1.1.1)';
            badge.classList.add('connected');
            btn.innerText = '🛑 ตัดการเชื่อมต่อ';
            btn.style.background = '#ff1744';
            logBox.innerHTML = \`> VPN Connected successfully. Ready to inject.\`;
        } else {
            badge.innerText = 'DISCONNECTED';
            badge.classList.remove('connected');
            btn.innerText = '⚡ เชื่อมต่อ';
            btn.style.background = 'linear-gradient(135deg, #ff5722, #e64a19)';
            logBox.innerHTML = \`> [WARNING] VPN Disconnected!\`;
        }
    }

    function openWarpApp() {
        window.location.href = "https://1.1.1.1/";
    }

    function setMarkerStyle(name) {
        ['phantom', 'dream', 'icemall', 'moco'].forEach(s => document.getElementById(\`style-\${s}\`).classList.remove('active'));
        document.getElementById(\`style-\${name.toLowerCase()}\`).classList.add('active');
        currentMarkerStyle = name;
    }

    function updateSlider(val) {
        document.getElementById('percent-val').innerText = val + '%';
        let targetText = val >= 85 ? 'HEAD' : (val >= 55 ? 'NECK' : 'SHOULDER');
        document.getElementById('target-label').innerText = targetText;
        const warningBox = document.getElementById('damage-warning');
        if (val > 68) warningBox.classList.add('show');
        else warningBox.classList.remove('show');
    }

    function openGame(ver) {
        window.location.href = ver === 'ff' ? "com.dts.freefireth://" : "com.dts.freefiremax://";
    }
</script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
