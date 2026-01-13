import { NextRequest, NextResponse } from "next/server";
import { getAudit, deleteAudit } from "@/lib/services/audit-store";

interface RouteParams {
  params: Promise<{ auditId: string }>;
}

// GET /api/audits/[auditId] - Get audit details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { auditId } = await params;
    const audit = getAudit(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

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

// DELETE /api/audits/[auditId] - Delete an audit
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { auditId } = await params;
    const deleted = deleteAudit(auditId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Audit deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
