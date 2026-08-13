import React, { useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import ScrollToTop from './components/ui/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Footer from './components/layout/Footer';
import AnalyzerCard from './components/analyzer/AnalyzerCard';
import Stats from './components/sections/Stats';
import HowItWorks from './components/sections/HowItWorks';
import History from './components/sections/History';
import { useHistory } from './hooks/useHistory';

function App() {
  const { history, addToHistory, clearHistory } = useHistory();

  // Spawn floating particles
  useEffect(() => {
    const container = document.querySelector('.aurora-bg');
    if (!container) return;

    const particles = [];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${60 + Math.random() * 40}%`;
      p.style.animationDuration = `${8 + Math.random() * 12}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.width = `${2 + Math.random() * 3}px`;
      p.style.height = p.style.width;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => p.remove());
  }, []);

  const handleHistoryClick = (headline) => {
    // Scroll to analyzer and pre-fill
    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen antialiased">
        <div className="aurora-bg" />
        <Navbar />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Hero />
          <Stats />
          <AnalyzerCard onResult={addToHistory} />

          {/* History card */}
          <div className="card-glass p-6 md:p-8 rounded-3xl shadow-xl mb-16 max-w-4xl mx-auto">
            <History items={history} onClear={clearHistory} onItemClick={handleHistoryClick} />
          </div>

          <HowItWorks />
          <Footer />
        </div>

        <ScrollToTop />
      </div>
    </ToastProvider>
  );
}

export default App;
