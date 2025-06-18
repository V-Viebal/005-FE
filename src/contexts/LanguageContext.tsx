import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    home: 'Home',
    plans: 'Plans',
    features: 'Features',
    faq: 'FAQ',
    clientLogin: 'Client Login',
    
    // Hero
    heroTitle: 'Architect Your Ambition.',
    heroSubtitle: "Deploy on Vietnam's most powerful VPS platform. Blazing-fast SSD, 99.9% uptime, and unlimited bandwidth for creators who demand excellence.",
    viewPlans: 'View Plans',
    
    // Value Proposition
    valueTitle: 'Built for Performance',
    valueSubtitle: 'The foundation of excellence starts with uncompromising infrastructure',
    
    unleashData: 'Unleash Your Data',
    unleashDataDesc: 'A ~600Mbps port with truly unlimited bandwidth. No caps, no throttling, no surprises.',
    
    digitalIdentity: 'Your Digital Identity',
    digitalIdentityDesc: 'A clean, dedicated IPv4 for security and stability.',
    
    instantActivation: 'Instant Activation',
    instantActivationDesc: 'Your server, provisioned and ready in under 5 minutes.',
    
    alwaysOnExpertise: 'Always-On Expertise',
    alwaysOnExpertiseDesc: 'Real, human experts available 24/7 to ensure your success.',
    
    // Plans
    plansTitle: 'Choose Your Power',
    plansSubtitle: 'Transparent pricing. No hidden fees. Scale as you grow.',
    
    // Plan Tabs
    trialPackages: 'Trial Packages',
    longtermPackages: 'Long-term Packages',
    
    // Trial Plans
    trialTitle: 'Start with a 1-Month Trial',
    trialDescription: 'Perfect for new customers to test our platform\'s speed and reliability at a minimal cost.',
    startTrial: 'Start Trial',
    
    // Long-term Plans
    longtermTitle: 'Save More with Long-Term Plans',
    
    oneMonth: '1 Month',
    threeMonths: '3 Months',
    sixMonths: '6 Months',
    oneYear: '1 Year',
    
    basic: 'Basic',
    standard: 'Standard',
    advanced: 'Advanced',
    premium: 'Premium',
    
    orderNow: 'Order Now',
    save: 'Save',
    onlyFrom: 'Only',
    perMonth: '/month',
    mostPopular: 'Most Popular',
    
    // Features
    featuresTitle: 'Everything You Need',
    featuresSubtitle: 'Professional-grade features that scale with your ambition',
    
    // Testimonials
    testimonialsTitle: 'Trusted by Creators',
    testimonialsSubtitle: 'Real success stories from our community',
    
    // FAQ
    faqTitle: 'Questions & Answers',
    faqSubtitle: 'Everything you need to know about our VPS hosting',
    
    // Final CTA
    finalCtaTitle: 'Your Vision. Deployed.',
    finalCtaSubtitle: 'Join thousands of creators who chose excellence',
    startBuilding: 'Start Building Now',
  },
  vi: {
    // Header
    home: 'Trang Chủ',
    plans: 'Bảng Giá',
    features: 'Tính Năng',
    faq: 'Câu Hỏi',
    clientLogin: 'Đăng Nhập',
    
    // Hero
    heroTitle: 'Kiến Tạo Tham Vọng Của Bạn.',
    heroSubtitle: 'Triển khai trên nền tảng VPS mạnh mẽ nhất Việt Nam. SSD tốc độ cực cao, cam kết 99.9% uptime, và băng thông không giới hạn dành cho những người sáng tạo đòi hỏi sự hoàn hảo.',
    viewPlans: 'Xem Bảng Giá',
    
    // Value Proposition
    valueTitle: 'Xây Dựng Cho Hiệu Suất',
    valueSubtitle: 'Nền tảng hoàn hảo bắt đầu từ hạ tầng không thỏa hiệp',
    
    unleashData: 'Giải Phóng Dữ Liệu',
    unleashDataDesc: 'Cổng mạng ~600Mbps cùng băng thông không giới hạn. Không giới hạn, không bóp băng thông, không chi phí ẩn.',
    
    digitalIdentity: 'Định Danh Số Của Bạn',
    digitalIdentityDesc: 'Một địa chỉ IPv4 sạch, dùng riêng cho bảo mật và ổn định.',
    
    instantActivation: 'Kích Hoạt Tức Thì',
    instantActivationDesc: 'Máy chủ của bạn, được khởi tạo và sẵn sàng trong dưới 5 phút.',
    
    alwaysOnExpertise: 'Chuyên Gia Luôn Sẵn Sàng',
    alwaysOnExpertiseDesc: 'Các chuyên gia thực sự, không phải robot, luôn túc trực 24/7 để đảm bảo thành công của bạn.',
    
    // Plans
    plansTitle: 'Chọn Sức Mạnh Của Bạn',
    plansSubtitle: 'Giá cả minh bạch. Không phí ẩn. Mở rộng theo nhu cầu.',
    
    // Plan Tabs
    trialPackages: 'Gói Dùng Thử',
    longtermPackages: 'Gói Dài Hạn',
    
    // Trial Plans
    trialTitle: 'Bắt Đầu với Gói Dùng Thử 1 Tháng',
    trialDescription: 'Lựa chọn hoàn hảo để khách hàng mới trải nghiệm tốc độ và sự ổn định của nền tảng với chi phí thấp nhất.',
    startTrial: 'Dùng Thử',
    
    // Long-term Plans
    longtermTitle: 'Tiết Kiệm Hơn với Gói Dài Hạn',
    
    oneMonth: '1 Tháng',
    threeMonths: '3 Tháng',
    sixMonths: '6 Tháng',
    oneYear: '1 Năm',
    
    basic: 'Cơ Bản',
    standard: 'Tiêu Chuẩn',
    advanced: 'Nâng Cao',
    premium: 'Cao Cấp',
    
    orderNow: 'Đặt Mua',
    save: 'Tiết Kiệm',
    onlyFrom: 'Chỉ từ',
    perMonth: '/tháng',
    mostPopular: 'Phổ Biến Nhất',
    
    // Features
    featuresTitle: 'Mọi Thứ Bạn Cần',
    featuresSubtitle: 'Tính năng chuyên nghiệp mở rộng theo tham vọng của bạn',
    
    // Testimonials
    testimonialsTitle: 'Được Tin Tưởng Bởi Các Nhà Sáng Tạo',
    testimonialsSubtitle: 'Câu chuyện thành công thực tế từ cộng đồng của chúng tôi',
    
    // FAQ
    faqTitle: 'Câu Hỏi & Trả Lời',
    faqSubtitle: 'Mọi thứ bạn cần biết về dịch vụ VPS hosting của chúng tôi',
    
    // Final CTA
    finalCtaTitle: 'Tầm Nhìn Của Bạn. Sẵn Sàng Triển Khai.',
    finalCtaSubtitle: 'Tham gia cùng hàng nghìn nhà sáng tạo đã chọn sự hoàn hảo',
    startBuilding: 'Bắt Đầu Ngay',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};