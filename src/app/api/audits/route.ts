import { NextRequest, NextResponse } from "next/server";
import { createAudit, getAllAudits } from "@/lib/services/audit-store";
import { AuditTier } from "@/lib/types";

// GET /api/audits - List all audits
export async function GET(request: NextRequest) {
  try {
    const audits = getAllAudits();

    // Sort by createdAt descending
    audits.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({
      success: true,
      data: audits,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/audits - Create a new audit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.websiteUrl) {
      return NextResponse.json(
        { success: false, error: "Website URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(body.websiteUrl);
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid website URL" },
        { status: 400 }
      );
    }

    // Validate tier
    const validTiers: AuditTier[] = ["basic", "professional", "agency"];
    const tier = body.tier || "basic";
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { success: false, error: "Invalid tier" },
        { status: 400 }
      );
    }

    // Create the audit
    const audit = createAudit({
      websiteUrl: url.href,
      displayName: body.displayName || url.hostname,
      tier,
      userId: body.userId,
    });

    return NextResponse.json({
      success: true,
      data: audit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
