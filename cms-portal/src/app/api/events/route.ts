import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const association = searchParams.get("association");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (association && association !== "all") {
      const assoc = await prisma.association.findFirst({
        where: { name: { equals: association } },
      });
      if (assoc) {
        where.associationId = assoc.id;
      }
    }

    if (status && status !== "all") {
      where.status = status;
    }

    const events = await prisma.associationEvent.findMany({
      where,
      include: {
        association: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { startsAt: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
    const { title, description, location, startsAt, endsAt, associationId, status } =
      body;

    if (!title || !startsAt) {
      return NextResponse.json(
        { error: "Title and start date are required" },
        { status: 400 },
      );
    }

    const event = await prisma.associationEvent.create({
      data: {
        title,
        description: description || "",
        location: location || "",
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        associationId: associationId || null,
        status: status || "upcoming",
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
