const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Analyze a news headline or URL for fake news detection.
 * @param {string} input - The text or URL to analyze
 * @param {'text'|'url'} type - Input type
 * @returns {Promise<Object>} Prediction result
 */
export const analyzeNews = async (input, type) => {
  const payload = type === 'url' ? { url: input } : { text: input };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis failed (${response.status})`);
  }

  return response.json();
};

/**
 * Submit user feedback on a prediction.
 * @param {string} text - The analyzed text
 * @param {string} expectedLabel - 'Real' or 'Fake'
 * @param {string|null} url - Original URL if applicable
 */
export const submitFeedback = async (text, expectedLabel, url) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      news_text: text,
      expected_label: expectedLabel,
      original_url: url,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }

  return true;
};
