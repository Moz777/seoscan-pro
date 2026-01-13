"use client";

import { Zap, DollarSign, Target, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const propositions = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Complete audit in 10 minutes vs 3-7 days with traditional agencies. Get actionable results immediately.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: DollarSign,
    title: "Unbeatable Price",
    description:
      "$49-149 vs $500-2000 agency fees. No monthly subscriptions. Pay once, get your complete professional report.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Target,
    title: "Actionable Insights",
    description:
      "Prioritized recommendations with step-by-step guides. Know exactly what to fix and in what order.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "Your data encrypted and protected. GDPR compliant. We never share your information with third parties.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Why Choose SEOScan Pro?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            We&apos;ve built the most comprehensive and affordable SEO audit tool on
            the market. Here&apos;s what sets us apart.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {propositions.map((prop, index) => (
            <div
              key={prop.title}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                {/* Icon */}
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                    prop.bgColor
                  )}
                >
                  <prop.icon className={cn("h-6 w-6", prop.color)} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {prop.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
