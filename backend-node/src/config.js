require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'chrome-extension://*']
};
