import { Metadata } from "next";
import { Check, X } from "lucide-react";
import { PricingTable, FAQ, CTASection } from "@/components/marketing";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for SEO audits. Pay once, no subscriptions. Choose from Basic ($49), Professional ($99), or Agency ($149) tier.",
};

const allFeatures = [
  { name: "Pages Analyzed", basic: "100", pro: "500", agency: "2000" },
  { name: "PDF Report Pages", basic: "25+", pro: "45+", agency: "60+" },
  { name: "Technical SEO Analysis", basic: true, pro: true, agency: true },
  { name: "Performance Analysis", basic: true, pro: true, agency: true },
  { name: "Content Audit", basic: true, pro: true, agency: true },
  { name: "Core Web Vitals", basic: true, pro: true, agency: true },
  { name: "Mobile Friendliness", basic: true, pro: true, agency: true },
  { name: "Security Analysis", basic: true, pro: true, agency: true },
  { name: "Top Issues Highlighted", basic: "15", pro: "All", agency: "All" },
  { name: "Interactive Dashboard", basic: false, pro: true, agency: true },
  { name: "Competitor Analysis", basic: false, pro: "5 sites", agency: "10 sites" },
  { name: "Advanced Content Audit", basic: false, pro: true, agency: true },
  { name: "Internal Linking Analysis", basic: false, pro: true, agency: true },
  { name: "Structured Data Check", basic: false, pro: true, agency: true },
  { name: "CSV Data Export", basic: false, pro: true, agency: true },
  { name: "Backlink Analysis", basic: false, pro: false, agency: true },
  { name: "Backlink Toxicity Check", basic: false, pro: false, agency: true },
  { name: "White Label Reports", basic: false, pro: false, agency: true },
  { name: "DOCX Export (Editable)", basic: false, pro: false, agency: true },
  { name: "API Access", basic: false, pro: false, agency: true },
  { name: "Re-scans", basic: "None", pro: "1 free after 30 days", agency: "Unlimited (90 days)" },
  { name: "Support Response", basic: "48 hours", pro: "24 hours", agency: "Priority + 30min call" },
  { name: "Report Validity", basic: "30 days", pro: "90 days", agency: "180 days" },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-slate-300 mx-auto" />
    );
  }
  return <span className="text-slate-700 text-sm">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="pt-10">
      {/* Header */}
      <section className="py-16 lg:py-20 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            Choose Your Audit Package
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            One-time payment. No subscriptions. No hidden fees.
            Get professional SEO analysis at a fraction of agency costs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingTable showHeader={false} />

      {/* Detailed Feature Comparison */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Detailed Feature Comparison
            </h2>
            <p className="mt-3 text-slate-600">
              See exactly what&apos;s included in each tier
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900 bg-slate-50 rounded-tl-xl">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 bg-slate-50">
                    Basic
                    <span className="block text-sm font-normal text-slate-500">$49</span>
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-primary bg-primary/5">
                    Professional
                    <span className="block text-sm font-normal text-primary/70">$99</span>
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 bg-slate-50 rounded-tr-xl">
                    Agency
                    <span className="block text-sm font-normal text-slate-500">$149</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={
                      index < allFeatures.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }
                  >
                    <td className="py-3 px-6 text-slate-900 text-sm font-medium">
                      {feature.name}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <FeatureValue value={feature.basic} />
                    </td>
                    <td className="py-3 px-6 text-center bg-primary/5">
                      <FeatureValue value={feature.pro} />
                    </td>
                    <td className="py-3 px-6 text-center">
                      <FeatureValue value={feature.agency} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Money-back guarantee */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              100% Satisfaction Guarantee
            </h3>
            <p className="text-slate-600">
              We&apos;re confident you&apos;ll love your SEO audit. If you&apos;re not completely
              satisfied with your report for any reason, contact us within 7 days
              for a full refund. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
}
