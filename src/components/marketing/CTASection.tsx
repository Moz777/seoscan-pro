"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "No credit card required",
  "Results in 10 minutes",
  "100% satisfaction guarantee",
];

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gradient-hero" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative py-16 lg:py-24 px-8 lg:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto">
              Ready to Fix Your SEO Issues?
            </h2>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              Join 2,500+ businesses who improved their search rankings with SEOScan
              Pro. Get your comprehensive audit today.
            </p>

            {/* CTA Button */}
            <div className="mt-10">
              <Button
                size="lg"
                asChild
                className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 text-lg font-semibold shadow-xl"
              >
                <Link href="/new-audit">
                  Audit My Website - Starting at $49
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-slate-300"
                >
                  <Check className="h-5 w-5 text-green-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
