import React, { useState, useEffect, useCallback } from 'react';
import Analyzer from './components/Analyzer';
import HowItWorks from './components/HowItWorks';
import History from './components/History';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('veriFactAnalysisHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = useCallback((headline, prediction) => {
    setHistory(prev => {
      const updated = [{ headline, prediction }, ...prev].slice(0, 10);
      localStorage.setItem('veriFactAnalysisHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('veriFactAnalysisHistory');
  }, []);

  return (
    <div className="text-slate-200 min-h-screen antialiased">
      <div className="aurora-bg"></div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6 mb-16">
          <div className="flex items-center gap-5 cursor-pointer" onClick={() => window.location.reload()}>
            <img src="/logo.png" alt="VeriFact Logo" className="w-12 h-12 md:w-16 md:h-16" 
                 onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-3xl md:text-4xl font-bold text-white">VeriFact</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-base font-medium">
            <a href="#analyzer" className="nav-link text-slate-300 hover:text-white transition-colors">Analyzer</a>
            <a href="#how-it-works" className="nav-link text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#contact" className="nav-link text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>
        </nav>

        {/* Hero */}
        <header className="text-center mb-24 header-anim">
          <h1 className="text-5xl md:text-6xl font-extrabold animated-gradient-text leading-tight">
            Navigate the News with Confidence
          </h1>
          <p className="text-slate-400 text-xl mt-6 max-w-4xl mx-auto">
            In a world of information overload, VeriFact is your guide to the truth. Our AI gives you the power to distinguish fact from fiction, instantly.
          </p>
        </header>

        {/* Analyzer Card */}
        <Analyzer onResult={addToHistory} history={history} clearHistory={clearHistory} />

        {/* How It Works */}
        <HowItWorks />

        {/* Footer */}
        <footer id="contact" className="text-center py-10 border-t border-slate-800">
          <p className="text-slate-400">&copy; 2025 VeriFact. All Rights Reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
