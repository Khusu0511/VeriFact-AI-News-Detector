const express = require('express');
const scraperService = require('../services/scraperService');
const tokenizerService = require('../services/tokenizerService');
const modelService = require('../services/modelService');
const { validatePredictInput } = require('../middleware/validator');

const router = express.Router();

router.post('/', validatePredictInput, async (req, res) => {
  try {
    const { url, text } = req.body;
    let contentToAnalyze = text;

    // Scrape if URL is provided
    if (url) {
      try {
        contentToAnalyze = await scraperService.scrapeText(url);
      } catch (scrapeError) {
        return res.status(400).json({ error: `Failed to extract content from URL: ${scrapeError.message}` });
      }
    }

    if (!contentToAnalyze || contentToAnalyze.trim().length === 0) {
      return res.status(400).json({ error: 'No content to analyze.' });
    }

    // Process through tokenizer
    const sequences = tokenizerService.textsToSequences([contentToAnalyze]);
    const padded = tokenizerService.padSequences(sequences, 100);

    // Predict
    const prediction = await modelService.predict(padded);
    
    // Calculate credibility (scale of 0-100)
    // Assuming model returns probability of being real
    const fakeProb = prediction.isFake ? (1 - prediction.confidence) : prediction.confidence;
    const credibilityScore = Math.round((prediction.isFake ? prediction.confidence : fakeProb) * 100);

    return res.json({
      prediction: prediction.isFake ? 'Fake News' : 'Real News',
      confidence: prediction.confidence,
      credibilityScore: credibilityScore,
      text_snippet: contentToAnalyze.substring(0, 200) + '...'
    });

  } catch (error) {
    console.error('Prediction Error:', error);
    res.status(500).json({ error: 'An internal error occurred during prediction.' });
  }
});

module.exports = router;
