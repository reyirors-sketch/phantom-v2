const express = require('express');
const app = express();

app.use(express.json());

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
            --neon-purple: #9333ea; --neon-green: #10b981; --text-main: #f8fafc; --text-sub: #94a3b8;
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
        .dashboard-topbar {
            display: flex; justify-content: space-between; align-items: center; background: #0d081b;
            padding: 14px 16px; border-bottom: 1px solid rgba(147, 51, 234, 0.3);
        }
        .dashboard-content { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
        .pro-tabs {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;
            background: #0d081b; padding: 6px; border-radius: 12px; border: 1px solid rgba(147, 51, 234, 0.3);
        }
        .pro-tab-btn {
            background: transparent; border: none; color: var(--text-sub);
            font-size: 0.75rem; padding: 10px 0; border-radius: 8px; cursor: pointer; text-align: center; font-weight: bold;
        }
        .pro-tab-btn.active { background: var(--neon-purple); color: #fff; }
        .tab-pane { display: none; flex-direction: column; gap: 14px; }
        .tab-pane.active { display: flex; }
        .inject-card, .cheat-card, .feature-block {
            background: #0d081b; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 14px; padding: 16px;
        }
        .block-desc { font-size: 0.8rem; color: var(--text-sub); margin-bottom: 12px; line-height: 1.4; }
        button {
            width: 100%; padding: 14px; border: none; border-radius: 10px;
            background: linear-gradient(135deg, var(--neon-purple), #581c87); color: white;
            font-weight: 700; cursor: pointer; text-transform: uppercase; font-size: 0.95rem;
        }
        .console-box {
            background: #010403; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px;
            padding: 12px; font-size: 0.75rem; color: var(--neon-green); height: 110px; overflow-y: auto; margin-top: 10px; white-space: pre-line;
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
        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    </style>
</head>
<body>
<div class="matrix-container">
    <div class="dashboard-topbar">
        <div>
            <h2 style="font-size: 1.1rem; color: #fff; margin:0;">🔥 PHANTOMv2 ELITE</h2>
            <div style="font-size: 0.7rem; color: var(--neon-cyan);">Status: <span style="color:var(--neon-green);">CONNECTED & READY</span></div>
        </div>
        <div style="background: rgba(16,185,129,0.15); color: var(--neon-green); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; border:1px solid rgba(16,185,129,0.4);">VIP ACTIVE</div>
    </div>

    <div class="dashboard-content">
        <div class="pro-tabs">
            <button class="pro-tab-btn active" onclick="switchTab('inject', this)">📥 PAYLOAD</button>
            <button class="pro-tab-btn" onclick="switchTab('cheats', this)">💎 CHEATS</button>
            <button class="pro-tab-btn" onclick="switchTab('warp', this)">☁️ LAUNCHER</button>
        </div>

        <!-- TAB 1: PAYLOAD -->
        <div id="pane-inject" class="tab-pane active">
            <div class="inject-card">
                <div style="font-weight:900; color:var(--neon-green); margin-bottom:6px; font-size:1rem;">🤖 HTTP INJECTOR PAYLOAD</div>
                <div class="block-desc">เปิดฟังก์ชันในแท็บ Cheats ให้เรียบร้อย แล้วกดปุ่มด้านล่างเพื่อคัดลอก Payload ไปวางในแอป HTTP Injector ได้เลย</div>
                <button onclick="copyAndroidPayload()" style="background: #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">📋 คัดลอก Payload สำหรับ Android</button>
                <div class="console-box" id="console-log">> System initialized. Ready to generate payload script...</div>
            </div>
        </div>

        <!-- TAB 2: CHEATS -->
        <div id="pane-cheats" class="tab-pane">
            <div class="cheat-card">
                <div style="font-weight:900; color:var(--neon-cyan); margin-bottom:6px; font-size:1rem;">💎 FREE FIRE HACKS</div>
                <div class="block-desc">เลือกเปิดฟังก์ชันที่ต้องการให้ฝังลงใน Payload</div>
                
                <div class="toggle-row">
                    <div><b>🎯 Magic Bullet V2</b><div style="font-size:0.68rem; color:var(--text-sub);">กระสุนโค้งเข้าหัวอัตโนมัติ</div></div>
                    <label class="cyber-switch"><input type="checkbox" id="chk-magic" checked><span class="switch-slider"></span></label>
                </div>
                <div class="toggle-row">
                    <div><b>🔒 No Spread</b><div style="font-size:0.68rem; color:var(--text-sub);">เป้านิ่งกระสุนไม่ดีด</div></div>
                    <label class="cyber-switch"><input type="checkbox" id="chk-spread" checked><span class="switch-slider"></span></label>
                </div>
                <div class="toggle-row">
                    <div><b>⚡ Fast Loot</b><div style="font-size:0.68rem; color:var(--text-sub);">เก็บไอเทมไวทันทีที่เดินผ่าน</div></div>
                    <label class="cyber-switch"><input type="checkbox" id="chk-loot" checked><span class="switch-slider"></span></label>
                </div>
            </div>
        </div>

        <!-- TAB 3: LAUNCHER -->
        <div id="pane-warp" class="tab-pane">
            <div class="feature-block">
                <div style="font-weight:900; color:var(--neon-orange); margin-bottom:6px; font-size:1rem;">🚀 GAME LAUNCHER</div>
                <div class="block-desc">กดเพื่อเปิดเข้าตัวเกม Free Fire หลังจากเชื่อมต่อ VPN เรียบร้อยแล้ว</div>
                <button onclick="openGame('ff')" style="background: linear-gradient(135deg, #f59e0b, #b45309); margin-top:6px;">🎮 เปิดเกม Free Fire</button>
                <button onclick="openGame('max')" style="background: linear-gradient(135deg, var(--neon-cyan), #0284c7); margin-top:10px;">🔥 เปิดเกม Free Fire MAX</button>
            </div>
        </div>
    </div>
</div>

<script>
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
            document.getElementById('console-log').innerText = "> [SUCCESS] Payload copied to clipboard!\\n> Magic: " + magic + " | Spread: " + spread + " | Loot: " + loot;
            alert("📋 คัดลอก Payload สำเร็จ!\n\nนำข้อความนี้ไปวางในช่อง 'Payload' ของแอป HTTP Injector ได้เลยครับ!");
        }).catch(err => {
            alert("คัดลอกไม่สำเร็จ กรุณากดคัดลอกใหม่อีกครั้ง");
        });
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
    console.log("Server is running on port " + PORT);
});
