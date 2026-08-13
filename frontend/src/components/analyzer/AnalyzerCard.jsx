import React, { useState } from 'react';
import { analyzeNews, submitFeedback } from '../../api';
import { useToast } from '../ui/Toast';
import Spinner from '../ui/Spinner';
import ResultCard from './ResultCard';

const AnalyzerCard = ({ onResult }) => {
  const toast = useToast();
  const [inputMode, setInputMode] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const inputValue = inputMode === 'text' ? textValue : urlValue;

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setResult(null);
    setFeedbackSent(false);

    try {
      const data = await analyzeNews(inputValue, inputMode);
      setResult({ ...data, originalInput: inputValue, inputType: inputMode });

      const headline = data.analyzed_headline || data.text_snippet || inputValue;
      onResult(headline.substring(0, 100), data.prediction === 'Fake News' ? 'fake' : 'real', data.credibilityScore);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (type) => {
    try {
      await submitFeedback(
        result.text_snippet,
        type === 'correct',
        result.inputType === 'url' ? result.originalInput : null
      );
      setFeedbackSent(true);
      toast.success('Feedback submitted — thank you!');
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div id="analyzer" className="card-glass p-6 md:p-10 rounded-3xl shadow-2xl space-y-8 mb-16 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Analyze a Headline</h2>
        <p className="text-slate-500 text-sm">Paste a headline or article URL to check its credibility</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-900/60 p-1 rounded-xl inline-flex gap-1">
          <button
            className={`tab-btn px-6 py-2.5 text-sm font-semibold rounded-lg ${inputMode === 'text' ? 'active' : 'text-slate-400 hover:text-slate-300'}`}
            onClick={() => setInputMode('text')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              By Text
            </span>
          </button>
          <button
            className={`tab-btn px-6 py-2.5 text-sm font-semibold rounded-lg ${inputMode === 'url' ? 'active' : 'text-slate-400 hover:text-slate-300'}`}
            onClick={() => setInputMode('url')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              By URL
            </span>
          </button>
        </div>
      </div>

      {/* Input */}
      {inputMode === 'text' ? (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
          className="input-glow w-full h-36 p-4 bg-slate-900/50 text-slate-200 rounded-xl border-2 border-slate-700/80
            focus:outline-none transition-all duration-300 placeholder-slate-500 text-base leading-relaxed resize-none"
          placeholder="Paste a news headline here..."
        />
      ) : (
        <input
          type="url"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
          className="input-glow w-full p-4 bg-slate-900/50 text-slate-200 rounded-xl border-2 border-slate-700/80
            focus:outline-none transition-all duration-300 placeholder-slate-500 text-base"
          placeholder="https://example.com/news-article..."
        />
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !inputValue.trim()}
        className="btn-primary w-full text-white font-bold py-4 rounded-xl shadow-lg text-lg
          flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Spinner size="md" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Analyze</span>
          </>
        )}
      </button>

      {/* Skeleton Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-20 w-full" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <ResultCard result={result} onFeedback={handleFeedback} feedbackSent={feedbackSent} />
      )}
    </div>
  );
};

export default AnalyzerCard;
