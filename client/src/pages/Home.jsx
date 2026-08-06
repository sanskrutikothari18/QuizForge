import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import PricingComparison from '../components/PricingComparison';
import FAQ from '../components/FAQ';

export default function Home() {
  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Glow Spheres for Background Ambient Aesthetics */}
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-glow-primary pointer-events-none opacity-50 blur-3xl" />
        <div className="absolute bottom-[20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-glow-secondary pointer-events-none opacity-40 blur-3xl" />

        {/* Home Sections */}
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <PricingComparison />
        <FAQ />
      </div>
    </AnimatedPage>
  );
}
