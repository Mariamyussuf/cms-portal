import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { paymentProvider } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    const event = paymentProvider.parseWebhookEvent({
      rawBody,
      headers: { "x-paystack-signature": signature },
    });

    if (!event) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment.successful" && event.reference) {
      const payment = await prisma.payment.findUnique({
        where: { reference: event.reference },
      });

      if (payment && payment.status !== "SUCCESSFUL") {
        const receiptNo = `REC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCESSFUL",
            paidAt: new Date(),
            providerReference: event.providerReference || payment.providerReference,
            rawWebhookPayload: JSON.stringify(event.raw),
            receipt: {
              create: {
                receiptNo,
                issuedAt: new Date(),
              },
            },
          },
        });
      }
    } else if (event.type === "payment.failed" && event.reference) {
      await prisma.payment.updateMany({
        where: { reference: event.reference, status: "PENDING" },
        data: {
          status: "FAILED",
          rawWebhookPayload: JSON.stringify(event.raw),
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
