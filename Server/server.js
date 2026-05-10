import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authroute.js';
import teamRoutes from './routes/teamroutes.js';
import projectRoutes from './routes/projectroutes.js';
import taskRoutes from './routes/taskroute.js';
import activityLogRoutes from './routes/activityLogRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.CLIENT_URLS),
  'http://localhost:3000',
  'http://localhost:5173',
];

const isAllowedVercelPreview = (origin) => {
  if (!origin) return false;

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === 'https:' && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isAllowedVercelPreview(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI is not set. Database-backed API routes will fail until it is configured.');
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

app.get("/", (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'team-task-manager-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityLogRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err.message?.startsWith('CORS blocked origin')) {
    return res.status(403).json({ message: err.message });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({ message: 'Server error' });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
