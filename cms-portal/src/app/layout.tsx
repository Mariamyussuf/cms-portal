import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COLMANS — College of Management Sciences",
  description:
    "The College of Management Sciences — home to BASA, NESA, and MATSA. Pay your dues, explore events, connect with your association, and access resources.",
  keywords: [
    "COLMANS",
    "College of Management Sciences",
    "BASA",
    "NESA",
    "MATSA",
    "student association",
    "pay dues",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
