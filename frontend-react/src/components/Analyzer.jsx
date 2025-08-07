import React from 'react';
import { analyzeNews, submitFeedback } from '../api';

const Analyzer = () => {
  const [inputMode, setInputMode] = React.useState('url');
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [feedbackSent, setFeedbackSent] = React.useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSent(false);

    try {
      const data = await analyzeNews(inputValue, inputMode);
      setResult({
        ...data,
        originalInput: inputValue,
        inputType: inputMode
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isReal) => {
    try {
      await submitFeedback(
        result.text_snippet,
        isReal,
        result.inputType === 'url' ? result.originalInput : null
      );
      setFeedbackSent(true);
    } catch (err) {
      console.error('Feedback failed', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 mt-10">
      <div className="glass-panel p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/10 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Analyze News
        </h2>

        <div className="flex gap-4 mb-6 justify-center">
          <button
            className={`px-6 py-2 rounded-full font-medium transition-all ${inputMode === 'url' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            onClick={() => { setInputMode('url'); setInputValue(''); }}
          >
            Article URL
          </button>
          <button
             className={`px-6 py-2 rounded-full font-medium transition-all ${inputMode === 'text' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
             onClick={() => { setInputMode('text'); setInputValue(''); }}
          >
            Raw Text
          </button>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          {inputMode === 'url' ? (
            <input
              type="url"
              placeholder="https://example.com/news-article..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          ) : (
            <textarea
              placeholder="Paste the news article text here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-40 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-blue-500/25"
          >
            {loading ? 'Analyzing...' : 'Verify Content'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-fade-in-up">
            <div className={`p-6 rounded-2xl border ${result.prediction === 'Fake News' ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/20 border-green-500/50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-2xl font-bold ${result.prediction === 'Fake News' ? 'text-red-400' : 'text-green-400'}`}>
                  {result.prediction}
                </h3>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Credibility Score</p>
                  <p className="text-xl font-bold text-white">{result.credibilityScore}%</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Analyzed Snippet:</p>
                <p className="text-gray-300 italic">"{result.text_snippet}"</p>
              </div>

              {!feedbackSent ? (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-center text-gray-400 mb-3">Is this prediction accurate?</p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => handleFeedback(true)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition-colors">
                      Yes, it's correct
                    </button>
                    <button onClick={() => handleFeedback(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition-colors">
                      No, it's wrong
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-white/10 pt-4 text-center">
                  <p className="text-green-400 text-sm">Thank you for your feedback! This helps improve our model.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;
