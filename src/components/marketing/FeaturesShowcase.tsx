"use client";

import {
  Search,
  Zap,
  FileText,
  Link2,
  Trophy,
  LineChart,
  Target,
  FileDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Search,
    title: "Deep Technical Crawl",
    description:
      "Analyze up to 2000 pages. Find hidden issues that automated tools miss. Complete site structure analysis.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Performance Analysis",
    description:
      "Core Web Vitals, page speed scores, mobile optimization, resource loading, and caching analysis.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    icon: FileText,
    title: "Content Audit",
    description:
      "Meta tags, headings structure, duplicate content detection, thin pages, and readability scores.",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Link2,
    title: "Internal Linking",
    description:
      "Link structure analysis, orphan pages detection, crawl depth optimization, and anchor text review.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Trophy,
    title: "Competitor Analysis",
    description:
      "Compare against top competitors. Find content gaps, keyword opportunities, and backlink strategies.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: LineChart,
    title: "Backlink Profile",
    description:
      "Domain authority, toxicity detection, lost links tracking, and anchor text distribution analysis.",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Target,
    title: "Prioritized Actions",
    description:
      "Impact vs effort matrix. Quick wins highlighted. Step-by-step implementation guides for each issue.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    icon: FileDown,
    title: "White Label Reports",
    description:
      "Add your logo, brand colors, and custom footer. Perfect for agencies serving clients.",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    icon: RefreshCw,
    title: "Progress Tracking",
    description:
      "Re-scan after fixes to track improvements. Compare scores over time. Measure your SEO progress.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
  },
];

export function FeaturesShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Everything You Need for SEO Success
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Comprehensive analysis covering every aspect of technical SEO.
            No stone left unturned.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={cn(
                  "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("h-6 w-6", feature.color)} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
