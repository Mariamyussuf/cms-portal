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
    const { reference, simulated } = body as {
      reference: string;
      simulated?: boolean;
    };

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: {
        student: true,
        feeStructure: true,
        associationDues: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 },
      );
    }

    if (payment.status === "SUCCESSFUL") {
      return NextResponse.json({
        success: true,
        status: "SUCCESSFUL",
        payment,
      });
    }

    const isPaystackConfigured =
      process.env.PAYSTACK_SECRET_KEY &&
      !process.env.PAYSTACK_SECRET_KEY.includes("replace_me");

    let isSuccess = false;

    if (isPaystackConfigured && !simulated) {
      try {
        const verifyRes = await paymentProvider.verifyPayment(reference);
        if (verifyRes.status === "successful") {
          isSuccess = true;
        }
      } catch (err) {
        console.error("Paystack verification failed:", err);
      }
    } else {
      // In simulation mode or sandbox testing
      isSuccess = true;
    }

    if (isSuccess) {
      const receiptNo = `REC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESSFUL",
          paidAt: new Date(),
          receipt: {
            create: {
              receiptNo,
              issuedAt: new Date(),
            },
          },
        },
        include: {
          receipt: true,
          student: true,
        },
      });

      return NextResponse.json({
        success: true,
        status: "SUCCESSFUL",
        payment: updatedPayment,
      });
    }

    return NextResponse.json({
      success: false,
      status: "FAILED",
      error: "Transaction could not be verified",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification process failed" },
      { status: 500 },
    );
  }
}
