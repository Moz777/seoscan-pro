"use client";

import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonData = [
  {
    feature: "Price",
    agency: "$800-2000",
    monthlyTool: "$99-399/mo",
    seoscanpro: "$49-149 one-time",
    highlight: true,
  },
  {
    feature: "Time to Results",
    agency: "3-7 days",
    monthlyTool: "Instant (limited)",
    seoscanpro: "10 minutes",
    highlight: true,
  },
  {
    feature: "Audit Depth",
    agency: "Comprehensive",
    monthlyTool: "Varies",
    seoscanpro: "Comprehensive",
    highlight: false,
  },
  {
    feature: "Pages Analyzed",
    agency: "Unlimited",
    monthlyTool: "Limited",
    seoscanpro: "Up to 2000",
    highlight: false,
  },
  {
    feature: "PDF Report",
    agency: true,
    monthlyTool: false,
    seoscanpro: true,
    highlight: false,
  },
  {
    feature: "White Label",
    agency: "Extra cost",
    monthlyTool: "Enterprise only",
    seoscanpro: "Included (Agency)",
    highlight: true,
  },
  {
    feature: "Re-scans",
    agency: "Charged",
    monthlyTool: "Included",
    seoscanpro: "Unlimited (90 days)",
    highlight: true,
  },
  {
    feature: "Support",
    agency: "Email",
    monthlyTool: "Chat",
    seoscanpro: "Priority + Call",
    highlight: false,
  },
  {
    feature: "Competitor Analysis",
    agency: true,
    monthlyTool: "Limited",
    seoscanpro: "Up to 10 sites",
    highlight: false,
  },
];

function renderValue(value: string | boolean) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-red-400 mx-auto" />
    );
  }
  return value;
}

export function ComparisonTable() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Why Choose SEOScan Pro?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            See how we compare to traditional agencies and monthly subscription tools.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Feature
                </th>
                <th className="text-center py-4 px-4 font-semibold text-slate-500">
                  Traditional Agency
                </th>
                <th className="text-center py-4 px-4 font-semibold text-slate-500">
                  Monthly Tools
                </th>
                <th className="text-center py-4 px-4">
                  <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                    SEOScan Pro
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={row.feature}
                  className={cn(
                    "border-b border-slate-100",
                    row.highlight && "bg-green-50/50"
                  )}
                >
                  <td className="py-4 px-4 font-medium text-slate-900">
                    {row.feature}
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    {renderValue(row.agency)}
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    {renderValue(row.monthlyTool)}
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-primary">
                    {renderValue(row.seoscanpro)}
                    {row.highlight && (
                      <Check className="inline-block ml-1 h-4 w-4 text-green-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-sm text-slate-500">
          * Comparison based on average market rates and features as of 2024
        </p>
      </div>
    </section>
  );
}
