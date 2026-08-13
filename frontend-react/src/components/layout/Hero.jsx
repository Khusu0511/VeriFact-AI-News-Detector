import React from 'react';

const Hero = () => {
  return (
    <header className="text-center pt-32 md:pt-40 pb-20 header-anim px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-8">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        AI-Powered News Verification
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold animated-gradient-text leading-tight max-w-5xl mx-auto">
        Navigate the News with&nbsp;Confidence
      </h1>
      <p className="text-slate-400 text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
        In a world of information overload, VeriFact is your guide to the truth.
        Our AI gives you the power to distinguish fact from fiction, instantly.
      </p>
      <div className="mt-10 flex justify-center">
        <a
          href="#analyzer"
          className="btn-primary text-white font-bold py-4 px-10 rounded-xl text-lg inline-flex items-center gap-2"
        >
          Start Analyzing
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </header>
  );
};

export default Hero;
