import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library & Planner",
  description: "A dark, no-nonsense gym companion: pick a lift, lock it into today’s plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-white min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-neutral-900 border-t border-neutral-800 text-center py-6 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between px-6 lg:px-16">
          <div className="flex items-center gap-2.5 mb-2 md:mb-0">
            <img src="/logo.png" alt="FitLog Logo" className="w-7 h-7 object-contain" />
            <span className="font-black text-white tracking-wider uppercase">FITLOG</span>
          </div>
          <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </footer>
      </body>
    </html>
  );
}