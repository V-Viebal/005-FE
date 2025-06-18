import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import Plans from './components/Plans';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

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