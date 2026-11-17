const express = require('express');
const app = express();

app.use(express.json());

// ฐานข้อมูลคีย์แบบจำไว้ในแรม (ไม่หายเวลากด Gen เล่นบนเว็บ)
let database = {
    keys: {
        "PHANTOM-VIP-2026": { expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), status: 'active' },
        "PHANTOM-Z-G9LJD7": { expiresAt: Date.now() + (12 * 60 * 60 * 1000), status: 'active' }
    },
    adminPassword: "ADMIN1234"
};

// API: ตรวจสอบ Key
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

// API: สร้าง Key ใหม่ผ่าน Admin Panel
app.post('/api/generate', (req, res) => {
    const { adminSecret, type } = req.body;

    if (adminSecret !== database.adminPassword) {
        return res.json({ success: false, message: 'Invalid Admin Password!' });
    }

    let duration = 3600000; // 1 Hour
    if (type === 'Z') duration = 12 * 3600000; // 12 Hours
    if (type === 'Q') duration = 7 * 24 * 3600000; // 7 Days

    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newKey = `PHANTOM-${type}-${randomStr}`;

    database.keys[newKey] = {
        expiresAt: Date.now() + duration,
        status: 'active'
    };

    res.json({ success: true, key: newKey });
});

// API: แสดงรายการ Key ทั้งหมด
app.post('/api/list', (req, res) => {
    const { adminSecret } = req.body;

    if (adminSecret !== database.adminPassword) {
        return res.json({ success: false, message: 'Invalid Admin Password!' });
    }

    res.json({ success: true, keys: database.keys });
});

