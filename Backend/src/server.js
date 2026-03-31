require('dotenv').config();

const cors = require('cors');
const express = require('express');
const path = require('path');

const { getDbPool } = require('./config/db');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploads');

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendUrl = process.env.FRONTEND_URL || '*';
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
const aiViewerDir = path.resolve(__dirname, '..', '..', 'AI', 'TryOnAR');

app.use(
  cors({
    origin: frontendUrl === '*' ? true : frontendUrl,
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
    aiViewer: '/ai-viewer/',
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
  res.json({ path: '/ai-viewer/' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

app.listen(port, () => {
  console.log(`TryOnAR backend listening on http://localhost:${port}`);
});
