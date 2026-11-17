const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// โหลดข้อมูล Keys
const loadKeys = () => {
    try {
        const data = fs.readFileSync('keys.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { keys: [], adminPassword: "ADMIN1234" };
    }
};

const saveKeys = (data) => {
    fs.writeFileSync('keys.json', JSON.stringify(data, null, 2));
};

// API ตรวจสอบ Key
app.post('/api/verify', (req, res) => {
    const { key } = req.body;
    const db = loadKeys();
    const found = db.keys.find(k => k.key === key);

    if (!found) {
        return res.json({ success: false, message: 'Invalid Key!' });
    }

    if (found.status !== 'active') {
        return res.json({ success: false, message: 'Key is inactive or expired!' });
    }

    res.json({ success: true, message: 'Login Success!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
