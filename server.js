const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'jrt_lms_secret_2024';

// ── Database setup (JSON file as DB) ──────────────────────────
const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

const adapter = new FileSync(path.join(dbPath, 'db.json'));
const db = low(adapter);

db.defaults({
  users: [],
  otps: [],
  courses: [],
  enrollments: []
}).write();

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth Middleware ────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not logged in' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════════

// SIGNUP
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ error: 'All fields are required' });

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = db.get('users').find({ email }).value();
  if (existing)
    return res.status(400).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Save pending user
  db.get('users').push({
    id: Date.now().toString(),
    name,
    email,
    password: hashed,
    role,
    verified: false,
    createdAt: new Date().toISOString()
  }).write();

  // Save OTP
  db.get('otps').remove({ email }).write();
  db.get('otps').push({ email, otp, expiry: otpExpiry }).write();

  console.log(`\n📧 OTP for ${email}: ${otp}\n`);

  res.json({ message: 'OTP sent. Check your console (development mode).', email });
});

// VERIFY OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const record = db.get('otps').find({ email }).value();
  if (!record) return res.status(400).json({ error: 'No OTP found for this email' });
  if (Date.now() > record.expiry) return res.status(400).json({ error: 'OTP expired. Request a new one.' });
  if (record.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP' });

  db.get('users').find({ email }).assign({ verified: true }).write();
  db.get('otps').remove({ email }).write();

  const user = db.get('users').find({ email }).value();
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: 'Email verified!', user: { name: user.name, email: user.email, role: user.role } });
});

// RESEND OTP
app.post('/api/resend-otp', (req, res) => {
  const { email } = req.body;
  const user = db.get('users').find({ email }).value();
  if (!user) return res.status(404).json({ error: 'Email not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  db.get('otps').remove({ email }).write();
  db.get('otps').push({ email, otp, expiry: otpExpiry }).write();

  console.log(`\n📧 New OTP for ${email}: ${otp}\n`);
  res.json({ message: 'New OTP sent!' });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });

  const user = db.get('users').find({ email }).value();
  if (!user) return res.status(400).json({ error: 'Email not registered' });
  if (!user.verified) return res.status(400).json({ error: 'Email not verified. Please verify your email first.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Incorrect password' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } });
});

// LOGOUT
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET CURRENT USER
app.get('/api/me', authMiddleware, (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});

// ══════════════════════════════════════════════════════════════
//  DASHBOARD DATA ROUTES
// ══════════════════════════════════════════════════════════════

app.get('/api/dashboard', authMiddleware, (req, res) => {
  const enrollments = db.get('enrollments').filter({ userId: req.user.id }).value();
  res.json({
    myCourses: enrollments.length,
    upcomingAssignments: 0,
    scheduledSessions: 0,
    overallProgress: enrollments.length > 0
      ? (enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length).toFixed(2)
      : '0.00',
    enrolledCourses: enrollments
  });
});

// ══════════════════════════════════════════════════════════════
//  PAGE ROUTES (serve HTML pages)
// ══════════════════════════════════════════════════════════════
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'signup.html')));
app.get('/otp', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'otp.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html')));

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ JRT LMS running at: http://localhost:${PORT}`);
  console.log(`📧 OTP codes will print here in the console\n`);
});
