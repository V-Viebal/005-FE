// 1. Imports
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Rocket } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particle-background';

// 2. Types
type FinalCTAProps = {
  className?: string;
};

// 3. Component
const FinalCTA = ({ className }: FinalCTAProps) => {
  // 4. Hooks
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  // 5. Effects
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
    <section id="final-cta" className={`relative py-20 overflow-hidden ${className || ''}`}>
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
            {t('finalCtaTitle')}
          </h2>

          <p
            className={`text-xl md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('finalCtaSubtitle')}
          </p>

          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <button className="group relative inline-flex items-center space-x-3 px-12 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>{t('startBuilding')}</span>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />

              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-300 -z-10"></div>
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

FinalCTA.displayName = 'FinalCTA';

export { FinalCTA };
export type { FinalCTAProps };
