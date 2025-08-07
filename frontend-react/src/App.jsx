import React from 'react';
import Analyzer from './components/Analyzer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950"></div>
      
      <header className="w-full p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20">
            V
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Veri<span className="text-purple-400">Fact</span></h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">History</a>
        </nav>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <div className="text-center mt-16 mb-8 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
            Spot <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Fake News</span> Instantly.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our AI-powered engine uses Deep Learning (BiLSTM) to analyze linguistic patterns and determine the credibility of any article in seconds.
          </p>
        </div>

        <Analyzer />
      </main>
    </div>
  );
}

export default App;
