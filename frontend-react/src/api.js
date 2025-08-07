const API_BASE_URL = 'http://localhost:3001/api';

export const analyzeNews = async (input, type) => {
  try {
    const payload = type === 'url' ? { url: input } : { text: input };
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze news');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const submitFeedback = async (text, expectedLabel, url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        news_text: text, 
        expected_label: expectedLabel,
        original_url: url 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
    return true;
  } catch (error) {
    throw error;
  }
};
