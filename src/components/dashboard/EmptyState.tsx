"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSearch, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No audits yet",
  description = "Run your first SEO audit to see how your website is performing. Get detailed insights and actionable recommendations in minutes.",
  actionLabel = "Start Your First Audit",
  actionHref = "/new-audit",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
        <FileSearch className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <Button asChild>
        <Link href={actionHref} className="flex items-center gap-2">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
