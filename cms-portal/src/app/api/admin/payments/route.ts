import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "SUPER_ADMIN" &&
        session.user.role !== "BURSAR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const association = searchParams.get("association");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: {
          include: {
            department: true,
            associationMembers: { include: { association: true } },
          },
        },
        receipt: true,
        feeStructure: true,
        associationDues: { include: { association: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "SUPER_ADMIN" &&
        session.user.role !== "BURSAR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { matricNumber, feeType, amountKobo, method, notes } = body;

    if (!matricNumber || !amountKobo) {
      return NextResponse.json(
        { error: "Matric number and amount are required" },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: { matricNumber: matricNumber.trim().toUpperCase() },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student with this matric number not found" },
        { status: 404 },
      );
    }

    const reference = `MAN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNo = `REC-MAN-${Date.now().toString().slice(-6)}`;

    const payment = await prisma.payment.create({
      data: {
        reference,
        provider: "MANUAL",
        studentId: student.id,
        amountKobo: Number(amountKobo),
        currency: "NGN",
        status: "SUCCESSFUL",
        feeType: feeType || "Manual Bursary Reconciliation",
        paidAt: new Date(),
        rawWebhookPayload: JSON.stringify({ method, notes, adminId: session.user.id }),
        receipt: {
          create: {
            receiptNo,
            issuedAt: new Date(),
          },
        },
      },
      include: { receipt: true },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Manual payment mark error:", error);
    return NextResponse.json(
      { error: "Failed to mark payment" },
      { status: 500 },
    );
  }
}
