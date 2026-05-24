# JRT SYSTEM LMS — Full Stack (Node.js + Express + JSON DB)

## 📁 Folder Structure

```
jrt-lms/
├── server.js              ← Backend server (main file)
├── package.json           ← Dependencies
├── data/
│   └── db.json            ← Auto-created database (JSON)
├── public/
│   ├── index.html         ← Home page
│   ├── css/
│   │   └── style.css      ← All styles
│   ├── js/
│   │   └── api.js         ← Frontend API helper
│   └── pages/
│       ├── login.html     ← Sign In
│       ├── signup.html    ← Create Account
│       ├── otp.html       ← Email Verify
│       └── dashboard.html ← Student Dashboard
└── README.md
```

---

## 🚀 Run Karne Ka Tarika (Step by Step)

### Step 1 — Node.js Install Karo
Agar Node.js install nahi hai:
👉 https://nodejs.org/en/download
"LTS" version download karo aur install karo.

Check karo:
```
node --version
npm --version
```

---

### Step 2 — Project Extract Karo
ZIP extract karo aur `jrt-lms` folder kisi jagah rakh lo
(maslan: `C:\Users\YourName\Desktop\jrt-lms`)

---

### Step 3 — Terminal/CMD Kholo
- Windows: `Win + R` → `cmd` → Enter
- Ya VS Code mein: Terminal → New Terminal

---

### Step 4 — Folder mein Jao
```bash
cd C:\Users\YourName\Desktop\jrt-lms
```
(apna sahi path likho)

---

### Step 5 — Dependencies Install Karo (pehli baar sirf)
```bash
npm install
```

---

### Step 6 — Server Chalao
```bash
node server.js
```

Yeh message aayega:
```
✅ JRT LMS running at: http://localhost:3000
📧 OTP codes will print here in the console
```

---

### Step 7 — Browser mein Kholo
👉 http://localhost:3000

---

## 🔐 Registration Flow

1. `/signup` → Account banao
2. Terminal mein OTP code dekho (6 digit number)
3. `/otp` → Woh code dalo
4. Automatically dashboard khul jayega

---

## 📡 API Endpoints

| Method | URL | Kaam |
|--------|-----|------|
| POST | /api/signup | Naya account banao |
| POST | /api/verify-otp | Email verify karo |
| POST | /api/resend-otp | OTP dobara bhejo |
| POST | /api/login | Login karo |
| POST | /api/logout | Logout karo |
| GET | /api/me | Logged-in user info |
| GET | /api/dashboard | Dashboard data |

---

## 💡 Notes

- Database `data/db.json` file mein automatically save hota hai
- OTP terminal console mein print hota hai (development mode)
- JWT cookies se authentication hoti hai
- Server band karne ke liye `Ctrl + C` press karo
