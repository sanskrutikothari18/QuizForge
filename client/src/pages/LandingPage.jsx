import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Grid (6 Core Features) */}
        <FeaturesSection />

        {/* How It Works (5-Step Process) */}
        <HowItWorksSection />

        {/* Flexible Pricing Section */}
        <PricingSection />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Call to Action Section */}
        <CTASection />
      </div>
    </AnimatedPage>
  );
}