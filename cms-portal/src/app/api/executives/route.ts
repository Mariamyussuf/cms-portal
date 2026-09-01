import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const association = searchParams.get("association");

    const where: Record<string, unknown> = {};

    if (association && association !== "all") {
      const assoc = await prisma.association.findFirst({
        where: { name: { equals: association } },
      });
      if (assoc) {
        where.associationId = assoc.id;
      }
    }

    const executives = await prisma.associationLeader.findMany({
      where,
      include: {
        association: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ executives });
  } catch (error) {
    console.error("Executives fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch executives" },
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
        session.user.role !== "DEPT_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, position, associationId, photoUrl, socialLinks, order } = body;

    if (!name || !position || !associationId) {
      return NextResponse.json(
        { error: "Name, position and association are required" },
        { status: 400 },
      );
    }

    const executive = await prisma.associationLeader.create({
      data: {
        name,
        position,
        associationId,
        photoUrl: photoUrl || null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, executive });
  } catch (error) {
    console.error("Executive creation error:", error);
    return NextResponse.json(
      { error: "Failed to create executive profile" },
      { status: 500 },
    );
  }
}
