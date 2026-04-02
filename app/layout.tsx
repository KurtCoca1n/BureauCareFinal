import type { Metadata } from "next";

import "./globals.css";
import { getRequestLanguage } from "@/lib/request-locale";

export const metadata: Metadata = {
  title: "BureauCare",
  description: "Mobile-first document workspace for BureauCare V1"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLanguage();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
