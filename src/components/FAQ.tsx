// 1. Imports
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// 2. Types
interface FAQProps {
  // Add props if needed in the future
}

// 3. Component
const FAQ: React.FC<FAQProps> = () => {
  // 4. Hooks
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

    const element = document.getElementById('faq');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // 7. Constants
  const faqs = [
    {
      question: t('faqQuestion1'),
      answer: t('faqAnswer1'),
    },
    {
      question: t('faqQuestion2'),
      answer: t('faqAnswer2'),
    },
    {
      question: t('faqQuestion3'),
      answer: t('faqAnswer3'),
    },
    {
      question: t('faqQuestion4'),
      answer: t('faqAnswer4'),
    },
    {
      question: t('faqQuestion5'),
      answer: t('faqAnswer5'),
    },
    {
      question: t('faqQuestion6'),
      answer: t('faqAnswer6'),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('faqTitle')}
          </h2>
          <p
            className={`text-xl text-slate-400 max-w-2xl mx-auto transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {t('faqSubtitle')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden transform transition-all duration-500 hover:border-blue-500/50 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 transform transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-400 transform transition-transform duration-300" />
                  )}
                </div>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100 pb-6'
                    : 'max-h-0 opacity-0 pb-0'
                }`}
              >
                <div className="px-6">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;