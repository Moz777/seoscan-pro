"use client";

import { Globe, Search, Brain, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Globe,
    title: "Enter Your Website URL",
    description:
      "Just paste your URL and select audit tier. We'll handle the rest. No setup or configuration required.",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    number: "02",
    icon: Search,
    title: "We Scan Everything",
    description:
      "Our crawler analyzes up to 2000 pages. 500+ checks across technical, performance, content & competition.",
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  {
    number: "03",
    icon: Brain,
    title: "AI Analyzes Results",
    description:
      "GPT-4 powered insights identify critical issues & opportunities. Smart prioritization based on impact.",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
  },
  {
    number: "04",
    icon: FileText,
    title: "Get Your Report",
    description:
      "Download professional PDF, share with team, implement changes. Everything in one comprehensive report.",
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Get your professional SEO audit in four simple steps.
            From URL to actionable insights in under 10 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-[10%] right-[10%] h-0.5 bg-slate-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="text-center">
                  {/* Number & Icon */}
                  <div className="relative inline-flex flex-col items-center">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10",
                        step.bgColor
                      )}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:flex lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <svg
                      className="w-6 h-6 text-slate-300 rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Ready to see what&apos;s holding your website back?
          </p>
          <a
            href="/new-audit"
            className="inline-flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Your Audit Now
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
