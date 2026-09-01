"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  User,
  CreditCard,
  LogOut,
  IdCard,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function PortalPage() {
  const { data: session } = useSession();

  // Placeholder student data — in production this would come from API
  const student = {
    firstName: session?.user?.name?.split(" ")[0] || "Student",
    lastName: session?.user?.name?.split(" ")[1] || "",
    matricNumber: "BU/20A/0001",
    level: "300 Level",
    department: "Business Administration",
    programme: "B.Sc. Business Administration",
    session: "2026/2027",
    association: "BASA",
    email: session?.user?.email || "student@bellsuniversity.edu.ng",
    phone: "+234 800 000 0000",
    admissionYear: 2024,
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary">
                Student Portal
              </h1>
              <p className="mt-1 text-text-secondary">
                Welcome back, {student.firstName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/payments">
                <Button variant="primary" size="md" leftIcon={<CreditCard size={16} />}>
                  Pay Dues
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="md"
                leftIcon={<LogOut size={16} />}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Student ID Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary">
                {/* Card Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-gold-700/20 to-gold-600/10 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                      <GraduationCap size={16} className="text-bg-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                        Student Identity Card
                      </p>
                      <p className="text-[10px] text-text-muted">
                        College of Management Sciences
                      </p>
                    </div>
                  </div>
                  <Badge variant="colmans">COLMANS</Badge>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-28 h-28 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
                        <User size={40} className="text-text-muted" />
                      </div>
                      <button className="mt-2 text-xs text-gold-400 hover:underline cursor-pointer">
                        Upload photo
                      </button>
                    </div>

                    {/* Details */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Full Name
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-text-primary">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Matric Number
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-text-primary tabular">
                          {student.matricNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Department
                        </p>
                        <p className="mt-0.5 text-sm text-text-primary">
                          {student.department}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Level
                        </p>
                        <p className="mt-0.5 text-sm text-text-primary">
                          {student.level}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Programme
                        </p>
                        <p className="mt-0.5 text-sm text-text-primary">
                          {student.programme}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">
                          Session
                        </p>
                        <p className="mt-0.5 text-sm text-text-primary">
                          {student.session}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Barcode Section */}
                  <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IdCard size={14} className="text-text-muted" />
                      <span className="text-xs text-text-muted tabular">
                        {student.matricNumber}
                      </span>
                    </div>
                    <Badge
                      variant={
                        student.association === "BASA"
                          ? "basa"
                          : student.association === "NESA"
                            ? "nesa"
                            : "matsa"
                      }
                      dot
                    >
                      {student.association} Member
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Quick Actions
              </h2>

              {[
                {
                  icon: CreditCard,
                  label: "Pay Your Dues",
                  desc: "College & association dues",
                  href: "/payments",
                  color: "text-gold-400",
                },
                {
                  icon: BookOpen,
                  label: "Past Questions",
                  desc: "Download study materials",
                  href: "/resources",
                  color: "text-blue-400",
                },
                {
                  icon: Mail,
                  label: "Contact Admin",
                  desc: "Get help with your account",
                  href: "/contact",
                  color: "text-nesa",
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-bg-card border border-border hover:border-border-hover hover:shadow-[0_0_20px_rgba(184,134,11,0.08)] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                    <action.icon size={18} className={action.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary group-hover:text-gold-400 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-text-muted">{action.desc}</p>
                  </div>
                </Link>
              ))}

              {/* Contact Info */}
              <div className="mt-6 p-4 rounded-xl bg-bg-card border border-border">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  Your Info
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Mail size={12} className="text-text-muted" />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Phone size={12} className="text-text-muted" />
                    {student.phone}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
