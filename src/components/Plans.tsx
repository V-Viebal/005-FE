// 1. Imports
import React, { useState, useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// 2. Types
type Duration = '1month' | '3months' | '6months' | '1year';
type PlanTab = 'trial' | 'longterm';

interface Plan {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  prices: Record<Duration, number>;
  popular?: boolean;
}

interface TrialPlan {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  price: number;
}

interface PlansProps {
  // Add props if needed in the future
}

// 3. Component
const Plans: React.FC<PlansProps> = () => {
  // 4. Hooks
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState<Duration>('1month');
  const [activeTab, setActiveTab] = useState<PlanTab>('trial');
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

    const element = document.getElementById('plans-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const trialPlans: TrialPlan[] = [
    {
      name: 'Trial S',
      cpu: '1 Core',
      ram: '1 GB',
      storage: '20 GB SSD',
      price: 15000,
    },
    {
      name: 'Trial M',
      cpu: '2 Cores',
      ram: '2 GB',
      storage: '20 GB SSD',
      price: 35000,
    },
    {
      name: 'Trial A',
      cpu: '2 Cores',
      ram: '4 GB',
      storage: '20 GB SSD',
      price: 60000,
    },
    {
      name: 'Trial P',
      cpu: '4 Cores',
      ram: '8 GB',
      storage: '40 GB SSD',
      price: 90000,
    },
  ];

  const plans: Plan[] = [
    {
      name: t('basic'),
      cpu: '1 Core',
      ram: '1 GB',
      storage: '30 GB SSD',
      prices: {
        '1month': 40000,
        '3months': 114000,
        '6months': 192000,
        '1year': 360000,
      },
    },
    {
      name: t('standard'),
      cpu: '2 Cores',
      ram: '2 GB',
      storage: '40 GB SSD',
      prices: {
        '1month': 70000,
        '3months': 189000,
        '6months': 336000,
        '1year': 630000,
      },
      popular: true,
    },
    {
      name: t('advanced'),
      cpu: '2 Cores',
      ram: '4 GB',
      storage: '50 GB SSD',
      prices: {
        '1month': 120000,
        '3months': 324000,
        '6months': 576000,
        '1year': 1080000,
      },
    },
    {
      name: t('premium'),
      cpu: '4 Cores',
      ram: '8 GB',
      storage: '100 GB SSD',
      prices: {
        '1month': 200000,
        '3months': 540000,
        '6months': 960000,
        '1year': 1800000,
      },
    },
  ];

  const durations = [
    { key: '1month' as Duration, label: t('oneMonth') },
    { key: '3months' as Duration, label: t('threeMonths') },
    { key: '6months' as Duration, label: t('sixMonths') },
    { key: '1year' as Duration, label: t('oneYear') },
  ];

  const getSavingsPercentage = (duration: Duration): number => {
    const savings = {
      '1month': 0,
      '3months': 5,
      '6months': 20,
      '1year': 25,
    };
    return savings[duration];
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getMonthlyEquivalent = (price: number, duration: Duration): number => {
    const months = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12,
    };
    return Math.round(price / months[duration]);
  };

  return (
    <section id="plans" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('plansTitle')}
          </h2>
          <p
            className={`text-xl text-slate-400 max-w-2xl mx-auto mb-8 transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('plansSubtitle')}
          </p>

          {/* Tab Selector */}
          <div
            className={`inline-flex bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 mb-8 transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <button
              onClick={() => setActiveTab('trial')}
              className={`relative px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'trial'
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t('trialPackages')}
            </button>
            <button
              onClick={() => setActiveTab('longterm')}
              className={`relative px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'longterm'
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t('longtermPackages')}
            </button>
          </div>
        </div>

        {/* Trial Plans Tab */}
        {activeTab === 'trial' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('trialTitle')}
              </h3>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                {t('trialDescription')}
              </p>
            </div>

            <div id="plans-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {trialPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative group p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 ${
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${600 + index * 100}ms`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Plan Content */}
                  <div className="relative">
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-white mb-6">{plan.name}</h3>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-white">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-slate-400">VND</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{t('perMonth')}</p>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">CPU</span>
                        <span className="text-white font-medium">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">RAM</span>
                        <span className="text-white font-medium">{plan.ram}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Storage</span>
                        <span className="text-white font-medium">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Bandwidth</span>
                        <span className="text-white font-medium">Unlimited</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {[t('dedicatedIpv4'), t('uptimeGuarantee'), t('support247'), t('instantSetup')].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                      {t('startTrial')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Long-term Plans Tab */}
        {activeTab === 'longterm' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('longtermTitle')}
              </h3>

              {/* Duration Selector */}
              <div className="inline-flex bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.key}
                    onClick={() => setSelectedDuration(duration.key)}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedDuration === duration.key
                        ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {duration.label}
                    {getSavingsPercentage(duration.key) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{getSavingsPercentage(duration.key)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative group p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 ${
                    plan.popular ? 'ring-2 ring-blue-500/50' : ''
                  } ${
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${600 + index * 100}ms`,
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-max">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{t('mostPopular')}</span>
                      </div>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Plan Content */}
                  <div className="relative">
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                    {/* Savings Badge */}
                    {getSavingsPercentage(selectedDuration) > 0 && (
                      <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <span>{t('save')} {getSavingsPercentage(selectedDuration)}%</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-white">
                          {formatPrice(plan.prices[selectedDuration])}
                        </span>
                        <span className="text-slate-400">VND</span>
                      </div>
                      {selectedDuration !== '1month' && (
                        <p className="text-sm text-slate-500 mt-1">
                          {t('onlyFrom')} {formatPrice(getMonthlyEquivalent(plan.prices[selectedDuration], selectedDuration))} VND{t('perMonth')}
                        </p>
                      )}
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">CPU</span>
                        <span className="text-white font-medium">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">RAM</span>
                        <span className="text-white font-medium">{plan.ram}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Storage</span>
                        <span className="text-white font-medium">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Bandwidth</span>
                        <span className="text-white font-medium">Unlimited</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {[t('dedicatedIpv4'), t('uptimeGuarantee'), t('support247'), t('instantSetup')].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                      {t('orderNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
