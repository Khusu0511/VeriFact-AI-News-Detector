import React, { useState } from 'react';
import ConfidenceBar from './ConfidenceBar';
import { useToast } from '../ui/Toast';

const ResultCard = ({ result, onFeedback, feedbackSent }) => {
  const toast = useToast();
  const isReal = result.prediction !== 'Fake News';
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const predictionText = isReal ? 'Likely REAL' : 'Likely FAKE';
    const text = `VeriFact Analysis:\n"${result.analyzed_headline || result.text_snippet}"\nResult: ${predictionText} News (${result.credibilityScore}% confidence)`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="animate-fade-in">
      <div className={`bg-slate-800/50 p-6 md:p-8 rounded-2xl ${isReal ? 'result-real' : 'result-fake'}`}>
        {/* Verdict */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3
              ${isReal ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}
            >
              <span className={`w-2 h-2 rounded-full ${isReal ? 'bg-green-400' : 'bg-red-400'}`} />
              {isReal ? 'Verified Credible' : 'Flagged Suspicious'}
            </div>
            <h3 className={`text-2xl md:text-3xl font-bold ${isReal ? 'text-green-400' : 'text-red-400'}`}>
              {isReal ? 'Likely REAL News' : 'Likely FAKE News'}
            </h3>
          </div>
        </div>

        {/* Analyzed text */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Analyzed Headline</p>
          <p className="text-slate-300 text-sm italic leading-relaxed">
            "{result.analyzed_headline || result.text_snippet}"
          </p>
        </div>

        {/* Confidence */}
        <ConfidenceBar percent={result.credibilityScore} isReal={isReal} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-slate-700/50">
          {!feedbackSent ? (
            <div>
              <p className="text-sm text-slate-400 mb-3">Was this prediction correct?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => onFeedback('correct')}
                  className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30
                    font-semibold py-2 px-4 rounded-lg text-sm transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Correct
                </button>
                <button
                  onClick={() => onFeedback('incorrect')}
                  className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30
                    font-semibold py-2 px-4 rounded-lg text-sm transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Incorrect
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-400 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thank you for your feedback!
            </div>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white
              font-medium py-2 px-4 rounded-lg text-sm transition-all hover:scale-105 border border-slate-600/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResultCard;
