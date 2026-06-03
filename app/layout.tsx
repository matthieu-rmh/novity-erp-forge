import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/*
  next/font/google downloads Inter at build time and serves it locally —
  no external font requests at runtime, which improves privacy and perf.
  The `variable` option injects a CSS custom property (--font-inter) that
  our @theme block in globals.css can reference.
*/
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVITY ERP",
  description: "Internal ERP — CRM, Orders, Stock, Invoices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
