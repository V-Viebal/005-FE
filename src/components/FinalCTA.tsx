import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Rocket } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const FinalCTA: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('final-cta');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="final-cta" className="relative py-20 overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('finalCtaTitle')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('finalCtaSubtitle')}
          </p>
          
          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              {t('startFreeTrial')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300">
              {t('viewPricing')}
            </button>
          </div>
          
          {/* Trust indicators */}
          <div
            className={`mt-12 flex items-center justify-center space-x-8 text-sm text-slate-400 transform transition-all duration-1000 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>99.9% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;