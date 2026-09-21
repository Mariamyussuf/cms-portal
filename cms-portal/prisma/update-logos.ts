// @ts-nocheck
import { prisma } from "../src/lib/db/prisma";

/**
 * Migration helper to ensure associations have official logos,
 * executive signatures, and payment links configured in the database.
 */
async function main() {
  console.log("Updating associations, logos, and signatures in database...");

  // 1. Update NESA
  await prisma.association.update({
    where: { slug: "nesa" },
    data: {
      fullName: "Nigerian Economics Students' Association",
      logoUrl: "/logo/Nesa Logo.jpeg",
      officialEmail: "nesabellstech@gmail.com",
      colorHex: "#10B981",
    },
  });

  // Update NESA dues
  const nesa = await prisma.association.findUnique({ where: { slug: "nesa" } });
  if (nesa) {
    await prisma.associationDues.updateMany({
      where: { associationId: nesa.id },
      data: {
        amountKobo: 1000000, // ₦10,000
        paymentLink: "https://checkout.bachs.io/pay/pl_18fcf3e8c401",
      },
    });

    await prisma.associationLeader.deleteMany({
      where: {
        associationId: nesa.id,
        position: { in: ["President", "Financial Secretary"] },
      },
    });

    await prisma.associationLeader.createMany({
      data: [
        {
          associationId: nesa.id,
          name: "Chinwe Okafor",
          position: "President",
          signatureUrl: "/images/signatures/president-sig.svg",
          order: 1,
        },
        {
          associationId: nesa.id,
          name: "Adewale Fashola",
          position: "Financial Secretary",
          signatureUrl: "/images/signatures/finsec-sig.svg",
          order: 2,
        },
      ],
    });
  }

  // 2. Update BASA
  const basa = await prisma.association.update({
    where: { slug: "basa" },
    data: {
      fullName: "Business Administration Students' Association",
      logoUrl: "/logo/Basa Logo.jpeg",
      officialEmail: "basabellstech@gmail.com",
      colorHex: "#2563EB",
    },
  });

  if (basa) {
    await prisma.associationLeader.deleteMany({
      where: {
        associationId: basa.id,
        position: { in: ["President", "Financial Secretary"] },
      },
    });

    await prisma.associationLeader.createMany({
      data: [
        {
          associationId: basa.id,
          name: "Oluwaseun Adebayo",
          position: "President",
          signatureUrl: "/images/signatures/president-sig.svg",
          order: 1,
        },
        {
          associationId: basa.id,
          name: "Amina Yusuf",
          position: "Financial Secretary",
          signatureUrl: "/images/signatures/finsec-sig.svg",
          order: 2,
        },
      ],
    });
  }

  // 3. Update MATSA
  const matsa = await prisma.association.update({
    where: { slug: "matsa" },
    data: {
      fullName: "Marketing, Accounting & Taxation Students' Association",
      logoUrl: "/logo/Matsa logo.png",
      officialEmail: "matsabellstech@gmail.com",
      colorHex: "#7C3AED",
    },
  });

  if (matsa) {
    await prisma.associationLeader.deleteMany({
      where: {
        associationId: matsa.id,
        position: { in: ["President", "Financial Secretary"] },
      },
    });

    await prisma.associationLeader.createMany({
      data: [
        {
          associationId: matsa.id,
          name: "Zainab Ibrahim",
          position: "President",
          signatureUrl: "/images/signatures/president-sig.svg",
          order: 1,
        },
        {
          associationId: matsa.id,
          name: "Kelechi Nnamdi",
          position: "Financial Secretary",
          signatureUrl: "/images/signatures/finsec-sig.svg",
          order: 2,
        },
      ],
    });
  }

  console.log("Database update completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
