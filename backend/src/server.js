const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const modelService = require('./services/modelService');
const tokenizerService = require('./services/tokenizerService');
const predictRoute = require('./routes/predict');
const feedbackRoute = require('./routes/feedback');
const scraperService = require('./services/scraperService');

const app = express();

// Security Middleware — configured for cross-origin API usage
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Not needed for a pure API server
}));
app.use(cors({
  origin: config.CORS_ORIGINS,
  methods: ['GET', 'POST'],
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body Parser
app.use(express.json());

// Routes
app.use('/api/predict', predictRoute);
app.use('/api/feedback', feedbackRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'VeriFact API is running' });
});

const mongoose = require('mongoose');

// Initialize Services and Start Server
async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully.');
    } else {
      console.log('MONGODB_URI not set. Feedback will be saved to local CSV.');
    }

    console.log('Initializing Tokenizer...');
    tokenizerService.load();

    console.log('Initializing Model...');
    await modelService.load();

    console.log('Pre-launching Puppeteer...');
    await scraperService.init();

    app.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown — close Puppeteer browser (SIGINT for local, SIGTERM for Render/Docker)
const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);
  await scraperService.close();
  process.exit(0);
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
