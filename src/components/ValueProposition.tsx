import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Zap, Clock, Users } from 'lucide-react';

const ValueProposition: React.FC = () => {
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

    const element = document.getElementById('value-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // 7. Constants
  const features = [
    {
      icon: Zap,
      title: t('lightningFast'),
      description: t('lightningFastDesc'),
      large: true,
      delay: 0,
    },
    {
      icon: Shield,
      title: t('enterpriseSecurity'),
      description: t('enterpriseSecurityDesc'),
      large: false,
      delay: 200,
    },
    {
      icon: Clock,
      title: t('instantDeployment'),
      description: t('instantDeploymentDesc'),
      large: false,
      delay: 400,
    },
    {
      icon: Users,
      title: t('expertSupport'),
      description: t('expertSupportDesc'),
      large: true,
      delay: 600,
    },
  ];

  return (
    <section id="value-section" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('valueTitle')}
          </h2>
          <p
            className={`text-xl text-slate-400 max-w-2xl mx-auto transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('valueSubtitle')}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 ${
                feature.large ? 'lg:col-span-2' : 'lg:col-span-1'
              } ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{
                transitionDelay: `${feature.delay}ms`,
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
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">
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

export default ValueProposition;
