import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const association = searchParams.get("association");

    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (association && association !== "all") {
      const assoc = await prisma.association.findFirst({
        where: { name: { equals: association } },
      });
      if (assoc) {
        where.associationId = assoc.id;
      }
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        association: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
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
    const { title, excerpt, body: content, category, coverImage, status, associationId, authorName } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and body are required" },
        { status: 400 },
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        body: content,
        category: category || "General",
        coverImage: coverImage || null,
        status: status || "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorName: authorName || session.user.name || "COLMANS Editorial",
        associationId: associationId || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Blog post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}