// หน้าเว็บหลัก UI ตัวเต็ม
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHANTOMv2 // EXPLOIT PANEL</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;600;900&display=swap');
        :root {
            --bg-dark: #07050d; --panel-bg: #0e0a18; --neon-purple: #a855f7;
            --neon-cyan: #06b6d4; --neon-green: #22c55e; --neon-yellow: #eab308;
            --text-main: #f8fafc; --text-sub: #94a3b8; --danger: #ef4444;
        }
        body {
            font-family: 'Inter', sans-serif; background: var(--bg-dark); color: var(--text-main);
            display: flex; justify-content: center; align-items: center; min-height: 100vh;
            margin: 0; width: 100vw; height: 100vh; overflow: hidden; box-sizing: border-box;
        }
        .matrix-container {
            width: 100%; height: 100%; background: var(--panel-bg); display: flex;
            flex-direction: column; justify-content: space-between; box-sizing: border-box;
            position: relative; border-left: 2px solid rgba(168, 85, 247, 0.3); border-right: 2px solid rgba(6, 182, 212, 0.3);
        }
        .matrix-container::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple), #ec4899);
            box-shadow: 0 0 15px var(--neon-purple);
        }
        .auth-wrapper {
            max-width: 440px; width: 90%; margin: auto; padding: 35px; background: #130f22;
            border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 18px; box-shadow: 0 0 40px rgba(0,0,0,0.9); box-sizing: border-box;
        }
        .header-area { text-align: center; margin-bottom: 24px; }
        .logo-box {
            width: 65px; height: 65px; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan));
            border-radius: 16px; display: inline-flex; justify-content: center; align-items: center; font-size: 30px;
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.5); margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.3);
        }
        h2 { margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; letter-spacing: 2px; color: #fff; }
        .sub-tag { color: var(--neon-cyan); font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; }
        input, select {
            width: 100%; padding: 14px; margin: 10px 0 16px 0; border-radius: 10px;
            border: 1px solid rgba(168, 85, 247, 0.4); background: #07050d; color: #fff;
            font-family: 'Share Tech Mono', monospace; font-size: 1rem; box-sizing: border-box; text-align: center; outline: none;
        }
        input:focus { border-color: var(--neon-cyan); box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
        button {
            width: 100%; padding: 14px; border: none; border-radius: 10px;
            background: linear-gradient(135deg, var(--neon-purple), #7e22ce); color: white;
            font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
            text-transform: uppercase; letter-spacing: 1px;
        }
        button:hover { opacity: 0.9; }
        .btn-admin { background: transparent; border: 1px solid rgba(168, 85, 247, 0.4); color: var(--text-sub); font-size: 0.85rem; padding: 10px; margin-top: 12px; box-shadow: none; }
        #dashboard-section { width: 100%; height: 100%; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; }
        .dashboard-topbar { display: flex; justify-content: space-between; align-items: center; background: #130f22; padding: 14px 24px; border-bottom: 1px solid rgba(168, 85, 247, 0.3); }
        .dashboard-content { flex-grow: 1; padding: 20px 24px; overflow-y: auto; box-sizing: border-box; }
        .feature-block { background: #130f22; border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 14px; padding: 18px; margin-bottom: 16px; }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .block-title { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 8px; }
        .block-title span { color: var(--neon-purple); }
        .block-desc { font-size: 0.8rem; color: var(--text-sub); margin-bottom: 14px; }
        .style-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
        @media(max-width: 600px) { .style-grid { grid-template-columns: repeat(2, 1fr); } }
        .style-btn { background: #07050d; border: 1px solid rgba(168, 85, 247, 0.3); color: var(--text-sub); padding: 10px 0; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; text-align: center; }
        .style-btn.active { background: var(--neon-purple); border-color: #fff; color: #fff; box-shadow: 0 0 10px rgba(168, 85, 247, 0.6); }
        .slider-section { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; gap: 20px; }
        .body-preview { width: 90px; height: 110px; background: #07050d; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .slider-controls { flex-grow: 1; display: flex; flex-direction: column; gap: 8px; }
        .range-slider { width: 100%; accent-color: var(--neon-purple); cursor: pointer; }
        .range-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-sub); }
        .percent-display { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; font-weight: 900; color: #fff; }
        .warning-box { background: rgba(234, 179, 8, 0.1); border: 1px dashed var(--neon-yellow); color: var(--neon-yellow); font-size: 0.78rem; padding: 8px 12px; border-radius: 8px; margin-top: 10px; display: none; align-items: center; gap: 6px; font-family: 'Share Tech Mono', monospace; }
        .warning-box.show { display: flex; }
        .cyber-switch { position: relative; display: inline-block; width: 48px; height: 24px; }
        .cyber-switch input { opacity: 0; width: 0; height: 0; }
        .switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #07050d; transition: .3s; border-radius: 24px; border: 1px solid rgba(168, 85, 247, 0.4); }
        .switch-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .switch-slider { background-color: var(--neon-green); border-color: var(--neon-green); box-shadow: 0 0 10px rgba(34, 197, 94, 0.6); }
        input:checked + .switch-slider:before { transform: translateX(24px); }
        .bottom-nav { display: grid; grid-template-columns: repeat(3, 1fr); background: #0b0814; border-top: 1px solid rgba(168, 85, 247, 0.3); padding: 10px 0; }
        .nav-item { text-align: center; color: var(--text-sub); font-size: 0.75rem; cursor: pointer; background: none; border: none; }
        .nav-item.active { color: var(--neon-cyan); }
        .error-msg { color: var(--danger); text-align: center; font-size: 0.85rem; margin-top: 8px; font-family: 'Share Tech Mono', monospace; }
        .hidden { display: none !important; }
        .key-row { background: #07050d; padding: 10px 14px; margin: 6px 0; border-radius: 8px; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(168, 85, 247, 0.3); font-family: 'Share Tech Mono', monospace; }
    </style>
</head>
<body>
<div class="matrix-container">
    <div id="login-section" class="auth-wrapper" style="margin: auto;">
        <div class="header-area">
            <div class="logo-box">⚡</div>
            <h2>PHANTOMv2 GATEWAY</h2>
            <div class="sub-tag">// LICENSE AUTHENTICATION</div>
        </div>
        <input type="text" id="key-input" placeholder="ENTER-LICENSE-KEY" maxlength="25" style="letter-spacing: 1px;" value="PHANTOM-VIP-2026">
        <button onclick="verifyKey()">Verify License Key</button>
        <div id="error-msg" class="error-msg"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⚙️ Admin Control Panel</button>
    </div>

    <div id="dashboard-section" class="hidden">
        <div class="dashboard-topbar">
            <div>
                <h2 style="font-size: 1.1rem; font-family: 'Share Tech Mono', monospace; color: #fff;">🔥 PHANTOMv2</h2>
                <div style="font-size: 0.75rem; color: var(--text-sub);">Key: <span id="active-key" style="color: var(--neon-cyan);"></span></div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #07050d; padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(34,197,94,0.4); text-align: center;">
                    <div style="font-size: 0.55rem; color: var(--text-sub); text-transform: uppercase;">REMAINING</div>
                    <div id="countdown" style="font-family: 'Share Tech Mono', monospace; font-size: 0.95rem; color: var(--neon-green);">--h --m --s</div>
                </div>
                <button onclick="logout()" style="background: var(--danger); padding: 8px 14px; font-size: 0.75rem; width: auto;">LOGOUT</button>
            </div>
        </div>
        <div class="dashboard-content">
            <div class="feature-block">
                <div class="block-header">
                    <div class="block-title"><span>01</span> MARKER ESP</div>
                    <label class="cyber-switch"><input type="checkbox" id="moco-toggle"><span class="switch-slider"></span></label>
                </div>
                <div class="block-desc">ทำเครื่องหมายศัตรูทุกคนบนหน้าจอแบบเรียลไทม์</div>
                <div class="style-grid">
                    <button class="style-btn active" id="style-phantom" onclick="setMarkerStyle('Phantom')">PHANTOM</button>
                    <button class="style-btn" id="style-dream" onclick="setMarkerStyle('Dream')">DREAM</button>
                    <button class="style-btn" id="style-icemall" onclick="setMarkerStyle('IceWall')">ICE WALL</button>
                    <button class="style-btn" id="style-moco" onclick="setMarkerStyle('Moco')">MOCO</button>
                </div>
            </div>
            <div class="feature-block">
                <div class="block-header">
                    <div class="block-title"><span>02</span> AIM HEIGHT & TARGET <span style="font-size:0.65rem; background:var(--neon-purple); color:#fff; padding:2px 6px; border-radius:4px;">NEW</span></div>
                    <label class="cyber-switch"><input type="checkbox" id="aim-toggle"><span class="switch-slider"></span></label>
                </div>
                <div class="block-desc">ย้ายจุดเล็งจากหน้าอกขึ้นไปทางหัว เลื่อนเพื่อเลือกระดับความแม่นยำ</div>
                <div class="slider-section">
                    <div class="body-preview">
                        <div style="font-size: 0.65rem; color: var(--text-sub); margin-bottom: 4px;">TARGET</div>
                        <div id="target-label" style="font-family: 'Share Tech Mono', monospace; font-weight: bold; color: var(--neon-cyan);">NECK</div>
                    </div>
                    <div class="slider-controls">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.8rem; color: var(--text-sub);">ความสูงจุดเล็ง</span>
                            <span class="percent-display" id="percent-val">68%</span>
                        </div>
                        <input type="range" min="0" max="100" value="68" class="range-slider" id="aim-range" oninput="updateSlider(this.value)">
                        <div class="range-labels"><span>หัว (100%)</span><span>คอ (68%)</span><span>ไหล่ (50%)</span></div>
                    </div>
                </div>
                <div id="damage-warning" class="warning-box show">⚠️ ถ้ายิงศัตรูที่ยืนนิ่งดาเมจจะบัค</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                <button onclick="openGame('ff')" style="background: linear-gradient(135deg, #f59e0b, #b45309);">🎮 Launch Free Fire</button>
                <button onclick="openGame('max')" style="background: linear-gradient(135deg, var(--neon-cyan), #0284c7);">🚀 Launch FF MAX</button>
            </div>
        </div>
        <div class="bottom-nav">
            <button class="nav-item active">🏠 หน้าหลัก</button>
            <button class="nav-item">⚡ ฟีเจอร์</button>
            <button class="nav-item">⚙️ จัดการ</button>
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
        <div id="generated-result" style="margin-top:12px; text-align:center; color: var(--neon-green); font-weight:bold; user-select:all; word-break: break-all; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem;"></div>
        <div style="margin-top:14px; font-size:0.8rem; color: var(--neon-cyan); font-family: 'Share Tech Mono', monospace;">Active System Keys:</div>
        <div id="key-list" style="margin-top:6px; max-height:140px; overflow-y:auto;"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⬅️ Back to Login</button>
    </div>
</div>

<script>
    let countdownInterval;
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
