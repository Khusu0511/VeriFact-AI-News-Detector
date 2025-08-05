const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const modelService = require('./services/modelService');
const tokenizerService = require('./services/tokenizerService');
const predictRoute = require('./routes/predict');
const feedbackRoute = require('./routes/feedback');

const app = express();

// Security Middleware
app.use(helmet());
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

// Initialize Services and Start Server
async function startServer() {
  try {
    console.log('Initializing Tokenizer...');
    tokenizerService.load();

    console.log('Initializing Model...');
    await modelService.load();

    app.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
