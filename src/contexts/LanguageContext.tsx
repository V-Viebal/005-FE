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

    enterpriseSecurity: 'Enterprise Security',
    enterpriseSecurityDesc: 'Advanced DDoS protection, firewall, and regular security updates.',
    instantDeployment: 'Instant Deployment',
    instantDeploymentDesc: 'Your VPS is ready in under 60 seconds with automated provisioning.',
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
    fullStackDeveloper: 'Full Stack Developer',
    devopsEngineer: 'DevOps Engineer',
    productManager: 'Product Manager',
    cloudscaleSolutions: 'CloudScale Solutions',
    innovationLabs: 'Innovation Labs',
    testimonial1: 'ArchitectVPS has been a game-changer for our startup. The performance is incredible, and the support team actually knows what they\'re talking about. We\'ve been running our production apps here for 8 months without a single issue.',
    testimonial2: 'I\'ve worked with dozens of hosting providers, and ArchitectVPS stands out. The network performance is consistently excellent, and their infrastructure is clearly built by people who understand modern development workflows.',
    testimonial3: 'What impressed me most is how quickly we could scale. When our app went viral, ArchitectVPS handled the traffic surge flawlessly. The peace of mind is worth every penny.',

    // FAQ
    faqTitle: 'Questions & Answers',
    faqSubtitle: 'Everything you need to know about our VPS hosting',
    faqQuestion1: 'What makes ArchitectVPS different from other VPS providers?',
    faqAnswer1: 'We focus on performance, reliability, and developer experience. Our infrastructure is built specifically for modern applications with SSD storage, premium network connectivity, and instant provisioning.',
    faqQuestion2: 'How quickly can I get my VPS up and running?',
    faqAnswer2: 'Your VPS is provisioned instantly after payment confirmation. You\'ll receive your login credentials within minutes and can start deploying immediately.',
    faqQuestion3: 'Do you offer technical support?',
    faqAnswer3: 'Yes! We provide 24/7 technical support via live chat and email. Our team consists of experienced system administrators who can help with server configuration, troubleshooting, and optimization.',
    faqQuestion4: 'Can I upgrade or downgrade my plan anytime?',
    faqAnswer4: 'Absolutely! You can scale your resources up or down at any time through our control panel. Upgrades are instant, and downgrades take effect at your next billing cycle.',
    faqQuestion5: 'What payment methods do you accept?',
    faqAnswer5: 'We accept all major credit cards, PayPal, and cryptocurrency payments. All transactions are secured with industry-standard encryption.',
    faqQuestion6: 'Is there a money-back guarantee?',
    faqAnswer6: 'Yes, we offer a 30-day money-back guarantee. If you\'re not completely satisfied with our service, we\'ll refund your payment in full.',

    // Final CTA
    finalCtaTitle: 'Your Vision. Deployed.',
    finalCtaSubtitle: 'Join thousands of creators who chose excellence',
    startBuilding: 'Start Building Now',

    // Features - Individual Feature Titles
    enterpriseHardware: 'Enterprise Hardware',
    enterpriseHardwareDesc: 'Latest Intel Xeon processors with NVMe SSD storage for maximum performance.',
    advancedSecurity: 'Advanced Security',
    advancedSecurityDesc: 'DDoS protection, firewall management, and automated security updates.',
    lightningFast: 'Lightning Fast',
    lightningFastDesc: 'Optimized network routes and premium bandwidth for blazing-fast speeds.',
    globalNetwork: 'Global Network',
    globalNetworkDesc: 'Strategic data center locations for optimal performance worldwide.',
    expertSupport: 'Expert Support',
    expertSupportDesc: 'Real human experts available 24/7 to help you succeed.',
    fullControl: 'Full Control',
    fullControlDesc: 'Complete root access with your choice of operating system and software.',

    // Footer Links
    quickLinks: 'Quick Links',
    support: 'Support',
    legal: 'Legal',
    pricing: 'Pricing',
    api: 'API',
    status: 'Status',
    contactUs: 'Contact Us',
    community: 'Community',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    gdpr: 'GDPR',
    apiReference: 'API Reference',
    tutorials: 'Tutorials',
    reportIssue: 'Report Issue',
    documentation: 'Documentation',
    helpCenter: 'Help Center',
    systemStatus: 'System Status',
    termsOfService: 'Terms of Service',

    // Plan Features
    dedicatedIpv4: 'Dedicated IPv4',
    uptimeGuarantee: '99.9% Uptime',
    support247: '24/7 Support',
    instantSetup: 'Instant Setup',
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
    valueTitle: 'Tại Sao Chọn ArchitectVPS?',
    valueSubtitle: 'Nền tảng của sự xuất sắc bắt đầu từ cơ sở hạ tầng không thỏa hiệp',

    enterpriseSecurity: 'Bảo Mật Doanh Nghiệp',
    enterpriseSecurityDesc: 'Bảo vệ DDoS tiên tiến, tường lửa và cập nhật bảo mật thường xuyên.',
    instantDeployment: 'Triển Khai Tức Thì',
    instantDeploymentDesc: 'VPS của bạn sẵn sàng trong vòng dưới 60 giây với cung cấp tự động.',
    unleashData: 'Giải Phóng Dữ Liệu Của Bạn',
    unleashDataDesc: 'Cổng ~600Mbps với băng thông thực sự không giới hạn. Không có giới hạn, không điều chỉnh, không bất ngờ.',
    digitalIdentity: 'Danh Tính Số Của Bạn',
    digitalIdentityDesc: 'Nhận địa chỉ IPv4 chuyên dụng chỉ dành riêng cho bạn, hoàn hảo cho hosting và phát triển.',
    instantActivation: 'Kích Hoạt Tức Thì',
    instantActivationDesc: 'Từ thanh toán đến triển khai trong vòng dưới 60 giây. Không chờ đợi, không trì hoãn.',
    alwaysOnExpertise: 'Chuyên Môn Luôn Sẵn Sàng',
    alwaysOnExpertiseDesc: 'Hỗ trợ 24/7 từ các quản trị viên hệ thống thực sự hiểu nhu cầu kỹ thuật của bạn.',

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
    fullStackDeveloper: 'Lập Trình Viên Full Stack',
    devopsEngineer: 'Kỹ Sư DevOps',
    productManager: 'Quản Lý Sản Phẩm',
    cloudscaleSolutions: 'CloudScale Solutions',
    innovationLabs: 'Innovation Labs',
    testimonial1: 'ArchitectVPS đã thay đổi hoàn toàn startup của chúng tôi. Hiệu suất đáng kinh ngạc và đội ngũ hỗ trợ thực sự hiểu những gì họ đang nói. Chúng tôi đã chạy các ứng dụng production ở đây trong 8 tháng mà không gặp một sự cố nào.',
    testimonial2: 'Tôi đã làm việc với hàng chục nhà cung cấp hosting, và ArchitectVPS nổi bật. Hiệu suất mạng luôn xuất sắc, và cơ sở hạ tầng của họ rõ ràng được xây dựng bởi những người hiểu quy trình phát triển hiện đại.',
    testimonial3: 'Điều ấn tượng nhất với tôi là tốc độ mở rộng nhanh chóng. Khi ứng dụng của chúng tôi viral, ArchitectVPS xử lý lưu lượng tăng đột biến một cách hoàn hảo. Sự an tâm này đáng giá từng xu.',

    // FAQ
    faqTitle: 'Câu Hỏi Thường Gặp',
    faqSubtitle: 'Mọi thứ bạn cần biết về dịch vụ VPS hosting của chúng tôi',
    faqQuestion1: 'Điều gì làm cho ArchitectVPS khác biệt so với các nhà cung cấp VPS khác?',
    faqAnswer1: 'Chúng tôi tập trung vào hiệu suất, độ tin cậy và trải nghiệm của nhà phát triển. Cơ sở hạ tầng của chúng tôi được xây dựng đặc biệt cho các ứng dụng hiện đại với lưu trữ SSD, kết nối mạng cao cấp và cung cấp tức thì.',
    faqQuestion2: 'Tôi có thể khởi chạy VPS của mình nhanh như thế nào?',
    faqAnswer2: 'VPS của bạn được cung cấp ngay lập tức sau khi xác nhận thanh toán. Bạn sẽ nhận được thông tin đăng nhập trong vòng vài phút và có thể bắt đầu triển khai ngay lập tức.',
    faqQuestion3: 'Bạn có cung cấp hỗ trợ kỹ thuật không?',
    faqAnswer3: 'Có! Chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua chat trực tuyến và email. Đội ngũ của chúng tôi bao gồm các quản trị viên hệ thống có kinh nghiệm có thể giúp cấu hình máy chủ, khắc phục sự cố và tối ưu hóa.',
    faqQuestion4: 'Tôi có thể nâng cấp hoặc hạ cấp gói của mình bất cứ lúc nào không?',
    faqAnswer4: 'Hoàn toàn có thể! Bạn có thể mở rộng tài nguyên lên hoặc xuống bất cứ lúc nào thông qua bảng điều khiển của chúng tôi. Nâng cấp là tức thì, và hạ cấp có hiệu lực vào chu kỳ thanh toán tiếp theo của bạn.',
    faqQuestion5: 'Bạn chấp nhận những phương thức thanh toán nào?',
    faqAnswer5: 'Chúng tôi chấp nhận tất cả các thẻ tín dụng chính, PayPal và thanh toán bằng tiền điện tử. Tất cả các giao dịch được bảo mật với mã hóa tiêu chuẩn ngành.',
    faqQuestion6: 'Có bảo đảm hoàn tiền không?',
    faqAnswer6: 'Có, chúng tôi cung cấp bảo đảm hoàn tiền trong 30 ngày. Nếu bạn không hoàn toàn hài lòng với dịch vụ của chúng tôi, chúng tôi sẽ hoàn lại toàn bộ khoản thanh toán của bạn.',

    // Final CTA
    finalCtaTitle: 'Tầm Nhìn Của Bạn. Sẵn Sàng Triển Khai.',
    finalCtaSubtitle: 'Tham gia cùng hàng nghìn nhà sáng tạo đã chọn sự hoàn hảo',
    startBuilding: 'Bắt Đầu Ngay',

    // Features - Individual Feature Titles
    enterpriseHardware: 'Phần Cứng Doanh Nghiệp',
    enterpriseHardwareDesc: 'Bộ xử lý Intel Xeon mới nhất với ổ cứng NVMe SSD cho hiệu suất tối đa.',
    advancedSecurity: 'Bảo Mật Nâng Cao',
    advancedSecurityDesc: 'Bảo vệ DDoS, quản lý tường lửa và cập nhật bảo mật tự động.',
    lightningFast: 'Tốc Độ Chớp Nhoáng',
    lightningFastDesc: 'Tuyến mạng được tối ưu hóa và băng thông cao cấp cho tốc độ cực nhanh.',
    globalNetwork: 'Mạng Lưới Toàn Cầu',
    globalNetworkDesc: 'Các vị trí trung tâm dữ liệu chiến lược cho hiệu suất tối ưu trên toàn thế giới.',
    expertSupport: 'Hỗ Trợ Chuyên Gia',
    expertSupportDesc: 'Các chuyên gia thực sự luôn sẵn sàng 24/7 để giúp bạn thành công.',
    fullControl: 'Toàn Quyền Kiểm Soát',
    fullControlDesc: 'Quyền truy cập root hoàn toàn với lựa chọn hệ điều hành và phần mềm của bạn.',

    // Footer Links
    quickLinks: 'Liên Kết Nhanh',
    support: 'Hỗ Trợ',
    legal: 'Pháp Lý',
    pricing: 'Bảng Giá',
    api: 'API',
    status: 'Trạng Thái',
    contactUs: 'Liên Hệ',
    community: 'Cộng Đồng',
    privacyPolicy: 'Chính Sách Bảo Mật',
    cookiePolicy: 'Chính Sách Cookie',
    gdpr: 'GDPR',
    apiReference: 'Tài Liệu API',
    tutorials: 'Hướng Dẫn',
    reportIssue: 'Báo Cáo Sự Cố',
    documentation: 'Tài Liệu',
    helpCenter: 'Trung Tâm Trợ Giúp',
    systemStatus: 'Trạng Thái Hệ Thống',
    termsOfService: 'Điều Khoản Dịch Vụ',

    // Plan Features
    dedicatedIpv4: 'IPv4 Riêng',
    uptimeGuarantee: 'Cam Kết 99.9% Uptime',
    support247: 'Hỗ Trợ 24/7',
    instantSetup: 'Thiết Lập Tức Thì',
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
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
