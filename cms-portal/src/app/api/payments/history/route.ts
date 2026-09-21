import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: {
        department: true,
        associationMembers: { include: { association: true } },
      },
    });

    if (!student) {
      return NextResponse.json({
        payments: [],
        feeBreakdown: [],
      });
    }

    // Get student's payments
    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      include: {
        receipt: true,
        feeStructure: true,
        associationDues: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get current session fee structures (College dues)
    const collegeFees = await prisma.feeStructure.findMany({
      where: { isActive: true },
    });

    // Get association dues for student's association(s)
    const studentAssocIds = student.associationMembers.map(
      (m) => m.associationId,
    );
    const assocFees = await prisma.associationDues.findMany({
      where: {
        associationId: { in: studentAssocIds },
        isActive: true,
      },
      include: { association: true },
    });

    // Check payment status for each fee item
    const successfulPaymentFeeIds = new Set(
      payments
        .filter((p) => p.status === "SUCCESSFUL")
        .flatMap((p) => [p.feeStructureId, p.associationDuesId])
        .filter(Boolean),
    );

    const feeBreakdown = [
      ...collegeFees.map((f) => ({
        id: f.id,
        type: "COLLEGE_DUE" as const,
        label: f.label,
        amount: f.amountKobo,
        session: f.session,
        paymentLink: f.paymentLink || null,
        status: successfulPaymentFeeIds.has(f.id)
          ? ("paid" as const)
          : ("unpaid" as const),
      })),
      ...assocFees.map((f) => ({
        id: f.id,
        type: "ASSOCIATION_DUE" as const,
        label: `${f.association.name} — ${f.label}`,
        amount: f.amountKobo,
        session: f.session,
        paymentLink: f.paymentLink || null,
        associationName: f.association.name,
        associationLogo: f.association.logoUrl,
        status: successfulPaymentFeeIds.has(f.id)
          ? ("paid" as const)
          : ("unpaid" as const),
      })),
    ];

    return NextResponse.json({
      student,
      payments,
      feeBreakdown,
    });
  } catch (error) {
    console.error("Payment history fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 },
    );
  }
}
