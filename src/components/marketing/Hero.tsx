"use client";

import Link from "next/link";
import { ArrowRight, Download, Check, Zap, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const trustLogos = [
  "Shopify",
  "WordPress",
  "Wix",
  "Squarespace",
  "Webflow",
];

const stats = [
  { value: "2,500+", label: "Businesses Trusted" },
  { value: "10,000+", label: "Audits Completed" },
  { value: "4.9/5", label: "Customer Rating" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <Badge
                variant="secondary"
                className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Zap className="mr-1 h-3 w-3" />
                Launch Special: 25% Off First Audit
              </Badge>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Professional SEO Audit in{" "}
                <span className="text-gradient-primary bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                  10 Minutes
                </span>
                , Not 7 Days
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0">
                Get comprehensive technical SEO analysis for{" "}
                <span className="text-white font-semibold">$49-149</span>.
                No monthly subscription. Pay once, own forever.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="gradient-primary text-white border-0 h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <Link href="/new-audit">
                    Audit My Website Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/sample-reports">
                    <Download className="mr-2 h-5 w-5" />
                    See Sample Report
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Results in 10 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Visual */}
            <div className="relative hidden lg:block">
              {/* Floating dashboard mockup */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-sm text-slate-500">
                    seoscanpro.com/dashboard
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="p-6 space-y-4">
                  {/* Score Gauge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">SEO Health Score</p>
                      <p className="text-3xl font-bold text-slate-900">72/100</p>
                    </div>
                    <div className="w-20 h-20 rounded-full border-8 border-yellow-400 flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-900">72</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Issues", value: "27", color: "text-red-500" },
                      { label: "Warnings", value: "45", color: "text-yellow-500" },
                      { label: "Passed", value: "428", color: "text-green-500" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-slate-50 rounded-lg p-3 text-center"
                      >
                        <p className={`text-xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Issue Preview */}
                  <div className="space-y-2">
                    {[
                      { severity: "critical", title: "Missing alt text on 156 images" },
                      { severity: "warning", title: "24 pages with duplicate titles" },
                      { severity: "info", title: "Enable browser caching" },
                    ].map((issue, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded bg-slate-50"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            issue.severity === "critical"
                              ? "bg-red-500"
                              : issue.severity === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="text-sm text-slate-700 truncate">
                          {issue.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-float">
                <Target className="inline mr-1 h-4 w-4" />
                500+ Checks
              </div>
            </div>
          </div>

          {/* Trust Bar */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-6">
                Trusted by businesses using these platforms
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                {trustLogos.map((logo) => (
                  <div
                    key={logo}
                    className="text-slate-500 font-semibold text-lg opacity-50 hover:opacity-75 transition-opacity"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
