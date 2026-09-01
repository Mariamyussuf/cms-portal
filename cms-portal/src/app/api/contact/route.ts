import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || "General Inquiry",
        message,
      },
    });

    return NextResponse.json({ success: true, message: contactMessage });
  } catch (error) {
    console.error("Contact message submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 },
    );
  }
}
