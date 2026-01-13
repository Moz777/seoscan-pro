"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Download,
  RefreshCw,
  Settings,
  Link2,
  HelpCircle,
} from "lucide-react";

const actions = [
  {
    title: "New Audit",
    description: "Start a new SEO audit",
    icon: PlusCircle,
    href: "/new-audit",
    variant: "default" as const,
  },
  {
    title: "Re-scan Site",
    description: "Update an existing audit",
    icon: RefreshCw,
    href: "/audits",
    variant: "outline" as const,
  },
  {
    title: "Download Reports",
    description: "Export your reports",
    icon: Download,
    href: "/audits",
    variant: "outline" as const,
  },
  {
    title: "Integrations",
    description: "Connect your tools",
    icon: Link2,
    href: "/settings/integrations",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto py-4 px-4 flex flex-col items-start gap-1"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground">
                {action.description}
              </span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
