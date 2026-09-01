import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, email, matricNumber, level, department, association } =
      body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 },
      );
    }

    const event = await prisma.associationEvent.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        fullName,
        email,
        matricNumber: matricNumber || null,
        level: level || null,
        department: department || null,
        association: association || null,
      },
    });

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 },
    );
  }
}
