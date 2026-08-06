import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import HeroSection from '../components/landing/HeroSection';
import TrustSection from '../components/landing/TrustSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import LiveDemoSection from '../components/landing/LiveDemoSection';
import WhyChooseSection from '../components/landing/WhyChooseSection';
import PricingSection from '../components/landing/PricingSection';
import ComparisonTableSection from '../components/landing/ComparisonTableSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Hero Section */}
        <HeroSection />

        {/* Trust Stats Bar */}
        <TrustSection />

        {/* Features Grid (15 Features) */}
        <FeaturesSection />

        {/* How It Works (5 Step Timeline) */}
        <HowItWorksSection />

        {/* Live Interactive Demo Preview */}
        <LiveDemoSection />

        {/* Why Choose QuizForge */}
        <WhyChooseSection />

        {/* Pricing Section (Free, Pro, Enterprise with Monthly/Yearly toggle) */}
        <PricingSection />

        {/* Detailed Feature Comparison Table */}
        <ComparisonTableSection />

        {/* Community Testimonials & Reviews */}
        <TestimonialsSection />

        {/* Frequently Asked Questions Accordion */}
        <FAQSection />

        {/* Call to Action Section */}
        <CTASection />
      </div>
    </AnimatedPage>
  );
}