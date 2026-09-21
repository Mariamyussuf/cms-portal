import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { format } from "date-fns";
import { koboToWordsNaira } from "@/lib/utils/number-to-words";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Find payment by either payment ID or reference
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
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

    // Resolve association info (or default to student's association or COLMANS)
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
      : format(new Date(payment.receipt.issuedAt), "dd/MM/yyyy, hh:mm:ss a");

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
      receipt: {
        receiptNo: payment.receipt.receiptNo,
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
    console.error("Receipt retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve receipt" },
      { status: 500 },
    );
  }
}
