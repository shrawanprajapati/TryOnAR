require('dotenv').config();

const cors = require('cors');
const express = require('express');
const path = require('path');

const { getDbPool } = require('./config/db');
const aiRoutes = require('./routes/ai');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploads');
const workspaceRoutes = require('./routes/workspace');

const app = express();
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || '0.0.0.0';
const frontendUrl = process.env.FRONTEND_URL || '*';
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
const aiViewerDir = path.resolve(__dirname, '..', '..', 'AI', 'TryOnAR');
const hostedAiViewerUrl = process.env.AI_VIEWER_URL || 'https://virtual-hat-glasses-try-on-booth.vercel.app';
const allowedOrigins =
  frontendUrl === '*'
    ? null
    : frontendUrl
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

function isLocalDevOrigin(origin) {
  try {
    const parsed = new URL(origin);
    const localHosts = new Set(['localhost', '127.0.0.1']);
    return localHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  })
);
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use('/ai-viewer', express.static(aiViewerDir));

app.get('/', (_req, res) => {
  res.json({
    message: 'TryOnAR backend is running.',
    health: '/health',
    products: '/api/products',
    profile: '/api/users/me',
    aiViewer: hostedAiViewerUrl,
  });
});

app.get('/health', async (_req, res) => {
  try {
    await getDbPool().query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

app.get('/api/ai/viewer-url', (_req, res) => {
  res.json({ viewerUrl: hostedAiViewerUrl });
});

app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/workspace', workspaceRoutes);

app.listen(port, host, () => {
  console.log(`TryOnAR backend listening on http://${host}:${port}`);
});
