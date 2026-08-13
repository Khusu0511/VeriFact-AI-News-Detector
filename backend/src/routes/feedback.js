const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateFeedbackInput } = require('../middleware/validator');

const router = express.Router();

router.post('/', validateFeedbackInput, (req, res) => {
  const { news_text, expected_label, original_url } = req.body;

  try {
    const feedbackPath = path.resolve(__dirname, '../../model/feedback.csv');
    
    // Simple CSV formatting
    const escapedText = news_text.replace(/"/g, '""');
    const label = expected_label ? 'Real' : 'Fake';
    const url = original_url ? original_url.replace(/"/g, '""') : '';
    
    const csvRow = `"${escapedText}","${label}","${url}","${new Date().toISOString()}"\n`;

    // Append to file (create if doesn't exist)
    if (!fs.existsSync(feedbackPath)) {
       fs.writeFileSync(feedbackPath, '"text","expected_label","url","timestamp"\n', 'utf8');
    }
    
    fs.appendFileSync(feedbackPath, csvRow, 'utf8');
    
    return res.json({ message: 'Feedback recorded successfully!' });
  } catch (error) {
    console.error('Feedback Error:', error);
    return res.status(500).json({ error: 'Failed to record feedback.' });
  }
});

module.exports = router;
