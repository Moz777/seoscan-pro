"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Issue } from "@/lib/types";

interface IssuesTableProps {
  issues: Issue[];
  title?: string;
  showCategory?: boolean;
}

const impactConfig = {
  critical: {
    label: "Critical",
    icon: <AlertCircle className="h-4 w-4" />,
    className: "bg-red-100 text-red-800 border-red-200",
  },
  high: {
    label: "High",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  medium: {
    label: "Medium",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: {
    label: "Low",
    icon: <Info className="h-4 w-4" />,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

const effortLabels = {
  quick: "Quick Fix",
  medium: "Medium Effort",
  complex: "Complex",
};

const categoryLabels = {
  technical: "Technical",
  performance: "Performance",
  content: "Content",
  security: "Security",
};

export function IssuesTable({
  issues,
  title = "Issues",
  showCategory = true,
}: IssuesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Sort by impact priority
  const sortedIssues = [...issues].sort((a, b) => {
    const priority = { critical: 0, high: 1, medium: 2, low: 3 };
    return priority[a.impact] - priority[b.impact];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline">{issues.length} issues</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedIssues.map((issue) => {
            const impact = impactConfig[issue.impact];
            const isExpanded = expandedId === issue.id;

            return (
              <div key={issue.id} className="p-4 hover:bg-muted/50">
                <button
                  onClick={() => toggleExpand(issue.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="outline"
                          className={cn("gap-1", impact.className)}
                        >
                          {impact.icon}
                          {impact.label}
                        </Badge>
                        {showCategory && (
                          <Badge variant="secondary" className="text-xs">
                            {categoryLabels[issue.category]}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {effortLabels[issue.effort]}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {issue.affectedPages}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          pages
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-1">
                        Recommendation
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {issue.recommendation}
                      </p>
                    </div>

                    {issue.exampleUrls.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">
                          Example URLs
                        </h5>
                        <div className="space-y-1">
                          {issue.exampleUrls.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              {url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
