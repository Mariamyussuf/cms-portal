import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

/**
 * Students can log in with either their matric number or their email —
 * the credentials provider below tries a matric-number lookup first
 * (since it's unambiguous and unique), then falls back to email, so a
 * staff account (which has no Student record) still resolves by email.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Matric number or email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!identifier || !password) return null;

        const looksLikeEmail = identifier.includes("@");

        const user = looksLikeEmail
          ? await prisma.user.findUnique({
              where: { email: identifier.toLowerCase().trim() },
              include: { student: true, staff: true },
            })
          : await prisma.user.findFirst({
              where: { student: { matricNumber: identifier.trim().toUpperCase() } },
              include: { student: true, staff: true },
            });

        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.student
            ? `${user.student.firstName} ${user.student.lastName}`
            : user.staff
              ? `${user.staff.firstName} ${user.staff.lastName}`
              : user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
