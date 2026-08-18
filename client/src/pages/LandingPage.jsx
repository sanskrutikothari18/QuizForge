import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import HeroSection from '../components/landing/HeroSection';
import LiveDemoSection from '../components/landing/LiveDemoSection';
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

        {/* Interactive Mini Quiz Product Demo */}
        <LiveDemoSection />

        {/* How It Works (4-Step Process) */}
        <HowItWorksSection />

        {/* Features Grid */}
        <FeaturesSection />

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