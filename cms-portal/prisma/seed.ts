import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding COLMANS portal database...");

  // 1. Create Default Admin & Sample Student User
  const passwordHash = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@colmans.edu.ng" },
    update: {},
    create: {
      email: "admin@colmans.edu.ng",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@colmans.edu.ng" },
    update: {},
    create: {
      email: "student@colmans.edu.ng",
      passwordHash,
      role: "STUDENT",
    },
  });

  // 2. Create Departments
  const deptBusAdmin = await prisma.department.upsert({
    where: { slug: "business-administration" },
    update: {},
    create: {
      name: "Business Administration",
      slug: "business-administration",
      summary: "Developing visionary leaders, managers, and entrepreneurs.",
      description:
        "The Department of Business Administration is dedicated to equipping students with strategic management principles, corporate finance insight, organizational development techniques, and entrepreneurial mindsets.",
    },
  });

  const deptEconomics = await prisma.department.upsert({
    where: { slug: "economics" },
    update: {},
    create: {
      name: "Economics",
      slug: "economics",
      summary: "Analyzing market systems, policy design, and quantitative economics.",
      description:
        "The Department of Economics provides comprehensive training in microeconomics, macroeconomics, econometrics, developmental finance, and public policy analysis.",
    },
  });

  const deptAccounting = await prisma.department.upsert({
    where: { slug: "accounting-finance" },
    update: {},
    create: {
      name: "Accounting & Finance",
      slug: "accounting-finance",
      summary: "Mastering auditing, financial reporting, taxation, and advisory.",
      description:
        "Preparing chartered accountants, auditors, and financial analysts for global corporate, fiscal, and regulatory environments.",
    },
  });

  const deptMarketing = await prisma.department.upsert({
    where: { slug: "marketing" },
    update: {},
    create: {
      name: "Marketing",
      slug: "marketing",
      summary: "Driving brand strategy, consumer intelligence, and digital commerce.",
      description:
        "Combining behavioral analytics, digital marketing channels, and strategic market development for tomorrow's commercial growth.",
    },
  });

  // 3. Create Associations (BASA, NESA, MATSA)
  const basa = await prisma.association.upsert({
    where: { slug: "basa" },
    update: {},
    create: {
      name: "BASA",
      fullName: "Business Administration Students' Association",
      slug: "basa",
      tagline: "Leadership, Strategy & Innovation",
      description:
        "Empowering future business leaders with the skills, networks, and knowledge to shape global enterprise.",
      colorHex: "#3B82F6",
    },
  });

  const nesa = await prisma.association.upsert({
    where: { slug: "nesa" },
    update: {},
    create: {
      name: "NESA",
      fullName: "Nigerian Economics Students' Association",
      slug: "nesa",
      tagline: "Economic Insight, Policy & Progress",
      description:
        "Advancing economic literacy, research capability, and policy awareness through academic symposiums and real-world engagements.",
      colorHex: "#10B981",
    },
  });

  const matsa = await prisma.association.upsert({
    where: { slug: "matsa" },
    update: {},
    create: {
      name: "MATSA",
      fullName: "Marketing, Accounting & Taxation Students' Association",
      slug: "matsa",
      tagline: "Precision, Creativity & Fiscal Integrity",
      description:
        "Bridging dynamic brand marketing, financial stewardship, and tax governance into a collaborative student ecosystem.",
      colorHex: "#8B5CF6",
    },
  });

  // 4. Create Student Profile
  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      matricNumber: "BU/20A/0001",
      firstName: "Adebayo",
      lastName: "Oluwaseun",
      middleName: "David",
      level: "300 Level",
      departmentId: deptBusAdmin.id,
      admissionYear: 2024,
      phone: "+234 802 345 6789",
    },
  });

  // Connect student to BASA
  await prisma.associationMember.upsert({
    where: {
      associationId_studentId: {
        associationId: basa.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      associationId: basa.id,
      studentId: student.id,
    },
  });

  // 5. Create Fee Structures (College Dues) & Association Dues
  const collegeDue = await prisma.feeStructure.create({
    data: {
      label: "COLMANS College Due",
      category: "COLLEGE_DUE",
      amountKobo: 500000, // ₦5,000
      session: "2026/2027",
      isActive: true,
    },
  });

  const basaDue = await prisma.associationDues.create({
    data: {
      associationId: basa.id,
      label: "BASA Association Annual Due",
      amountKobo: 300000, // ₦3,000
      session: "2026/2027",
      isActive: true,
    },
  });

  const nesaDue = await prisma.associationDues.create({
    data: {
      associationId: nesa.id,
      label: "NESA Association Annual Due",
      amountKobo: 300000,
      session: "2026/2027",
      isActive: true,
    },
  });

  const matsaDue = await prisma.associationDues.create({
    data: {
      associationId: matsa.id,
      label: "MATSA Association Annual Due",
      amountKobo: 300000,
      session: "2026/2027",
      isActive: true,
    },
  });

  // 6. Create Sample Executives
  await prisma.associationLeader.createMany({
    data: [
      {
        associationId: basa.id,
        name: "Oluwaseun Adebayo",
        position: "President",
        order: 1,
      },
      {
        associationId: basa.id,
        name: "Fatima Bello",
        position: "Vice President",
        order: 2,
      },
      {
        associationId: basa.id,
        name: "Emeka Okonkwo",
        position: "General Secretary",
        order: 3,
      },
      {
        associationId: nesa.id,
        name: "Chinwe Okafor",
        position: "President",
        order: 1,
      },
      {
        associationId: nesa.id,
        name: "Tunde Bakare",
        position: "Director of Research",
        order: 2,
      },
      {
        associationId: matsa.id,
        name: "Zainab Ibrahim",
        position: "President",
        order: 1,
      },
      {
        associationId: matsa.id,
        name: "Kelechi Nnamdi",
        position: "Financial Secretary",
        order: 2,
      },
    ],
  });

  // 7. Create Sample Events
  await prisma.associationEvent.createMany({
    data: [
      {
        associationId: basa.id,
        title: "BASA Leadership Summit 2026",
        description:
          "Keynote address by corporate leaders, business case study challenges, and executive networking sessions.",
        location: "Management Sciences Auditorium",
        startsAt: new Date("2026-10-15T09:00:00Z"),
        status: "upcoming",
      },
      {
        associationId: nesa.id,
        title: "NESA Annual Economic Colloquium",
        description:
          "Theme: Unlocking Nigeria's Fiscal Resilience through Digital Transformation and Sovereign Wealth.",
        location: "COLMANS Lecture Hall A",
        startsAt: new Date("2026-10-28T10:00:00Z"),
        status: "upcoming",
      },
      {
        associationId: matsa.id,
        title: "MATSA Brand & Tax Masterclass",
        description:
          "Practical insights into modern corporate tax compliance, branding agility, and financial reporting.",
        location: "Business Block Room 104",
        startsAt: new Date("2026-11-12T11:00:00Z"),
        status: "upcoming",
      },
    ],
  });

  // 8. Create Sample Blog Posts
  await prisma.post.createMany({
    data: [
      {
        title: "Welcome to the 2026/2027 Academic Session: Message from the COLMANS Dean",
        slug: "welcome-2026-2027-dean-message",
        excerpt:
          "A warm welcome to all returning and newly admitted students of the College of Management Sciences.",
        body: "We are thrilled to welcome our extraordinary student body to a new academic year filled with opportunity, high-impact research, and dynamic leadership initiatives across BASA, NESA, and MATSA.",
        category: "Academic",
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorName: "Prof. H. A. Adeleke",
      },
      {
        title: "How COLMANS Students Emerged Top 3 in National Fintech Challenge",
        slug: "colmans-top-3-fintech-challenge",
        excerpt:
          "Our interdisciplinary team created an automated agricultural credit risk score model that won national acclaim.",
        body: "Representing Management Sciences, the four-person delegation brought together economics modeling and business administration strategy to take home honors at the National Innovation Expo.",
        category: "Career",
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorName: "Editorial Board",
      },
      {
        title: "Dues Payment Portal Guidelines and FAQ for 2026/2027",
        slug: "dues-payment-portal-guidelines-2026",
        excerpt:
          "Step-by-step instructions on verifying student identity and paying college and association dues online.",
        body: "All students are advised to complete their dues payments before the mid-semester examination period. Receipts are generated instantly upon successful checkout.",
        category: "General",
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorName: "Bursary Unit",
      },
    ],
  });

  // 9. Create Sample Resources
  await prisma.resource.createMany({
    data: [
      {
        title: "BUS 301 - Strategic Management Past Questions (2022-2025)",
        courseCode: "BUS 301",
        departmentName: "Business Administration",
        level: "300",
        semester: "First",
        year: "2024/2025",
        fileUrl: "/downloads/bus301_pq.pdf",
        fileSize: 2450000,
        associationId: basa.id,
      },
      {
        title: "ECO 201 - Microeconomic Theory Past Questions & Solutions",
        courseCode: "ECO 201",
        departmentName: "Economics",
        level: "200",
        semester: "First",
        year: "2024/2025",
        fileUrl: "/downloads/eco201_pq.pdf",
        fileSize: 1800000,
        associationId: nesa.id,
      },
      {
        title: "ACC 305 - Advanced Taxation & Fiscal Policy Compendium",
        courseCode: "ACC 305",
        departmentName: "Accounting & Finance",
        level: "300",
        semester: "Second",
        year: "2024/2025",
        fileUrl: "/downloads/acc305_compendium.pdf",
        fileSize: 3200000,
        associationId: matsa.id,
      },
      {
        title: "MKT 202 - Consumer Behavior Analysis & Case Studies",
        courseCode: "MKT 202",
        departmentName: "Marketing",
        level: "200",
        semester: "Second",
        year: "2024/2025",
        fileUrl: "/downloads/mkt202_cases.pdf",
        fileSize: 1500000,
        associationId: matsa.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
