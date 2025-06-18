import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import {
  Header,
  Hero,
  ValueProposition,
  Plans,
  Features,
  Testimonials,
  FAQ,
  FinalCTA,
  Footer,
} from '@/components';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <Header />
        <Hero />
        <ValueProposition />
        <Plans />
        <Features />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;