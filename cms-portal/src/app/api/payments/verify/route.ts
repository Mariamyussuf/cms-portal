import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { paymentProvider } from "@/lib/payments";
import { format } from "date-fns";
import { koboToWordsNaira } from "@/lib/utils/number-to-words";

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

    let payment = await prisma.payment.findUnique({
      where: { reference },
      include: {
        student: {
          include: {
            department: true,
            associationMembers: { include: { association: true } },
          },
        },
        feeStructure: true,
        associationDues: { include: { association: true } },
        receipt: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 },
      );
    }

    // If not yet successful, verify with provider
    if (payment.status !== "SUCCESSFUL") {
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
          console.error("Payment provider verification failed:", err);
        }
      } else {
        // In simulation mode, manual verification, or test checkout
        isSuccess = true;
      }

      if (isSuccess) {
        const receiptNo = `REC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const amountWords = koboToWordsNaira(payment.amountKobo);

        payment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCESSFUL",
            paidAt: new Date(),
            receipt: {
              upsert: {
                create: {
                  receiptNo,
                  referenceNo: payment.reference,
                  amountWords,
                  issuedAt: new Date(),
                },
                update: {
                  referenceNo: payment.reference,
                  amountWords,
                },
              },
            },
          },
          include: {
            student: {
              include: {
                department: true,
                associationMembers: { include: { association: true } },
              },
            },
            feeStructure: true,
            associationDues: { include: { association: true } },
            receipt: true,
          },
        });
      } else {
        return NextResponse.json({
          success: false,
          status: "FAILED",
          error: "Transaction could not be verified",
        });
      }
    }

    // Build rich receipt response
    const association =
      payment.associationDues?.association ||
      payment.student.associationMembers[0]?.association;

    let leaders: Array<{
      name: string;
      position: string;
      signatureUrl?: string | null;
    }> = [];

    if (association) {
      const rawLeaders = await prisma.associationLeader.findMany({
        where: { associationId: association.id },
      });
      leaders = rawLeaders as unknown as Array<{
        name: string;
        position: string;
        signatureUrl?: string | null;
      }>;
    }

    const president = leaders.find(
      (l) => l.position.toLowerCase() === "president",
    );
    const finSec = leaders.find(
      (l) =>
        l.position.toLowerCase().includes("financial") ||
        l.position.toLowerCase().includes("treasurer"),
    );

    const isCollegeDue =
      payment.feeType?.toLowerCase().includes("college") ||
      Boolean(payment.feeStructureId);

    const associationAcronym = isCollegeDue
      ? "COLMANS"
      : association?.name || "NESA";

    const associationFullName = isCollegeDue
      ? "College of Management Sciences"
      : association?.fullName || "Nigerian Economics Students' Association";

    const associationLogoUrl = isCollegeDue
      ? "/images/colmans-logo.svg"
      : association?.logoUrl || "/logo/Nesa Logo.jpeg";

    const officialEmail = isCollegeDue
      ? "colmans@bellsuniversity.edu.ng"
      : (association as { officialEmail?: string | null })?.officialEmail ||
        "nesabellstech@gmail.com";

    const themeColor = isCollegeDue
      ? "#1D4ED8"
      : association?.colorHex || "#1877F2";

    const dateTime = payment.paidAt
      ? format(new Date(payment.paidAt), "dd/MM/yyyy, hh:mm:ss a")
      : format(
          new Date(payment.receipt?.issuedAt || new Date()),
          "dd/MM/yyyy, hh:mm:ss a",
        );

    const amountWords =
      (payment.receipt as { amountWords?: string | null })?.amountWords ||
      koboToWordsNaira(payment.amountKobo);

    const sessionYear =
      payment.associationDues?.session ||
      payment.feeStructure?.session ||
      "2026/2027";

    const paymentPurpose =
      payment.feeType ||
      `${associationAcronym} Payment for ${sessionYear} Academic Session`;

    return NextResponse.json({
      success: true,
      status: "SUCCESSFUL",
      payment,
      receipt: {
        receiptNo: payment.receipt?.receiptNo || `REC-${Date.now().toString().slice(-6)}`,
        referenceNo: payment.reference,
        studentName: `${payment.student.firstName} ${payment.student.lastName} ${payment.student.middleName || ""}`.trim(),
        department: payment.student.department.name,
        matricNumber: payment.student.matricNumber,
        level: payment.student.level,
        amountKobo: payment.amountKobo,
        amountWords,
        paymentPurpose,
        dateTime,
        associationAcronym,
        associationFullName,
        associationLogoUrl,
        officialEmail,
        themeColor,
        presidentName: president?.name || "Chinwe Okafor",
        presidentSignatureUrl:
          president?.signatureUrl || "/images/signatures/president-sig.svg",
        finSecName: finSec?.name || "Adewale Fashola",
        finSecSignatureUrl:
          finSec?.signatureUrl || "/images/signatures/finsec-sig.svg",
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification process failed" },
      { status: 500 },
    );
  }
}
