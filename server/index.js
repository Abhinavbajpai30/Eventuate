import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'abc123';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

import fs from 'fs';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const users = [];
const events = [];

app.post('/api/signup', async (req, res) => {
  const { username, password, fullName, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    username,
    password: hashedPassword,
    fullName: fullName || '',
    email: email || '',
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ message: 'User created successfully.' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.username === decoded.username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.createdAt) user.createdAt = new Date().toISOString();
    res.json({
      username: user.username,
      fullName: user.fullName || '',
      email: user.email || '',
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.post('/api/events', upload.single('banner'), (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, description, date, time, location, peopleLimit } = req.body;
    
    if (!name || !description || !date || !time || !location || !peopleLimit) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = {
      id: Date.now().toString(),
      name,
      description,
      date,
      time,
      location,
      peopleLimit: parseInt(peopleLimit),
      banner: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: decoded.username,
      createdAt: new Date().toISOString(),
      attendees: []
    };

    events.push(event);
    res.status(201).json(event);
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

app.post('/api/events/:id/join', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(decoded.username)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    if (event.attendees.length >= event.peopleLimit) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(decoded.username);
    res.json(event);
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 