// 1. Imports
import React, { useState, useEffect } from 'react';
import { Server, Shield, Zap, Globe, Headphones, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// 2. Types
type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
};

type FeaturesProps = {
  className?: string;
};

// 3. Component
const Features = ({ className }: FeaturesProps) => {
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

    const element = document.getElementById('features');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // 7. Constants
  const features: Feature[] = [
    {
      icon: Server,
      title: t('enterpriseHardware'),
      description: t('enterpriseHardwareDesc'),
      delay: 0,
    },
    {
      icon: Shield,
      title: t('advancedSecurity'),
      description: t('advancedSecurityDesc'),
      delay: 200,
    },
    {
      icon: Zap,
      title: t('lightningFast'),
      description: t('lightningFastDesc'),
      delay: 400,
    },
    {
      icon: Globe,
      title: t('globalNetwork'),
      description: t('globalNetworkDesc'),
      delay: 600,
    },
    {
      icon: Headphones,
      title: t('expertSupport'),
      description: t('expertSupportDesc'),
      delay: 800,
    },
    {
      icon: Settings,
      title: t('fullControl'),
      description: t('fullControlDesc'),
      delay: 1000,
    },
  ];

  return (
    <section id="features" className={`py-20 bg-slate-900/30 ${className || ''}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('featuresTitle')}
          </h2>
          <p
            className={`text-xl text-slate-400 max-w-2xl mx-auto transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{
                transitionDelay: `${400 + feature.delay}ms`,
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Features.displayName = 'Features';

export { Features };
export type { FeaturesProps, Feature };
