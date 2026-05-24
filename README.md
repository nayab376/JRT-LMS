# JRT SYSTEM LMS — Full Stack (Node.js + Express + JSON DB)




<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/55d831d2-a14a-4933-b2d2-2b8c202f6618" />










<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/fd7b6478-b95c-4f3a-9ded-a15922bd5d88" />











<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/94084794-c264-470a-b2fe-3cb6f710520f" />











<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/97c0147a-b395-45c0-8d6f-a5840d9b7d39" />














<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/ba27c82e-d379-4bad-8f40-9967db1e4d82" />








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

###  Browser 
 http://localhost:3000

##  Registration Flow

1. `/signup` → Account banao


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


- JWT cookies se authentication hoti hai
- Server band karne ke liye `Ctrl + C` press karo
