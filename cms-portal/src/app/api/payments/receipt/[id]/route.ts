import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        receipt: true,
        student: {
          include: {
            department: true,
            associationMembers: { include: { association: true } },
          },
        },
        feeStructure: true,
        associationDues: { include: { association: true } },
      },
    });

    if (!payment || !payment.receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Verify ownership unless admin
    if (
      payment.student.userId !== session.user.id &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "BURSAR"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      receipt: {
        receiptNo: payment.receipt.receiptNo,
        issuedAt: payment.receipt.issuedAt,
        studentName: `${payment.student.firstName} ${payment.student.lastName}`,
        matricNumber: payment.student.matricNumber,
        department: payment.student.department.name,
        level: payment.student.level,
        amountKobo: payment.amountKobo,
        currency: payment.currency,
        reference: payment.reference,
        feeDescription: payment.feeType || "College/Association Due",
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Receipt retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve receipt" },
      { status: 500 },
    );
  }
}
