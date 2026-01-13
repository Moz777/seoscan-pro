import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Check } from "lucide-react";

const features = [
  "No credit card required",
  "Instant access",
  "Results in 10 minutes",
  "GDPR compliant",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <Logo size="lg" />
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center gradient-hero relative overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6">
              Professional SEO Audits at Your Fingertips
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join 2,500+ businesses who improved their search rankings with
              SEOScan Pro. Get comprehensive analysis in minutes, not days.
            </p>

            {/* Features */}
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-white">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-slate-200">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial */}
            <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
              <p className="text-slate-300 italic mb-4">
                &quot;SEOScan Pro helped us identify critical issues we missed for
                months. Our organic traffic increased 40% after implementing
                their recommendations.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  SJ
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sarah Johnson</p>
                  <p className="text-slate-400 text-xs">Marketing Director, TechStart Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
