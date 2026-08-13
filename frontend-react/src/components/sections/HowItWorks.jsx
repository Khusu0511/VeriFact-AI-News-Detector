import React, { useEffect, useRef } from 'react';

const STEPS = [
  {
    title: 'Input Headline',
    description: 'Paste a news headline or article URL from any source.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    step: '01',
  },
  {
    title: 'AI Analysis',
    description: 'Our BiLSTM neural network analyzes linguistic patterns and context.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    step: '02',
  },
  {
    title: 'Get a Verdict',
    description: 'Receive an instant credibility score with detailed confidence metrics.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    step: '03',
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.reveal');
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="my-24 md:my-32" ref={sectionRef}>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
          Simple 3-Step Process
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white">How It Works</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {STEPS.map((step, index) => (
          <div
            key={step.step}
            className="reveal how-card card-glass p-8 rounded-2xl text-center relative overflow-hidden"
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Step number watermark */}
            <span className="absolute top-4 right-6 text-6xl font-extrabold text-slate-800/30 select-none">
              {step.step}
            </span>

            <div className="how-card-icon mb-6 text-cyan-400 bg-slate-800/50 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center relative z-10">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white relative z-10">{step.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
