import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#020617] border-t border-slate-800 font-exo relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 mx-auto">

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">

          {/* Brand & Description (Spans 2 columns) */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <a href="#" className="flex items-center gap-3 md:gap-4 mb-6 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <img
                src="/logo.png"
                alt="VeriFact"
                className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Veri<span className="text-cyan-400">Fact</span>
              </span>
            </a>

            <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-8 mr-20">
              A personal project designed to explore how AI can combat misinformation. VeriFact leverages natural language processing and machine learning to help users detect bias, analyze sentiment, and verify news sources in real-time.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5">
              {[
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
              ].map(social => (
                <a key={social.name} href="#" className="text-slate-500 hover:text-white transition-colors duration-200" aria-label={social.name}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" clipRule={social.name === 'GitHub' ? 'evenodd' : undefined} fillRule={social.name === 'GitHub' ? 'evenodd' : undefined}>
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 lg:col-start-4">
            <h4 className="text-sm font-semibold text-white mb-6">Platform</h4>
            <ul className="flex flex-col gap-3">
              {['AI Analyzer', 'How It Works', 'Key Features', 'About Us', 'Pricing'].map(item => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-white mb-6">Legal & Help</h4>
            <ul className="flex flex-col gap-3">
              {['API Documentation', 'Research Papers', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map(item => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-sm font-semibold text-white mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li>
                <a href="mailto:hello@verifact.ai" className="hover:text-white transition-colors duration-200">hello@verifact.ai</a>
              </li>
              <li className="leading-relaxed mt-1">
                123 Innovation Drive<br />
                San Francisco, CA 94105
              </li>
              <li className="mt-1">
                +1 (555) 123-4567
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800/60 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} VeriFact. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
