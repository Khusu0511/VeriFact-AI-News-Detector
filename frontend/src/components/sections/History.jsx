import React from 'react';

const History = ({ items, onClear, onItemClick }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="pt-8 border-t border-slate-700/30">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-slate-300">Analysis History</h2>
          {items.length > 0 && (
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{items.length}</span>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-600 text-sm">No history yet. Analyze a headline to begin!</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item, index) => (
            <li
              key={item.timestamp || index}
              onClick={() => onItemClick(item.headline)}
              className="history-item bg-slate-800/30 p-3 rounded-xl text-sm flex items-center gap-3 cursor-pointer border border-transparent hover:border-slate-700/50"
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.prediction === 'real' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-slate-300 flex-1 truncate">{item.headline}</span>
              {item.confidence && (
                <span className="text-xs text-slate-500 flex-shrink-0">{item.confidence}%</span>
              )}
              <span className="text-xs text-slate-600 flex-shrink-0">{formatTime(item.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default History;
