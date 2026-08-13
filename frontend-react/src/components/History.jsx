import React from 'react';

const History = ({ items, onClear, onItemClick }) => {
  return (
    <section className="pt-8 border-t border-slate-700/50">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-slate-300">Analysis History</h2>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
          >
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-slate-500 mt-4">No history yet. Analyze a headline to begin!</p>
      ) : (
        <ul className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => onItemClick(item.headline)}
              className="animate-fade-in bg-slate-800/50 p-3 rounded-lg text-sm flex items-center gap-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.prediction === 'real' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-slate-300 flex-1 truncate">{item.headline}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default History;
