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

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PHANTOMv2 // PRO EXPLOIT PANEL</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;600;900&display=swap');
        :root {
            --bg-dark: #05030a; --panel-bg: #0b0714; --neon-primary: #8b5cf6;
            --neon-cyan: #00f0ff; --neon-green: #10b981; --neon-yellow: #facc15;
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
            border-left: 1px solid rgba(139, 92, 246, 0.4); border-right: 1px solid rgba(0, 240, 255, 0.4);
            box-shadow: 0 0 40px rgba(0,0,0,0.9);
        }
        .matrix-container::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, var(--neon-cyan), var(--neon-primary), var(--danger));
            box-shadow: 0 0 15px var(--neon-cyan); z-index: 10;
        }
        .auth-wrapper {
            width: 90%; margin: auto; padding: 30px; background: #100b1e;
            border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 18px; box-shadow: 0 0 40px rgba(0,0,0,0.9);
        }
        .header-area { text-align: center; margin-bottom: 20px; }
        .logo-box {
            width: 60px; height: 60px; background: linear-gradient(135deg, var(--neon-primary), var(--neon-cyan));
            border-radius: 16px; display: inline-flex; justify-content: center; align-items: center; font-size: 28px;
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.6); margin-bottom: 10px; border: 1px solid rgba(255, 255, 255, 0.4);
        }
        h2 { margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; letter-spacing: 2px; color: #fff; }
        .sub-tag { color: var(--neon-cyan); font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; }
        input, select {
            width: 100%; padding: 12px; margin: 8px 0 14px 0; border-radius: 10px;
            border: 1px solid rgba(139, 92, 246, 0.4); background: #05030a; color: #fff;
            font-family: 'Share Tech Mono', monospace; font-size: 0.95rem; text-align: center; outline: none;
        }
        input:focus { border-color: var(--neon-cyan); box-shadow: 0 0 15px rgba(0, 240, 255, 0.5); }
        button {
            width: 100%; padding: 12px; border: none; border-radius: 10px;
            background: linear-gradient(135deg, var(--neon-primary), #6d28d9); color: white;
            font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;
        }
        button:hover { opacity: 0.9; }
        .btn-admin { background: transparent; border: 1px solid rgba(139, 92, 246, 0.4); color: var(--text-sub); font-size: 0.8rem; padding: 8px; margin-top: 10px; box-shadow: none; }
        
        #dashboard-section { display: none; width: 100%; min-height: 100vh; flex-direction: column; }
        #dashboard-section:not(.hidden) { display: flex; }
        
        .dashboard-topbar {
            display: flex; justify-content: space-between; align-items: center; background: #100b1e;
            padding: 12px 16px; border-bottom: 1px solid rgba(139, 92, 246, 0.3); position: sticky; top: 0; z-index: 100;
        }
        .dashboard-content {
            flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; padding-bottom: 40px;
        }
        
        .feature-block { background: #100b1e; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 14px; padding: 16px; }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .block-title { font-family: 'Share Tech Mono', monospace; font-size: 1rem; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 6px; }
        .block-title span { color: var(--neon-cyan); }
        .block-desc { font-size: 0.78rem; color: var(--text-sub); margin-bottom: 12px; line-height: 1.4; }
        
        /* การ์ดฟังก์ชันโกงพิเศษ */
        .cheat-card {
            background: linear-gradient(145deg, #180d2b, #11071f);
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
        .style-btn { background: #05030a; border: 1px solid rgba(139, 92, 246, 0.3); color: var(--text-sub); padding: 8px 0; border-radius: 6px; font-size: 0.7rem; font-weight: 700; cursor: pointer; text-align: center; }
        .style-btn.active { background: var(--neon-primary); border-color: #fff; color: #fff; box-shadow: 0 0 10px rgba(139, 92, 246, 0.8); }
        
        .slider-section { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 12px; }
        .body-preview { width: 75px; height: 90px; background: #05030a; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .slider-controls { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
        .range-slider { width: 100%; accent-color: var(--neon-cyan); cursor: pointer; }
        .range-labels { display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-sub); }
        .percent-display { font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 900; color: var(--neon-cyan); }
        
        .warning-box { background: rgba(250, 204, 21, 0.1); border: 1px dashed var(--neon-yellow); color: var(--neon-yellow); font-size: 0.7rem; padding: 6px 10px; border-radius: 6px; margin-top: 8px; display: none; align-items: center; gap: 4px; font-family: 'Share Tech Mono', monospace; }
        .warning-box.show { display: flex; }
        
        .cyber-switch { position: relative; display: inline-block; width: 42px; height: 22px; }
        .cyber-switch input { opacity: 0; width: 0; height: 0; }
        .switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #05030a; transition: .3s; border-radius: 22px; border: 1px solid rgba(139, 92, 246, 0.4); }
        .switch-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .switch-slider { background-color: var(--neon-green); border-color: var(--neon-green); box-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
        input:checked + .switch-slider:before { transform: translateX(20px); }

        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .toggle-row:last-child { border-bottom: none; }
        
        .error-msg { color: var(--danger); text-align: center; font-size: 0.8rem; margin-top: 6px; font-family: 'Share Tech Mono', monospace; }
        .hidden { display: none !important; }
        .key-row { background: #05030a; padding: 8px 12px; margin: 4px 0; border-radius: 6px; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(139, 92, 246, 0.3); font-family: 'Share Tech Mono', monospace; }
        .theme-dot { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 2px solid #fff; display: inline-block; margin-right: 8px; }
    </style>
</head>
<body>
<div class="matrix-container">
    <div id="login-section" class="auth-wrapper" style="margin: auto;">
        <div class="header-area">
            <div class="logo-box">⚡</div>
            <h2>PHANTOMv2 PRO</h2>
            <div class="sub-tag">// FREE FIRE ULTIMATE EXPLOIT</div>
        </div>
        <input type="text" id="key-input" placeholder="ENTER-LICENSE-KEY" maxlength="25" style="letter-spacing: 1px;" value="PHANTOM-VIP-2026">
        <button onclick="verifyKey()">Verify License Key</button>
        <div id="error-msg" class="error-msg"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⚙️ Admin Control Panel</button>
    </div>

    <div id="dashboard-section" class="hidden">
        <div class="dashboard-topbar">
            <div>
                <h2 style="font-size: 1rem; font-family: 'Share Tech Mono', monospace; color: #fff;">🔥 PHANTOMv2 PRO</h2>
                <div style="font-size: 0.65rem; color: var(--neon-cyan);">Key: <span id="active-key"></span></div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="background: #05030a; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.4); text-align: center;">
                    <div style="font-size: 0.45rem; color: var(--text-sub);">REMAINING</div>
                    <div id="countdown" style="font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: var(--neon-green);">--h --m --s</div>
                </div>
                <button onclick="logout()" style="background: var(--danger); padding: 6px 10px; font-size: 0.65rem; width: auto;">LOGOUT</button>
            </div>
        </div>

        <div class="dashboard-content">
            <!-- 1. โหมดโกงพิเศษ Free Fire -->
            <div class="cheat-card">
                <div class="cheat-logo">💎 FF PRO CHEAT MODULES</div>
                <div class="block-desc">ฟังก์ชันเจาะระบบเฉพาะกิจสำหรับ Free Fire และ FF MAX</div>
                
                <div class="toggle-row">
                    <div>
                        <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">🌌 Under-Foot Platform (แพลตฟอร์มใต้เท้า)</div>
                        <div style="font-size: 0.68rem; color: var(--text-sub);">สร้างพื้นลอยใต้เท้า ยืนซุ่มยิงกลางอากาศ</div>
                    </div>
                    <label class="cyber-switch"><input type="checkbox" id="cheat-platform" checked><span class="switch-slider"></span></label>
                </div>

                <div class="toggle-row">
                    <div>
                        <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">👻 Ghost Wall (เดินทะลุกำแพง/ไอซ์เวลล์)</div>
                        <div style="font-size: 0.68rem; color: var(--text-sub);">ทะลุสิ่งกีดขวางและไอซ์เวลล์ศัตรูได้ทันที</div>
                    </div>
                    <label class="cyber-switch"><input type="checkbox" id="cheat-ghost"><span class="switch-slider"></span></label>
                </div>

                <div class="toggle-row">
                    <div>
                        <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">📡 Global Antenna (เสาอากาศรอบแมป)</div>
                        <div style="font-size: 0.68rem; color: var(--text-sub);">ลากเส้นพิกัดศัตรูทุกคนในระยะไกล</div>
                    </div>
                    <label class="cyber-switch"><input type="checkbox" id="cheat-antenna" checked><span class="switch-slider"></span></label>
                </div>

                <div class="toggle-row">
                    <div>
                        <div style="font-weight: 600; font-size: 0.85rem; color: #fff;">⚡ Speed Hack 3x (วิ่งไวเหนือเสียง)</div>
                        <div style="font-size: 0.68rem; color: var(--text-sub);">เพิ่มความเร็วในการเคลื่อนที่และวิ่งชาร์จ</div>
                    </div>
                    <label class="cyber-switch"><input type="checkbox" id="cheat-speed"><span class="switch-slider"></span></label>
                </div>
            </div>

            <!-- 2. การ์ด WARP VPN -->
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

            <!-- 3. การ์ดเปิดเกมด่วน -->
            <div class="feature-block">
                <div class="block-title" style="margin-bottom: 8px;"><span>🚀</span> QUICK GAME LAUNCHER</div>
                <div class="block-desc">เปิดเข้าตัวเกมพร้อมฉีดสคริปต์โปรแกรมโกงอัตโนมัติ</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button onclick="openGame('ff')" style="background: linear-gradient(135deg, #f59e0b, #b45309);">🎮 Free Fire</button>
                    <button onclick="openGame('max')" style="background: linear-gradient(135deg, var(--neon-cyan), #0284c7);">🔥 FF MAX</button>
                </div>
            </div>

            <!-- 4. การ์ด Marker ESP -->
            <div class="feature-block">
                <div class="block-header">
                    <div class="block-title"><span>01</span> MARKER ESP</div>
                    <label class="cyber-switch"><input type="checkbox" id="moco-toggle" checked><span class="switch-slider"></span></label>
                </div>
                <div class="block-desc">ทำเครื่องหมายศัตรูทุกคนบนหน้าจอแบบเรียลไทม์</div>
                <div class="style-grid">
                    <button class="style-btn active" id="style-phantom" onclick="setMarkerStyle('Phantom')">PHANTOM</button>
                    <button class="style-btn" id="style-dream" onclick="setMarkerStyle('Dream')">DREAM</button>
                    <button class="style-btn" id="style-icemall" onclick="setMarkerStyle('IceWall')">ICE WALL</button>
                    <button class="style-btn" id="style-moco" onclick="setMarkerStyle('Moco')">MOCO</button>
                </div>
            </div>

            <!-- 5. การ์ด Aim Height -->
            <div class="feature-block">
                <div class="block-header">
                    <div class="block-title"><span>02</span> AIM HEIGHT & TARGET <span style="font-size:0.55rem; background:var(--neon-cyan); color:#000; padding:2px 5px; border-radius:3px; font-weight:bold;">PRO</span></div>
                    <label class="cyber-switch"><input type="checkbox" id="aim-toggle" checked><span class="switch-slider"></span></label>
                </div>
                <div class="block-desc">ย้ายจุดเล็งจากหน้าอกขึ้นไปทางหัว เลื่อนเพื่อเลือกระดับความแม่นยำ</div>
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

    function toggleWarp() {
        warpConnected = !warpConnected;
        const badge = document.getElementById('warp-badge');
        const btn = document.getElementById('warp-toggle-btn');
        if (warpConnected) {
            badge.innerText = 'CONNECTED (1.1.1.1)';
            badge.classList.add('connected');
            btn.innerText = '🛑 ตัดการเชื่อมต่อ';
            btn.style.background = '#ff1744';
        } else {
            badge.innerText = 'DISCONNECTED';
            badge.classList.remove('connected');
            btn.innerText = '⚡ เชื่อมต่อ';
            btn.style.background = 'linear-gradient(135deg, #ff5722, #e64a19)';
        }
    }

    function openWarpApp() {
        window.location.href = "https://1.1.1.1/";
    }

    function setMarkerStyle(name) {
        ['phantom', 'dream', 'icemall', 'moco'].forEach(s => document.getElementById(\`style-\${s}\`).classList.remove('active'));
        document.getElementById(\`style-\${name.toLowerCase()}\`).classList.add('active');
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
