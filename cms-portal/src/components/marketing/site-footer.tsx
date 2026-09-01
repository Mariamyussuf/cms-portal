"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { label: "About COLMANS", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Executives", href: "/executives" },
  { label: "Blog & News", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

const associations = [
  { name: "BASA", full: "Business Administration Students' Association", color: "text-basa" },
  { name: "NESA", full: "Nigerian Economics Students' Association", color: "text-nesa" },
  { name: "MATSA", full: "Marketing, Accounting & Taxation Students' Association", color: "text-matsa" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to newsletter API
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="mt-auto border-t border-border bg-bg-secondary">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Stay in the loop
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Get updates on events, news, and association activities.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full sm:w-64 rounded-lg bg-bg-tertiary border border-border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-bg-primary hover:from-gold-400 hover:to-gold-500 transition-all duration-300 cursor-pointer"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <GraduationCap size={18} className="text-bg-primary" />
              </div>
              <span className="font-display text-lg font-bold text-text-primary">
                COLMANS
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              The College of Management Sciences — nurturing the next
              generation of business leaders, economists, and management
              professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-400 transition-colors"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Associations */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-4">
              Associations
            </h4>
            <ul className="space-y-3">
              {associations.map((assoc) => (
                <li key={assoc.name}>
                  <span className={`text-sm font-semibold ${assoc.color}`}>
                    {assoc.name}
                  </span>
                  <p className="text-xs text-text-muted mt-0.5">
                    {assoc.full}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-text-secondary">
                <MapPin size={14} className="mt-0.5 shrink-0 text-text-muted" />
                <span>College of Management Sciences, Bells University of Technology, Ota, Ogun State</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                <Mail size={14} className="shrink-0 text-text-muted" />
                <a href="mailto:cms@bellsuniversity.edu.ng" className="hover:text-gold-400 transition-colors">
                  cms@bellsuniversity.edu.ng
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                <Phone size={14} className="shrink-0 text-text-muted" />
                <span>+234 800 000 0000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} College of Management Sciences, Bells University of Technology. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/contact" className="hover:text-text-secondary transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-text-secondary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
