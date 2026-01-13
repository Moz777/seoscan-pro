import {
  Hero,
  ValueProposition,
  ComparisonTable,
  HowItWorks,
  FeaturesShowcase,
  PricingTable,
  Testimonials,
  FAQ,
  CTASection,
} from "@/components/marketing";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Value Proposition */}
      <ValueProposition />

      {/* Comparison Table */}
      <ComparisonTable />

      {/* How It Works */}
      <HowItWorks />

      {/* Features Showcase */}
      <FeaturesShowcase />

      {/* Pricing */}
      <PricingTable />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <CTASection />
    </>
  );
}
