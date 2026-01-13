"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiers = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    description: "Perfect for small websites and quick checks",
    badge: "Best for Small Sites",
    highlighted: false,
    features: [
      "Up to 100 pages analyzed",
      "Technical & performance audit",
      "Content analysis",
      "25+ page PDF report",
      "Top 15 issues highlighted",
      "Action checklist",
      "Email support (48h)",
      "Report valid 30 days",
    ],
    cta: "Start Basic Audit",
    href: "/new-audit?tier=basic",
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "Most popular choice for growing businesses",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Up to 500 pages analyzed",
      "Everything in Basic +",
      "Competitor analysis (5 sites)",
      "Advanced content audit",
      "Interactive dashboard",
      "45+ page PDF report",
      "CSV data export",
      "Free re-scan after 30 days",
      "Priority support (24h)",
      "Report valid 90 days",
    ],
    cta: "Start Pro Audit",
    href: "/new-audit?tier=professional",
  },
  {
    id: "agency",
    name: "Agency",
    price: 149,
    description: "Enterprise features for SEO professionals",
    badge: "Best Value",
    highlighted: false,
    features: [
      "Up to 2000 pages analyzed",
      "Everything in Professional +",
      "Competitor analysis (10 sites)",
      "Backlink audit & toxicity",
      "White label reports",
      "DOCX export (editable)",
      "API access",
      "Unlimited re-scans (90 days)",
      "30min strategy call",
      "Report valid 180 days",
    ],
    cta: "Start Agency Audit",
    href: "/new-audit?tier=agency",
  },
];

interface PricingTableProps {
  showHeader?: boolean;
}

export function PricingTable({ showHeader = true }: PricingTableProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Choose Your Audit Package
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              One-time payment. No subscriptions. No hidden fees.
              Get your professional SEO audit today.
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-300",
                tier.highlighted
                  ? "bg-slate-900 text-white shadow-2xl scale-[1.02] lg:scale-105"
                  : "bg-white border border-slate-200 shadow-sm hover:shadow-lg"
              )}
            >
              {/* Badge */}
              <Badge
                className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2",
                  tier.highlighted
                    ? "bg-orange-500 text-white border-0"
                    : "bg-slate-100 text-slate-700"
                )}
              >
                {tier.badge}
              </Badge>

              {/* Header */}
              <div className="text-center mb-6 pt-4">
                <h3
                  className={cn(
                    "text-xl font-semibold",
                    tier.highlighted ? "text-white" : "text-slate-900"
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    tier.highlighted ? "text-slate-300" : "text-slate-500"
                  )}
                >
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span
                  className={cn(
                    "text-5xl font-bold",
                    tier.highlighted ? "text-white" : "text-slate-900"
                  )}
                >
                  ${tier.price}
                </span>
                <span
                  className={cn(
                    "text-sm ml-1",
                    tier.highlighted ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  / one-time
                </span>
              </div>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className={cn(
                  "w-full mb-8",
                  tier.highlighted
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "gradient-primary text-white border-0"
                )}
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>

              {/* Features */}
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "h-5 w-5 flex-shrink-0 mt-0.5",
                        tier.highlighted ? "text-green-400" : "text-green-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        tier.highlighted ? "text-slate-300" : "text-slate-600"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <svg
              className="h-5 w-5"
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
            100% Satisfaction Guarantee - Full refund within 7 days if not satisfied
          </div>
        </div>
      </div>
    </section>
  );
}
