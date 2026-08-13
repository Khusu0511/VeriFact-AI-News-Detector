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
    let displaySnippet = text;

    // Scrape if URL is provided
    if (url) {
      try {
        const scraped = await scraperService.scrapeText(url);
        // Use headline for prediction (model trained on headlines)
        contentToAnalyze = scraped.headline;
        // Use body text for the display snippet
        displaySnippet = scraped.bodyText || scraped.headline;
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
    
    // Credibility score: how confident the model is in its prediction (0-100)
    // confidence > 0.5 means "real", confidence < 0.5 means "fake"
    const credibilityScore = Math.round(
      (prediction.isFake ? (1 - prediction.confidence) : prediction.confidence) * 100
    );

    return res.json({
      prediction: prediction.isFake ? 'Fake News' : 'Real News',
      confidence: prediction.confidence,
      credibilityScore: credibilityScore,
      analyzed_headline: contentToAnalyze,
      text_snippet: (displaySnippet || contentToAnalyze).substring(0, 200) + ((displaySnippet || contentToAnalyze).length > 200 ? '...' : '')
    });

  } catch (error) {
    console.error('Prediction Error:', error);
    res.status(500).json({ error: 'An internal error occurred during prediction.' });
  }
});

module.exports = router;
