import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { paymentProvider } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { feeIds, redirectUrl } = body as {
      feeIds: string[];
      redirectUrl?: string;
    };

    if (!feeIds || feeIds.length === 0) {
      return NextResponse.json(
        { error: "At least one fee must be selected" },
        { status: 400 },
      );
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: {
        department: true,
        associationMembers: { include: { association: true } },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 },
      );
    }

    // Check selected fees
    let totalKobo = 0;
    const feeDescriptions: string[] = [];

    // Find college dues
    const collegeFees = await prisma.feeStructure.findMany({
      where: { id: { in: feeIds }, isActive: true },
    });
    for (const f of collegeFees) {
      totalKobo += f.amountKobo;
      feeDescriptions.push(f.label);
    }

    // Find association dues
    const assocFees = await prisma.associationDues.findMany({
      where: { id: { in: feeIds }, isActive: true },
    });
    for (const f of assocFees) {
      totalKobo += f.amountKobo;
      feeDescriptions.push(f.label);
    }

    if (totalKobo === 0) {
      return NextResponse.json(
        { error: "Invalid fee selection or inactive fees" },
        { status: 400 },
      );
    }

    const reference = `COL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentEmail = session.user.email || "student@colmans.edu.ng";
    const studentName = `${student.firstName} ${student.lastName}`;
    const description = feeDescriptions.join(", ");

    // Create Payment Record
    const payment = await prisma.payment.create({
      data: {
        reference,
        studentId: student.id,
        amountKobo: totalKobo,
        currency: "NGN",
        status: "PENDING",
        feeType: feeDescriptions.join(", "),
        feeStructureId: collegeFees[0]?.id || null,
        associationDuesId: assocFees[0]?.id || null,
      },
    });

    // Check if Paystack is configured
    const isPaystackConfigured =
      process.env.PAYSTACK_SECRET_KEY &&
      !process.env.PAYSTACK_SECRET_KEY.includes("replace_me");

    if (isPaystackConfigured) {
      try {
        const checkout = await paymentProvider.createCheckout({
          reference,
          amountKobo: totalKobo,
          currency: "NGN",
          studentEmail,
          studentName,
          description,
          redirectUrl:
            redirectUrl ||
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payments/verify?reference=${reference}`,
        });

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            checkoutUrl: checkout.checkoutUrl,
            providerReference: checkout.providerReference,
          },
        });

        return NextResponse.json({
          success: true,
          checkoutUrl: checkout.checkoutUrl,
          reference,
        });
      } catch (err) {
        console.error("Paystack API call failed:", err);
      }
    }

    // Sandbox / Development direct checkout URL simulation
    const mockCheckoutUrl = `/payments/verify?reference=${reference}&simulated=true`;
    await prisma.payment.update({
      where: { id: payment.id },
      data: { checkoutUrl: mockCheckoutUrl },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: mockCheckoutUrl,
      reference,
      isSimulation: !isPaystackConfigured,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 },
    );
  }
}
