/**
 * Validates URLs and basic text payloads
 */
const validatePredictInput = (req, res, next) => {
  const { url, text } = req.body;

  if (!url && !text) {
    return res.status(400).json({ error: 'Please provide either a url or text to analyze.' });
  }

  if (url) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return res.status(400).json({ error: 'Invalid URL protocol.' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }
  }

  next();
};

const validateFeedbackInput = (req, res, next) => {
  const { news_text, expected_label } = req.body;
  if (!news_text || typeof expected_label !== 'boolean') {
      return res.status(400).json({ error: 'Missing required feedback fields.' });
  }
  next();
};

module.exports = {
  validatePredictInput,
  validateFeedbackInput
};
