import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "SUPER_ADMIN" &&
        session.user.role !== "BURSAR" &&
        session.user.role !== "DEPT_ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalStudents,
      payments,
      totalEvents,
      totalPosts,
      totalResources,
      totalSubscribers,
      unreadMessages,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.payment.findMany({
        where: { status: "SUCCESSFUL" },
        select: { amountKobo: true },
      }),
      prisma.associationEvent.count(),
      prisma.post.count(),
      prisma.resource.count(),
      prisma.newsletterSubscriber.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    const totalRevenueKobo = payments.reduce(
      (sum: number, p: { amountKobo: number }) => sum + p.amountKobo,
      0,
    );

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { firstName: true, lastName: true, matricNumber: true } },
      },
    });

    return NextResponse.json({
      stats: {
        totalStudents,
        totalRevenueKobo,
        successfulPaymentsCount: payments.length,
        totalEvents,
        totalPosts,
        totalResources,
        totalSubscribers,
        unreadMessages,
      },
      recentPayments,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 },
    );
  }
}
