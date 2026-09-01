import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  CreditCard,
  Calendar,
  BookOpen,
  Users,
  FileText,
  Mail,
  Sliders,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/payments", label: "Payments & Fees", icon: CreditCard },
  { href: "/admin/events", label: "Events Manager", icon: Calendar },
  { href: "/admin/blog", label: "Blog & News", icon: BookOpen },
  { href: "/admin/executives", label: "Executives", icon: Users },
  { href: "/admin/resources", label: "Past Questions", icon: FileText },
  { href: "/admin/messages", label: "Messages & Leads", icon: Mail },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow SUPER_ADMIN, BURSAR, DEPT_ADMIN
  if (
    !session?.user ||
    (session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "BURSAR" &&
      session.user.role !== "DEPT_ADMIN")
  ) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-bg-secondary hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-bg-primary font-bold">
                <GraduationCap size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-text-primary">
                  COLMANS
                </span>
                <span className="text-[10px] text-text-muted">
                  Executive Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <item.icon size={16} className="text-text-muted" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                {session.user.name || session.user.email}
              </p>
              <Badge variant="colmans" className="mt-1 text-[10px]">
                {session.user.role}
              </Badge>
            </div>
            <Link
              href="/api/auth/signout"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-bg-secondary px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-text-primary">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-gold-400 font-medium">Administration</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="text-xs text-text-secondary hover:text-gold-400"
            >
              Student Portal &rarr;
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
