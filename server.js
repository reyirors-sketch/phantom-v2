const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const loadKeys = () => {
    try {
        const data = fs.readFileSync('keys.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { keys: [], adminPassword: "ADMIN1234" };
    }
};

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHANTOMv2 - Cyberpunk UI</title>
    <style>
        body { background: #0b0f19; color: #00ffcc; font-family: monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: rgba(0,255,204,0.05); border: 2px solid #00ffcc; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,255,204,0.3); text-align: center; width: 350px; }
        input { background: #000; border: 1px solid #00ffcc; color: #00ffcc; padding: 10px; width: 80%; margin: 15px 0; border-radius: 5px; text-align: center; font-size: 16px; }
        button { background: #00ffcc; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 5px; width: 85%; }
        button:hover { background: #00b386; }
        .error { color: #ff3366; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <h2>PHANTOMv2</h2>
        <p>ENTER LICENSE KEY</p>
        <input type="text" id="keyInput" placeholder="PHANTOM-xxxx">
        <br>
        <button onclick="verifyKey()">LOGIN SYSTEM</button>
        <div id="msg" class="error"></div>
    </div>
    <script>
        async function verifyKey() {
            const key = document.getElementById('keyInput').value;
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            const data = await res.json();
            if(data.success) {
                alert('Login Success! เข้าสู่ระบบสำเร็จ');
                location.href = '/dashboard';
            } else {
                document.getElementById('msg').innerText = data.message;
            }
        }
    </script>
</body>
</html>`);
});

app.get('/dashboard', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>PHANTOMv2 - Dashboard</title>
    <style>
        body { background: #050811; color: #fff; font-family: monospace; padding: 20px; }
        h1 { color: #00ffcc; text-shadow: 0 0 10px rgba(0,255,204,0.5); }
        .box { background: rgba(255,255,255,0.05); border: 1px solid #00ffcc; padding: 20px; border-radius: 8px; margin-top: 20px; }
        button { background: #ff3366; color: #fff; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>PHANTOMv2 CONTROL PANEL</h1>
    <div class="box">
        <p>สถานะระบบ: <span style="color: #00ffcc;">ONLINE (CONNECTED)</span></p>
        <p>01 เลือกสไตล์: Phantom / Dream / IceWall / Moco</p>
        <p>02 ปรับระดับจุดเล็งและระบบแจ้งเตือนดาเมจอัตโนมัติ</p>
        <br>
        <button onclick="location.href='/'">LOGOUT</button>
    </div>
</body>
</html>`);
});

app.post('/api/verify', (req, res) => {
    const { key } = req.body;
    const db = loadKeys();
    const found = db.keys.find(k => k.key === key);

    if (!found || found.status !== 'active') {
        return res.json({ success: false, message: 'Invalid or Inactive Key!' });
    }

    res.json({ success: true, message: 'Login Success!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
