const express = require('express');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/products');
const aiRoutes = require('./routes/ai');
const workspaceRoutes = require('./routes/workspace');

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendUrl = process.env.FRONTEND_URL || '*';
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
const viewerDir = path.resolve(__dirname, '..', '..', 'AI', 'TryOnAR');

fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(viewerDir, { recursive: true });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', frontendUrl === '*' ? '*' : frontendUrl);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDir));
app.use('/ai-viewer', express.static(viewerDir));

app.get('/', (_req, res) => {
  res.json({
    message: 'TryOnAR backend is running.',
    health: '/health',
    products: '/api/products',
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    me: '/api/me',
    tryOn: '/api/ai/tryon',
    detect: '/api/ai/detect',
    viewer: '/ai-viewer/',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', mode: 'mock-integrated' });
});

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workspace', workspaceRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`TryOnAR backend listening on http://localhost:${port}`);
  });
}

module.exports = app;
