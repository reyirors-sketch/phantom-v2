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
    const newKey = "PHANTOM-" + type + "-" + randomStr;
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
    <title>PHANTOMv2 // HTTP INJECTOR PAYLOAD</title>
    <style>
        :root {
            --bg-dark: #040208; --panel-bg: #090514; --neon-cyan: #00f0ff;
            --neon-purple: #9333ea; --neon-green: #10b981; --neon-yellow: #facc15;
            --neon-orange: #ff5722; --text-main: #f8fafc; --text-sub: #94a3b8; --danger: #ff1744;
        }
        * { box-sizing: border-box; }
        body {
            font-family: sans-serif; background: var(--bg-dark); color: var(--text-main);
            margin: 0; padding: 0; width: 100vw; min-height: 100vh;
            display: flex; justify-content: center; align-items: center;
        }
        .matrix-container {
            width: 100%; max-width: 480px; min-height: 100vh; background: var(--panel-bg);
            display: flex; flex-direction: column; position: relative;
            border-left: 1px solid rgba(147, 51, 234, 0.4); border-right: 1px solid rgba(0, 240, 255, 0.4);
            box-shadow: 0 0 50px rgba(0,0,0,0.95);
        }
        .auth-wrapper {
            width: 90%; margin: auto; padding: 30px; background: #0d081b;
            border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 18px;
        }
        .header-area { text-align: center; margin-bottom: 20px; }
        .logo-box {
            width: 60px; height: 60px; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan));
            border-radius: 16px; display: inline-flex; justify-content: center; align-items: center; font-size: 28px;
            margin-bottom: 10px;
        }
        h2 { margin: 0; font-size: 1.4rem; color: #fff; }
        .sub-tag { color: var(--neon-cyan); font-size: 0.7rem; margin-top: 4px; text-transform: uppercase; }
        input, select {
            width: 100%; padding: 12px; margin: 8px 0 14px 0; border-radius: 10px;
            border: 1px solid rgba(147, 51, 234, 0.4); background: #040208; color: #fff;
            font-size: 0.95rem; text-align: center; outline: none;
        }
        button {
            width: 100%; padding: 12px; border: none; border-radius: 10px;
            background: linear-gradient(135deg, var(--neon-purple), #581c87); color: white;
            font-weight: 700; cursor: pointer; text-transform: uppercase; font-size: 0.9rem;
        }
        .btn-admin { background: transparent; border: 1px solid rgba(147, 51, 234, 0.4); color: var(--text-sub); font-size: 0.8rem; padding: 8px; margin-top: 10px; }
        #dashboard-section { display: none; width: 100%; min-height: 100vh; flex-direction: column; }
        #dashboard-section:not(.hidden) { display: flex; }
        .dashboard-topbar {
            display: flex; justify-content: space-between; align-items: center; background: #0d081b;
            padding: 12px 16px; border-bottom: 1px solid rgba(147, 51, 234, 0.3);
        }
        .dashboard-content { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
        .pro-tabs {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
            background: #0d081b; padding: 6px; border-radius: 12px; border: 1px solid rgba(147, 51, 234, 0.3);
        }
        .pro-tab-btn {
            background: transparent; border: none; color: var(--text-sub);
            font-size: 0.68rem; padding: 8px 0; border-radius: 8px; cursor: pointer; text-align: center;
        }
        .pro-tab-btn.active { background: var(--neon-purple); color: #fff; font-weight: bold; }
        .tab-pane { display: none; flex-direction: column; gap: 14px; }
        .tab-pane.active { display: flex; }
        .feature-block, .inject-card, .cheat-card, .warp-card {
            background: #0d081b; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 14px; padding: 16px;
        }
        .block-desc { font-size: 0.78rem; color: var(--text-sub); margin-bottom: 12px; }
        .console-box {
            background: #010403; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px;
            padding: 10px; font-size: 0.72rem; color: var(--neon-green); height: 95px; overflow-y: auto; margin-top: 10px; white-space: pre-line;
        }
        .cyber-switch { position: relative; display: inline-block; width: 42px; height: 22px; }
        .cyber-switch input { opacity: 0; width: 0; height: 0; }
        .switch-slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #040208; transition: .3s; border-radius: 22px; border: 1px solid rgba(147, 51, 234, 0.4);
        }
        .switch-slider:before {
            position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
            background-color: white; transition: .3s; border-radius: 50%;
        }
        input:checked + .switch-slider { background-color: var(--neon-green); }
        input:checked + .switch-slider:before { transform: translateX(20px); }
        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .error-msg { color: var(--danger); text-align: center; font-size: 0.8rem; margin-top: 6px; }
        .hidden { display: none !important; }
        .key-row { background: #040208; padding: 8px 12px; margin: 4px 0; border-radius: 6px; font-size: 0.8rem; display: flex; justify-content: space-between; }
    </style>
</head>
<body>
<div class="matrix-container">
    <div id="login-section" class="auth-wrapper" style="margin: auto;">
        <div class="header-area">
            <div class="logo-box">⚡</div>
            <h2>PHANTOMv2 ELITE</h2>
            <div class="sub-tag">// HTTP INJECTOR PAYLOAD</div>
        </div>
        <input type="text" id="key-input" placeholder="ENTER-LICENSE-KEY" value="PHANTOM-VIP-2026">
        <button onclick="verifyKey()">Verify License Key</button>
        <div id="error-msg" class="error-msg"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⚙️ Admin Control Panel</button>
    </div>

    <div id="dashboard-section" class="hidden">
        <div class="dashboard-topbar">
            <div>
                <h2 style="font-size: 1rem; color: #fff;">🔥 PHANTOMv2 ELITE</h2>
                <div style="font-size: 0.65rem; color: var(--neon-cyan);">Key: <span id="active-key"></span></div>
            </div>
            <button onclick="logout()" style="background: var(--danger); padding: 6px 10px; font-size: 0.65rem; width: auto;">LOGOUT</button>
        </div>

        <div class="dashboard-content">
            <div class="pro-tabs">
                <button class="pro-tab-btn active" onclick="switchTab('inject', this)">📥 PAYLOAD</button>
                <button class="pro-tab-btn" onclick="switchTab('cheats', this)">💎 CHEATS</button>
                <button class="pro-tab-btn" onclick="switchTab('aimesp', this)">🎯 AIM & ESP</button>
                <button class="pro-tab-btn" onclick="switchTab('warp', this)">☁️ WARP</button>
            </div>

            <div id="pane-inject" class="tab-pane active">
                <div class="inject-card">
                    <div style="font-weight:900; color:var(--neon-green); margin-bottom:6px;">🤖 ANDROID HTTP INJECTOR</div>
                    <div class="block-desc">กดปุ่มด้านล่างเพื่อคัดลอกสคริปต์ Payload นำไปวางในแอป HTTP Injector ได้ทันที</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button onclick="copyAndroidPayload()" style="background: #10b981;">📋 คัดลอก Payload สำหรับ Android</button>
                    </div>
                    <div class="console-box" id="console-log">> System ready. Click copy to grab Android payload script...</div>
                </div>
            </div>

            <div id="pane-cheats" class="tab-pane">
                <div class="cheat-card">
                    <div style="font-weight:900; color:var(--neon-cyan); margin-bottom:6px;">💎 EXCLUSIVE FF HACKS</div>
                    <div class="toggle-row">
                        <div><b>🎯 Magic Bullet V2</b></div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-magic" checked><span class="switch-slider"></span></label>
                    </div>
                    <div class="toggle-row">
                        <div><b>🔒 No Spread / Crosshair</b></div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-spread" checked><span class="switch-slider"></span></label>
                    </div>
                    <div class="toggle-row">
                        <div><b>⚡ Fast Loot</b></div>
                        <label class="cyber-switch"><input type="checkbox" id="chk-loot" checked><span class="switch-slider"></span></label>
                    </div>
                </div>
            </div>

            <div id="pane-aimesp" class="tab-pane">
                <div class="feature-block">
                    <div style="font-weight:bold; margin-bottom:8px;">🎯 AIM & ESP SETTINGS</div>
                    <div class="toggle-row">
                        <div><b>ESP Master Toggle</b></div>
                        <label class="cyber-switch"><input type="checkbox" id="esp-master-toggle" checked><span class="switch-slider"></span></label>
                    </div>
                </div>
            </div>

            <div id="pane-warp" class="tab-pane">
                <div class="warp-card">
                    <div style="font-weight:900; color:var(--neon-orange); margin-bottom:6px;">☁️ 1.1.1.1 WARP</div>
                    <button onclick="window.location.href='com.dts.freefireth://'" style="background: #f59e0b; margin-top:8px;">🎮 เปิดเกม Free Fire</button>
                </div>
            </div>
        </div>
    </div>

    <div id="admin-section" class="auth-wrapper hidden" style="margin: auto;">
        <div class="header-area">
            <div class="logo-box">👑</div>
            <h2>ADMIN HUB</h2>
        </div>
        <input type="password" id="admin-pass" value="ADMIN1234">
        <select id="key-type">
            <option value="A">1 Hour</option>
            <option value="Z">12 Hours</option>
            <option value="Q">7 Days</option>
        </select>
        <button onclick="generateKey()">Generate New Key</button>
        <div id="generated-result" style="margin-top:10px; color: var(--neon-green); font-weight:bold; word-break:break-all;"></div>
        <button class="btn-admin" onclick="toggleAdmin()">⬅️ Back</button>
    </div>
</div>

<script>
    async function verifyKey() {
        const key = document.getElementById('key-input').value.trim();
        const errEl = document.getElementById('error-msg');
        errEl.innerText = '';
        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            const data = await res.json();
            if (data.success) {
                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('dashboard-section').classList.remove('hidden');
                document.getElementById('active-key').innerText = data.key;
            } else {
                errEl.innerText = data.message || 'Invalid License Key!';
            }
        } catch (e) {
            errEl.innerText = 'Connection Error!';
        }
    }

    function logout() {
        document.getElementById('dashboard-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
    }

    function toggleAdmin() {
        document.getElementById('login-section').classList.toggle('hidden');
        document.getElementById('admin-section').classList.toggle('hidden');
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
            document.getElementById('generated-result').innerText = "KEY: " + data.key;
        } else { alert(data.message); }
    }

    function switchTab(tabName, el) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.pro-tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('pane-' + tabName).classList.add('active');
        el.classList.add('active');
    }

    function copyAndroidPayload() {
        const magic = document.getElementById('chk-magic').checked ? "1" : "0";
        const spread = document.getElementById('chk-spread').checked ? "1" : "0";
        const loot = document.getElementById('chk-loot').checked ? "1" : "0";
        
        const payloadText = "GET / HTTP/1.1[c]Host: freefiremobile-a.akamaihd.net[c]X-Magic-Bullet: " + magic + "[c]X-No-Spread: " + spread + "[c]X-Fast-Loot: " + loot + "[c]X-Target-Pkg: com.dts.freefireth";

        navigator.clipboard.writeText(payloadText).then(() => {
            document.getElementById('console-log').innerText = "> [SUCCESS] Payload copied to clipboard!";
            alert("📋 คัดลอก Payload สำเร็จ!\n\nนำไปวางในช่อง Payload ของแอป HTTP Injector ได้เลยครับ");
        }).catch(err => {
            alert("คัดลอกไม่สำเร็จ กรุณากดคัดลอกใหม่อีกครั้ง");
        });
    }
</script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Server is running on port " + PORT);
});
