"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the automated audit?",
    answer:
      "Our audit uses the same techniques professional SEO agencies use, including Google's PageSpeed Insights API, comprehensive crawling technology, and GPT-4 powered analysis. We perform 500+ checks covering technical SEO, performance, content, and more. The accuracy is comparable to manual agency audits, but delivered in minutes instead of days.",
  },
  {
    question: "What makes this different from free SEO tools?",
    answer:
      "Free tools typically check only basic issues and analyze a single page at a time. SEOScan Pro crawls your entire site (up to 2000 pages), provides competitor analysis, generates professional PDF reports, offers prioritized action plans with AI-powered recommendations, and includes features like white-label reports for agencies.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes! We offer a 100% satisfaction guarantee. If you're not happy with your audit for any reason, contact us within 7 days of purchase for a full refund. No questions asked.",
  },
  {
    question: "How long does the audit take?",
    answer:
      "Most audits complete within 10-15 minutes, depending on your site size and the tier you choose. Basic audits (up to 100 pages) are typically faster, while Agency audits (up to 2000 pages) may take slightly longer. You'll receive an email notification when your report is ready.",
  },
  {
    question: "Do you store my website data?",
    answer:
      "We take privacy seriously. Your website data is only used to generate your audit report and is encrypted at rest. We never share your data with third parties. Reports are stored securely and accessible only to you. You can request data deletion at any time.",
  },
  {
    question: "Can I audit competitor websites?",
    answer:
      "You can analyze competitor websites as part of the competitive analysis feature in Professional and Agency tiers. However, detailed audits of sites you don't own require the site owner's permission. The competitive analysis provides domain authority, estimated traffic, keyword rankings, and content gap analysis.",
  },
  {
    question: "Is this suitable for large enterprise sites?",
    answer:
      "Yes! Our Agency tier supports up to 2000 pages per audit, which covers most enterprise sites. For larger sites, you can run multiple audits on different sections. We also offer custom enterprise solutions for sites with 10,000+ pages - contact our sales team for details.",
  },
  {
    question: "What if my site is password-protected?",
    answer:
      "Currently, we can only audit publicly accessible pages. If your site requires authentication, you'll need to temporarily allow public access or whitelist our crawler IP addresses. Contact support for assistance with staging environment audits.",
  },
  {
    question: "Do you offer agency/reseller programs?",
    answer:
      "Yes! We offer volume discounts and partnership opportunities for agencies who run multiple audits per month. Agency tier includes white-label reports with your branding. Contact us for custom pricing on 10+ audits per month.",
  },
  {
    question: "Can I integrate with Google Search Console?",
    answer:
      "Yes! You can connect your Google Search Console account to enhance your audit with real search data including actual keyword rankings, click-through rates, and impression data. This integration is optional but recommended for more accurate insights.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border border-slate-200 px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            Still have questions?{" "}
            <a
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
