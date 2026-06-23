import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MH4U Database",
    template: "%s · MH4U Database",
  },
  description:
    "A fast, searchable Monster Hunter 4 Ultimate database: monsters, weapons, armor, items, quests and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/40">
          <p>
            Game data &amp; assets © Capcom. This is an unofficial fan project, derived from the
            open-source MH4U Database (MIT).
          </p>
          <p className="mt-1">
            <Link href="/" className="hover:text-white/70">
              MH4U Database
            </Link>{" "}
            · Powered by a Laravel API
          </p>
        </footer>
      </body>
    </html>
  );
}
