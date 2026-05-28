require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/weather');
const solarTermRoutes = require('./routes/solarTerm');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const aiSuggestionsRoutes = require('./routes/aiSuggestions');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-app';

// 请求日志
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/solar-term', solarTermRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/ai-suggestions', aiSuggestionsRoutes);

// API 文档首页
app.get('/', (_req, res) => {
  res.json({
    name: '天气 App API',
    endpoints: {
      'GET  /api/health': '健康检查',
      'GET  /api/weather/current?city=城市名': '查询天气',
      'GET  /api/weather/forecast?city=城市名': '天气预报',
      'GET  /api/solar-term': '获取节气信息',
      'GET  /api/solar-term/current': '获取当前节气',
      'POST /api/auth/register': '注册 { email, password }',
      'POST /api/auth/login': '登录 { email, password }',
      'GET  /api/favorites': '获取收藏',
      'POST /api/favorites': '添加收藏 { city }',
      'DELETE /api/favorites/:city': '删除收藏',
      'GET  /api/ai-suggestions': 'AI 建议',
    }
  });
});

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 全局错误处理
app.use((err, _req, res, _next) => {
  console.error('未捕获错误:', err.message);
  res.status(500).json({ error: '服务器内部错误' });
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB 已连接');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 连接失败:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (无数据库)`);
    });
  });
