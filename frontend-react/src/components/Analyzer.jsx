import React, { useState } from 'react';
import { analyzeNews, submitFeedback } from '../api';
import History from './History';

const Analyzer = ({ onResult, history, clearHistory }) => {
  const [inputMode, setInputMode] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const inputValue = inputMode === 'text' ? textValue : urlValue;

  const handleAnalyze = async (e) => {
    e?.preventDefault();
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
      // Add to history
      const headline = data.analyzed_headline || data.text_snippet || inputValue;
      onResult(headline.substring(0, 100), data.prediction === 'Fake News' ? 'fake' : 'real');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedbackType) => {
    try {
      const isCorrect = feedbackType === 'correct';
      await submitFeedback(
        result.text_snippet,
        isCorrect,
        result.inputType === 'url' ? result.originalInput : null
      );
      setFeedbackSent(true);
    } catch (err) {
      console.error('Feedback failed', err);
    }
  };

  const handleShare = () => {
    const predictionText = result.prediction === 'Fake News' ? 'Likely FAKE' : 'Likely REAL';
    const confidence = result.credibilityScore;
    const textToCopy = `VeriFact Analysis:\n"${result.analyzed_headline || result.text_snippet}"\nResult: ${predictionText} News (${confidence}% confidence)`;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleHistoryClick = (headline) => {
    setTextValue(headline);
    setInputMode('text');
  };

  const confidencePercent = result ? result.credibilityScore : 0;
  const isReal = result ? result.prediction !== 'Fake News' : false;

  return (
    <main id="analyzer" className="card-glass p-8 md:p-12 rounded-3xl shadow-2xl space-y-10 mb-24 max-w-4xl mx-auto">
      {/* Input Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-6 text-slate-100">Analyze a Headline</h2>

        {/* Tabs */}
        <div className="flex justify-center mb-4 bg-slate-900/60 p-1 rounded-lg w-max mx-auto">
          <button
            className={`tab-btn px-6 py-2 text-sm font-semibold rounded-md transition-colors ${inputMode === 'text' ? 'active' : 'text-slate-400'}`}
            onClick={() => setInputMode('text')}
          >
            By Text
          </button>
          <button
            className={`tab-btn px-6 py-2 text-sm font-semibold rounded-md transition-colors ${inputMode === 'url' ? 'active' : 'text-slate-400'}`}
            onClick={() => setInputMode('url')}
          >
            By URL
          </button>
        </div>

        {/* Inputs */}
        {inputMode === 'text' ? (
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
            className="w-full h-32 p-4 bg-slate-900/60 text-slate-200 rounded-lg border-2 border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 shadow-inner placeholder-slate-500 text-lg"
            placeholder="Paste a news headline here..."
          />
        ) : (
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
            className="w-full p-4 bg-slate-900/60 text-slate-200 rounded-lg border-2 border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 shadow-inner placeholder-slate-500 text-lg"
            placeholder="Paste the article URL here..."
          />
        )}

        {/* Analyze Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading || !inputValue.trim()}
            className="btn-primary text-white font-bold py-4 px-14 rounded-lg shadow-lg flex items-center justify-center mx-auto text-lg"
          >
            <span>{loading ? 'Analyzing' : 'Analyze'}</span>
            {loading && (
              <svg className="spinner h-6 w-6 ml-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="animate-fade-in bg-red-900/30 border border-red-500/50 p-4 rounded-lg text-red-200">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <section className="animate-fade-in">
          <div className={`bg-slate-800/60 p-6 rounded-lg ${isReal ? 'result-real' : 'result-fake'}`}>
            <p className="text-slate-400 text-sm mb-2 italic">
              Analyzed: "{result.analyzed_headline || result.text_snippet}"
            </p>
            <p className={`text-3xl font-bold mb-3 ${isReal ? 'text-green-400' : 'text-red-400'}`}>
              {isReal ? 'Likely REAL News' : 'Likely FAKE News'}
            </p>

            {/* Confidence Bar */}
            <div className="flex items-center gap-4 mb-3">
              <span className="text-slate-400 text-lg">Confidence:</span>
              <div className="confidence-bar-bg w-full h-4 rounded-full overflow-hidden">
                <div
                  className="confidence-bar-fill h-full rounded-full"
                  style={{
                    width: `${confidencePercent}%`,
                    backgroundColor: isReal ? '#22c55e' : '#ef4444'
                  }}
                />
              </div>
              <span className="font-mono text-lg font-semibold whitespace-nowrap">
                {confidencePercent}%
              </span>
            </div>

            {/* Feedback + Share */}
            <div className="flex justify-between items-center mt-5 pt-5 border-t border-slate-700">
              {!feedbackSent ? (
                <div>
                  <p className="text-base text-slate-400 mb-2">Was this prediction correct?</p>
                  <button
                    onClick={() => handleFeedback('correct')}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md mr-3 text-sm transition-colors"
                  >
                    👍 Correct
                  </button>
                  <button
                    onClick={() => handleFeedback('incorrect')}
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                  >
                    👎 Incorrect
                  </button>
                </div>
              ) : (
                <p className="text-green-400 font-semibold text-lg">Thank you for your feedback!</p>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      <History items={history} onClear={clearHistory} onItemClick={handleHistoryClick} />
    </main>
  );
};

export default Analyzer;
