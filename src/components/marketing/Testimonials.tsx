"use client";

import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "SEOScan Pro saved us thousands compared to hiring an agency. The report was comprehensive, actionable, and helped us improve our rankings within weeks.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechStart Inc.",
    avatar: "/testimonials/sarah.jpg",
    rating: 5,
  },
  {
    quote:
      "As a freelance SEO consultant, this tool is invaluable. I use the white label reports for all my clients. Professional quality at an unbeatable price.",
    author: "Michael Chen",
    role: "SEO Consultant",
    company: "Digital Growth Agency",
    avatar: "/testimonials/michael.jpg",
    rating: 5,
  },
  {
    quote:
      "Found critical issues our developer missed. The prioritized action plan made it easy to know what to fix first. Our organic traffic increased 40% after implementing the recommendations.",
    author: "Emma Williams",
    role: "E-commerce Owner",
    company: "StyleBoutique",
    avatar: "/testimonials/emma.jpg",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Trusted by SEO Professionals
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Join thousands of businesses who improved their SEO with our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-slate-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Quote className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 text-sm leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback className="bg-primary text-white">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-16 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "2,500+", label: "Happy Customers" },
              { value: "10,000+", label: "Audits Completed" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "40%", label: "Avg Traffic Increase" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
