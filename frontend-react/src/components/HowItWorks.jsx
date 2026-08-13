import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: '1. Input Headline',
      description: 'You provide a news headline from any source.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      title: '2. AI Analysis',
      description: 'Our trained neural network analyzes the text for linguistic patterns.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
        </svg>
      )
    },
    {
      title: '3. Get a Verdict',
      description: 'Receive an instant "Real" or "Fake" classification with a confidence score.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="my-28">
      <h2 className="text-5xl font-bold text-center mb-16 text-white">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-10 text-center">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`card-glass p-8 rounded-xl animate-fade-in-delay-${index + 1}`}
          >
            <div className="mb-5 text-cyan-400 bg-slate-800/50 w-20 h-20 rounded-full mx-auto flex items-center justify-center">
              {step.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
            <p className="text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
