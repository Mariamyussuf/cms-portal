import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "SUPER_ADMIN" &&
        session.user.role !== "BURSAR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [collegeFees, associationDues] = await Promise.all([
      prisma.feeStructure.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.associationDues.findMany({
        include: { association: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ collegeFees, associationDues });
  } catch (error) {
    console.error("Admin fees fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fee configurations" },
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
    const { type, id, label, amountKobo, academicSession, isActive, associationId } =
      body;

    if (type === "COLLEGE_DUE") {
      if (id) {
        const updated = await prisma.feeStructure.update({
          where: { id },
          data: {
            label,
            amountKobo: Number(amountKobo),
            session: academicSession,
            isActive: isActive ?? true,
          },
        });
        return NextResponse.json({ success: true, fee: updated });
      } else {
        const created = await prisma.feeStructure.create({
          data: {
            label,
            category: "COLLEGE_DUE",
            amountKobo: Number(amountKobo),
            session: academicSession || "2026/2027",
            isActive: true,
          },
        });
        return NextResponse.json({ success: true, fee: created });
      }
    } else if (type === "ASSOCIATION_DUE") {
      if (id) {
        const updated = await prisma.associationDues.update({
          where: { id },
          data: {
            label,
            amountKobo: Number(amountKobo),
            session: academicSession,
            isActive: isActive ?? true,
          },
        });
        return NextResponse.json({ success: true, fee: updated });
      } else {
        const created = await prisma.associationDues.create({
          data: {
            associationId,
            label,
            amountKobo: Number(amountKobo),
            session: academicSession || "2026/2027",
            isActive: true,
          },
        });
        return NextResponse.json({ success: true, fee: created });
      }
    }

    return NextResponse.json({ error: "Invalid fee type" }, { status: 400 });
  } catch (error) {
    console.error("Fee config error:", error);
    return NextResponse.json(
      { error: "Failed to configure fee" },
      { status: 500 },
    );
  }
}
