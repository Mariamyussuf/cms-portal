import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const level = searchParams.get("level");
    const semester = searchParams.get("semester");

    const where: Record<string, unknown> = {};

    if (department && department !== "all") {
      where.departmentName = department;
    }

    if (level && level !== "all") {
      where.level = level;
    }

    if (semester && semester !== "all") {
      where.semester = semester;
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        association: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Resources fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
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
    const {
      title,
      courseCode,
      departmentName,
      level,
      semester,
      year,
      fileUrl,
      fileSize,
      associationId,
    } = body;

    if (!title || !courseCode || !departmentName || !level || !semester) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        courseCode,
        departmentName,
        level,
        semester,
        year: year || "2025/2026",
        fileUrl: fileUrl || "/downloads/sample.pdf",
        fileSize: fileSize || 1024 * 1024,
        associationId: associationId || null,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Resource upload error:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}
