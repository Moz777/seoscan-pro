import { Metadata } from "next";
import { AuditWizard } from "@/components/audit/AuditWizard";

export const metadata: Metadata = {
  title: "New Audit",
  description: "Start a new SEO audit for your website.",
};

export default function NewAuditPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">New SEO Audit</h1>
        <p className="text-muted-foreground">
          Enter your website details to get a comprehensive SEO analysis.
        </p>
      </div>
      <AuditWizard />
    </div>
  );
}
